const { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } = React;

// ---------- config ----------
const MODEL = 'gemini-2.5-flash';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const UPLOAD_BASE = 'https://generativelanguage.googleapis.com/upload/v1beta';

// How many of each item to pre-generate per chapter. Tune freely.
const DEFAULT_MC_COUNT = 15;
const DEFAULT_SHORT_COUNT = 8;

// ---------- storage ----------
const KEYS = {
  apiKey: 'mcat:apiKey',
  files: 'mcat:files',
  questions: 'mcat:questions',
  attempts: 'mcat:attempts',
  extractions: 'mcat:extractions',
};

const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  remove(key) { localStorage.removeItem(key); },
};

// ---------- gemini client ----------
class GeminiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function makeClient(getKey) {
  const authHeader = () => ({ 'x-goog-api-key': getKey() });

  async function parseError(res) {
    let body = null;
    try { body = await res.json(); } catch {}
    const msg = body?.error?.message || res.statusText || `HTTP ${res.status}`;
    return new GeminiError(res.status, msg);
  }

  // Resumable upload — initiate + send bytes. PDFs persist on Google for ~48h.
  async function uploadFile(file) {
    const initRes = await fetch(`${UPLOAD_BASE}/files`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'x-goog-upload-protocol': 'resumable',
        'x-goog-upload-command': 'start',
        'x-goog-upload-header-content-length': String(file.size),
        'x-goog-upload-header-content-type': file.type || 'application/pdf',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ file: { display_name: file.name } }),
    });
    if (!initRes.ok) throw await parseError(initRes);
    const uploadUrl = initRes.headers.get('x-goog-upload-url')
      || initRes.headers.get('X-Goog-Upload-URL');
    if (!uploadUrl) throw new GeminiError(0, 'Upload URL missing from initiate response.');

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'content-length': String(file.size),
        'x-goog-upload-offset': '0',
        'x-goog-upload-command': 'upload, finalize',
      },
      body: file,
    });
    if (!uploadRes.ok) throw await parseError(uploadRes);
    const json = await uploadRes.json();
    return json.file; // { name: "files/...", uri, mimeType, sizeBytes, state, ... }
  }

  async function deleteFile(fileName) {
    // fileName is like "files/abc-123"
    const res = await fetch(`${GEMINI_BASE}/${fileName}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    if (!res.ok && res.status !== 404) throw await parseError(res);
    return true;
  }

  async function generate({ contents, systemInstruction, responseSchema, maxOutputTokens = 32768, disableThinking = false }) {
    const generationConfig = { maxOutputTokens };
    if (responseSchema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseSchema = responseSchema;
    }
    if (disableThinking) {
      generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }
    const body = { contents, generationConfig };
    if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] };

    const res = await fetch(`${GEMINI_BASE}/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { ...authHeader(), 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await parseError(res);
    return res.json();
  }

  function extractText(resp) {
    const parts = resp?.candidates?.[0]?.content?.parts || [];
    return parts.map((p) => p.text || '').join('');
  }

  function extractJson(resp) {
    const finishReason = resp?.candidates?.[0]?.finishReason;
    const text = extractText(resp);
    if (!text) {
      throw new GeminiError(0, `Empty model response (finishReason: ${finishReason || 'unknown'}).`);
    }
    try { return JSON.parse(text); }
    catch (e) {
      const hint = finishReason === 'MAX_TOKENS'
        ? ' — output was truncated (hit max tokens). Try a longer chapter limit or fewer items.'
        : '';
      throw new GeminiError(0, `JSON parse failed (finishReason: ${finishReason}).${hint} Start: ${text.slice(0, 160)}`);
    }
  }

  async function ping() {
    return generate({
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      maxOutputTokens: 8,
    });
  }

  // ---- extraction ----
  const EXTRACTION_SCHEMA = {
    type: 'OBJECT',
    properties: {
      summary_sentences: {
        type: 'ARRAY',
        items: { type: 'STRING' },
      },
      context_examples: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            topic: { type: 'STRING' },
            example: { type: 'STRING' },
          },
          required: ['topic', 'example'],
        },
      },
      key_terms: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            term: { type: 'STRING' },
            definition: { type: 'STRING' },
          },
          required: ['term', 'definition'],
        },
      },
    },
    required: ['summary_sentences', 'context_examples', 'key_terms'],
  };

  async function extractFromPdf(fileUri, mimeType, chapterLabel) {
    const resp = await generate({
      maxOutputTokens: 32768,
      disableThinking: true,
      systemInstruction:
        'You extract MCAT study material from a chapter PDF for a question-generation pipeline. ' +
        'Be exhaustive in summary_sentences — these are the testable claims and become the basis of the quiz, ' +
        'taken from the end-of-chapter recap, key-takeaway boxes, or "concept summary" sections. ' +
        'context_examples are concrete illustrative scenarios, experiments, case studies, or worked examples from the body of the chapter (not summaries) — these inform question wording and distractor plausibility. ' +
        'key_terms are named terms, theories, models, researchers, or syndromes with one-sentence definitions for matching-style questions. ' +
        'Do not invent content not in the PDF.',
      contents: [{
        role: 'user',
        parts: [
          { fileData: { mimeType, fileUri } },
          { text: `Extract study material for: ${chapterLabel}. Aim for 25-50 summary_sentences, 10-25 context_examples, 15-40 key_terms.` },
        ],
      }],
      responseSchema: EXTRACTION_SCHEMA,
    });
    return extractJson(resp);
  }

  // ---- multiple choice generation ----
  const MC_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: { type: 'STRING' },
            choices: { type: 'ARRAY', items: { type: 'STRING' } },
            correct_index: { type: 'INTEGER' },
            explanation: { type: 'STRING' },
          },
          required: ['question', 'choices', 'correct_index', 'explanation'],
        },
      },
    },
    required: ['questions'],
  };

  async function generateMCQuestions(fileUri, mimeType, extraction, chapterLabel, n = DEFAULT_MC_COUNT) {
    const resp = await generate({
      maxOutputTokens: 32768,
      disableThinking: true,
      systemInstruction:
        'You write high-quality MCAT-style multiple-choice questions from a chapter PDF and structured extraction. ' +
        'Every question must have exactly 4 choices, with `correct_index` (0-3) pointing to the correct one. ' +
        'Distractors must be plausible — pull from common misconceptions, related-but-wrong concepts, or other key_terms in the same chapter. ' +
        'Cover the chapter broadly across summary_sentences. ' +
        'Explanations are 1-2 sentences and justify the correct answer (and ideally why the most tempting distractor is wrong). ' +
        'Do not duplicate questions. Do not include questions whose answer is not directly supported by the chapter.',
      contents: [{
        role: 'user',
        parts: [
          { fileData: { mimeType, fileUri } },
          { text:
            `Chapter: ${chapterLabel}\n\n` +
            `Extracted summary sentences and key terms:\n${JSON.stringify(extraction, null, 2).slice(0, 60000)}\n\n` +
            `Generate exactly ${n} MCAT-style multiple-choice questions covering the chapter.`,
          },
        ],
      }],
      responseSchema: MC_SCHEMA,
    });
    const data = extractJson(resp);
    // tag with ids for tracking
    return (data.questions || []).map((q, i) => ({
      id: `mc_${Date.now()}_${i}`,
      mode: 'mc',
      ...q,
    }));
  }

  // ---- short answer generation ----
  const SHORT_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            prompt: { type: 'STRING' },
            ideal_answer: { type: 'STRING' },
            key_points: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['prompt', 'ideal_answer', 'key_points'],
        },
      },
    },
    required: ['questions'],
  };

  async function generateShortAnswers(fileUri, mimeType, extraction, chapterLabel, n = DEFAULT_SHORT_COUNT) {
    const resp = await generate({
      maxOutputTokens: 16384,
      disableThinking: true,
      systemInstruction:
        'You write open-ended short-answer study prompts from a chapter PDF and structured extraction. ' +
        'Each prompt asks the student to explain or apply a concept in 2-4 sentences. ' +
        'ideal_answer is a model answer (2-4 sentences) suitable for self-evaluation. ' +
        'key_points is 3-6 short phrases that MUST appear (or be paraphrased) in a complete answer. ' +
        'Cover a range of high-yield topics — do not duplicate.',
      contents: [{
        role: 'user',
        parts: [
          { fileData: { mimeType, fileUri } },
          { text:
            `Chapter: ${chapterLabel}\n\n` +
            `Extracted material:\n${JSON.stringify(extraction, null, 2).slice(0, 60000)}\n\n` +
            `Generate exactly ${n} short-answer study prompts.`,
          },
        ],
      }],
      responseSchema: SHORT_SCHEMA,
    });
    const data = extractJson(resp);
    return (data.questions || []).map((q, i) => ({
      id: `sa_${Date.now()}_${i}`,
      mode: 'short',
      ...q,
    }));
  }

  return {
    uploadFile, deleteFile, generate, ping,
    extractFromPdf, generateMCQuestions, generateShortAnswers,
  };
}

// ---------- app context ----------
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function AppProvider({ children }) {
  const [apiKey, setApiKeyState] = useState(() => storage.get(KEYS.apiKey, ''));
  const [files, setFilesState] = useState(() => storage.get(KEYS.files, []));
  const [extractions, setExtractionsState] = useState(() => storage.get(KEYS.extractions, {}));
  const [questions, setQuestionsState] = useState(() => storage.get(KEYS.questions, {}));
  const [attempts, setAttemptsState] = useState(() => storage.get(KEYS.attempts, []));
  const [staticBank, setStaticBank] = useState(null); // { files, extractions, questions } or null
  const [readOnly, setReadOnly] = useState(false);

  // On boot: try to fetch a static data.json next to index.html.
  // If present, expose it on context. The user can enter "shared bank" mode
  // from the key gate, or local state already wins if they've processed chapters.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('./data.json', { cache: 'no-store' });
        if (!res.ok) return;
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('json')) return;
        const data = await res.json();
        if (cancelled) return;
        if (data?.files && data?.questions) {
          setStaticBank({
            files: data.files,
            extractions: data.extractions || {},
            questions: data.questions || {},
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const useStaticBank = useCallback(() => {
    if (!staticBank) return;
    setFilesState(staticBank.files);
    setExtractionsState(staticBank.extractions);
    setQuestionsState(staticBank.questions);
    storage.set(KEYS.files, staticBank.files);
    storage.set(KEYS.extractions, staticBank.extractions);
    storage.set(KEYS.questions, staticBank.questions);
    setReadOnly(true);
  }, [staticBank]);

  const setApiKey = useCallback((k) => {
    if (k) storage.set(KEYS.apiKey, k); else storage.remove(KEYS.apiKey);
    setApiKeyState(k || '');
  }, []);

  const setFiles = useCallback((updater) => {
    setFilesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set(KEYS.files, next);
      return next;
    });
  }, []);

  const setExtraction = useCallback((fileId, data) => {
    setExtractionsState((prev) => {
      const next = { ...prev };
      if (data === undefined) delete next[fileId]; else next[fileId] = data;
      storage.set(KEYS.extractions, next);
      return next;
    });
  }, []);

  const setQuestionsFor = useCallback((fileId, data) => {
    setQuestionsState((prev) => {
      const next = { ...prev };
      if (data === undefined) delete next[fileId]; else next[fileId] = data;
      storage.set(KEYS.questions, next);
      return next;
    });
  }, []);

  const addAttempt = useCallback((a) => {
    setAttemptsState((prev) => {
      const next = [...prev, { ...a, ts: Date.now() }];
      storage.set(KEYS.attempts, next);
      return next;
    });
  }, []);

  const clearAttempts = useCallback(() => {
    storage.set(KEYS.attempts, []);
    setAttemptsState([]);
  }, []);

  const client = useMemo(() => makeClient(() => storage.get(KEYS.apiKey, '')), []);

  const value = useMemo(
    () => ({
      apiKey, setApiKey,
      files, setFiles,
      extractions, setExtraction,
      questions, setQuestionsFor,
      attempts, addAttempt, clearAttempts,
      staticBank, useStaticBank,
      readOnly, setReadOnly,
      client,
    }),
    [apiKey, setApiKey, files, setFiles, extractions, setExtraction, questions, setQuestionsFor,
     attempts, addAttempt, clearAttempts, staticBank, useStaticBank, readOnly, client]
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// ---------- key gate ----------
function ApiKeyGate() {
  const { setApiKey, client, staticBank, useStaticBank } = useApp();
  const [val, setVal] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    const trimmed = val.trim();
    if (!trimmed.startsWith('AIza')) {
      setErr('That does not look like a Google AI API key (should start with AIza).');
      return;
    }
    setBusy(true); setErr('');
    storage.set(KEYS.apiKey, trimmed);
    try {
      await client.ping();
      setApiKey(trimmed);
    } catch (e) {
      storage.remove(KEYS.apiKey);
      setErr(`Key rejected: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-1">MCAT Study</h1>
        <p className="text-slate-400 text-sm mb-5">
          Paste your Google AI (Gemini) API key to begin. Stored only in this browser's localStorage.
        </p>

        <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">API key</label>
        <div className="flex gap-2">
          <input
            type={show ? 'text' : 'password'}
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(''); }}
            onKeyDown={(e) => e.key === 'Enter' && !busy && save()}
            placeholder="AIza..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="px-3 text-xs text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {err && <p className="text-red-400 text-xs mt-2">{err}</p>}

        <button
          onClick={save}
          disabled={!val.trim() || busy}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-2 text-sm font-medium"
        >
          {busy ? 'Verifying…' : 'Save & continue'}
        </button>

        {staticBank && (
          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 text-center">or</div>
            <button
              onClick={useStaticBank}
              className="w-full border border-slate-700 hover:bg-slate-800 rounded-lg py-2 text-sm font-medium text-slate-200"
            >
              Use shared bank ({staticBank.files?.length || 0} chapters, no key needed)
            </button>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Quiz-only mode. Won't be able to add new chapters.
            </p>
          </div>
        )}

        <div className="mt-5 text-[11px] leading-relaxed text-slate-500 space-y-1">
          <p>
            Get a free key at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="text-indigo-400 underline">
              aistudio.google.com/apikey
            </a>.
          </p>
          <p>
            <span className="text-amber-400">Heads up:</span> the app calls the Gemini API directly from your browser.
            Free-tier usage may be used for training; don't upload anything you wouldn't share.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- helpers ----------
function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}

function parseChapterFromFilename(name) {
  const stem = name.replace(/\.pdf$/i, '').trim();
  const m = stem.match(/^Chapter\s+(\d+)\s+(.+)$/i);
  if (m) return `Chapter ${m[1]} — ${m[2]}`;
  return stem;
}

// ---------- upload panel ----------
function UploadPanel() {
  const { client, files, setFiles } = useApp();
  const [subject, setSubject] = useState('Behavioral Science');
  const [pending, setPending] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const knownSubjects = useMemo(() => {
    const s = new Set(files.map((f) => f.subject));
    ['Behavioral Science', 'Biology', 'Chemistry', 'Physics', 'Biochemistry',
     'Psychology', 'Sociology'].forEach((x) => s.add(x));
    return Array.from(s);
  }, [files]);

  const onPick = (fileList) => {
    const arr = Array.from(fileList).filter((f) => /\.pdf$/i.test(f.name));
    if (!arr.length) return;
    setPending(arr.map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
      chapter: parseChapterFromFilename(f.name),
      status: 'queued',
      error: null,
    })));
  };

  const startUploads = async () => {
    for (let i = 0; i < pending.length; i++) {
      if (pending[i].status !== 'queued') continue;
      setPending((p) => p.map((e, idx) => idx === i ? { ...e, status: 'uploading' } : e));
      try {
        const meta = await client.uploadFile(pending[i].file);
        const record = {
          file_id: meta.name, // e.g. "files/abc-123"
          file_uri: meta.uri,
          mime_type: meta.mimeType || 'application/pdf',
          filename: pending[i].name,
          size_bytes: Number(meta.sizeBytes) || pending[i].size,
          subject,
          chapter: pending[i].chapter,
          uploaded_at: new Date().toISOString(),
        };
        setFiles((prev) => [...prev.filter((f) => f.file_id !== meta.name), record]);
        setPending((p) => p.map((e, idx) => idx === i ? { ...e, status: 'done' } : e));
      } catch (e) {
        setPending((p) => p.map((entry, idx) => idx === i ? { ...entry, status: 'error', error: e.message } : entry));
      }
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Upload chapter PDFs</h3>
        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-400">Subject</label>
          <input
            list="subjects"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 w-48"
          />
          <datalist id="subjects">
            {knownSubjects.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          onPick(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver ? 'border-indigo-400 bg-indigo-950/30' : 'border-slate-700 hover:border-slate-500'
        }`}
      >
        <div className="text-slate-300">Drag PDFs here, or click to select</div>
        <div className="text-xs text-slate-500 mt-1">
          They'll be assigned to <span className="text-slate-300">{subject}</span>. Chapter parsed
          from filename — editable before upload.
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
        />
      </div>

      {pending.length > 0 && (
        <div className="mt-4 space-y-2">
          {pending.map((e, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{e.name}</div>
                <input
                  value={e.chapter}
                  onChange={(ev) => setPending((p) => p.map((x, idx) => idx === i ? { ...x, chapter: ev.target.value } : x))}
                  disabled={e.status !== 'queued'}
                  className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs disabled:opacity-60"
                />
              </div>
              <div className="text-xs text-slate-400 w-20 text-right">{fmtBytes(e.size)}</div>
              <div className={`text-xs w-32 text-right truncate ${
                e.status === 'done' ? 'text-emerald-400' :
                e.status === 'error' ? 'text-red-400' :
                e.status === 'uploading' ? 'text-indigo-300' : 'text-slate-400'
              }`}>
                {e.status === 'error' ? (e.error || 'error') : e.status}
              </div>
            </div>
          ))}
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => setPending([])}
              className="text-xs px-3 py-1.5 border border-slate-700 rounded hover:bg-slate-800"
            >
              Clear
            </button>
            <button
              onClick={startUploads}
              disabled={pending.every((e) => e.status !== 'queued')}
              className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded font-medium"
            >
              Upload {pending.filter((e) => e.status === 'queued').length} file(s)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- extraction preview ----------
function ExtractionPreview({ data }) {
  const [tab, setTab] = useState('summary');
  if (!data) return null;
  const counts = {
    summary: data.summary_sentences?.length || 0,
    examples: data.context_examples?.length || 0,
    terms: data.key_terms?.length || 0,
  };
  const tabs = [
    ['summary', `Summary (${counts.summary})`],
    ['examples', `Examples (${counts.examples})`],
    ['terms', `Terms (${counts.terms})`],
  ];
  return (
    <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-lg">
      <div className="flex border-b border-slate-800">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`text-xs px-3 py-2 ${tab === k ? 'text-indigo-300 border-b border-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-3 max-h-72 overflow-y-auto text-xs space-y-1">
        {tab === 'summary' && (data.summary_sentences || []).map((s, i) => (
          <div key={i} className="text-slate-300"><span className="text-slate-600 mr-2">{i + 1}.</span>{s}</div>
        ))}
        {tab === 'examples' && (data.context_examples || []).map((e, i) => (
          <div key={i} className="text-slate-300">
            <span className="text-indigo-300 font-medium">{e.topic}:</span> <span className="text-slate-400">{e.example}</span>
          </div>
        ))}
        {tab === 'terms' && (data.key_terms || []).map((t, i) => (
          <div key={i} className="text-slate-300">
            <span className="text-fuchsia-300 font-medium">{t.term}</span> — <span className="text-slate-400">{t.definition}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- file row ----------
function FileRow({ file, extraction, qbank, busyStage, onProcess, onRemove, readOnly }) {
  const [open, setOpen] = useState(false);
  const mcCount = qbank?.mc?.length || 0;
  const shortCount = qbank?.short?.length || 0;
  const termsCount = extraction?.key_terms?.length || 0;
  const fullyProcessed = extraction && qbank?.mc && qbank?.short;

  let badge;
  if (busyStage) {
    badge = { label: busyStage, cls: 'bg-indigo-900/40 text-indigo-300 animate-pulse' };
  } else if (file.processError) {
    badge = { label: 'error', cls: 'bg-red-900/40 text-red-300' };
  } else if (fullyProcessed) {
    badge = { label: 'ready', cls: 'bg-emerald-900/40 text-emerald-300' };
  } else if (extraction) {
    badge = { label: 'partial', cls: 'bg-amber-900/40 text-amber-300' };
  } else {
    badge = { label: 'pending', cls: 'bg-slate-800 text-slate-400' };
  }

  return (
    <li className="py-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm">{file.chapter}</div>
          <div className="text-xs text-slate-500 truncate">
            {file.filename} · {fmtBytes(file.size_bytes)}
            {fullyProcessed && (
              <span className="ml-2 text-slate-400">
                · {mcCount} MC · {shortCount} short · {termsCount} terms
              </span>
            )}
          </div>
          {file.processError && (
            <div className="text-xs text-red-400 mt-1 truncate" title={file.processError}>
              {file.processError}
            </div>
          )}
        </div>
        <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded ${badge.cls}`}>
          {badge.label}
        </span>
        {extraction ? (
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs px-2 py-1 border border-slate-700 rounded hover:bg-slate-800"
          >
            {open ? 'Hide' : 'View'}
          </button>
        ) : null}
        {!readOnly && !fullyProcessed && (
          <button
            onClick={onProcess}
            disabled={!!busyStage}
            className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded font-medium"
          >
            {extraction ? 'Finish' : 'Process'}
          </button>
        )}
        {!readOnly && (
          <button onClick={onRemove} className="text-xs text-slate-400 hover:text-red-400 px-2" title="Remove">✕</button>
        )}
      </div>
      {open && extraction && <ExtractionPreview data={extraction} />}
    </li>
  );
}

// ---------- file list ----------
function FileList() {
  const {
    files, setFiles, client,
    extractions, setExtraction,
    questions, setQuestionsFor,
    readOnly,
  } = useApp();
  const [busy, setBusy] = useState({}); // { [file_id]: 'extracting' | 'generating MC' | 'generating short' }

  const grouped = useMemo(() => {
    const g = {};
    for (const f of files) {
      if (!g[f.subject]) g[f.subject] = [];
      g[f.subject].push(f);
    }
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => a.chapter.localeCompare(b.chapter, undefined, { numeric: true }));
    }
    return g;
  }, [files]);

  const markFile = useCallback((fileId, patch) => {
    setFiles((prev) => prev.map((f) => f.file_id === fileId ? { ...f, ...patch } : f));
  }, [setFiles]);

  const processOne = useCallback(async (file) => {
    if (busy[file.file_id]) return;
    markFile(file.file_id, { processError: null });
    const existingQ = questions[file.file_id] || {};
    try {
      // Step 1: extraction (skip if already cached)
      let ext = extractions[file.file_id];
      if (!ext) {
        setBusy((b) => ({ ...b, [file.file_id]: 'extracting' }));
        ext = await client.extractFromPdf(file.file_uri, file.mime_type, `${file.subject} — ${file.chapter}`);
        setExtraction(file.file_id, ext);
      }
      // Step 2: MC bank (skip if already cached)
      let mc = existingQ.mc;
      if (!mc) {
        setBusy((b) => ({ ...b, [file.file_id]: 'generating MC' }));
        mc = await client.generateMCQuestions(file.file_uri, file.mime_type, ext, file.chapter);
      }
      // Step 3: short answer bank
      let short = existingQ.short;
      if (!short) {
        setBusy((b) => ({ ...b, [file.file_id]: 'generating short' }));
        short = await client.generateShortAnswers(file.file_uri, file.mime_type, ext, file.chapter);
      }
      setQuestionsFor(file.file_id, { mc, short, generated_at: new Date().toISOString() });
      markFile(file.file_id, { processError: null });
    } catch (e) {
      markFile(file.file_id, { processError: e.message });
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[file.file_id]; return n; });
    }
  }, [busy, client, extractions, questions, markFile, setExtraction, setQuestionsFor]);

  const processAll = useCallback(async (subject) => {
    const list = grouped[subject].filter((f) => {
      const q = questions[f.file_id];
      return !(extractions[f.file_id] && q?.mc && q?.short);
    });
    for (const f of list) {
      // sequential — Gemini Pro free tier is ~few RPM, so don't parallelize
      // eslint-disable-next-line no-await-in-loop
      await processOne(f);
    }
  }, [grouped, extractions, questions, processOne]);

  const removeFile = async (record) => {
    if (!confirm(`Remove ${record.filename}? Also deletes from Gemini's file store.`)) return;
    try { await client.deleteFile(record.file_id); } catch (e) { console.warn('remote delete failed', e); }
    setFiles((prev) => prev.filter((f) => f.file_id !== record.file_id));
    setExtraction(record.file_id, undefined);
    setQuestionsFor(record.file_id, undefined);
  };

  if (!files.length) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6 text-sm text-slate-400">
        No uploads yet. Drop a PDF above to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([subject, items]) => {
        const unfinished = items.filter((f) => {
          const q = questions[f.file_id];
          return !(extractions[f.file_id] && q?.mc && q?.short);
        }).length;
        return (
          <div key={subject} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-semibold">{subject}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{items.length} file{items.length === 1 ? '' : 's'}</span>
                {!readOnly && unfinished > 0 && (
                  <button
                    onClick={() => processAll(subject)}
                    disabled={Object.keys(busy).length > 0}
                    className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded font-medium"
                  >
                    Process {unfinished} chapter{unfinished === 1 ? '' : 's'}
                  </button>
                )}
              </div>
            </div>
            <ul className="divide-y divide-slate-800">
              {items.map((f) => (
                <FileRow
                  key={f.file_id}
                  file={f}
                  extraction={extractions[f.file_id]}
                  qbank={questions[f.file_id]}
                  busyStage={busy[f.file_id]}
                  onProcess={() => processOne(f)}
                  onRemove={() => removeFile(f)}
                  readOnly={readOnly}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ---------- quiz: pool building ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// item shape: { id, mode, file_id, chapter, subject, q }
function buildPool({ files, questions, extractions, attempts }, mode, scope) {
  const readyFiles = files.filter((f) => {
    const qb = questions[f.file_id];
    return extractions[f.file_id] && qb?.mc && qb?.short;
  });
  let pool = [];
  for (const f of readyFiles) {
    const meta = { file_id: f.file_id, chapter: f.chapter, subject: f.subject };
    if (mode === 'mc') {
      for (const q of questions[f.file_id].mc) pool.push({ id: q.id, mode, q, ...meta });
    } else if (mode === 'short') {
      for (const q of questions[f.file_id].short) pool.push({ id: q.id, mode, q, ...meta });
    } else if (mode === 'match') {
      const terms = (extractions[f.file_id].key_terms || []).slice();
      const GROUP = 5;
      for (let i = 0; i < terms.length; i += GROUP) {
        const group = terms.slice(i, i + GROUP);
        if (group.length >= 2) {
          pool.push({
            id: `match_${f.file_id}_${i}`,
            mode,
            q: { id: `match_${f.file_id}_${i}`, terms: group },
            ...meta,
          });
        }
      }
    }
  }
  if (scope.startsWith('subject:')) {
    const subj = scope.slice(8);
    pool = pool.filter((x) => x.subject === subj);
  } else if (scope.startsWith('chapter:')) {
    const id = scope.slice(8);
    pool = pool.filter((x) => x.file_id === id);
  } else if (scope === 'misses') {
    const wrong = new Set();
    for (const a of attempts) if (!a.correct) wrong.add(a.question_id);
    pool = pool.filter((x) => wrong.has(x.id));
  }
  return pool;
}

// ---------- quiz: launcher ----------
function QuizLauncher({ onStart }) {
  const ctx = useApp();
  const { files, questions, extractions, attempts } = ctx;
  const [mode, setMode] = useState('mc');
  const [scope, setScope] = useState('all');
  const [count, setCount] = useState(10);

  const subjects = useMemo(() => {
    const s = new Set();
    files.forEach((f) => s.add(f.subject));
    return Array.from(s);
  }, [files]);

  const readyChapters = useMemo(
    () => files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short),
    [files, extractions, questions]
  );

  const pool = useMemo(() => buildPool(ctx, mode, scope), [ctx, mode, scope]);
  const wrongCount = useMemo(() => {
    const w = new Set();
    for (const a of attempts) if (!a.correct) w.add(a.question_id);
    return w.size;
  }, [attempts]);

  if (!readyChapters.length) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6 text-sm text-slate-400">
        No chapters processed yet. Upload PDFs in the Library tab and click <span className="text-slate-200">Process</span>.
      </div>
    );
  }

  const modes = [
    ['mc', 'Multiple choice'],
    ['short', 'Short answer'],
    ['match', 'Matching'],
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5">
      <div>
        <h2 className="font-semibold mb-3">Start a quiz</h2>
        <div className="grid grid-cols-3 gap-2">
          {modes.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`text-sm py-2 rounded border ${mode === k
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'border-slate-700 hover:bg-slate-800 text-slate-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Scope</div>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm"
        >
          <option value="all">All ready chapters</option>
          {subjects.map((s) => (
            <option key={s} value={`subject:${s}`}>{s} (all chapters)</option>
          ))}
          <optgroup label="Single chapter">
            {readyChapters.map((f) => (
              <option key={f.file_id} value={`chapter:${f.file_id}`}>
                {f.subject} — {f.chapter}
              </option>
            ))}
          </optgroup>
          <option value="misses" disabled={wrongCount === 0}>
            Drill my misses ({wrongCount} question{wrongCount === 1 ? '' : 's'})
          </option>
        </select>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Count</div>
        <div className="flex gap-2">
          {[5, 10, 20, 50].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`text-sm px-3 py-1.5 rounded border ${count === n
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'border-slate-700 hover:bg-slate-800 text-slate-300'}`}
            >
              {n}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-500 self-center">
            {pool.length} available
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
          if (!picked.length) return;
          onStart(picked);
        }}
        disabled={pool.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg py-2.5 font-medium"
      >
        Start {Math.min(count, pool.length)}-question quiz
      </button>
    </div>
  );
}

// ---------- quiz: MC ----------
function MCQuestion({ item, onAnswer }) {
  const [picked, setPicked] = useState(null);
  // shuffle choices, but remember original index for grading
  const shuffled = useMemo(() => {
    const arr = item.q.choices.map((text, origIdx) => ({ text, origIdx }));
    return shuffle(arr);
  }, [item.id]);

  const submit = (entry) => {
    if (picked !== null) return;
    setPicked(entry);
    const correct = entry.origIdx === item.q.correct_index;
    onAnswer({ correct, user_answer: entry.text });
  };

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed">{item.q.question}</p>
      <div className="space-y-2">
        {shuffled.map((entry, i) => {
          const isPicked = picked && entry.origIdx === picked.origIdx;
          const isCorrect = entry.origIdx === item.q.correct_index;
          let cls = 'border-slate-700 hover:bg-slate-800';
          if (picked) {
            if (isCorrect) cls = 'border-emerald-500 bg-emerald-900/30';
            else if (isPicked) cls = 'border-red-500 bg-red-900/30';
            else cls = 'border-slate-800 opacity-60';
          }
          return (
            <button
              key={i}
              onClick={() => submit(entry)}
              disabled={picked !== null}
              className={`w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors ${cls}`}
            >
              <span className="text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span>
              {entry.text}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-sm">
          <div className={picked.origIdx === item.q.correct_index ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
            {picked.origIdx === item.q.correct_index ? 'Correct' : 'Incorrect'}
          </div>
          <div className="text-slate-300 mt-1">{item.q.explanation}</div>
        </div>
      )}
    </div>
  );
}

// ---------- quiz: short answer ----------
function ShortAnswerQuestion({ item, onAnswer }) {
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(false);

  const submit = () => setRevealed(true);
  const grade = (correct) => {
    if (graded) return;
    setGraded(true);
    onAnswer({ correct, user_answer: text });
  };

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed">{item.q.prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={revealed}
        rows={4}
        placeholder="Write your answer…"
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm disabled:opacity-70"
      />
      {!revealed ? (
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg px-4 py-2 text-sm font-medium"
        >
          Reveal answer
        </button>
      ) : (
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-emerald-300 mb-1">Ideal answer</div>
            <div className="text-sm text-slate-200">{item.q.ideal_answer}</div>
          </div>
          {item.q.key_points?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wide text-indigo-300 mb-1">Key points</div>
              <ul className="text-sm text-slate-300 list-disc pl-5 space-y-0.5">
                {item.q.key_points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {!graded ? (
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 self-center mr-2">How did you do?</span>
              <button onClick={() => grade(false)} className="text-sm px-3 py-1.5 border border-red-700 text-red-300 hover:bg-red-950/40 rounded">
                Missed it
              </button>
              <button onClick={() => grade(true)} className="text-sm px-3 py-1.5 border border-emerald-700 text-emerald-300 hover:bg-emerald-950/40 rounded">
                Got it
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-800">Graded.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- quiz: matching ----------
function MatchingQuestion({ item, onAnswer }) {
  const pairs = item.q.terms; // [{term, definition}, ...]
  const termOrder = useMemo(() => pairs.map((_, i) => i), [item.id]);
  const defOrder = useMemo(() => shuffle(pairs.map((_, i) => i)), [item.id]);

  // pairings: { [termIdx]: defIdx }
  const [pairings, setPairings] = useState({});
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const usedDefs = new Set(Object.values(pairings));
  const allPaired = Object.keys(pairings).length === pairs.length;

  const onTermClick = (i) => {
    if (submitted) return;
    if (pairings[i] !== undefined) {
      // unpair
      const next = { ...pairings };
      delete next[i];
      setPairings(next);
      return;
    }
    setSelectedTerm(i);
  };

  const onDefClick = (j) => {
    if (submitted) return;
    if (usedDefs.has(j)) {
      // unpair: find the term linked to this def
      const termIdx = Object.entries(pairings).find(([, v]) => v === j)?.[0];
      if (termIdx !== undefined) {
        const next = { ...pairings };
        delete next[termIdx];
        setPairings(next);
      }
      return;
    }
    if (selectedTerm === null) return;
    setPairings((p) => ({ ...p, [selectedTerm]: j }));
    setSelectedTerm(null);
  };

  const submit = () => {
    if (submitted || !allPaired) return;
    setSubmitted(true);
    let correctCount = 0;
    for (const [termIdxStr, defIdx] of Object.entries(pairings)) {
      const termIdx = Number(termIdxStr);
      if (termIdx === defIdx) correctCount++;
    }
    // Report a single attempt per matching question — correct iff all pairs right.
    // (More granular per-pair tracking would require unique question_ids per term.)
    onAnswer({
      correct: correctCount === pairs.length,
      user_answer: `${correctCount}/${pairs.length} pairs correct`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-400">Match each term to its definition.</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-slate-500">Terms</div>
          {termOrder.map((i) => {
            const paired = pairings[i] !== undefined;
            const correct = submitted && paired && pairings[i] === i;
            const wrong = submitted && paired && pairings[i] !== i;
            let cls = 'border-slate-700 hover:bg-slate-800';
            if (selectedTerm === i) cls = 'border-indigo-400 bg-indigo-950/40';
            else if (correct) cls = 'border-emerald-500 bg-emerald-900/30';
            else if (wrong) cls = 'border-red-500 bg-red-900/30';
            else if (paired) cls = 'border-slate-600 bg-slate-800/50';
            return (
              <button
                key={i}
                onClick={() => onTermClick(i)}
                disabled={submitted}
                className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors ${cls}`}
              >
                <span className="text-slate-500 mr-2">{i + 1}.</span>
                <span className="font-medium">{pairs[i].term}</span>
                {paired && (
                  <span className="text-xs text-slate-400 ml-2">
                    → {String.fromCharCode(65 + defOrder.indexOf(pairings[i]))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-slate-500">Definitions</div>
          {defOrder.map((j, displayIdx) => {
            const used = usedDefs.has(j);
            const termIdx = Object.entries(pairings).find(([, v]) => v === j)?.[0];
            const correct = submitted && termIdx !== undefined && Number(termIdx) === j;
            const wrong = submitted && termIdx !== undefined && Number(termIdx) !== j;
            let cls = 'border-slate-700 hover:bg-slate-800';
            if (correct) cls = 'border-emerald-500 bg-emerald-900/30';
            else if (wrong) cls = 'border-red-500 bg-red-900/30';
            else if (used) cls = 'border-slate-600 bg-slate-800/50';
            return (
              <button
                key={j}
                onClick={() => onDefClick(j)}
                disabled={submitted || (selectedTerm === null && !used)}
                className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-60 ${cls}`}
              >
                <span className="text-slate-500 mr-2">{String.fromCharCode(65 + displayIdx)}.</span>
                {pairs[j].definition}
              </button>
            );
          })}
        </div>
      </div>
      {!submitted && (
        <button
          onClick={submit}
          disabled={!allPaired}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
        >
          {allPaired ? 'Submit' : `Pair all ${pairs.length} terms to submit`}
        </button>
      )}
    </div>
  );
}

// ---------- quiz: runner ----------
function QuizRunner({ items, onExit }) {
  const { addAttempt } = useApp();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]); // [{item, correct, user_answer}]
  const [answered, setAnswered] = useState(false);

  const item = items[index];
  const isLast = index === items.length - 1;

  const handleAnswer = ({ correct, user_answer }) => {
    if (answered) return;
    setAnswered(true);
    addAttempt({
      question_id: item.id,
      mode: item.mode,
      file_id: item.file_id,
      chapter: item.chapter,
      subject: item.subject,
      correct,
      user_answer,
    });
    setResults((r) => [...r, { item, correct, user_answer }]);
  };

  const next = () => {
    if (isLast) return;
    setIndex(index + 1);
    setAnswered(false);
  };

  if (!item) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">
          <span className="text-slate-200">{item.chapter}</span>
          <span className="ml-2">· Question {index + 1} of {items.length}</span>
        </div>
        <button
          onClick={() => onExit(results)}
          className="text-xs text-slate-400 hover:text-red-400 border border-slate-700 rounded px-2 py-1"
        >
          End quiz
        </button>
      </div>

      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{ width: `${((index + (answered ? 1 : 0)) / items.length) * 100}%` }}
        />
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        {item.mode === 'mc' && <MCQuestion key={item.id} item={item} onAnswer={handleAnswer} />}
        {item.mode === 'short' && <ShortAnswerQuestion key={item.id} item={item} onAnswer={handleAnswer} />}
        {item.mode === 'match' && <MatchingQuestion key={item.id} item={item} onAnswer={handleAnswer} />}
      </div>

      {answered && (
        <div className="flex justify-end">
          <button
            onClick={isLast ? () => onExit([...results]) : next}
            className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 text-sm font-medium"
          >
            {isLast ? 'See results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- quiz: summary ----------
function QuizSummary({ results, onRestart, onDrillMisses }) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const misses = results.filter((r) => !r.correct);

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center">
        <div className="text-xs uppercase tracking-wide text-slate-400">Quiz complete</div>
        <div className="text-5xl font-bold mt-2">{pct}%</div>
        <div className="text-sm text-slate-400 mt-1">{correct} of {total} correct</div>
      </div>

      {misses.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Missed questions</h3>
          <ul className="space-y-2 text-sm">
            {misses.map((m, i) => (
              <li key={i} className="text-slate-300">
                <span className="text-slate-500 mr-2">{i + 1}.</span>
                {m.item.mode === 'mc' && m.item.q.question}
                {m.item.mode === 'short' && m.item.q.prompt}
                {m.item.mode === 'match' && <span className="text-slate-400">Matching set · {m.user_answer}</span>}
                <div className="text-xs text-slate-500 mt-0.5 ml-6">{m.item.chapter}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex-1 border border-slate-700 hover:bg-slate-800 rounded-lg py-2 text-sm"
        >
          New quiz
        </button>
        {misses.length > 0 && (
          <button
            onClick={onDrillMisses}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 text-sm font-medium"
          >
            Drill {misses.length} miss{misses.length === 1 ? '' : 'es'}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- quiz: top-level view ----------
function StudyView() {
  // 'launcher' | 'active' | 'summary'
  const [phase, setPhase] = useState('launcher');
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);

  const start = (picked) => { setItems(picked); setResults([]); setPhase('active'); };
  const end = (r) => { setResults(r); setPhase('summary'); };
  const restart = () => { setItems([]); setResults([]); setPhase('launcher'); };
  const drillMisses = () => {
    const missedItems = results.filter((r) => !r.correct).map((r) => r.item);
    setItems(shuffle(missedItems));
    setResults([]);
    setPhase('active');
  };

  if (phase === 'launcher') return <QuizLauncher onStart={start} />;
  if (phase === 'active') return <QuizRunner items={items} onExit={end} />;
  return <QuizSummary results={results} onRestart={restart} onDrillMisses={drillMisses} />;
}

// ---------- shell ----------
function exportBank({ files, extractions, questions }) {
  const data = {
    version: 1,
    exported_at: new Date().toISOString(),
    model: MODEL,
    files,
    extractions,
    questions,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `data.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Shell() {
  const { apiKey, setApiKey, attempts, readOnly, files, extractions, questions } = useApp();
  const [tab, setTab] = useState('library');

  const tabs = readOnly
    ? [['study', 'Study'], ['library', 'Library']]
    : [['library', 'Library'], ['study', 'Study']];
  useEffect(() => { if (readOnly) setTab('study'); }, [readOnly]);

  const fullyProcessed = files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short).length;

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-slate-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <div className="font-semibold">MCAT Study</div>
          {readOnly
            ? <span className="text-xs text-emerald-300 bg-emerald-900/40 rounded px-2 py-0.5">read-only</span>
            : <span className="text-xs text-slate-500 font-mono">{MODEL}</span>}
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`text-sm px-3 py-1.5 rounded ${tab === k
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{attempts.length} attempt{attempts.length === 1 ? '' : 's'}</span>
          {!readOnly && (
            <>
              <span>key: <span className="font-mono">…{apiKey.slice(-6)}</span></span>
              <button
                onClick={() => { if (confirm('Forget the saved API key?')) setApiKey(''); }}
                className="px-2 py-1 border border-slate-700 rounded hover:bg-slate-800"
              >
                Forget key
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {tab === 'library' && (
            <>
              {!readOnly && <UploadPanel />}
              {!readOnly && fullyProcessed > 0 && (
                <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-3">
                  <div className="text-sm text-slate-300">
                    Export the {fullyProcessed} ready chapter{fullyProcessed === 1 ? '' : 's'} as <span className="font-mono text-xs">data.json</span> — drop it next to <span className="font-mono text-xs">index.html</span> on a static host so others can quiz without a key.
                  </div>
                  <button
                    onClick={() => exportBank({ files, extractions, questions })}
                    className="ml-3 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded font-medium whitespace-nowrap"
                  >
                    Export bank
                  </button>
                </div>
              )}
              <FileList />
            </>
          )}
          {tab === 'study' && <StudyView />}
        </div>
      </main>
    </div>
  );
}

function Root() {
  const { apiKey, readOnly } = useApp();
  return (apiKey || readOnly) ? <Shell /> : <ApiKeyGate />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <Root />
  </AppProvider>
);

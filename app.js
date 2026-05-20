const { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } = React;

// ---------- config ----------
const MODEL = 'gemini-2.5-flash';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const UPLOAD_BASE = 'https://generativelanguage.googleapis.com/upload/v1beta';

// Cloudflare Worker backend (accounts, attempt sync, stats, leaderboard).
const API_BASE = 'https://mcat-api.solitary-sky-76c1.workers.dev';

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
  theme: 'mcat:theme',
  github: 'mcat:github',
  session: 'mcat:session',
  pendingSync: 'mcat:pendingSync',
};

const THEMES = ['dark', 'light', 'warm'];

const DEFAULT_GITHUB = {
  token: '',
  repo: 'Orbgamestudios/MCAT-study-MASTER',
  branch: 'main',
  path: 'data.json',
  autoPush: false,
};

// ---------- github contents api ----------
function toBase64Utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

async function ghHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function ghGetSha({ token, repo, branch, path }) {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: await ghHeaders(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  return j.sha;
}

async function ghPutFile({ token, repo, branch, path }, content, sha, message) {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`;
  const body = { message, content: toBase64Utf8(content), branch };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...(await ghHeaders(token)), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function pushBankToGithub(github, { files, extractions, questions }) {
  if (!github.token || !github.repo || !github.path) throw new Error('GitHub sync not configured.');
  const data = {
    version: 1,
    exported_at: new Date().toISOString(),
    model: MODEL,
    files, extractions, questions,
  };
  const content = JSON.stringify(data, null, 2);
  const sha = await ghGetSha(github);
  const msg = `Update bank: ${files.length} files (${new Date().toISOString().slice(0, 10)})`;
  return ghPutFile(github, content, sha, msg);
}

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

  // ---- term coverage MC ----
  // Generates one MC question PER key_term so the quiz covers every term in the chapter,
  // even terms the chapter didn't directly quiz. Distractors should be deliberately tricky —
  // drawn from common student confusions, sibling concepts, and adjacent topics, NOT just
  // other terms' literal definitions.
  async function generateTermQuestions(extraction, chapterLabel) {
    const terms = extraction?.key_terms || [];
    if (!terms.length) return [];

    const BATCH = 12;
    const all = [];
    for (let i = 0; i < terms.length; i += BATCH) {
      const batch = terms.slice(i, i + BATCH);
      const resp = await generate({
        maxOutputTokens: 16384,
        disableThinking: true,
        systemInstruction:
          'You write tough MCAT-style multiple-choice questions, one per assigned term. ' +
          'For each term, write a question testing understanding — definition, application, ' +
          'mechanism, recognition in a clinical/behavioral scenario, or distinguishing the term from a sibling concept. ' +
          'Vary phrasing across items; do NOT default to "What is the X?" — mix in scenarios, vignettes, "best example of", "most similar to", "which of the following would NOT". ' +
          'Exactly 4 choices, correct_index 0-3.\n\n' +
          'DISTRACTORS MUST BE GENUINELY HARD:\n' +
          '- Pull from commonly confused sibling concepts (e.g. for "generalization" use accommodation, assimilation, classical-vs-operant cousins).\n' +
          '- Pull from adjacent material in the broader MCAT corpus, not just this chapter — Piaget vs Vygotsky, Type I vs Type II errors, sympathetic vs parasympathetic, etc.\n' +
          '- Include at least one distractor that is technically true but does NOT answer the question.\n' +
          '- Avoid "obviously wrong" distractors (unrelated facts, gibberish, definitions of trivial items). Every distractor should make a half-prepared student hesitate.\n' +
          '- Don\'t pad with "all/none of the above" filler.\n\n' +
          'Explanations are 1-2 sentences and should briefly call out why the most tempting distractor is wrong.',
        contents: [{
          role: 'user',
          parts: [{
            text:
              `Chapter: ${chapterLabel}\n\n` +
              `Assigned terms (write ONE question for each, in this order):\n` +
              batch.map((t, idx) => `${idx + 1}. ${t.term} — ${t.definition}`).join('\n') +
              `\n\nOther terms in the same chapter (fair game as distractor inspiration):\n` +
              terms.filter((_, idx) => idx < i || idx >= i + BATCH)
                .slice(0, 30)
                .map((t) => `- ${t.term}: ${t.definition}`).join('\n') +
              `\n\nReturn exactly ${batch.length} questions, in the same order as the assigned terms above.`,
          }],
        }],
        responseSchema: MC_SCHEMA,
      });
      const data = extractJson(resp);
      const qs = (data.questions || []).slice(0, batch.length);
      qs.forEach((q, idx) => {
        all.push({
          id: `term_${Date.now()}_${i + idx}`,
          mode: 'mc',
          from: 'term',
          term: batch[idx].term,
          ...q,
        });
      });
    }
    return all;
  }

  // ---- two-part MC ----
  // Each item presents two sequential mini-MCs on related-but-distinct concepts that
  // students commonly confuse. Each part is scored independently.
  const TWO_PART_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            theme: { type: 'STRING' },
            parts: {
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
          required: ['theme', 'parts'],
        },
      },
    },
    required: ['questions'],
  };

  async function generateTwoPartQuestions(extraction, chapterLabel, n = 6) {
    if (!extraction?.key_terms?.length) return [];
    const resp = await generate({
      maxOutputTokens: 16384,
      disableThinking: true,
      systemInstruction:
        'You design "two-part" MCAT-style multiple choice items. Each item has exactly TWO MC parts on RELATED-BUT-DIFFERENT concepts that students commonly confuse. ' +
        'Example shape: Part 1 presents a brief scenario or stem and asks "this illustrates _____" (correct: generalization). ' +
        'Part 2 then asks a definitional or application question on a sibling concept (correct: accommodation to a schema). ' +
        'The two parts share a "theme" (the broader area the student must navigate) but probe DISTINCT concepts so a student who has them blurred together will miss one. ' +
        'Each part has exactly 4 choices, correct_index 0-3, and a 1-2 sentence explanation. ' +
        'Distractors should be tough — sibling concepts, near-misses, things the student would plausibly pick if they\'re half-prepared. ' +
        'Avoid trivial filler distractors.',
      contents: [{
        role: 'user',
        parts: [{
          text:
            `Chapter: ${chapterLabel}\n\n` +
            `Key terms in this chapter (use as raw material for concept pairs that are commonly confused):\n` +
            (extraction.key_terms || []).slice(0, 40).map((t) => `- ${t.term}: ${t.definition}`).join('\n') +
            `\n\nGenerate exactly ${n} two-part items. Pick term pairs that students actually confuse (different theories explaining the same phenomenon, different stages of the same process, parallel mechanisms with subtle differences). ` +
            `Each "parts" array must have exactly 2 entries.`,
        }],
      }],
      responseSchema: TWO_PART_SCHEMA,
    });
    const data = extractJson(resp);
    return (data.questions || []).map((q, i) => ({
      id: `tp_${Date.now()}_${i}`,
      mode: 'two_part',
      ...q,
    }));
  }

  return {
    uploadFile, deleteFile, generate, ping,
    extractFromPdf, generateMCQuestions, generateShortAnswers, generateTermQuestions, generateTwoPartQuestions,
  };
}

// ---------- backend api client ----------
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function makeApiClient(getToken) {
  async function call(path, { method = 'GET', body, auth = false } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
      const t = getToken();
      if (!t) throw new ApiError(401, 'not signed in');
      headers['Authorization'] = `Bearer ${t}`;
    }
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) throw new ApiError(res.status, data?.error || res.statusText || `HTTP ${res.status}`);
    return data;
  }
  return {
    signup: ({ username, pin }) => call('/signup', { method: 'POST', body: { username, pin } }),
    login: ({ username, pin }) => call('/login', { method: 'POST', body: { username, pin } }),
    logout: () => call('/logout', { method: 'POST', auth: true }),
    me: () => call('/me', { auth: true }),
    postAttempts: (attempts) => call('/attempts', { method: 'POST', body: { attempts }, auth: true }),
    meStats: () => call('/me/stats', { auth: true }),
    leaderboard: () => call('/leaderboard'),
    userProfile: (username) => call(`/u/${encodeURIComponent(username)}`),

    // Bank publish + pull. body for putBank is the raw JSON string of the bank.
    putBank: async (bankJson) => {
      const t = getToken();
      if (!t) throw new ApiError(401, 'not signed in');
      const res = await fetch(`${API_BASE}/bank`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
        body: bankJson,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new ApiError(res.status, data?.error || `HTTP ${res.status}`);
      return data;
    },
    getMyBank: () => call('/bank', { auth: true }),
    getUserBank: (username) => call(`/bank/${encodeURIComponent(username)}`),
    bankMeta: (username) => call(`/bank/${encodeURIComponent(username)}/meta`),
    deleteMyBank: () => call('/bank', { method: 'DELETE', auth: true }),
    listBanks: () => call('/banks'),

    // ---- collaborative chapters ----
    listChapters: () => call('/chapters'),
    getChapter: (id) => call(`/chapters/${encodeURIComponent(id)}`),
    createChapter: ({ subject, title, filename, size_bytes }) =>
      call('/chapters', { method: 'POST', body: { subject, title, filename, size_bytes }, auth: true }),
    deleteChapter: (id) => call(`/chapters/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
    putChapterStage: async (id, stage, payload) => {
      const t = getToken();
      if (!t) throw new ApiError(401, 'not signed in');
      const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const res = await fetch(`${API_BASE}/chapters/${encodeURIComponent(id)}/stage/${encodeURIComponent(stage)}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new ApiError(res.status, data?.error || `HTTP ${res.status}`);
      return data;
    },
  };
}

// Hard-reload that defeats browser cache by adding a fresh query param
// and clearing any registered Cache Storage entries (PWA service workers).
async function forceUpdateApp() {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch {}
  const url = new URL(window.location.href);
  url.searchParams.set('_t', Date.now().toString());
  window.location.replace(url.toString());
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
  const [theme, setThemeState] = useState(() => storage.get(KEYS.theme, 'dark'));
  const [github, setGithubState] = useState(() => ({ ...DEFAULT_GITHUB, ...(storage.get(KEYS.github, {}) || {}) }));
  const [pushStatus, setPushStatus] = useState({ state: 'idle', lastAt: null, error: null });

  const setGithub = useCallback((patch) => {
    setGithubState((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      storage.set(KEYS.github, next);
      return next;
    });
  }, []);

  const pushBank = useCallback(async () => {
    setPushStatus({ state: 'pushing', lastAt: null, error: null });
    try {
      const cur = {
        files: storage.get(KEYS.files, []),
        extractions: storage.get(KEYS.extractions, {}),
        questions: storage.get(KEYS.questions, {}),
      };
      await pushBankToGithub(github, cur);
      setPushStatus({ state: 'idle', lastAt: Date.now(), error: null });
      return true;
    } catch (e) {
      setPushStatus({ state: 'error', lastAt: null, error: e.message });
      return false;
    }
  }, [github]);

  const setTheme = useCallback((t) => {
    if (!THEMES.includes(t)) return;
    storage.set(KEYS.theme, t);
    document.documentElement.setAttribute('data-theme', t);
    setThemeState(t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    const stamped = { ...a, ts: Date.now() };
    setAttemptsState((prev) => {
      const next = [...prev, stamped];
      storage.set(KEYS.attempts, next);
      return next;
    });
  }, []);

  const clearAttempts = useCallback(() => {
    storage.set(KEYS.attempts, []);
    setAttemptsState([]);
  }, []);

  const client = useMemo(() => makeClient(() => storage.get(KEYS.apiKey, '')), []);

  // ---- backend session ----
  const [session, setSessionState] = useState(() => storage.get(KEYS.session, null)); // { token, username } | null
  const [syncBusy, setSyncBusy] = useState(false);
  const [syncError, setSyncError] = useState('');

  const setSession = useCallback((s) => {
    if (s) storage.set(KEYS.session, s); else storage.remove(KEYS.session);
    setSessionState(s);
  }, []);

  const api = useMemo(() => makeApiClient(() => storage.get(KEYS.session, null)?.token || ''), []);

  // Unsynced = any attempt without `synced: true`. The single source of truth
  // is mcat:attempts; the old mcat:pendingSync key is unused now.
  const pendingSync = useMemo(
    () => attempts.filter((a) => !a.synced),
    [attempts]
  );

  const flushSync = useCallback(async () => {
    const s = storage.get(KEYS.session, null);
    if (!s?.token) return { ok: false, reason: 'not signed in' };
    if (syncBusy) return { ok: false, reason: 'busy' };
    const queue = storage.get(KEYS.attempts, []).filter((a) => !a.synced);
    if (!queue.length) return { ok: true, inserted: 0 };
    setSyncBusy(true);
    setSyncError('');
    try {
      // Chunk to stay well under the worker's 500-row cap.
      const CHUNK = 200;
      let remaining = queue.slice();
      while (remaining.length) {
        const chunk = remaining.slice(0, CHUNK);
        await api.postAttempts(chunk);
        remaining = remaining.slice(CHUNK);
      }
      // Mark every attempt that was in the queue as synced.
      const queuedTs = new Set(queue.map((a) => `${a.ts}:${a.question_id}`));
      setAttemptsState((prev) => {
        const next = prev.map((a) =>
          queuedTs.has(`${a.ts}:${a.question_id}`) ? { ...a, synced: true } : a
        );
        storage.set(KEYS.attempts, next);
        return next;
      });
      return { ok: true, inserted: queue.length };
    } catch (e) {
      setSyncError(e.message || 'sync failed');
      if (e.status === 401) {
        storage.remove(KEYS.session);
        setSessionState(null);
      }
      return { ok: false, reason: e.message };
    } finally {
      setSyncBusy(false);
    }
  }, [api, syncBusy]);

  // On login or app load with an active session: flush any unsynced attempts.
  useEffect(() => {
    if (session?.token) flushSync();
  }, [session?.token, flushSync]);

  const value = useMemo(
    () => ({
      apiKey, setApiKey,
      files, setFiles,
      extractions, setExtraction,
      questions, setQuestionsFor,
      attempts, addAttempt, clearAttempts,
      staticBank, useStaticBank,
      readOnly, setReadOnly,
      theme, setTheme,
      github, setGithub, pushBank, pushStatus,
      session, setSession, api, pendingSync, flushSync, syncBusy, syncError,
      client,
    }),
    [apiKey, setApiKey, files, setFiles, extractions, setExtraction, questions, setQuestionsFor,
     attempts, addAttempt, clearAttempts, staticBank, useStaticBank, readOnly, theme, setTheme,
     github, setGithub, pushBank, pushStatus,
     session, setSession, api, pendingSync, flushSync, syncBusy, syncError, client]
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// ---------- key gate ----------
function ApiKeyGate() {
  const { setApiKey, client, staticBank, useStaticBank, files, extractions, questions, setReadOnly } = useApp();
  const hasLocalData = files.some((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short);
  const localCount = files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short).length;
  const [val, setVal] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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
      <div className="w-full max-w-md bg-[var(--bg-card-strong)] border border-[var(--border)] rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-1">MCAT Study</h1>
        <p className="text-[var(--text-muted)] text-sm mb-5">
          Paste your Google AI (Gemini) API key to begin. Stored only in this browser's localStorage.
        </p>

        <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1">API key</label>
        <div className="flex gap-2">
          <input
            type={show ? 'text' : 'password'}
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(''); }}
            onKeyDown={(e) => e.key === 'Enter' && !busy && save()}
            placeholder="AIza..."
            className="flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="px-3 text-xs text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)]"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {err && <p className="text-[var(--danger-text)] text-xs mt-2">{err}</p>}

        <button
          onClick={save}
          disabled={!val.trim() || busy}
          className="mt-4 w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-2 text-sm font-medium"
        >
          {busy ? 'Verifying…' : 'Save & continue'}
        </button>

        {(staticBank || hasLocalData) && (
          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-faint)] mb-2 text-center">or</div>
            {hasLocalData && (
              <button
                onClick={() => setReadOnly(true)}
                className="w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
              >
                Continue with existing data ({localCount} chapter{localCount === 1 ? '' : 's'})
              </button>
            )}
            {staticBank && !hasLocalData && (
              <button
                onClick={useStaticBank}
                className="w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
              >
                Use shared bank ({staticBank.files?.length || 0} chapters)
              </button>
            )}
            <p className="text-[11px] text-[var(--text-faint)] mt-2 text-center">
              Quiz-only mode. Can't add new chapters without a key.
            </p>
          </div>
        )}

        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-faint)] mb-2 text-center">or</div>
          <button
            onClick={() => setShowAccount((s) => !s)}
            className="w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
          >
            Sign in / Sign up for cross-device stats
          </button>
          {showAccount && (
            <div className="mt-3">
              <AccountPanel onClose={() => setShowAccount(false)} />
            </div>
          )}
        </div>

        <div className="mt-5 text-[11px] leading-relaxed text-[var(--text-faint)] space-y-1">
          <p>
            Get a free key at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="text-[var(--accent-text)] underline">
              aistudio.google.com/apikey
            </a>.
          </p>
          <p>
            <span className="text-[var(--warning-text-strong)]">Heads up:</span> the app calls the Gemini API directly from your browser.
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
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Upload chapter PDFs</h3>
        <div className="flex items-center gap-2 text-xs">
          <label className="text-[var(--text-muted)]">Subject</label>
          <input
            list="subjects"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1 w-48"
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
          dragOver ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'
        }`}
      >
        <div className="text-[var(--text)]">Drag PDFs here, or click to select</div>
        <div className="text-xs text-[var(--text-faint)] mt-1">
          They'll be assigned to <span className="text-[var(--text)]">{subject}</span>. Chapter parsed
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
            <div key={i} className="flex items-center gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{e.name}</div>
                <input
                  value={e.chapter}
                  onChange={(ev) => setPending((p) => p.map((x, idx) => idx === i ? { ...x, chapter: ev.target.value } : x))}
                  disabled={e.status !== 'queued'}
                  className="mt-1 w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1 text-xs disabled:opacity-60"
                />
              </div>
              <div className="text-xs text-[var(--text-muted)] w-20 text-right">{fmtBytes(e.size)}</div>
              <div className={`text-xs w-32 text-right truncate ${
                e.status === 'done' ? 'text-[var(--success-text)]' :
                e.status === 'error' ? 'text-[var(--danger-text)]' :
                e.status === 'uploading' ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]'
              }`}>
                {e.status === 'error' ? (e.error || 'error') : e.status}
              </div>
            </div>
          ))}
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => setPending([])}
              className="text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
            >
              Clear
            </button>
            <button
              onClick={startUploads}
              disabled={pending.every((e) => e.status !== 'queued')}
              className="text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
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
    <div className="mt-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg">
      <div className="flex border-b border-[var(--border-soft)]">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`text-xs px-3 py-2 ${tab === k ? 'text-[var(--accent-text)] border-b border-[var(--accent-border)]' : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-3 max-h-72 overflow-y-auto text-xs space-y-1">
        {tab === 'summary' && (data.summary_sentences || []).map((s, i) => (
          <div key={i} className="text-[var(--text)]"><span className="text-[var(--text-fainter)] mr-2">{i + 1}.</span>{s}</div>
        ))}
        {tab === 'examples' && (data.context_examples || []).map((e, i) => (
          <div key={i} className="text-[var(--text)]">
            <span className="text-[var(--accent-text)] font-medium">{e.topic}:</span> <span className="text-[var(--text-muted)]">{e.example}</span>
          </div>
        ))}
        {tab === 'terms' && (data.key_terms || []).map((t, i) => (
          <div key={i} className="text-[var(--text)]">
            <span className="text-[var(--accent-2-text)] font-medium">{t.term}</span> — <span className="text-[var(--text-muted)]">{t.definition}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- file row ----------
function PublishToBankButton({ file, extraction, qbank }) {
  const { api, session, setFiles } = useApp();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  if (!session) return null;
  // Need at least an extraction to publish anything meaningful.
  if (!extraction) return null;

  const publish = async () => {
    if (busy) return;
    setBusy(true);
    setStatus(null);
    try {
      // 1. Ensure chapter exists (POST is idempotent by uploader+subject+title).
      let chapterId = file.chapter_id;
      if (!chapterId) {
        const created = await api.createChapter({
          subject: file.subject,
          title: file.chapter,
          filename: file.filename,
          size_bytes: file.size_bytes,
        });
        chapterId = created.id;
        // Persist the link on the file record.
        setFiles((prev) => prev.map((f) => f.file_id === file.file_id ? { ...f, chapter_id: chapterId } : f));
      }
      // 2. Push each stage we have locally.
      const pushes = [];
      if (extraction) pushes.push(['extraction', extraction]);
      if (qbank?.mc?.length) pushes.push(['mc', qbank.mc]);
      if (qbank?.twoPart?.length) pushes.push(['two_part', qbank.twoPart]);
      if (qbank?.short?.length) pushes.push(['short', qbank.short]);
      for (const [stage, payload] of pushes) {
        await api.putChapterStage(chapterId, stage, payload);
      }
      setStatus({ kind: 'ok', msg: `Published ${pushes.length} stage${pushes.length === 1 ? '' : 's'}` });
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {status && (
        <span className={`text-[10px] ${status.kind === 'ok' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]'}`}>
          {status.kind === 'ok' ? '✓' : '!'} {status.msg}
        </span>
      )}
      <button
        onClick={publish}
        disabled={busy}
        title={file.chapter_id ? `Update chapter ${file.chapter_id}` : 'Publish this chapter to the shared Bank'}
        className="text-xs px-2 py-1 border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] disabled:opacity-40 rounded font-medium"
      >
        {busy ? 'Publishing…' : file.chapter_id ? 'Update bank' : 'Publish to bank'}
      </button>
    </div>
  );
}

function FileRow({ file, extraction, qbank, busyStage, onProcess, onRemove, readOnly }) {
  const [open, setOpen] = useState(false);
  const mcCount = qbank?.mc?.length || 0;
  const shortCount = qbank?.short?.length || 0;
  const termsCount = extraction?.key_terms?.length || 0;
  const termCovered = qbank?.mc ? new Set(qbank.mc.filter((q) => q.from === 'term').map((q) => q.term)) : new Set();
  const termsNeeded = (extraction?.key_terms || []).filter((t) => !termCovered.has(t.term)).length;
  const fullyProcessed = extraction && qbank?.mc && qbank?.short && qbank?.twoPart && termsNeeded === 0;

  let badge;
  if (busyStage) {
    badge = { label: busyStage, cls: 'bg-[var(--accent-soft)] text-[var(--accent-text)] animate-pulse' };
  } else if (file.processError) {
    badge = { label: 'error', cls: 'bg-[var(--danger-bg)] text-[var(--danger-text)]' };
  } else if (fullyProcessed) {
    badge = { label: 'ready', cls: 'bg-[var(--success-bg)] text-[var(--success-text)]' };
  } else if (extraction) {
    badge = { label: 'partial', cls: 'bg-[var(--warning-bg)] text-[var(--warning-text)]' };
  } else {
    badge = { label: 'pending', cls: 'bg-[var(--bg-hover)] text-[var(--text-muted)]' };
  }

  return (
    <li className="py-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm">{file.chapter}</div>
          <div className="text-xs text-[var(--text-faint)] truncate">
            {file.filename} · {fmtBytes(file.size_bytes)}
            {qbank?.mc && (
              <span className="ml-2 text-[var(--text-muted)]">
                · {mcCount} MC · {shortCount} short · {termsCount} terms
                {termsNeeded > 0 && (
                  <span className="text-[var(--warning-text-strong)]"> · {termsNeeded} terms need coverage</span>
                )}
              </span>
            )}
          </div>
          {file.processError && (
            <div className="text-xs text-[var(--danger-text)] mt-1 truncate" title={file.processError}>
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
            className="text-xs px-2 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
          >
            {open ? 'Hide' : 'View'}
          </button>
        ) : null}
        {!readOnly && !fullyProcessed && (
          <button
            onClick={onProcess}
            disabled={!!busyStage}
            className="text-xs px-2 py-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
          >
            {extraction ? 'Finish' : 'Process'}
          </button>
        )}
        {!readOnly && <PublishToBankButton file={file} extraction={extraction} qbank={qbank} />}
        {!readOnly && (
          <button onClick={onRemove} className="text-xs text-[var(--text-muted)] hover:text-[var(--danger-text)] px-2" title="Remove">✕</button>
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
    readOnly, github, pushBank,
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
      // Step 3: term-coverage MC (one question per key_term). Skip if we've already
      // covered all current terms, or if a term run was already merged in mc.
      const haveTermFor = new Set(mc.filter((q) => q.from === 'term').map((q) => q.term));
      const allTerms = (ext.key_terms || []).map((t) => t.term);
      const missingTerms = allTerms.filter((t) => !haveTermFor.has(t));
      if (missingTerms.length > 0) {
        setBusy((b) => ({ ...b, [file.file_id]: `term coverage (${missingTerms.length})` }));
        const termExtraction = {
          ...ext,
          key_terms: (ext.key_terms || []).filter((t) => missingTerms.includes(t.term)),
        };
        const termQs = await client.generateTermQuestions(termExtraction, file.chapter);
        mc = [...mc, ...termQs];
      }
      // Step 4: short answer bank
      let short = existingQ.short;
      if (!short) {
        setBusy((b) => ({ ...b, [file.file_id]: 'generating short' }));
        short = await client.generateShortAnswers(file.file_uri, file.mime_type, ext, file.chapter);
      }
      // Step 5: two-part bank (skip if already cached)
      let twoPart = existingQ.twoPart;
      if (!twoPart) {
        setBusy((b) => ({ ...b, [file.file_id]: 'generating two-part' }));
        twoPart = await client.generateTwoPartQuestions(ext, file.chapter);
      }
      setQuestionsFor(file.file_id, { mc, short, twoPart, generated_at: new Date().toISOString() });
      markFile(file.file_id, { processError: null });
      // Fire-and-forget auto-push. Don't block the UI on it.
      if (github.autoPush && github.token) {
        // Small delay so the most recent setQuestionsFor write lands in storage
        // before pushBank reads from it.
        setTimeout(() => { pushBank(); }, 250);
      }
    } catch (e) {
      markFile(file.file_id, { processError: e.message });
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[file.file_id]; return n; });
    }
  }, [busy, client, extractions, questions, markFile, setExtraction, setQuestionsFor, github, pushBank]);

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
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
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
          <div key={subject} className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-semibold">{subject}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-muted)]">{items.length} file{items.length === 1 ? '' : 's'}</span>
                {!readOnly && unfinished > 0 && (
                  <button
                    onClick={() => processAll(subject)}
                    disabled={Object.keys(busy).length > 0}
                    className="text-xs px-3 py-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
                  >
                    Process {unfinished} chapter{unfinished === 1 ? '' : 's'}
                  </button>
                )}
              </div>
            </div>
            <ul className="divide-y divide-[var(--border-soft)]">
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
      // Regular MC + two-part items share the same pool — two-part items keep their
      // own mode so the runner dispatches them to TwoPartQuestion.
      for (const q of questions[f.file_id].mc) pool.push({ id: q.id, mode: 'mc', q, ...meta });
      for (const q of (questions[f.file_id].twoPart || [])) pool.push({ id: q.id, mode: 'two_part', q, ...meta });
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
  if (scope?.misses) {
    const wrong = new Set();
    for (const a of attempts) if (!a.correct) wrong.add(a.question_id);
    pool = pool.filter((x) => wrong.has(x.id));
  } else if (scope?.fileIds instanceof Set) {
    pool = pool.filter((x) => scope.fileIds.has(x.file_id));
  }
  return pool;
}

// ---------- quiz: launcher ----------
function QuizLauncher({ onStart }) {
  const ctx = useApp();
  const { files, questions, extractions, attempts } = ctx;
  const [mode, setMode] = useState('mc');
  const [count, setCount] = useState(10);
  const [drillMisses, setDrillMisses] = useState(false);

  const readyChapters = useMemo(
    () => files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short),
    [files, extractions, questions]
  );

  // Tree: { [subject]: { chapters: [file] } }
  const grouped = useMemo(() => {
    const g = {};
    for (const f of readyChapters) {
      if (!g[f.subject]) g[f.subject] = [];
      g[f.subject].push(f);
    }
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => a.chapter.localeCompare(b.chapter, undefined, { numeric: true }));
    }
    return g;
  }, [readyChapters]);

  // Selected file_ids — default to all ready chapters.
  const [selected, setSelected] = useState(() => new Set(readyChapters.map((f) => f.file_id)));
  // Re-sync selection if the set of ready chapters changes (e.g. user pulled a new bank).
  useEffect(() => {
    setSelected((prev) => {
      const valid = new Set(readyChapters.map((f) => f.file_id));
      const next = new Set();
      for (const id of prev) if (valid.has(id)) next.add(id);
      // If nothing is left selected (e.g. first load), default to all.
      if (next.size === 0) for (const id of valid) next.add(id);
      return next;
    });
  }, [readyChapters]);

  const wrongCount = useMemo(() => {
    const w = new Set();
    for (const a of attempts) if (!a.correct) w.add(a.question_id);
    return w.size;
  }, [attempts]);

  const scope = drillMisses ? { misses: true } : { fileIds: selected };
  const pool = useMemo(() => buildPool(ctx, mode, scope), [ctx, mode, drillMisses, selected]);

  if (!readyChapters.length) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No chapters processed yet. Upload PDFs in the Library tab and click <span className="text-[var(--text-strong)]">Process</span>, or pull a published bank from the Cloud bank panel.
      </div>
    );
  }

  const modes = [
    ['mc', 'Multiple choice'],
    ['short', 'Short answer'],
    ['match', 'Matching'],
  ];

  const subjectFileIds = (subject) => grouped[subject].map((f) => f.file_id);
  const isSubjectFully = (subject) => subjectFileIds(subject).every((id) => selected.has(id));
  const isSubjectPartial = (subject) => !isSubjectFully(subject) && subjectFileIds(subject).some((id) => selected.has(id));
  const toggleChapter = (fileId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId); else next.add(fileId);
      return next;
    });
  };
  const toggleSubject = (subject) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const ids = subjectFileIds(subject);
      const allOn = ids.every((id) => next.has(id));
      if (allOn) for (const id of ids) next.delete(id);
      else for (const id of ids) next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(readyChapters.map((f) => f.file_id)));
  const selectNone = () => setSelected(new Set());

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-5">
      <div>
        <h2 className="font-semibold mb-3">Start a quiz</h2>
        <div className="grid grid-cols-3 gap-2">
          {modes.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`text-sm py-2 rounded border ${mode === k
                ? 'bg-[var(--accent)] text-white border-[var(--accent-border)] text-white'
                : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            {drillMisses ? 'Drilling missed questions' : 'Scope'}
          </div>
          {!drillMisses && (
            <div className="flex gap-2 text-xs">
              <button onClick={selectAll} className="text-[var(--accent-text)] hover:underline">All</button>
              <span className="text-[var(--text-fainter)]">·</span>
              <button onClick={selectNone} className="text-[var(--text-muted)] hover:underline">None</button>
            </div>
          )}
        </div>

        {drillMisses ? (
          <div className="text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3">
            Pool draws only from your {wrongCount} previously-missed question{wrongCount === 1 ? '' : 's'}.
          </div>
        ) : (
          <div className="border border-[var(--border-soft)] rounded-lg divide-y divide-[var(--border-soft)] max-h-72 overflow-y-auto">
            {Object.entries(grouped).map(([subject, items]) => (
              <div key={subject}>
                <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[var(--bg-hover-soft)]">
                  <input
                    type="checkbox"
                    checked={isSubjectFully(subject)}
                    ref={(el) => { if (el) el.indeterminate = isSubjectPartial(subject); }}
                    onChange={() => toggleSubject(subject)}
                    className="w-4 h-4 accent-[var(--accent)]"
                  />
                  <span className="font-medium text-[var(--text-strong)] flex-1">{subject}</span>
                  <span className="text-xs text-[var(--text-faint)]">{items.length}</span>
                </label>
                <div className="pl-7 pb-1">
                  {items.map((f) => (
                    <label key={f.file_id} className="flex items-center gap-3 px-3 py-1.5 cursor-pointer hover:bg-[var(--bg-hover-soft)] rounded">
                      <input
                        type="checkbox"
                        checked={selected.has(f.file_id)}
                        onChange={() => toggleChapter(f.file_id)}
                        className="w-4 h-4 accent-[var(--accent)]"
                      />
                      <span className="text-sm text-[var(--text)] flex-1">{f.chapter}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 mt-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={drillMisses}
            disabled={wrongCount === 0}
            onChange={(e) => setDrillMisses(e.target.checked)}
            className="w-4 h-4 accent-[var(--accent)]"
          />
          <span className={wrongCount === 0 ? 'text-[var(--text-faint)]' : 'text-[var(--text)]'}>
            Drill my misses ({wrongCount} question{wrongCount === 1 ? '' : 's'})
          </span>
        </label>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Count</div>
        <div className="flex gap-2 flex-wrap">
          {[5, 10, 20, 50].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`text-sm px-3 py-1.5 rounded border ${count === n
                ? 'bg-[var(--accent)] text-white border-[var(--accent-border)] text-white'
                : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]'}`}
            >
              {n}
            </button>
          ))}
          <span className="ml-auto text-xs text-[var(--text-faint)] self-center">
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
        className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-3 sm:py-2.5 font-medium"
      >
        Start {Math.min(count, pool.length)}-question quiz
      </button>
    </div>
  );
}

// ---------- quiz: MC ----------
function MCQuestion({ item, onAnswer, nextSlot }) {
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
          let cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
          if (picked) {
            if (isCorrect) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (isPicked) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else cls = 'border-[var(--border-soft)] opacity-60';
          }
          return (
            <button
              key={i}
              onClick={() => submit(entry)}
              disabled={picked !== null}
              className={`w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors ${cls}`}
            >
              <span className="text-[var(--text-faint)] mr-2">{String.fromCharCode(65 + i)}.</span>
              {entry.text}
            </button>
          );
        })}
      </div>
      {picked && (
        <>
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className={picked.origIdx === item.q.correct_index ? 'text-[var(--success-text)] font-medium' : 'text-[var(--danger-text)] font-medium'}>
              {picked.origIdx === item.q.correct_index ? 'Correct' : 'Incorrect'}
            </div>
            {nextSlot}
          </div>
          <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-sm text-[var(--text)]">
            {item.q.explanation}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- quiz: short answer ----------
function ShortAnswerQuestion({ item, onAnswer, nextSlot }) {
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
        className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm disabled:opacity-70"
      />
      {!revealed ? (
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg px-4 py-2 text-sm font-medium"
        >
          Reveal answer
        </button>
      ) : (
        <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-4 space-y-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--success-text)] mb-1">Ideal answer</div>
            <div className="text-sm text-[var(--text-strong)]">{item.q.ideal_answer}</div>
          </div>
          {item.q.key_points?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--accent-text)] mb-1">Key points</div>
              <ul className="text-sm text-[var(--text)] list-disc pl-5 space-y-0.5">
                {item.q.key_points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {!graded ? (
            <div className="flex gap-2 pt-2 border-t border-[var(--border-soft)]">
              <span className="text-xs text-[var(--text-muted)] self-center mr-2">How did you do?</span>
              <button onClick={() => grade(false)} className="text-sm px-3 py-1.5 border border-[var(--danger-border)] text-[var(--danger-text)] hover:bg-[var(--danger-bg)] rounded">
                Missed it
              </button>
              <button onClick={() => grade(true)} className="text-sm px-3 py-1.5 border border-[var(--success-border)] text-[var(--success-text)] hover:bg-[var(--success-bg)] rounded">
                Got it
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-soft)]">
              <div className="text-xs text-[var(--text-faint)]">Graded.</div>
              {nextSlot}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- quiz: matching ----------
// ---------- quiz: two-part ----------
function TwoPartQuestion({ item, onAnswer, nextSlot }) {
  const parts = item.q.parts || [];
  const [partIdx, setPartIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  if (parts.length === 0) {
    return <div className="text-sm text-[var(--text-muted)]">Malformed two-part question.</div>;
  }

  const handlePartAnswer = (res) => {
    const nextResults = [...results, res];
    setResults(nextResults);
    if (partIdx + 1 < parts.length) {
      onAnswer({ ...res, isInterim: true });
      setPartIdx((i) => i + 1);
    } else {
      const allCorrect = nextResults.every((r) => r.correct);
      setDone(true);
      onAnswer({
        correct: allCorrect,
        user_answer: nextResults.map((r, i) => `P${i + 1}: ${r.user_answer}`).join(' | '),
      });
    }
  };

  const current = parts[partIdx];

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wide text-[var(--accent-text)]">
          Two-part · {item.q.theme}
        </span>
        <span className="text-xs text-[var(--text-faint)]">Part {partIdx + 1} of {parts.length}</span>
      </div>
      <SinglePart
        key={partIdx}
        part={current}
        onAnswer={handlePartAnswer}
        nextSlot={done && partIdx === parts.length - 1 ? nextSlot : null}
        continueLabel={partIdx === parts.length - 1 ? null : 'Continue →'}
      />
    </div>
  );
}

function SinglePart({ part, onAnswer, nextSlot, continueLabel }) {
  const [picked, setPicked] = useState(null);
  const [advanced, setAdvanced] = useState(false);
  const shuffled = useMemo(() => {
    const arr = (part.choices || []).map((text, origIdx) => ({ text, origIdx }));
    return shuffle(arr);
  }, [part]);

  const submit = (entry) => {
    if (picked !== null) return;
    setPicked(entry);
  };

  const onContinue = () => {
    if (picked === null || advanced) return;
    setAdvanced(true);
    const correct = picked.origIdx === part.correct_index;
    onAnswer({ correct, user_answer: picked.text });
  };

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed">{part.question}</p>
      <div className="space-y-2">
        {shuffled.map((entry, i) => {
          const isPicked = picked && entry.origIdx === picked.origIdx;
          const isCorrect = entry.origIdx === part.correct_index;
          let cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
          if (picked) {
            if (isCorrect) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (isPicked) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else cls = 'border-[var(--border-soft)] opacity-60';
          }
          return (
            <button
              key={i}
              onClick={() => submit(entry)}
              disabled={picked !== null}
              className={`w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors ${cls}`}
            >
              <span className="text-[var(--text-faint)] mr-2">{String.fromCharCode(65 + i)}.</span>
              {entry.text}
            </button>
          );
        })}
      </div>
      {picked && (
        <>
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className={picked.origIdx === part.correct_index ? 'text-[var(--success-text)] font-medium' : 'text-[var(--danger-text)] font-medium'}>
              {picked.origIdx === part.correct_index ? 'Correct' : 'Incorrect'}
            </div>
            {!advanced && (
              <button
                onClick={onContinue}
                className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded px-4 py-2 text-sm font-medium"
              >
                {continueLabel || 'Continue →'}
              </button>
            )}
            {advanced && nextSlot}
          </div>
          <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-sm text-[var(--text)]">
            {part.explanation}
          </div>
        </>
      )}
    </div>
  );
}

function MatchingQuestion({ item, onAnswer, nextSlot }) {
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
      <div className="text-sm text-[var(--text-muted)]">Match each term to its definition.</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-[var(--text-faint)]">Terms</div>
          {termOrder.map((i) => {
            const paired = pairings[i] !== undefined;
            const correct = submitted && paired && pairings[i] === i;
            const wrong = submitted && paired && pairings[i] !== i;
            let cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
            if (selectedTerm === i) cls = 'border-[var(--accent-border)] bg-[var(--accent-soft)]';
            else if (correct) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (wrong) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else if (paired) cls = 'border-[var(--border-strong)] bg-[var(--bg-hover-soft)]';
            return (
              <button
                key={i}
                onClick={() => onTermClick(i)}
                disabled={submitted}
                className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors ${cls}`}
              >
                <span className="text-[var(--text-faint)] mr-2">{i + 1}.</span>
                <span className="font-medium">{pairs[i].term}</span>
                {paired && (
                  <span className="text-xs text-[var(--text-muted)] ml-2">
                    → {String.fromCharCode(65 + defOrder.indexOf(pairings[i]))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-[var(--text-faint)]">Definitions</div>
          {defOrder.map((j, displayIdx) => {
            const used = usedDefs.has(j);
            const termIdx = Object.entries(pairings).find(([, v]) => v === j)?.[0];
            const correct = submitted && termIdx !== undefined && Number(termIdx) === j;
            const wrong = submitted && termIdx !== undefined && Number(termIdx) !== j;
            let cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
            if (correct) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (wrong) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else if (used) cls = 'border-[var(--border-strong)] bg-[var(--bg-hover-soft)]';
            return (
              <button
                key={j}
                onClick={() => onDefClick(j)}
                disabled={submitted || (selectedTerm === null && !used)}
                className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-60 ${cls}`}
              >
                <span className="text-[var(--text-faint)] mr-2">{String.fromCharCode(65 + displayIdx)}.</span>
                {pairs[j].definition}
              </button>
            );
          })}
        </div>
      </div>
      {!submitted ? (
        <button
          onClick={submit}
          disabled={!allPaired}
          className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
        >
          {allPaired ? 'Submit' : `Pair all ${pairs.length} terms to submit`}
        </button>
      ) : (
        <div className="flex justify-end">{nextSlot}</div>
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

  const handleAnswer = ({ correct, user_answer, isInterim }) => {
    if (isInterim) return; // two-part items emit interim results between parts; only score the final
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
        <div className="text-xs text-[var(--text-muted)]">
          <span className="text-[var(--text-strong)]">{item.chapter}</span>
          <span className="ml-2">· Question {index + 1} of {items.length}</span>
        </div>
        <button
          onClick={() => onExit(results)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--danger-text)] border border-[var(--border)] rounded px-2 py-1"
        >
          End quiz
        </button>
      </div>

      <div className="h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent-hover)] transition-all"
          style={{ width: `${((index + (answered ? 1 : 0)) / items.length) * 100}%` }}
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        {(() => {
          const nextBtn = answered ? (
            <button
              onClick={isLast ? () => onExit([...results]) : next}
              className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded px-4 py-2 text-sm font-medium shrink-0"
            >
              {isLast ? 'See results' : 'Next →'}
            </button>
          ) : null;
          const props = { key: item.id, item, onAnswer: handleAnswer, nextSlot: nextBtn };
          if (item.mode === 'mc') return <MCQuestion {...props} />;
          if (item.mode === 'two_part') return <TwoPartQuestion {...props} />;
          if (item.mode === 'short') return <ShortAnswerQuestion {...props} />;
          if (item.mode === 'match') return <MatchingQuestion {...props} />;
          return null;
        })()}
      </div>
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
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 text-center">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Quiz complete</div>
        <div className="text-5xl font-bold mt-2">{pct}%</div>
        <div className="text-sm text-[var(--text-muted)] mt-1">{correct} of {total} correct</div>
      </div>

      {misses.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Missed questions</h3>
          <ul className="space-y-2 text-sm">
            {misses.map((m, i) => (
              <li key={i} className="text-[var(--text)]">
                <span className="text-[var(--text-faint)] mr-2">{i + 1}.</span>
                {m.item.mode === 'mc' && m.item.q.question}
                {m.item.mode === 'two_part' && <span><span className="text-[var(--accent-text)]">Two-part:</span> {m.item.q.theme}</span>}
                {m.item.mode === 'short' && m.item.q.prompt}
                {m.item.mode === 'match' && <span className="text-[var(--text-muted)]">Matching set · {m.user_answer}</span>}
                <div className="text-xs text-[var(--text-faint)] mt-0.5 ml-6">{m.item.chapter}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm"
        >
          New quiz
        </button>
        {misses.length > 0 && (
          <button
            onClick={onDrillMisses}
            className="flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg py-2 text-sm font-medium"
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

// ---------- github sync panel ----------
function relativeTime(ts) {
  if (!ts) return 'never';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function SyncPanel() {
  const { github, setGithub, pushBank, pushStatus, files, extractions, questions } = useApp();
  const [showToken, setShowToken] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fullyProcessed = files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short).length;
  const canPush = !!github.token && !!github.repo && !!github.path && fullyProcessed > 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[var(--text-strong)]">GitHub sync</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Push your question bank to <span className="font-mono">{github.repo || '(no repo)'}/{github.path}</span> so your phone can load it.
          </p>
        </div>
        <button
          onClick={() => setExpanded((x) => !x)}
          className="text-xs px-2 py-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded"
        >
          {expanded ? 'Hide' : 'Configure'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs">
              <span className="block uppercase tracking-wide text-[var(--text-faint)] mb-1">Repo (owner/name)</span>
              <input
                value={github.repo}
                onChange={(e) => setGithub({ repo: e.target.value })}
                placeholder="user/repo"
                className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
              />
            </label>
            <label className="text-xs">
              <span className="block uppercase tracking-wide text-[var(--text-faint)] mb-1">Branch</span>
              <input
                value={github.branch}
                onChange={(e) => setGithub({ branch: e.target.value })}
                placeholder="main"
                className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
              />
            </label>
          </div>
          <label className="text-xs block">
            <span className="block uppercase tracking-wide text-[var(--text-faint)] mb-1">File path</span>
            <input
              value={github.path}
              onChange={(e) => setGithub({ path: e.target.value })}
              placeholder="data.json"
              className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
            />
          </label>
          <label className="text-xs block">
            <span className="block uppercase tracking-wide text-[var(--text-faint)] mb-1">
              Fine-grained PAT (Contents: Read and write)
            </span>
            <div className="flex gap-2">
              <input
                type={showToken ? 'text' : 'password'}
                value={github.token}
                onChange={(e) => setGithub({ token: e.target.value })}
                placeholder="github_pat_..."
                className="flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowToken((s) => !s)}
                className="text-xs px-2 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded"
              >
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-faint)] mt-1">
              Create at{' '}
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank" rel="noopener"
                className="text-[var(--accent-text)] underline"
              >
                github.com/settings/personal-access-tokens
              </a>
              . Stored only in this browser.
            </p>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={github.autoPush}
              onChange={(e) => setGithub({ autoPush: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            <span className="text-[var(--text)]">
              Auto-push after each chapter finishes processing
            </span>
          </label>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={pushBank}
          disabled={!canPush || pushStatus.state === 'pushing'}
          className="text-sm px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
        >
          {pushStatus.state === 'pushing' ? 'Pushing…' : 'Push now'}
        </button>
        <span className="text-xs text-[var(--text-muted)]">
          {pushStatus.state === 'error' ? (
            <span className="text-[var(--danger-text)]" title={pushStatus.error}>
              Error: {pushStatus.error?.slice(0, 80)}
            </span>
          ) : pushStatus.lastAt ? (
            <>Last push: <span className="text-[var(--text-strong)]">{relativeTime(pushStatus.lastAt)}</span></>
          ) : github.autoPush ? (
            'Auto-push armed. Will fire on next chapter processed.'
          ) : (
            !github.token ? 'Not configured.' : 'Ready.'
          )}
        </span>
      </div>
    </div>
  );
}

// ---------- stats ----------
function StatBar({ correct, total, label }) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm mb-1">
        <span className="text-[var(--text)]">{label}</span>
        <span className="text-[var(--text-muted)] text-xs">
          {correct}/{total} <span className="text-[var(--text-strong)] font-medium ml-1">{pct}%</span>
        </span>
      </div>
      <div className="h-2 bg-[var(--bg-elev)] rounded-full overflow-hidden">
        <div
          className="h-full transition-all rounded-full"
          style={{
            width: `${pct}%`,
            background: pct >= 80
              ? 'var(--success-border)'
              : pct >= 50
              ? 'var(--accent)'
              : 'var(--danger-border)',
          }}
        />
      </div>
    </div>
  );
}

function StatsView() {
  const { attempts, files, questions, clearAttempts } = useApp();

  const stats = useMemo(() => {
    const overall = { correct: 0, total: 0 };
    const byMode = {};
    const byChapter = {};
    const bySubject = {};
    const missByQid = {};
    const seenByQid = {};

    for (const a of attempts) {
      overall.total++;
      if (a.correct) overall.correct++;

      const m = byMode[a.mode] ||= { correct: 0, total: 0 };
      m.total++; if (a.correct) m.correct++;

      const fkey = a.file_id;
      const c = byChapter[fkey] ||= { correct: 0, total: 0, chapter: a.chapter, subject: a.subject };
      c.total++; if (a.correct) c.correct++;

      const s = bySubject[a.subject] ||= { correct: 0, total: 0 };
      s.total++; if (a.correct) s.correct++;

      seenByQid[a.question_id] = (seenByQid[a.question_id] || 0) + 1;
      if (!a.correct) missByQid[a.question_id] = (missByQid[a.question_id] || 0) + 1;
    }

    // Build a question lookup so missed questions can show their text.
    const qLookup = {};
    for (const fid of Object.keys(questions)) {
      const qb = questions[fid] || {};
      for (const q of (qb.mc || [])) qLookup[q.id] = { ...q, mode: 'mc', file_id: fid };
      for (const q of (qb.short || [])) qLookup[q.id] = { ...q, mode: 'short', file_id: fid };
    }
    const fileLookup = {};
    for (const f of files) fileLookup[f.file_id] = f;

    const topMisses = Object.entries(missByQid)
      .map(([qid, misses]) => {
        const q = qLookup[qid];
        const text = q ? (q.mode === 'mc' ? q.question : q.prompt) : qid;
        const chapter = q && fileLookup[q.file_id] ? fileLookup[q.file_id].chapter : '—';
        const seen = seenByQid[qid] || misses;
        return { qid, misses, seen, text, chapter, mode: q?.mode || 'matching' };
      })
      .sort((a, b) => b.misses - a.misses)
      .slice(0, 10);

    return { overall, byMode, byChapter, bySubject, topMisses };
  }, [attempts, files, questions]);

  if (attempts.length === 0) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No quiz attempts yet. Run a quiz from the Study tab to see your stats.
      </div>
    );
  }

  const modeLabels = { mc: 'Multiple choice', short: 'Short answer', match: 'Matching' };
  const overallPct = stats.overall.total
    ? Math.round((stats.overall.correct / stats.overall.total) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* Big number */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 text-center">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Overall accuracy</div>
        <div className="text-5xl font-bold mt-2 text-[var(--text-strong)]">{overallPct}%</div>
        <div className="text-sm text-[var(--text-muted)] mt-1">
          {stats.overall.correct} of {stats.overall.total} attempts correct
        </div>
      </div>

      {/* By mode */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By mode</h3>
        <div className="space-y-3">
          {Object.entries(stats.byMode).map(([mode, s]) => (
            <StatBar key={mode} label={modeLabels[mode] || mode} correct={s.correct} total={s.total} />
          ))}
        </div>
      </div>

      {/* By subject */}
      {Object.keys(stats.bySubject).length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By subject</h3>
          <div className="space-y-3">
            {Object.entries(stats.bySubject).map(([subject, s]) => (
              <StatBar key={subject} label={subject} correct={s.correct} total={s.total} />
            ))}
          </div>
        </div>
      )}

      {/* By chapter */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By chapter</h3>
        <div className="space-y-3">
          {Object.entries(stats.byChapter)
            .sort(([, a], [, b]) => (a.correct / a.total) - (b.correct / b.total))
            .map(([fid, s]) => (
              <StatBar key={fid} label={`${s.subject} — ${s.chapter}`} correct={s.correct} total={s.total} />
            ))}
        </div>
      </div>

      {/* Top misses */}
      {stats.topMisses.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">Most-missed questions</h3>
          <ul className="space-y-2 text-sm">
            {stats.topMisses.map((m, i) => (
              <li key={m.qid} className="flex gap-3">
                <span className="text-[var(--text-faint)] w-5 text-right shrink-0">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--text)] truncate" title={m.text}>{m.text}</div>
                  <div className="text-xs text-[var(--text-faint)] mt-0.5">
                    {m.chapter} · {modeLabels[m.mode] || m.mode}
                  </div>
                </div>
                <span className="text-xs text-[var(--danger-text)] whitespace-nowrap self-start">
                  {m.misses}/{m.seen} missed
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => { if (confirm('Clear all quiz attempts? This cannot be undone.')) clearAttempts(); }}
          className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--danger-text)] hover:border-[var(--danger-border)] rounded"
        >
          Clear all attempts
        </button>
      </div>
    </div>
  );
}

// ---------- theme switcher ----------
function ThemeSwitcher() {
  const { theme, setTheme } = useApp();
  return (
    <div className="flex items-center gap-0.5 border border-[var(--border)] rounded-full p-0.5">
      {THEMES.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          title={`${t.charAt(0).toUpperCase()}${t.slice(1)} theme`}
          className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
            theme === t
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'
          }`}
        >
          {t === 'dark' ? '🌙' : t === 'light' ? '☀️' : '🍂'}
        </button>
      ))}
    </div>
  );
}

// ---------- settings ----------
function SettingsPanel({ onClose }) {
  const { theme, setTheme, apiKey, setApiKey, client, session, pendingSync, syncBusy, syncError, flushSync } = useApp();
  const [keyVal, setKeyVal] = useState(apiKey || '');
  const [keyShow, setKeyShow] = useState(false);
  const [keyErr, setKeyErr] = useState('');
  const [keyBusy, setKeyBusy] = useState(false);

  const saveKey = async () => {
    const trimmed = keyVal.trim();
    if (!trimmed) { setApiKey(''); return; }
    if (!trimmed.startsWith('AIza')) {
      setKeyErr('Google AI keys start with AIza.');
      return;
    }
    setKeyBusy(true); setKeyErr('');
    storage.set(KEYS.apiKey, trimmed);
    try {
      await client.ping();
      setApiKey(trimmed);
    } catch (e) {
      storage.remove(KEYS.apiKey);
      setKeyErr(`Key rejected: ${e.message}`);
    } finally {
      setKeyBusy(false);
    }
  };

  const themeOpts = [
    ['dark', '🌙', 'Dark'],
    ['light', '☀️', 'Light'],
    ['warm', '🍂', 'Warm'],
  ];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 max-w-md mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-strong)]">Settings</h2>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-strong)] text-2xl leading-none">×</button>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Appearance</div>
        <div className="grid grid-cols-3 gap-2">
          {themeOpts.map(([k, emoji, label]) => (
            <button
              key={k}
              onClick={() => setTheme(k)}
              className={`flex flex-col items-center gap-1 py-3 rounded border ${theme === k
                ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]'
                : 'border-[var(--border)] hover:bg-[var(--bg-hover)]'}`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-[var(--text)]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {session && (
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Sync</div>
          <div className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5">
            <div className="text-sm min-w-0 flex-1">
              {syncBusy ? (
                <span className="text-[var(--accent-text)]">Syncing…</span>
              ) : syncError ? (
                <span className="text-[var(--danger-text)] truncate" title={syncError}>{syncError}</span>
              ) : pendingSync.length > 0 ? (
                <span className="text-[var(--warning-text-strong)]">{pendingSync.length} attempt{pendingSync.length === 1 ? '' : 's'} pending</span>
              ) : (
                <span className="text-[var(--text-muted)]">All synced</span>
              )}
            </div>
            <button
              onClick={flushSync}
              disabled={syncBusy}
              className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
            >
              Force sync
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">App</div>
        <div className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5">
          <div className="text-sm text-[var(--text-muted)]">Fetch the latest version of the app</div>
          <button
            onClick={forceUpdateApp}
            className="shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded font-medium"
          >
            Force update
          </button>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Gemini API key</div>
        <div className="flex gap-2">
          <input
            type={keyShow ? 'text' : 'password'}
            value={keyVal}
            onChange={(e) => { setKeyVal(e.target.value); setKeyErr(''); }}
            placeholder={apiKey ? `current: …${apiKey.slice(-6)}` : 'AIza...'}
            className="flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]"
          />
          <button onClick={() => setKeyShow((s) => !s)} className="px-3 text-xs border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]">
            {keyShow ? 'Hide' : 'Show'}
          </button>
        </div>
        {keyErr && <p className="text-[var(--danger-text)] text-xs mt-2">{keyErr}</p>}
        <div className="flex gap-2 mt-2">
          <button
            onClick={saveKey}
            disabled={keyBusy || keyVal === apiKey}
            className="flex-1 text-xs px-3 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
          >
            {keyBusy ? 'Verifying…' : keyVal ? 'Save key' : 'No key set'}
          </button>
          {apiKey && (
            <button
              onClick={() => { if (confirm('Forget the saved API key?')) { setApiKey(''); setKeyVal(''); } }}
              className="text-xs px-3 py-2 border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] rounded"
            >
              Forget
            </button>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-faint)] mt-2">
          Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="text-[var(--accent-text)] underline">aistudio.google.com/apikey</a>. Stored only in this browser.
        </p>
      </div>
    </div>
  );
}

// ---------- bulk publish to chapter bank ----------
function PublishAllPanel() {
  const { api, session, files, extractions, questions, setFiles } = useApp();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const publishable = files.filter((f) => extractions[f.file_id]);
  if (publishable.length === 0) return null;

  const allLinked = publishable.every((f) => f.chapter_id);

  const publishAll = async () => {
    if (busy) return;
    setBusy(true);
    setStatus({ kind: 'info', msg: `Publishing ${publishable.length} chapter${publishable.length === 1 ? '' : 's'}…` });
    let okCount = 0;
    let errCount = 0;
    const lastErr = { msg: '' };
    for (const f of publishable) {
      try {
        let chapterId = f.chapter_id;
        if (!chapterId) {
          const created = await api.createChapter({
            subject: f.subject,
            title: f.chapter,
            filename: f.filename,
            size_bytes: f.size_bytes,
          });
          chapterId = created.id;
          // eslint-disable-next-line no-loop-func
          setFiles((prev) => prev.map((x) => x.file_id === f.file_id ? { ...x, chapter_id: chapterId } : x));
        }
        const ext = extractions[f.file_id];
        const qb = questions[f.file_id] || {};
        const pushes = [];
        if (ext) pushes.push(['extraction', ext]);
        if (qb.mc?.length) pushes.push(['mc', qb.mc]);
        if (qb.twoPart?.length) pushes.push(['two_part', qb.twoPart]);
        if (qb.short?.length) pushes.push(['short', qb.short]);
        for (const [stage, payload] of pushes) {
          // eslint-disable-next-line no-await-in-loop
          await api.putChapterStage(chapterId, stage, payload);
        }
        okCount++;
      } catch (e) {
        errCount++;
        lastErr.msg = e.message;
      }
    }
    setBusy(false);
    if (errCount === 0) {
      setStatus({ kind: 'ok', msg: `Published ${okCount} chapter${okCount === 1 ? '' : 's'} to the Bank.` });
    } else {
      setStatus({ kind: 'err', msg: `${okCount} ok, ${errCount} failed. Last error: ${lastErr.msg}` });
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-[var(--text-strong)]">Publish to Bank</h3>
        <span className="text-xs text-[var(--text-faint)]">
          {publishable.length} chapter{publishable.length === 1 ? '' : 's'} ready
        </span>
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        {allLinked
          ? <>All your local chapters are already published. Click below to push any newer stages.</>
          : <>Each local chapter becomes its own row in the shared Bank, with stage badges showing what's done. Friends signed in to the same Bank can quiz from or contribute to them.</>}
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={publishAll}
          disabled={busy}
          className="flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
        >
          {busy ? 'Publishing…' : allLinked ? 'Update all in Bank' : `Publish all ${publishable.length} to Bank`}
        </button>
      </div>
      {status && (
        <p className={`text-xs ${
          status.kind === 'ok' ? 'text-[var(--success-text)]' :
          status.kind === 'err' ? 'text-[var(--danger-text)]' :
          'text-[var(--text-muted)]'
        }`}>
          {status.kind === 'ok' ? '✓ ' : ''}{status.msg}
        </p>
      )}
    </div>
  );
}

// ---------- shell ----------
function CloudBankPanel() {
  const { session, api, files, extractions, questions, setFiles, setExtraction, setQuestionsFor } = useApp();
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [remote, setRemote] = useState(null); // { size_bytes, updated_at } | null
  const [busy, setBusy] = useState(false);

  // On mount / login: probe whether the user has a published bank already.
  useEffect(() => {
    if (!session) { setRemote(null); return; }
    let cancelled = false;
    api.bankMeta(session.username)
      .then((m) => { if (!cancelled) setRemote(m); })
      .catch(() => { if (!cancelled) setRemote(null); });
    return () => { cancelled = true; };
  }, [api, session?.username]);

  if (!session) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl px-4 py-3 text-sm text-[var(--text-muted)]">
        Sign in to publish your question bank to the cloud — then any device (including your phone) can pull it down.
      </div>
    );
  }

  const hasLocal = files.length > 0 && files.some((f) => extractions[f.file_id] && questions[f.file_id]?.mc);

  const publish = async () => {
    setBusy(true);
    setStatus({ state: 'pushing', message: 'Uploading…' });
    try {
      const bank = JSON.stringify({
        version: 1,
        exported_at: new Date().toISOString(),
        model: MODEL,
        files,
        extractions,
        questions,
      });
      const res = await api.putBank(bank);
      setRemote({ size_bytes: res.size_bytes, updated_at: res.updated_at, username: session.username });
      setStatus({ state: 'ok', message: `Published ${(res.size_bytes / 1024).toFixed(1)} KB` });
    } catch (e) {
      setStatus({ state: 'err', message: e.message });
    } finally {
      setBusy(false);
    }
  };

  const pull = async () => {
    if (!confirm('Replace your local question bank with the cloud copy?')) return;
    setBusy(true);
    setStatus({ state: 'pulling', message: 'Downloading…' });
    try {
      const bank = await api.getMyBank();
      setFiles(bank.files || []);
      // setExtraction / setQuestionsFor write per-key; bulk-replace via direct storage.
      storage.set(KEYS.extractions, bank.extractions || {});
      storage.set(KEYS.questions, bank.questions || {});
      // Force a state refresh by setting each one (cheap).
      for (const fid of Object.keys(bank.extractions || {})) setExtraction(fid, bank.extractions[fid]);
      for (const fid of Object.keys(bank.questions || {})) setQuestionsFor(fid, bank.questions[fid]);
      const n = (bank.files || []).length;
      setStatus({ state: 'ok', message: `Pulled ${n} chapter${n === 1 ? '' : 's'}` });
    } catch (e) {
      setStatus({ state: 'err', message: e.message });
    } finally {
      setBusy(false);
    }
  };

  const remoteAge = remote
    ? (() => {
        const ago = Date.now() - remote.updated_at;
        const min = Math.round(ago / 60000);
        if (min < 1) return 'just now';
        if (min < 60) return `${min} min ago`;
        const hr = Math.round(min / 60);
        if (hr < 24) return `${hr} hr ago`;
        return `${Math.round(hr / 24)} d ago`;
      })()
    : null;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-[var(--text-strong)]">Cloud bank</h3>
        {remote && (
          <span className="text-xs text-[var(--text-faint)]">
            {(remote.size_bytes / 1024).toFixed(1)} KB · {remoteAge}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        {remote
          ? <>Your bank is published. Other devices signed in as <span className="font-mono">@{session.username}</span> can pull it down.</>
          : <>Publish your processed chapters to the cloud so your phone (or any other device) can quiz from them without re-processing.</>
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={publish}
          disabled={busy || !hasLocal}
          className="flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
        >
          {busy && status.state === 'pushing' ? 'Uploading…' : remote ? 'Update cloud bank' : 'Publish to cloud'}
        </button>
        {remote && (
          <button
            onClick={pull}
            disabled={busy}
            className="flex-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
          >
            {busy && status.state === 'pulling' ? 'Downloading…' : 'Pull cloud bank to this device'}
          </button>
        )}
      </div>
      {status.state === 'ok' && (
        <p className="text-xs text-[var(--success-text)]">✓ {status.message}</p>
      )}
      {status.state === 'err' && (
        <p className="text-xs text-[var(--danger-text)]">{status.message}</p>
      )}
      {!hasLocal && (
        <p className="text-xs text-[var(--text-faint)]">No locally processed chapters — process some in the Library, or pull from cloud if you have one.</p>
      )}
    </div>
  );
}

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

// ---------- account ----------
function AccountPanel({ onClose }) {
  const { session, setSession, api } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (session) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--text-muted)]">Signed in as</div>
            <div className="text-xl font-semibold">@{session.username}</div>
          </div>
          <button
            onClick={async () => {
              try { await api.logout(); } catch {}
              setSession(null);
            }}
            className="text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  const submit = async () => {
    setErr('');
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setErr('Username must be 3-20 chars (letters, digits, underscore).');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setErr('PIN must be exactly 4 digits.');
      return;
    }
    setBusy(true);
    try {
      const res = mode === 'signup'
        ? await api.signup({ username, pin })
        : await api.login({ username, pin });
      setSession({ token: res.token, username: res.username });
      setPin('');
      onClose?.();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 max-w-sm mx-auto">
      <div className="flex gap-1 mb-4">
        {[['login', 'Log in'], ['signup', 'Sign up']].map(([k, label]) => (
          <button
            key={k}
            onClick={() => { setMode(k); setErr(''); }}
            className={`text-sm px-3 py-1.5 rounded flex-1 ${mode === k
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text-strong)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1">Username</label>
      <input
        value={username}
        onChange={(e) => { setUsername(e.target.value.toLowerCase()); setErr(''); }}
        placeholder="3-20 chars, a-z 0-9 _"
        autoComplete="username"
        className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]"
      />

      <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mt-3 mb-1">4-digit PIN</label>
      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setErr(''); }}
        onKeyDown={(e) => e.key === 'Enter' && !busy && submit()}
        placeholder="••••"
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg font-mono tracking-widest text-center focus:outline-none focus:border-[var(--accent-border)]"
      />

      {err && <p className="text-[var(--danger-text)] text-xs mt-2">{err}</p>}

      <button
        onClick={submit}
        disabled={busy || !username || !pin}
        className="mt-4 w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
      >
        {busy ? 'Working…' : mode === 'signup' ? 'Create account' : 'Log in'}
      </button>

      <p className="text-[11px] text-[var(--text-faint)] mt-3 text-center">
        Stats sync across devices and show up on the leaderboard. PIN is hashed server-side. Don't reuse a sensitive PIN.
      </p>
    </div>
  );
}

// ---------- leaderboard + profiles ----------
function pct(c, t) { return t ? Math.round((c / t) * 100) : 0; }

function Leaderboard({ onPickUser }) {
  const { api } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.leaderboard()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api]);

  if (err) return <div className="text-sm text-[var(--danger-text)]">Could not load leaderboard: {err}</div>;
  if (!data) return <div className="text-sm text-[var(--text-muted)]">Loading…</div>;

  if (!data.users.length) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No one has recorded any attempts yet. Be the first.
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
      <h3 className="font-semibold mb-3 text-[var(--text-strong)]">Leaderboard — top 50 by attempts</h3>
      <ol className="divide-y divide-[var(--border-soft)]">
        {data.users.map((u, i) => (
          <li key={u.username} className="py-2 flex items-center gap-3">
            <span className="text-[var(--text-faint)] w-6 text-right">{i + 1}.</span>
            <button
              onClick={() => onPickUser?.(u.username)}
              className="flex-1 text-left text-[var(--text)] hover:text-[var(--accent-text)] font-medium truncate"
            >
              @{u.username}
            </button>
            <div className="text-xs text-[var(--text-muted)] tabular-nums">
              {u.correct}/{u.total}
              <span className="ml-2 text-[var(--text-strong)] font-medium">{pct(u.correct, u.total)}%</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ServerStatsPayload({ data }) {
  if (!data) return null;
  const overall = data.overall || { total: 0, correct: 0 };
  const weekly = data.weekly || { total: 0, correct: 0 };
  const overallPct = pct(overall.correct, overall.total);
  const weeklyPct = pct(weekly.correct, weekly.total);

  const modeLabels = { mc: 'Multiple choice', short: 'Short answer', match: 'Matching' };

  // Build last-7-days bar series from data.daily (sparse — fill missing days with zero).
  const today = Math.floor(Date.now() / 86400000);
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(today - i);
  const dailyByBucket = {};
  for (const d of (data.daily || [])) dailyByBucket[d.day_bucket] = d;
  const dailySeries = days.map((b) => {
    const r = dailyByBucket[b];
    return { day: b, total: r?.total || 0, correct: r?.correct || 0 };
  });
  const maxTotal = Math.max(1, ...dailySeries.map((d) => d.total));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 text-center">
          <div className="text-[10px] sm:text-xs uppercase tracking-wide text-[var(--text-muted)]">All-time</div>
          <div className="text-3xl sm:text-4xl font-bold mt-1.5 text-[var(--text-strong)]">{overallPct}%</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">{overall.correct} / {overall.total}</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 text-center">
          <div className="text-[10px] sm:text-xs uppercase tracking-wide text-[var(--text-muted)]">This week</div>
          <div className="text-3xl sm:text-4xl font-bold mt-1.5 text-[var(--text-strong)]">{weeklyPct}%</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">{weekly.correct} / {weekly.total}</div>
        </div>
      </div>

      {data.mostStudiedSubject && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 flex items-baseline justify-between">
          <span className="text-sm text-[var(--text-muted)]">Most-studied subject</span>
          <span className="text-base font-medium text-[var(--text-strong)]">{data.mostStudiedSubject}</span>
        </div>
      )}

      {/* Daily bar chart (last 7 days) */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <h3 className="font-semibold mb-3 text-[var(--text-strong)]">Last 7 days</h3>
        <div className="flex items-end gap-1.5 h-32">
          {dailySeries.map((d, i) => {
            const acc = pct(d.correct, d.total);
            const h = `${(d.total / maxTotal) * 100}%`;
            const ok = `${d.total ? (d.correct / maxTotal) * 100 : 0}%`;
            const dayLabel = new Date((d.day + 1) * 86400000 - 1).toLocaleDateString(undefined, { weekday: 'short' });
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center justify-end">
                <div className="w-full bg-[var(--bg-elev)] rounded-t flex flex-col justify-end" style={{ height: h }}>
                  <div className="bg-[var(--success-border)] rounded-t" style={{ height: ok }} title={`${d.correct}/${d.total} (${acc}%)`} />
                </div>
                <div className="text-[10px] text-[var(--text-faint)] mt-1">{dayLabel}</div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-[var(--text-faint)] mt-2">Full bar = total attempts that day. Filled portion = correct.</p>
      </div>

      {data.bySubject?.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By subject</h3>
          <div className="space-y-3">
            {data.bySubject.map((s) => (
              <StatBar key={s.subject} label={s.subject} correct={s.correct} total={s.total} />
            ))}
          </div>
        </div>
      )}

      {data.byChapter?.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By chapter (weakest first)</h3>
          <div className="space-y-3">
            {[...data.byChapter]
              .sort((a, b) => (a.correct / Math.max(1, a.total)) - (b.correct / Math.max(1, b.total)))
              .map((c) => (
                <StatBar key={`${c.subject}/${c.chapter}`} label={`${c.subject} — ${c.chapter}`} correct={c.correct} total={c.total} />
              ))}
          </div>
        </div>
      )}

      {data.byMode?.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By mode</h3>
          <div className="space-y-3">
            {data.byMode.map((m) => (
              <StatBar key={m.mode} label={modeLabels[m.mode] || m.mode} correct={m.correct} total={m.total} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- collaborative bank (chapters) ----------
function StageDot({ stage, label }) {
  const done = stage?.done;
  const partial = stage?.terms_missing > 0;
  const cls = done && !partial
    ? 'bg-[var(--success-bg-strong)] text-[var(--success-text)] border-[var(--success-border)]'
    : done && partial
    ? 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-text-strong)]'
    : 'bg-[var(--bg-elev)] text-[var(--text-faint)] border-[var(--border)]';
  let tooltip = `${label}: ${done ? 'done' : 'pending'}`;
  if (stage?.by) tooltip += ` · by @${stage.by}`;
  if (stage?.count != null) tooltip += ` · ${stage.count} items`;
  if (stage?.term_coverage) tooltip += ` · term coverage: ${stage.term_coverage}`;
  return (
    <span
      title={tooltip}
      className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${cls}`}
    >
      {label}{stage?.count != null ? ` ${stage.count}` : ''}
    </span>
  );
}

function ChapterRow({ chapter, onDownload, busy, downloaded }) {
  const ago = (() => {
    const ms = Date.now() - chapter.updated_at;
    const m = Math.round(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.round(h / 24)}d ago`;
  })();

  return (
    <li className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[var(--text)] font-medium truncate">{chapter.title}</span>
          {chapter.status === 'complete' && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--success-bg)] text-[var(--success-text)]">
              ✓ complete
            </span>
          )}
          {chapter.status === 'partial' && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--warning-bg)] text-[var(--warning-text)]">
              partial
            </span>
          )}
          {chapter.status === 'pending' && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--bg-elev)] text-[var(--text-faint)] border border-[var(--border)]">
              needs extraction
            </span>
          )}
        </div>
        <div className="text-xs text-[var(--text-faint)] mt-0.5">
          {chapter.filename} · {ago}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <StageDot stage={chapter.stages.extraction} label="extract" />
          <StageDot stage={chapter.stages.mc} label="mc" />
          <StageDot stage={chapter.stages.two_part} label="two-part" />
          <StageDot stage={chapter.stages.short} label="short" />
        </div>
      </div>
      <div className="flex sm:flex-col items-end gap-2 shrink-0">
        <button
          onClick={onDownload}
          disabled={busy || chapter.status === 'pending'}
          className="text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium whitespace-nowrap"
        >
          {busy ? 'Downloading…' : downloaded ? 'Re-download' : 'Download'}
        </button>
      </div>
    </li>
  );
}

function BankTab() {
  const { api, session, setFiles, setExtraction, setQuestionsFor, files } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);
  const [downloading, setDownloading] = useState(null); // chapter id
  const [status, setStatus] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.listChapters()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api, tick]);

  const downloadChapter = async (chapter) => {
    if (downloading) return;
    setDownloading(chapter.id);
    setStatus(null);
    try {
      const full = await api.getChapter(chapter.id);
      // Insert as a local file_record so the Library + StudyView see it.
      const localFileId = `chap_${full.id}`;
      const fileRecord = {
        file_id: localFileId,
        file_uri: 'cloud',
        mime_type: 'application/pdf',
        filename: full.filename,
        size_bytes: full.size_bytes || 0,
        subject: full.subject,
        chapter: full.title,
        uploaded_at: new Date(full.created_at).toISOString(),
        chapter_id: full.id,
      };
      setFiles((prev) => [...prev.filter((f) => f.file_id !== localFileId && f.chapter_id !== full.id), fileRecord]);
      if (full.extraction) setExtraction(localFileId, full.extraction);
      setQuestionsFor(localFileId, {
        mc: full.mc || [],
        twoPart: full.two_part || [],
        short: full.short || [],
        generated_at: new Date(full.updated_at).toISOString(),
      });
      setStatus({ kind: 'ok', msg: `Downloaded "${full.title}"` });
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    } finally {
      setDownloading(null);
    }
  };

  if (err) {
    return (
      <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-2xl px-4 py-3 text-sm text-[var(--danger-text)] flex items-center justify-between">
        <span>Could not load bank: {err}</span>
        <button onClick={() => setTick((t) => t + 1)} className="text-xs px-3 py-1 border border-[var(--danger-border)] rounded">Retry</button>
      </div>
    );
  }
  if (!data) return <div className="text-sm text-[var(--text-muted)]">Loading bank…</div>;

  // Group by uploader, then sort uploaders by their latest chapter.
  const byUploader = {};
  for (const ch of data.chapters) {
    if (!byUploader[ch.uploader_username]) byUploader[ch.uploader_username] = [];
    byUploader[ch.uploader_username].push(ch);
  }
  const localChapterIds = new Set(files.map((f) => f.chapter_id).filter(Boolean));
  const uploaders = Object.keys(byUploader).sort((a, b) => {
    const aMax = Math.max(...byUploader[a].map((c) => c.updated_at));
    const bMax = Math.max(...byUploader[b].map((c) => c.updated_at));
    return bMax - aMax;
  });

  const filterLc = filter.toLowerCase();
  const filtered = (chs) =>
    filterLc ? chs.filter((c) =>
      c.title.toLowerCase().includes(filterLc) ||
      c.subject.toLowerCase().includes(filterLc) ||
      c.filename.toLowerCase().includes(filterLc)
    ) : chs;

  return (
    <div className="space-y-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3">
        <div>
          <h2 className="font-semibold text-[var(--text-strong)]">Bank</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Every chapter anyone has published. Stage badges show what's been generated. Download any chapter into your local Library to quiz from it.
          </p>
        </div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by subject, chapter, filename…"
          className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-3 py-2 text-sm"
        />
        {status && (
          <div className={`text-sm ${status.kind === 'ok' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]'}`}>
            {status.kind === 'ok' ? '✓ ' : ''}{status.msg}
          </div>
        )}
      </div>

      {data.chapters.length === 0 && (
        <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
          No chapters published yet. Publish your local chapters from the Library tab.
        </div>
      )}

      {uploaders.map((uploader) => {
        const list = filtered(byUploader[uploader]);
        if (!list.length) return null;
        return (
          <div key={uploader} className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-semibold text-[var(--text-strong)]">@{uploader}</h3>
              <span className="text-xs text-[var(--text-faint)]">{list.length} chapter{list.length === 1 ? '' : 's'}</span>
            </div>
            <ul className="divide-y divide-[var(--border-soft)]">
              {list.map((ch) => (
                <ChapterRow
                  key={ch.id}
                  chapter={ch}
                  onDownload={() => downloadChapter(ch)}
                  busy={downloading === ch.id}
                  downloaded={localChapterIds.has(ch.id)}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function BanksBrowser() {
  const { api, session, setFiles, setExtraction, setQuestionsFor, files } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(null); // username currently downloading
  const [status, setStatus] = useState(null); // { username, msg, kind }

  useEffect(() => {
    let cancelled = false;
    setData(null); setErr('');
    api.listBanks()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api, tick]);

  const download = async (username) => {
    if (busy) return;
    const localCount = files.length;
    const msg = localCount > 0
      ? `Replace your local bank (${localCount} chapter${localCount === 1 ? '' : 's'}) with @${username}'s bank? Your local data will be lost.`
      : `Download @${username}'s bank to this device?`;
    if (!confirm(msg)) return;
    setBusy(username);
    setStatus(null);
    try {
      const bank = await api.getUserBank(username);
      setFiles(bank.files || []);
      storage.set(KEYS.extractions, bank.extractions || {});
      storage.set(KEYS.questions, bank.questions || {});
      for (const fid of Object.keys(bank.extractions || {})) setExtraction(fid, bank.extractions[fid]);
      for (const fid of Object.keys(bank.questions || {})) setQuestionsFor(fid, bank.questions[fid]);
      const n = (bank.files || []).length;
      setStatus({ username, msg: `Downloaded ${n} chapter${n === 1 ? '' : 's'} from @${username}`, kind: 'ok' });
    } catch (e) {
      setStatus({ username, msg: e.message, kind: 'err' });
    } finally {
      setBusy(null);
    }
  };

  if (err) {
    return (
      <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-2xl px-4 py-3 text-sm text-[var(--danger-text)] flex items-center justify-between">
        <span>Could not load banks: {err}</span>
        <button onClick={() => setTick((t) => t + 1)} className="text-xs px-3 py-1 border border-[var(--danger-border)] rounded">Retry</button>
      </div>
    );
  }
  if (!data) return <div className="text-sm text-[var(--text-muted)]">Loading banks…</div>;
  if (!data.banks.length) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No one has published a bank yet. Publish yours from the Library tab.
      </div>
    );
  }

  const ago = (ts) => {
    const d = Date.now() - ts;
    const m = Math.round(d / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} min ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} hr ago`;
    return `${Math.round(h / 24)} d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">
        <h2 className="font-semibold mb-1 text-[var(--text-strong)]">Published banks</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Download any user's question bank to study from their chapters. {' '}
          {session ? 'Replaces your local bank.' : 'Sign in to download.'}
        </p>
        <ul className="divide-y divide-[var(--border-soft)]">
          {data.banks.map((b) => (
            <li key={b.username} className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[var(--text)] font-medium">@{b.username}</div>
                <div className="text-xs text-[var(--text-faint)]">
                  {(b.size_bytes / 1024).toFixed(1)} KB · updated {ago(b.updated_at)}
                </div>
                {status?.username === b.username && (
                  <div className={`text-xs mt-1 ${status.kind === 'ok' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]'}`}>
                    {status.kind === 'ok' ? '✓ ' : ''}{status.msg}
                  </div>
                )}
              </div>
              <button
                onClick={() => download(b.username)}
                disabled={!session || busy != null}
                className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
              >
                {busy === b.username ? 'Downloading…' : session ? 'Download' : 'Sign in'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function UserProfile({ username, onBack }) {
  const { api } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    setData(null); setErr('');
    api.userProfile(username)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api, username]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded">
          ← Back
        </button>
        <h2 className="text-xl font-semibold">@{username}</h2>
      </div>
      {err && <div className="text-sm text-[var(--danger-text)]">{err}</div>}
      {!data && !err && <div className="text-sm text-[var(--text-muted)]">Loading…</div>}
      {data && <ServerStatsPayload data={data} />}
    </div>
  );
}

function SyncBar() {
  const { pendingSync, syncBusy, syncError, flushSync, session } = useApp();
  if (!session) return null;
  const count = pendingSync.length;
  return (
    <div className="flex items-center justify-between gap-3 bg-[var(--bg-card-soft)] border border-[var(--border-soft)] rounded-xl px-4 py-2.5 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        {syncBusy ? (
          <span className="text-[var(--accent-text)]">Syncing…</span>
        ) : syncError ? (
          <span className="text-[var(--danger-text)] truncate" title={syncError}>Sync error: {syncError}</span>
        ) : count > 0 ? (
          <span className="text-[var(--warning-text-strong)]">{count} attempt{count === 1 ? '' : 's'} not yet synced</span>
        ) : (
          <span className="text-[var(--text-muted)]">All attempts synced</span>
        )}
      </div>
      <button
        onClick={flushSync}
        disabled={syncBusy}
        className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
      >
        {syncBusy ? '...' : 'Sync now'}
      </button>
    </div>
  );
}

function ServerStatsView() {
  const { api, session, pendingSync, syncBusy } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    setErr('');
    api.meStats()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
    // refetch when sync queue drains or user manually re-triggers
  }, [api, session?.username, pendingSync.length, syncBusy, tick]);

  if (!session) return null;

  return (
    <div className="space-y-4">
      {err ? (
        <div className="flex items-center justify-between gap-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-xl px-4 py-2.5 text-sm">
          <span className="text-[var(--danger-text)]">Could not load stats: {err}</span>
          <button onClick={() => setTick((t) => t + 1)} className="text-xs px-3 py-1 border border-[var(--danger-border)] text-[var(--danger-text)] rounded hover:bg-[var(--danger-bg-strong)]">
            Retry
          </button>
        </div>
      ) : !data ? (
        <div className="text-sm text-[var(--text-muted)]">Loading server stats…</div>
      ) : (
        <ServerStatsPayload data={data} />
      )}
    </div>
  );
}

function Shell() {
  const { apiKey, setApiKey, attempts, readOnly, files, extractions, questions, session, setSession, pendingSync, syncBusy } = useApp();
  const [tab, setTab] = useState('library');
  const [showAccount, setShowAccount] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  const hasLibrary = apiKey || readOnly || session;
  const tabs = readOnly
    ? [['study', 'Study'], ['stats', 'Stats'], ['leaderboard', 'Leaderboard'], ['banks', 'Bank'], ['library', 'Library']]
    : hasLibrary
      ? [['library', 'Library'], ['study', 'Study'], ['stats', 'Stats'], ['leaderboard', 'Leaderboard'], ['banks', 'Bank']]
      : [['stats', 'Stats'], ['leaderboard', 'Leaderboard'], ['banks', 'Bank'], ['study', 'Study']];
  useEffect(() => { if (readOnly) setTab('study'); else if (!hasLibrary) setTab('stats'); }, [readOnly, hasLibrary]);
  useEffect(() => { setProfileUser(null); }, [tab]);

  const fullyProcessed = files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short).length;

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-[var(--border-soft)] px-3 sm:px-5 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-y-2 gap-x-3">
        <div className="flex items-center gap-2 sm:gap-3 order-1">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
          <div className="font-semibold text-sm sm:text-base">MCAT Study</div>
          {readOnly
            ? <span className="text-[10px] sm:text-xs text-[var(--success-text)] bg-[var(--success-bg)] rounded px-1.5 sm:px-2 py-0.5">read-only</span>
            : <span className="hidden sm:inline text-xs text-[var(--text-faint)] font-mono">{MODEL}</span>}
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto -mx-1 px-1 order-3 sm:order-2 w-full sm:w-auto">
          {tabs.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`text-sm px-3 py-2 sm:py-1.5 rounded whitespace-nowrap shrink-0 ${tab === k
                ? 'bg-[var(--bg-hover)] text-[var(--text-strong)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-[var(--text-muted)] order-2 sm:order-3">
          {session ? (
            <button
              onClick={() => setShowAccount((s) => !s)}
              className="px-2 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] flex items-center gap-1.5"
              title={pendingSync.length ? `${pendingSync.length} attempts pending sync` : 'Signed in'}
            >
              <span className="text-[var(--text-strong)]">@{session.username}</span>
              {(pendingSync.length > 0 || syncBusy) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning-text-strong)]" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowAccount((s) => !s)}
              className="px-2 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] text-[var(--text-strong)]"
            >
              Sign in
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
            title="Settings"
            className="w-9 h-9 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 flex items-center justify-center border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] text-[var(--text-strong)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 p-3 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
          {tab === 'library' && (
            <>
              {!readOnly && apiKey && <UploadPanel />}
              {session && <PublishAllPanel />}
              {fullyProcessed > 0 && (
                <>
                  {/* SyncPanel (GitHub auto-push) intentionally hidden — Cloudflare CloudBankPanel replaces it. */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => exportBank({ files, extractions, questions })}
                      className="text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] rounded"
                    >
                      Export data.json locally
                    </button>
                  </div>
                </>
              )}
              <FileList />
            </>
          )}
          {tab === 'study' && <StudyView />}
          {tab === 'stats' && (
            <>
              {session && <ServerStatsView />}
              <StatsView />
            </>
          )}
          {tab === 'leaderboard' && (
            profileUser
              ? <UserProfile username={profileUser} onBack={() => setProfileUser(null)} />
              : <Leaderboard onPickUser={(u) => setProfileUser(u)} />
          )}
          {tab === 'banks' && <BankTab />}
        </div>
      </main>

      {showAccount && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-24"
          onClick={() => setShowAccount(false)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <AccountPanel onClose={() => setShowAccount(false)} />
          </div>
        </div>
      )}

      {showSettings && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-20 overflow-y-auto"
          onClick={() => setShowSettings(false)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function Root() {
  const { apiKey, readOnly, session } = useApp();
  return (apiKey || readOnly || session) ? <Shell /> : <ApiKeyGate />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <Root />
  </AppProvider>
);

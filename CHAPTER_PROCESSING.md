# Chapter Processing — instructions for Claude Code

Use this file to process MCAT chapter PDFs into the JSON shape the app expects, so you can
publish them to the cloud bank (https://mcat-api.solitary-sky-76c1.workers.dev) without
spending Gemini quota. Designed for Claude Code with Sonnet/Opus + the Read + Write tools.

---

## Quick start

### Launching Claude Code

This project lives at `C:\MCAT REVIEW\`. **Open Claude Code from that directory** so it
can see both the spec and the PDFs in one workspace:

```powershell
cd "C:\MCAT REVIEW"
claude
```

If you've already launched Claude Code somewhere else (typically `C:\Users\<you>\`), you'll
get an error like *"can't find a Website directory"* — that's because Claude Code only
sees files under its launch cwd. Either restart it from `C:\MCAT REVIEW`, or in the
running session ask it to add that directory to its workspace.

### What to ask Claude Code

After launching in `C:\MCAT REVIEW`, paste this prompt verbatim:

> Read `Website/CHAPTER_PROCESSING.md`. Then run the pipeline it describes on every PDF in
> `Material/Behaviorial Science/`. Write one `chapter_<file_id>.json` per chapter into a
> new `Generated/` folder at the project root, and at the end merge them into a single
> `Generated/bank.json` matching the bank-envelope shape at the bottom of the spec.
>
> Before processing all five chapters, do a **dry run on Chapter 1 only** and report the
> token usage. Wait for me to say "go" before processing the remaining chapters.

The dry-run gate is worth keeping — five chapters end-to-end (extraction + general MC +
term coverage + two-part + short answer) typically runs **50-100k input + 30-60k output
tokens per chapter**, so confirm Chapter 1's actual usage before paying for the rest.

### Loading the result

When Claude Code finishes and you have `Generated/bank.json`, see the
[Loading the bank into the app](#loading-the-bank-into-the-app) section below. The
**cloud bank PUT** path (Section A) is the easiest — one curl call after you're signed
in, then every device pulls the new bank from the Library tab.

### Resuming if it stops mid-run

If Claude Code stops part-way (rate limit, interrupted session, context limit), restart
it the same way and use:

> Continue processing the PDFs in `Material/Behaviorial Science/` per `Website/CHAPTER_PROCESSING.md`.
> Skip any chapter that already has a `Generated/chapter_*.json` file. After processing,
> re-merge into `Generated/bank.json`.

Idempotent skipping by file presence means you only pay for what's not yet done.

---

## Goal

For each chapter PDF you point at, produce a JSON file that mirrors the **exact** shape the
app stores in localStorage under `mcat:files`, `mcat:extractions`, and `mcat:questions`.
At the end you can either:

- Open the app, paste the JSON into the browser console to merge it into local state, or
- POST the whole bank to `PUT /bank` on the worker once you're logged in.

## High-level pipeline (per chapter)

```
PDF → extraction → MC bank → term-coverage MC → two-part MC → short-answer bank
```

Each step's output is required input for the next.

---

## Step 0 — File record

For each chapter PDF, decide on metadata. Use a stable string for `file_id` (a UUID or a
slug like `local_behsci_ch3`). The app uses this to key its other stores.

```json
{
  "file_id": "local_<subject_slug>_<chapter_slug>",
  "filename": "Chapter 3 Learning and Memory.pdf",
  "size_bytes": 3741290,
  "subject": "Behavioral Science",
  "chapter": "Chapter 3 — Learning and Memory",
  "uploaded_at": "2026-05-19T12:34:56.000Z",
  "mime_type": "application/pdf",
  "file_uri": "local"
}
```

`subject` should match what's already in the app (`Behavioral Science`, `Biology`, etc.).
`chapter` is the human label shown in the UI; convention is `Chapter N — Title`.

---

## Step 1 — Extraction

Read the PDF. Extract three lists from it. **Be exhaustive on summary_sentences** — these
are the testable claims the quiz draws from.

Output exactly this JSON shape:

```json
{
  "summary_sentences": [
    "string — one high-yield claim per element",
    "..."
  ],
  "context_examples": [
    { "topic": "Short topic label", "example": "1-3 sentence concrete example/case/scenario from the chapter body" }
  ],
  "key_terms": [
    { "term": "Named term, theory, model, researcher, syndrome", "definition": "Single-sentence definition" }
  ]
}
```

Rules:
- `summary_sentences`: pull every sentence from end-of-chapter recaps, key-takeaway boxes,
  "concept summary" sidebars, and explicit "Key Concepts" call-outs. Aim 25-50.
- `context_examples`: concrete illustrations from the BODY of the chapter (not summaries) —
  worked scenarios, case studies, experiments, applied vignettes. Aim 10-25.
- `key_terms`: every named term/theory/researcher/syndrome with a one-sentence definition
  derived from the chapter itself. Aim 15-40.
- **Do not invent content not in the PDF.** Stay faithful to chapter wording.

Save to: `extractions/<file_id>.json`

---

## Step 2 — Multiple-choice bank (general)

Generate 15 MCAT-style MC questions from the extraction.

System guidance:
- Every question has exactly 4 choices and one correct answer.
- Distractors must be **genuinely hard**: pull from common student misconceptions, sibling
  concepts, "technically true but doesn't answer the question" near-misses. Avoid trivial
  fillers and "all/none of the above" padding.
- Cover a broad range of `summary_sentences`. Don't write 3 questions on the same idea.
- Vary stem phrasing: scenarios, "best example of", "would NOT", vignettes. Don't default
  to "What is X?".
- 1-2 sentence explanation per question, ideally calling out why the most tempting
  distractor is wrong.

Output shape:
```json
{
  "questions": [
    {
      "question": "Stem text",
      "choices": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "1-2 sentences."
    }
  ]
}
```

After generation, tag each question with an id and mode:

```json
{
  "id": "mc_<unix_ms>_<idx>",
  "mode": "mc",
  "question": "...",
  "choices": ["...", "...", "...", "..."],
  "correct_index": 2,
  "explanation": "..."
}
```

---

## Step 3 — Term-coverage MC

Generate **one MC question per `key_term`** in the extraction. This ensures every term
gets quiz coverage even if the chapter didn't directly quiz it (e.g. *serial-position
effect* might be defined but never tested in the PDF — we still want a question on it).

Use the same MC shape as Step 2 but also include:
- `"from": "term"`
- `"term": "<the term name>"`

Distractor rules are even stricter than Step 2:
- Distractors should be drawn from **other terms' definitions in this chapter** AND from
  the broader MCAT corpus where students commonly confuse concepts (Piaget vs Vygotsky,
  Type I vs Type II errors, classical vs operant cousins, sympathetic vs parasympathetic).
- Include at least one distractor that is **technically true but doesn't answer this
  particular question**.
- Every distractor should make a half-prepared student hesitate.
- Vary the stem: definition recall, scenario application, "best example of", "would NOT".

Tagged output:

```json
{
  "id": "term_<unix_ms>_<idx>",
  "mode": "mc",
  "from": "term",
  "term": "serial-position effect",
  "question": "...",
  "choices": ["...", "...", "...", "..."],
  "correct_index": 1,
  "explanation": "..."
}
```

Append all term questions to the same MC array from Step 2.

---

## Step 4 — Two-part MC

Generate ~6 **two-part** items. Each item probes two related-but-distinct concepts that
students commonly confuse. Example: Part 1 presents a scenario, asks "this illustrates
_____" → answer is *generalization*. Part 2 asks a definitional question on a sibling
concept → answer is *accommodation to a schema*.

Pick term pairs students actually confuse — different theories explaining the same
phenomenon, parallel mechanisms with subtle differences, etc.

Shape:
```json
{
  "id": "tp_<unix_ms>_<idx>",
  "mode": "two_part",
  "theme": "Behaviorist conditioning concepts",
  "parts": [
    {
      "question": "Stem for Part 1",
      "choices": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "..."
    },
    {
      "question": "Stem for Part 2",
      "choices": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "..."
    }
  ]
}
```

Always exactly 2 parts. Both parts get tough distractors per the rules in Steps 2-3.

---

## Step 5 — Short-answer bank

Generate ~8 open-ended short-answer prompts. Each asks the student to explain or apply a
concept in 2-4 sentences.

Shape:
```json
{
  "id": "sa_<unix_ms>_<idx>",
  "mode": "short",
  "prompt": "Open-ended question.",
  "ideal_answer": "Model answer in 2-4 sentences for self-evaluation.",
  "key_points": ["short phrase 1", "short phrase 2", "..."]
}
```

`key_points`: 3-6 short phrases that MUST appear (or be paraphrased) in a complete answer.
Cover a range of high-yield topics; don't duplicate.

---

## Final output for one chapter

Aggregate everything into one JSON file per chapter, `chapter_<file_id>.json`:

```json
{
  "file_record": { /* Step 0 */ },
  "extraction": { /* Step 1 */ },
  "questions": {
    "mc": [ /* Steps 2 + 3 concatenated */ ],
    "short": [ /* Step 5 */ ],
    "twoPart": [ /* Step 4 */ ],
    "generated_at": "2026-05-19T13:00:00.000Z"
  }
}
```

When all chapters are done, merge them into a single bank file:

```json
{
  "version": 1,
  "exported_at": "2026-05-19T13:00:00.000Z",
  "model": "claude-code",
  "files": [ /* every file_record */ ],
  "extractions": { "<file_id>": { /* extraction */ }, ... },
  "questions":  { "<file_id>": { "mc": [...], "short": [...], "twoPart": [...] }, ... }
}
```

Save as `bank.json`.

---

## Loading the bank into the app

Pick one of:

### A. Push to the cloud bank (recommended)

1. Sign in to the app on any device.
2. In the browser console:
   ```js
   const t = JSON.parse(localStorage.getItem('mcat:session')).token;
   const body = await (await fetch('./bank.json')).text(); // or paste the JSON string directly
   await fetch('https://mcat-api.solitary-sky-76c1.workers.dev/bank', {
     method: 'PUT',
     headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
     body,
   });
   ```
3. On any device signed in to the same account: Library → Cloud bank → **Pull cloud bank to this device**.

### B. Load into localStorage directly

In the browser console on the app:
```js
const bank = /* paste your bank JSON */;
localStorage.setItem('mcat:files', JSON.stringify(bank.files));
localStorage.setItem('mcat:extractions', JSON.stringify(bank.extractions));
localStorage.setItem('mcat:questions', JSON.stringify(bank.questions));
location.reload();
```

### C. data.json (static deployment)

Drop `bank.json` into the repo root, rename to `data.json`, commit, push. The app picks it
up on first load via the existing "Use shared bank" flow.

---

## Quality bar — what "good" looks like

A processed chapter should:

- Have at least one MC question for every key_term (so the bank covers everything taught,
  not just what the textbook quizzed).
- Have distractors that genuinely fool a half-prepared student — if a college freshman who
  didn't read the chapter could eliminate two distractors at a glance, they're too easy.
- Avoid leakage between question and answer (don't put the answer term in the question
  unless the question is about its definition).
- Match the chapter's terminology exactly. If the chapter uses "operant conditioning",
  don't write "instrumental conditioning" without flagging it.
- Vary phrasing across the bank — repeated stems get gameable fast.

If you find yourself writing a weak distractor, replace it with the definition of a
related concept the student is likely to confuse with the correct answer.

---

## Procedure for Claude Code

Assumes the working directory is `C:\MCAT REVIEW` (per Quick start above).

```
For each PDF in Material/<Subject>/:
  1. If Generated/chapter_<file_id>.json already exists → skip (resume-friendly).
  2. Read the PDF.
  3. Run Step 1 (extraction).
  4. Run Step 2 (general MC, 15 items).
  5. Run Step 3 (term coverage, one item per key_term). Append to the MC array.
  6. Run Step 4 (two-part, ~6 items).
  7. Run Step 5 (short answer, ~8 items).
  8. Write Generated/chapter_<file_id>.json with the aggregated shape from §Final output.

After all chapters:
  9. Re-read every Generated/chapter_*.json and merge into Generated/bank.json
     per the bank envelope shape.
  10. Tell the user "Done — bank.json written. See §Loading to publish."
```

Optimize for quality, not speed. A single careful Sonnet/Opus pass per step beats
multiple cheap iterations — distractor quality is the whole point.

If processing the first chapter, **stop and report token usage before continuing** so the
user can decide whether to proceed with the rest.

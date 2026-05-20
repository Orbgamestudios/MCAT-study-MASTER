# Gemini Prompts — single source of truth

Every device running this app — yours, your phone's, a friend's contributing with their
own Gemini key — sends the same instructions to Gemini for each pipeline stage. This file
is the human-readable reference for those instructions. The strings here mirror the
`PROMPTS` constant near the top of `app.js`; if you change one you must change the other.

The pipeline has five stages. **Extraction** needs the PDF. The other four operate on the
extraction's text alone, so a contributor without the PDF can still help on them.

```
PDF ─► Stage 1: extraction ──► Stage 2: general MC ──► Stage 3: term coverage MC
                                                  │
                                                  ├──► Stage 4: two-part MC
                                                  │
                                                  └──► Stage 5: short answer
```

All stages use `gemini-2.5-flash` with adaptive thinking **disabled** (`thinkingBudget:
0`) and `responseSchema` set to enforce JSON output. Output token budgets are large enough
that responses don't truncate even for chapters with many terms.

---

## Stage 1 — Extraction

**Input:** the chapter PDF (via Gemini Files API) + the chapter label.

**System instruction:**

> You extract MCAT study material from a chapter PDF for a question-generation pipeline.
> Be exhaustive in summary_sentences — these are the testable claims and become the basis
> of the quiz, taken from the end-of-chapter recap, key-takeaway boxes, or "concept
> summary" sections. context_examples are concrete illustrative scenarios, experiments,
> case studies, or worked examples from the body of the chapter (not summaries) — these
> inform question wording and distractor plausibility. key_terms are named terms,
> theories, models, researchers, or syndromes with one-sentence definitions for
> matching-style questions. Do not invent content not in the PDF.

**User message:**

> Extract study material for: {chapter_label}. Aim for 25-50 summary_sentences, 10-25
> context_examples, 15-40 key_terms.

**Response schema:**

```json
{
  "summary_sentences": ["string", "..."],
  "context_examples": [{ "topic": "string", "example": "string" }],
  "key_terms":        [{ "term":  "string", "definition": "string" }]
}
```

**Output budget:** 32,768 tokens.

---

## Choice formatting & correctness rules (applies to all MC stages)

Every MC stage (2, 3, 4) must follow these rules. They are appended to each stage's
system instruction in `app.js`.

> **CHOICE FORMATTING RULES:**
> - Each choice must be SHORT — just the concept name, term, value, or brief phrase.
> - NEVER add explanatory text, justifications, or definitions after a dash, colon, or
>   parenthetical in a choice.
>   Bad: `"Associative learning — both involve linking two events"`.
>   Good: `"Associative learning"`.
> - All four choices should be roughly the same length and style so the correct answer
>   does not stand out visually.
>
> **CORRECTNESS CHECK:**
> - Before finalizing, verify that the choice at `correct_index` is genuinely and
>   unambiguously the best answer. If two choices could plausibly be correct, rewrite
>   the stem to disambiguate or pick a different topic.

---

## Stage 2 — General Multiple Choice

**Input:** PDF + extraction JSON.

**System instruction:**

> You write high-quality MCAT-style multiple-choice questions from a chapter PDF and
> structured extraction. Every question must have exactly 4 choices, with `correct_index`
> (0-3) pointing to the correct one. Distractors must be plausible — pull from common
> misconceptions, related-but-wrong concepts, or other key_terms in the same chapter.
> Cover the chapter broadly across summary_sentences. Explanations are 1-2 sentences and
> justify the correct answer (and ideally why the most tempting distractor is wrong). Do
> not duplicate questions. Do not include questions whose answer is not directly supported
> by the chapter.

**User message:**

> Chapter: {chapter_label}
>
> Extracted summary sentences and key terms:
> {extraction_json}
>
> Generate exactly 15 MCAT-style multiple-choice questions covering the chapter.

**Response schema:**

```json
{
  "questions": [{
    "question": "string",
    "choices":  ["A", "B", "C", "D"],
    "correct_index": 0,
    "explanation": "string"
  }]
}
```

Each question stored with `id: "mc_<ms>_<idx>"` and `mode: "mc"`. **Output budget:**
32,768 tokens.

---

## Stage 3 — Term-coverage MC

**Input:** extraction JSON. The PDF is **not** required.

Runs in batches of 12 terms. Generates one MC question per term so every `key_term` gets
quiz coverage, even ones the chapter never directly quizzed.

**System instruction:**

> You write tough MCAT-style multiple-choice questions, one per assigned term. For each
> term, write a question testing understanding — definition, application, mechanism,
> recognition in a clinical/behavioral scenario, or distinguishing the term from a sibling
> concept. Vary phrasing across items; do NOT default to "What is the X?" — mix in
> scenarios, vignettes, "best example of", "most similar to", "which of the following
> would NOT". Exactly 4 choices, correct_index 0-3.
>
> DISTRACTORS MUST BE GENUINELY HARD:
> - Pull from commonly confused sibling concepts (e.g. for "generalization" use
>   accommodation, assimilation, classical-vs-operant cousins).
> - Pull from adjacent material in the broader MCAT corpus, not just this chapter —
>   Piaget vs Vygotsky, Type I vs Type II errors, sympathetic vs parasympathetic, etc.
> - Include at least one distractor that is technically true but does NOT answer the
>   question.
> - Avoid "obviously wrong" distractors (unrelated facts, gibberish, definitions of
>   trivial items). Every distractor should make a half-prepared student hesitate.
> - Don't pad with "all/none of the above" filler.
>
> Explanations are 1-2 sentences and should briefly call out why the most tempting
> distractor is wrong.

**User message (per batch):**

> Chapter: {chapter_label}
>
> Assigned terms (write ONE question for each, in this order):
> 1. {term1} — {definition1}
> 2. ...
>
> Other terms in the same chapter (fair game as distractor inspiration):
> - {other_term}: {other_definition}
> - ...
>
> Return exactly {N} questions, in the same order as the assigned terms above.

**Response schema:** identical to Stage 2.

Each question stored with `id: "term_<ms>_<idx>"`, `mode: "mc"`, `from: "term"`,
`term: "<the term>"`. **Output budget:** 16,384 tokens per batch.

---

## Stage 4 — Two-part MC

**Input:** extraction JSON. PDF not required.

Generates ~6 items. Each item presents two sequential mini-MCs on related-but-distinct
concepts students commonly confuse. Each part is scored independently; the whole item
counts as "correct" only if both parts are right.

**System instruction:**

> You design "two-part" MCAT-style multiple choice items. Each item has exactly TWO MC
> parts on RELATED-BUT-DIFFERENT concepts that students commonly confuse. Example shape:
> Part 1 presents a brief scenario or stem and asks "this illustrates _____" (correct:
> generalization). Part 2 then asks a definitional or application question on a sibling
> concept (correct: accommodation to a schema). The two parts share a "theme" (the
> broader area the student must navigate) but probe DISTINCT concepts so a student who
> has them blurred together will miss one. Each part has exactly 4 choices, correct_index
> 0-3, and a 1-2 sentence explanation. Distractors should be tough — sibling concepts,
> near-misses, things the student would plausibly pick if they're half-prepared. Avoid
> trivial filler distractors.

**User message:**

> Chapter: {chapter_label}
>
> Key terms in this chapter (use as raw material for concept pairs that are commonly
> confused):
> - {term}: {definition}
> - ...
>
> Generate exactly 6 two-part items. Pick term pairs that students actually confuse
> (different theories explaining the same phenomenon, different stages of the same
> process, parallel mechanisms with subtle differences). Each "parts" array must have
> exactly 2 entries.

**Response schema:**

```json
{
  "questions": [{
    "theme": "string",
    "parts": [
      { "question": "string", "choices": ["A","B","C","D"], "correct_index": 0, "explanation": "string" },
      { "question": "string", "choices": ["A","B","C","D"], "correct_index": 0, "explanation": "string" }
    ]
  }]
}
```

Each item stored with `id: "tp_<ms>_<idx>"`, `mode: "two_part"`. **Output budget:** 16,384
tokens.

---

## Stage 5 — Short Answer

**Input:** PDF + extraction JSON.

Generates ~8 open-ended prompts. Each asks the student to explain or apply a concept in
2-4 sentences. Quiz mode shows the ideal answer + key points; user self-grades.

**System instruction:**

> You write open-ended short-answer study prompts from a chapter PDF and structured
> extraction. Each prompt asks the student to explain or apply a concept in 2-4
> sentences. ideal_answer is a model answer (2-4 sentences) suitable for self-evaluation.
> key_points is 3-6 short phrases that MUST appear (or be paraphrased) in a complete
> answer. Cover a range of high-yield topics — do not duplicate.

**User message:**

> Chapter: {chapter_label}
>
> Extracted material:
> {extraction_json}
>
> Generate exactly 8 short-answer study prompts.

**Response schema:**

```json
{
  "questions": [{
    "prompt": "string",
    "ideal_answer": "string",
    "key_points": ["short phrase", "..."]
  }]
}
```

Each prompt stored with `id: "sa_<ms>_<idx>"`, `mode: "short"`. **Output budget:** 16,384
tokens.

---

## Why all this consistency matters

Every contributor's Gemini key is invoked from the same browser code with the same
prompts. That means:

- **Voice is consistent.** All distractors follow the same "must be plausible, no filler"
  rule, regardless of who paid for them.
- **Schemas are stable.** A question generated by your friend looks identical to one you
  generated yourself — same fields, same id pattern, same `mode`/`from` tagging.
- **Quality is steerable.** If we tighten the term-coverage prompt to be even more
  adversarial (e.g. "include at least one distractor that requires knowing two chapters
  to eliminate"), one edit propagates to every contributor on the next deploy.

## Changing a prompt

Edit the matching string under `const PROMPTS = { ... }` near the top of `app.js`, then
update this document to match. Increment the `?v=N` cache-bust on `app.js` in
`index.html` so contributors fetch the new version on their next visit. Existing
generated questions are not retroactively updated; only new generation calls use the new
prompt.

## Question audit

After questions are generated, they can be audited for quality via the **Audit** button
in the Bank tab. See `QUESTION_AUDIT.md` for the full pipeline — pass 1 strips
explanatory text from choices (client-side, free), pass 2 uses Gemini to verify that
`correct_index` actually points to the right answer.

## Out-of-band processing (Claude Code, etc.)

If you ever want to bypass Gemini entirely and use Claude Code's tokens to process a
chapter, see `CHAPTER_PROCESSING.md` — that doc translates the same five stages into a
self-contained instruction set for Claude Code, with the same schemas and rules.

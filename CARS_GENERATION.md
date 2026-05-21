# Daily CARS — generation spec

This is the single source of truth for how the app's **daily CARS** passage and
questions are generated. The strings here mirror the `CARS_PROMPT` constant near the
top of `app.js`; if you change one, change the other.

One CARS set is generated per calendar day. The first signed-in user with a Gemini API
key to open the app on a given day generates that day's set and uploads it to the cloud
(`POST /cars`); everyone else just downloads it. It then lives on the Home page for that
day and is archived in the CARS bank afterwards.

The goal is **harder than the real MCAT CARS section** — these are training questions, so
they should punish loose reading and reward genuine analysis.

## How the passage is sourced

**Primary path — a real public-domain text.** The Cloudflare Worker exposes
`GET /cars/passage?date=YYYY-MM-DD`. It picks a work from a curated, verified list of
**Project Gutenberg** books (difficult humanities / social-science prose — exactly the
CARS disciplines), fetches the plain text server-side, strips the Gutenberg header/footer
and front matter, and slices a flowing ~500–600 word window of genuine prose. The client
hands that passage to Gemini, which writes **only the questions** (`generateCarsQuestions`).
This is the intended behaviour: the passage is real, difficult, human-written text; only
the questions are AI-generated.

The Gutenberg list lives in `GUTENBERG_BOOKS` in the Worker (`API/src/index.js`) — 29
verified works of difficult humanities / social-science prose (Machiavelli, Veblen,
Nietzsche, Du Bois, William James, Adam Smith, Mill, Frazer, the Federalist, Pater,
Wollstonecraft, Tocqueville, Arnold, Hume, Malthus, Hobbes, Thoreau, Russell,
Marx/Engels, Aristotle, Locke, Emerson, Plato, Paine, Descartes, More, …). The book
rotates by day-of-year; within each book the ~550-word window is date-seeded, so the
same title yields a different passage each time it comes around. The Worker tries the
next book if one fails to fetch.

**Fallback path — fully generated.** If the Gutenberg fetch fails entirely,
`generateDailyCars` has Gemini write the passage *and* questions (an original passage in
authentic CARS style). The "The passage" section below governs that fallback only.

---

## What CARS actually is (from the Kaplan outline)

- The real section: 9 passages, 5–7 questions each, 90 minutes.
- Passages are **500–600 words**, multi-paragraph, drawn from **humanities** and **social
  sciences** — never natural sciences.
- Passages are academic in register: advanced vocabulary, varied rhetorical styles, an
  argument or interpretive stance the reader must reconstruct.
- Questions test analysis and reasoning, **not outside knowledge**. Every answer must be
  decidable from the passage alone (plus, for "beyond" questions, the new scenario the
  question supplies).

### Disciplines to rotate through

**Humanities:** Architecture, Art, Dance, Ethics, Literature, Music, Philosophy, Popular
Culture, Religion, Studies of Diverse Cultures, Theater.

**Social Sciences:** Anthropology, Archaeology, Economics, Education, Geography, History,
Linguistics, Political Science, Population Health, Psychology, Sociology, Studies of
Diverse Cultures.

The app passes a target discipline (rotating day to day) so consecutive days vary.

---

## The passage (fallback path only)

When the Gutenberg fetch fails and Gemini must write the passage itself, write an
**original** passage in authentic CARS style — do **not** copy any existing copyrighted
text.

Requirements:

- **500–600 words**, 4–6 paragraphs.
- Built around a **single arguable thesis** the author advances — an interpretation, a
  critique, a re-evaluation. Not a neutral encyclopedia summary.
- Include **nuance the reader must track**: a concession, a counter-position the author
  partly accepts, a distinction between two similar ideas, a shift in tone in one
  paragraph. The practice passages do this — e.g. an author whose final paragraph turns
  noticeably more positive, or who praises the *application* of an idea while staying
  neutral on the idea itself.
- Use academic vocabulary and varied sentence structure. No headings, no lists — flowing
  prose.
- The thesis should be **inferable but never stated as a tidy topic sentence**. The
  reader earns it.

---

## The questions

Generate **exactly 6 questions**. Cover all three AAMC categories; lean toward the
harder two:

| Category | Count | Subtypes to draw from |
| --- | --- | --- |
| Foundations of Comprehension | 2 | Main Idea, Detail, Inference, Definition-in-Context |
| Reasoning Within the Text | 2 | Function, Strengthen–Weaken (Within the Passage) |
| Reasoning Beyond the Text | 2 | Apply, Strengthen–Weaken (Beyond the Passage) |

Every question has exactly **4 choices** and a `correct_index` (0–3).

### Difficulty mandate — harder than real CARS

The distractors are where difficulty lives. Each wrong choice must be wrong for a
*specific, identifiable* reason — and that reason must be subtle. Draw distractors from:

- **Technically true but doesn't answer the question** — a real statement from the
  passage that simply isn't responsive to the stem.
- **Right concept, wrong scope** — correct in spirit but too broad or too narrow (e.g.
  "compare" vs. "give an overview", "the application of an idea" vs. "the idea itself").
- **Reversed relationship** — swaps cause and effect, or which of two things the author
  prefers.
- **Too extreme** — adds an absolute ("always", "never", "better than") the passage
  never commits to.
- **Correct for a different paragraph** — true of one part of the passage, applied to the
  wrong part.
- **Tense / modality shift** — describes a choice already made vs. one being made, a
  possibility vs. a certainty.

Additional rules:

- **No giveaway phrasing.** Distractors must be the same length and register as the
  correct answer. The correct answer must not be the longest or most hedged.
- **At least two questions must require synthesizing two or more paragraphs** — the
  answer cannot be found by reading a single sentence.
- For **Apply** questions, invent a genuinely novel scenario (a policy, an experiment, a
  person's behaviour) where mapping it back to the passage takes real thought — not an
  obvious paraphrase.
- For **Strengthen–Weaken**, the new fact's effect should be indirect: the test-taker
  must work out *which* of the passage's claims it bears on before judging the direction.
- Every set should have at least one **"LEAST supported" / "EXCEPT" / "would most
  disagree"** style question — these reward eliminating four near-equivalent options.
- The most tempting wrong answer should be defensible enough that a 90th-percentile
  scorer hesitates. Aim so a strong student gets ~4/6, not 6/6.

### Explanations

For every question provide:

- `explanation` — 2–4 sentences: the question type, the strategy (e.g. "go back to the
  text", "process of elimination"), and why the correct answer is correct.
- `choice_explanations` — one entry per choice (4 total), each explaining concretely why
  that choice is right or wrong. This mirrors the answer keys in the practice problems:
  every choice gets a real rationale, not just "incorrect".

---

## Prompt — primary path (`generateCarsQuestions` in app.js)

Used when a real Gutenberg passage was fetched. Gemini writes **only the questions**.

**System instruction:**

> You write MCAT CARS (Critical Analysis and Reasoning Skills) questions for a study app.
> You are given a REAL public-domain passage of difficult humanities or social-science
> prose. Do NOT rewrite, summarize, or replace the passage — write questions about it
> exactly as given. Generate exactly 6 multiple-choice questions covering all three AAMC
> categories (Foundations of Comprehension, Reasoning Within the Text, Reasoning Beyond
> the Text), each with exactly 4 choices and a correct_index 0–3, testing analysis of
> THIS passage only — never outside knowledge. THESE MUST BE HARDER THAN THE REAL MCAT:
> distractors must be technically-true-but-unresponsive, right-concept-wrong-scope,
> reversed relationships, too-extreme, or correct-for-the-wrong-paragraph — never
> obviously wrong. All four choices must match in length and register. At least two
> questions must require combining two or more paragraphs. Include at least one
> LEAST-supported / EXCEPT-style question. For every question give a 2–4 sentence
> explanation and a one-line rationale for each of the four choices.

**User message:**

> Discipline: {discipline}
>
> Passage (real public-domain text — do not alter it):
> {passage}
>
> Write exactly 6 CARS questions on this passage, harder than a real MCAT CARS section — a
> strong student should expect to miss one or two.

**Response schema:** `{ "questions": [ {question, choices[4], correct_index, category,
subtype, explanation, choice_explanations[4]} x6 ] }`

## Prompt — fallback path (`generateDailyCars` in app.js)

Used only when no Gutenberg passage could be fetched. Gemini writes the passage too.

**System instruction:**

> You write original MCAT CARS practice sets — one academic passage plus six
> multiple-choice questions — for a study app. The passages are humanities or
> social-science prose, 500–600 words, built around a single arguable thesis with real
> nuance. Never copy existing text; write original prose. [...same difficulty mandate as
> above...]

**Response schema:** as the primary path, plus top-level `passage`, `discipline`,
`title`, `source`.

**Output budget:** 32,768 tokens. Adaptive thinking disabled.

---

## Changing this spec

Edit `generateCarsQuestions` / `generateDailyCars` near the top of `app.js`, or the
`GUTENBERG_BOOKS` list in `API/src/index.js`, then update this document to match, then
bump the `?v=N` cache-bust on `app.js` in `index.html`. Already-generated days are not
regenerated; only future days use the new prompt.

# Lesson Generation Prompt

Generate an **adaptive, chunked lesson** for ONE chapter that already exists in the question bank.
Subjects: every subject in the bank (Biology, Biochemistry, Organic Chemistry, General Chemistry, Physics & Math, Behavioral Science, CARS-adjacent).
Output: `Generated/<slug>/lesson_ch<N>.json`, then publish to the API as the chapter's `lesson` stage.

This pipeline runs AFTER a chapter's question bank (extraction + mc/two_part/short) already exists. The lesson is built **on top of** that existing material — it teaches the same concepts the questions test, and it reuses the existing question IDs as its embedded mastery checks so the app's adaptive engine can skip what the student already knows.

---

## Why "adaptive + chunked" — read this first

The app tracks every answered question as an attempt `{ question_id, file_id, correct, ... }` and computes a per-chapter **% correct**. The Lessons tab already surfaces a student's most-struggled chapters and excludes questions they've mastered (answered correctly and not missed since).

A lesson must plug into that same model. So a lesson is **not** one long article — it is an ordered list of small **sections**, each one:

- tied to a single concept (a `concept_id` + human label),
- linked to the exact `question_id`s from the existing bank that test that concept (its `check_ids`),
- self-contained, so it can be shown or skipped independently.

**The adaptive rule the app applies (you do not implement it — you just make it possible):**
- A section is **mastered** when the student has answered all (or the configured threshold of) its `check_ids` correctly and has not missed any of them since. Mastered sections are skipped on entry.
- A section **resurfaces** the moment the student misses one of its `check_ids` again in any quiz.
- Brand-new students (no attempts) see every section in order.

For this to work your sections must be **granular** (one concept each) and every section's `check_ids` must reference **real IDs that exist in that chapter's published `mc` / `short` / `two_part` arrays**. Never invent IDs. A section with no valid check_ids can never be marked mastered, so it would show forever — don't ship those.

---

## A. Load the chapter's existing material (source of truth)

Pull the published chapter from the API — do NOT re-OCR the PDF; the work is already done:

```
GET /chapters                      -> find the chapter by subject + title, get its <id>
GET /chapters/<id>                 -> returns { extraction, questions:{ mc, twoPart, short }, ... }
```

From that payload you have everything you need:
- `extraction.summary_sentences` — the testable high-yield claims (the spine of the lesson)
- `extraction.key_terms[]` `{ term, definition }` — the definition-drill source; use the **exact** `term` strings
- `extraction.equations[]` `{ name, expression, variables, when_to_use, common_pitfalls }`
- `extraction.context_examples[]`
- `questions.mc[]`, `questions.twoPart[]`, `questions.short[]` — each has a stable `id`. **These IDs are your `check_ids`.**

Group the existing questions by what concept they test (use each MC's `question`/`explanation`, each term-question's `term`, each short item's `key_points`, and the original `practice_bank[].tests_concept` if present) so you can attach the right `check_ids` to each section.

> The PDFs are image-only scans and pages are non-sequential — but you should not need them. If a concept in the Concept Summary is under-covered by `summary_sentences`, prefer enriching from `summary_sentences` + `key_terms` rather than re-reading the PDF. Only fall back to the scan (extract embedded page JPEGs, read as images) if genuinely necessary.

## B. Plan the section list (concept map)

Walk `summary_sentences` + the chapter's Concept Summary and cluster them into **6–14 sections**, ordered the way you'd teach them (foundational → advanced; definitions before mechanisms before applications). Every Concept Summary point and every `key_term` must land in some section. Each section covers ONE concept a student could plausibly "know or not know" independently.

For each planned section, collect the `question_id`s from `mc`/`two_part`/`short` that test that concept → those become `check_ids`. Aim for **2–5 check_ids per section**; never zero.

## C. Write each section

Each section teaches its concept, then drills it. Sections contain:

1. **`teach`** — 2–5 short paragraphs (plain prose, no markdown headers) that explain the concept the way a strong tutor would: the intuition, the mechanism, why it matters on the MCAT, and the single most common misconception. Pull facts from `summary_sentences`; do not contradict the bank.
2. **`worked_examples`** (0–3) — `{ prompt, solution }`. For quantitative chapters (physics, parts of gchem/biochem) at least one section must show a fully worked numeric example that rearranges/uses an `equation`. Plain ASCII digits.
3. **`definition_drills`** — the `key_terms` that belong to this concept, as `{ term, definition }`, using the EXACT `term` strings from `extraction.key_terms`. These render as flashcards.
4. **`check_ids`** — the real bank question IDs that gate this section's mastery (see B).
5. **`equations`** (optional) — names of `extraction.equations` introduced here (exact `name` strings), for quick reference.

## D. Coverage check (mandatory)

- Every `extraction.key_terms[]` → appears as a `definition_drill` in exactly one section.
- Every `extraction.equations[]` → introduced in exactly one section (and that section has a worked example using it, where the chapter is quantitative).
- Every Concept Summary point and every `summary_sentences[]` claim → taught in some section's `teach`.
- Every `mc` / `two_part` / `short` `id` in the chapter → referenced as a `check_id` by exactly one section (so the whole bank is reachable through the lesson). If a question doesn't fit any concept section, add a catch-all "Mixed review" section at the end for the leftovers.
- No section has an empty `check_ids`.

---

## Output shape

```json
{
  "lesson": {
    "chapter_id": "ch_xxxxxxxxxxxx",
    "subject": "Biology",
    "title": "Chapter N - Title",
    "intro": "1-3 sentence orientation: what this chapter is about and why it matters on the MCAT.",
    "sections": [
      {
        "id": "sec_<unix_ms>_<idx>",
        "order": 1,
        "concept_id": "short-stable-slug-for-the-concept",
        "title": "Human-readable concept name",
        "teach": "2-5 short paragraphs of plain prose...",
        "worked_examples": [
          { "prompt": "...", "solution": "..." }
        ],
        "definition_drills": [
          { "term": "exact term string", "definition": "one sentence" }
        ],
        "equations": ["exact equation name"],
        "check_ids": ["mc_...","term_...","sa_..."],
        "mastery_threshold": 1.0
      }
    ],
    "generated_at": "<ISO timestamp>"
  }
}
```

Field notes:
- `mastery_threshold` (0.0–1.0, default `1.0`): fraction of `check_ids` that must be correct (and not since-missed) for the app to treat the section as mastered/skippable. Use `1.0` for short high-stakes sections; `0.75` is acceptable for big sections with 5+ checks.
- `order` is 1-based and must be unique and contiguous.
- `concept_id` is a stable slug (lowercase, hyphens) — keep it stable across regenerations so a student's per-section progress survives a lesson refresh.
- IDs: sections use `sec_<unix_ms>_<idx>`.

### ⚠ Field-name + encoding rules (same as the question pipeline)
- Plain ASCII digits only — no Unicode subscripts (`CH3`, `H2O`, not `CH₃`). Plain hyphen in `title`/`chapter` fields (no em dash).
- Greek letters, →, °, ² ³ are safe in `teach`/`solution` text.
- `definition_drills[].term` must byte-match an `extraction.key_terms[].term`.
- `check_ids` must all exist in the chapter's published `mc`/`two_part`/`short` arrays.
- After writing the JSON, verify zero Unicode subscripts and that every `check_id` resolves against the chapter payload from `GET /chapters/<id>`.

---

## Publishing

```
GET /chapters                          -> resolve <id> by subject+title
GET /chapters/<id>                      -> pull extraction + questions (source material + valid IDs)
PUT /chapters/<id>/stage/lesson         -> the lesson object (the value of "lesson" above)
```

Auth: `Authorization: Bearer <token>`
Host: `mcat-api.solitary-sky-76c1.workers.dev`

> **Backend note (one-time):** the worker currently accepts stages `extraction | mc | two_part | short`. Adding lessons requires allowing a new `lesson` stage on `PUT /chapters/<id>/stage/<stage>` and returning it inside `GET /chapters/<id>` (e.g. as `payload.lesson`). The app's Lessons tab reads `lesson.sections` and applies the adaptive skip/resurface logic against the student's local attempts. Until that route exists, write the file locally to `Generated/<slug>/lesson_ch<N>.json` and the push step is a no-op.

### Windows shell: strip UTF-8 BOM ONLY if present
```bash
if [ "$(head -c 3 tmp_lesson.json | xxd -p)" = "efbbbf" ]; then
  tail -c +4 tmp_lesson.json > tmp_lesson.clean.json
else
  cp tmp_lesson.json tmp_lesson.clean.json
fi
curl -s --ssl-no-revoke -X PUT \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  --data-binary @tmp_lesson.clean.json "https://mcat-api.solitary-sky-76c1.workers.dev/chapters/<id>/stage/lesson"
```

---

## Idempotency
Skip a chapter if `Generated/<slug>/lesson_ch<N>.json` already exists. Re-pushing the lesson stage is safe. Keep `concept_id`s stable across regenerations so student per-section progress is preserved.

## How the app consumes this (for context, not something you build)
The Lessons tab orders sections by `order`, then for each section checks the student's local attempts against `check_ids`:
- all (≥ `mastery_threshold`) correct and none since-missed → **skip** (collapsed as "mastered").
- otherwise → **show** the `teach` text, `worked_examples`, and `definition_drills`, and offer its `check_ids` as a short quiz.
- a later wrong answer on any `check_id` flips that section back to "needs review" automatically.
This is exactly the adaptive behavior the student asked for: get something right and it drops out of the lesson; miss it later and it comes back.

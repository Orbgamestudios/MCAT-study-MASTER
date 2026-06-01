# Science Chapter Processing Prompt

Subjects: Organic Chemistry · General Chemistry · Physics & Math
PDFs: `Material/<Subject>/<Subject> Chapters 1-12.pdf` + `<Subject> Milesdown Review.pdf`
Output: `Generated/<slug>/chapter_ch<N>.json` where slug = `orgo` | `gchem` | `phys`

---

## Per-chapter pipeline: A → B → C → D → E → F → G → H → I

### A. Locate chapter text
⚠ **The source PDFs are image-only scans** (full-page DCTDecode JPEGs, NO text layer). `pdftotext` and text-based PDF readers return nothing. Pages are also **non-sequential** — physical page order does not match book/chapter order, so you must hunt for each chapter's pages.

To read a chapter:
- Extract the embedded page JPEGs from the PDF byte stream and read them as images (multimodal), OR run OCR (`pdftoppm` + an OCR tool) if available.
- Identify the chapter by its visible heading on the page image: Main PDF `Chapter N <Title>`; Milesdown `<Subject> N: <Title>`.
- Confirm you have the full chapter before generating: the review text/bullets, the **end-of-chapter Concept Summary**, and the end-of-chapter practice questions with their answer explanations. The Concept Summary is a primary content source (see C) and a coverage target (see coverage check) — do not skip it.

### B. Style profile (read practice bank first, generate nothing yet)
The 15 sample practice questions + their answer explanations are the canonical **formatting template** for every question you generate — match their stem phrasing, choice structure, distractor style, and explanation tone. (Content comes from Milesdown in stage C; the samples define *form*, not *source*.) Read all 15 and record:
```
dominant_formats: [e.g. "product ID", "mechanism name", "rank by property", "roman numeral I/II/III"]
stem_patterns: [2-3 representative stems verbatim]
distractor_strategy: [how wrong answers are constructed]
calculation_fraction: 0.0-1.0
uses_roman_numerals: true/false
```
Every generated question must match this profile.

### C. Extraction
```json
{
  "summary_sentences": ["25-50 high-yield claims from Milesdown bullets + practice answer explanations"],
  "key_terms": [{"term": "...", "definition": "one sentence"}],
  "equations": [{"name":"...","expression":"...","variables":"...","when_to_use":"...","common_pitfalls":"..."}],
  "context_examples": [{"topic":"...","example":"1-3 sentences"}],
  "practice_bank": [{"num":1,"stem":"...","choices":["A","B","C","D"],"correct_index":0,"tests_concept":"...","format":"..."}]
}
```
- All content is drawn from the **Milesdown PDF chapter** (review bullets + text), the **main chapter's end-of-chapter Concept Summary**, and the practice answer explanations. Capture the chapter exhaustively — the counts below are floors, not caps; if the chapter has more, extract more.
- `summary_sentences`: every high-yield claim in the Milesdown chapter **and every concept stated in the main chapter's Concept Summary** (25-50+, don't cap if there's more). The Concept Summary is the chapter author's own list of what matters — treat each of its points as a claim that must appear here and be tested.
- `key_terms`: every named concept, mechanism, law, functional group (20-50)
- `equations`: every formula in Milesdown OR implied by a practice question (physics: 8-20, gchem: 5-15, orgo: 2-8)
- All text values: plain ASCII digits only — no Unicode subscripts (see encoding rules below)
- `practice_bank.format`: the question type (product ID / mechanism / calculation / ranking / roman numeral / etc.)

### D. General MC — 15 questions
- Format distribution matches `dominant_formats` proportionally
- Use `stem_patterns` as templates (vary, don't copy)
- Apply same `distractor_strategy` as real bank
- Match `calculation_fraction`
- IDs: `mc_<unix_ms>_<idx>`, `"mode":"mc"`

### E. Practice-mirror MC — 15 questions (one per practice question)
- Same concept + same format as the original; different numbers/molecule/reagent/scenario
- IDs: `pm_<unix_ms>_<idx>`, `"mode":"mc"`, `"from":"practice"`, `"mirrors":<1-15>`

### F. Equation-coverage MC — 2 per equation
- Q1 conceptual: when it applies, variable meanings, common pitfall
- Q2 applied: solve for unknown, rearrange, or "if X doubles, Y…"
- IDs: `eq_<unix_ms>_<idx>`, `"mode":"mc"`, `"from":"equation"`, `"equation":"<name>"`, `"kind":"conceptual"|"applied"`

### G. Term-coverage MC — 1 per key_term
- IDs: `term_<unix_ms>_<idx>`, `"mode":"mc"`, `"from":"term"`, `"term":"<exact term string>"`
- ⚠ If chapter already exists on server: fetch `/chapters/<id>` and use server's exact `key_terms[].term` strings

### H. Two-part MC — 6 items
- Pairs students confuse: SN1/SN2, E1/E2, Ka/Kb, ΔH/ΔG, velocity/acceleration, impulse/momentum
- IDs: `tp_<unix_ms>_<idx>`, `"mode":"two_part"`, `"theme":"..."`, `"parts":[{q1},{q2}]`

### I. Short answer — 8 items
- ≥2 prompts must ask student to derive or rearrange an equation
- IDs: `sa_<unix_ms>_<idx>`, `"mode":"short"`, `"prompt":"..."`, `"ideal_answer":"2-4 sentences"`, `"key_points":["3-6 phrases"]`

---

## Output shape
```json
{
  "file_record": {"file_id":"files/<12char>","filename":"...","size_bytes":0,"subject":"...","chapter":"Chapter N - Title","uploaded_at":"...","mime_type":"application/pdf","file_uri":"local"},
  "extraction": { /* C output */ },
  "questions": {
    "mc":      [ /* D + E + F + G concatenated */ ],
    "twoPart": [ /* H */ ],
    "short":   [ /* I */ ],
    "generated_at": "<ISO timestamp>"
  }
}
```

### ⚠ Field names (must match app.js)
- MC questions: use `"question"` for the stem — **NOT** `"stem"`
- Two-part parts: also use `"question"` — **NOT** `"stem"`
- Short-answer items: use `"prompt"` ✓
- Practice bank entries (in extraction): use `"stem"` ✓ (not rendered by quiz UI)

MC question shape:
```json
{"id":"mc_...","mode":"mc","question":"...","choices":["choice text","choice text","choice text","choice text"],"correct_index":0,"explanation":"..."}
```
Two-part part shape:
```json
{"question":"...","choices":["choice text","choice text","choice text","choice text"],"correct_index":0,"explanation":"..."}
```
⚠ **Choices must NOT include letter prefixes.** The app renders A/B/C/D labels itself.
- ❌ `"choices": ["A. sp hybridization", "B. sp2 hybridization", ...]`
- ✓ `"choices": ["sp hybridization", "sp2 hybridization", ...]`

---

## Distractor rules by subject
- **Physics**: ≥1 wrong-unit choice per calculation question; confuse F vs ma, p vs mv vs KE
- **G-Chem**: Ka/Kb, ΔH/ΔG, sign of q/w, intensive vs extensive, strong vs weak acid
- **O-Chem**: wrong stereochemistry, wrong regio (Markovnikov/anti), wrong leaving group, swapped SN1/SN2

## Structure/diagram rule
Cannot embed images. Use IUPAC names, condensed formulas (`CH3CH(OH)CH2CH3`), or text descriptions.

## ⚠ Character encoding rules (critical — app renders UTF-8 as Windows-1252)
The quiz app renders question text through a narrow Unicode path. Violations produce garbled gibberish (e.g. `CHâ,fCHâ,,` instead of `CH3CH2`).

**Always use plain ASCII for:**
| ❌ Don't use | ✓ Use instead |
|---|---|
| Unicode subscripts ₀₁₂₃₄₅₆₇₈₉ (U+2080–2089) | Plain digits: `CH3`, `H2O`, `CO2` |
| Unicode superscript minus ⁻ (U+207B) | Plain hyphen: `pKa = -1.7` |
| Subscript letters ₓₙ (U+2090–209C) | ASCII letter: `CnH(2n+2)` |
| Em dash — in chapter `"title"` and `"chapter"` fields | Plain hyphen with spaces: `Chapter N - Title` |

**Safe to use (render correctly):**
- Greek letters: α β γ δ π σ
- **Always write Greek letters as their actual Unicode symbol, never spelled out.** Use `λ` not "lambda", `Δ` not "delta", `μ` not "mu/micro", `θ` not "theta" (also `α β γ ω π σ φ ρ ε η κ ν τ χ ψ Ω Σ Φ`, etc.), everywhere in question/explanation/term text. Exception: keep the Latin spelling when it's part of a conventional proper term ("alpha helix", "beta sheet", "gamma rays"). Be consistent.
- Right arrow →, degree °
- Math symbols: ≈ ≡ ≥ ≤ ± × ÷ ½ ²  ³ Å
- Superscripts for exponents: ² ³ (U+00B2, U+00B3 only)
- Em dash — and en dash – are safe **inside question/explanation text** but NOT in chapter title fields (iOS renders them as a black diamond ◆)

**After writing any JSON file, verify before pushing:**
```powershell
$c = Get-Content "path/to/file.json" -Raw -Encoding UTF8
[regex]::Matches($c, '[₀₁₂₃₄₅₆₇₈₉₊₋ₓₙ]').Count  # must be 0
```

## Coverage check (must cover everything)
Keep the staged structure (D: 15 general · E: 1 mirror per sample · F: 2 per equation · G: 1 per term), but the chapter is NOT done until every extracted concept is tested. After G, verify and backfill:
- Every `key_terms[]` entry → ≥1 question (guaranteed by G).
- Every `equations[]` entry → ≥1 question (guaranteed by F).
- Every `practice_bank[].tests_concept` → ≥1 question.
- **Every concept in the main chapter's Concept Summary → tested by ≥1 question.** Walk the Concept Summary point by point; for any point not already covered by D/E/F/G, add extra general-MC items until it is. This is mandatory — the Concept Summary defines the chapter's high-yield scope.
- Every `summary_sentences[]` claim → tested by ≥1 question across D/E/F/G. If a chapter fact isn't covered, add extra general-MC items until it is.

---

## Publishing (per chapter)
```
POST /chapters  → {subject, title, filename, size_bytes}  → chapter_id
PUT  /chapters/<id>/stage/extraction  → extraction object
PUT  /chapters/<id>/stage/mc          → mc array (D+E+F+G)
PUT  /chapters/<id>/stage/two_part    → twoPart array
PUT  /chapters/<id>/stage/short       → short array
```
Auth: `Authorization: Bearer <token>`
Host: `mcat-api.solitary-sky-76c1.workers.dev`

### Windows shell: strip UTF-8 BOM ONLY if present
A UTF-8 BOM breaks API JSON parsing, but only PowerShell `Out-File -Encoding utf8` adds one — the Write tool / Node / bash redirection do NOT. **Check first, strip only if the BOM is there.** Blindly running `tail -c +4` on a BOM-less file removes the leading `[`/`{` and corrupts the payload.
```bash
# If first 3 bytes are 'ef bb bf' -> BOM present, strip it; else push as-is.
if [ "$(head -c 3 tmp_stage.json | xxd -p)" = "efbbbf" ]; then
  tail -c +4 tmp_stage.json > tmp_stage.clean.json
else
  cp tmp_stage.json tmp_stage.clean.json
fi
curl -s --ssl-no-revoke -X PUT \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  --data-binary @tmp_stage.clean.json "https://mcat-api.solitary-sky-76c1.workers.dev/chapters/<id>/stage/<stage>"
```

---

## Idempotency
Skip chapter if `Generated/<slug>/chapter_ch<N>.json` exists.
Re-pushing stages is safe (worker timestamps each push).

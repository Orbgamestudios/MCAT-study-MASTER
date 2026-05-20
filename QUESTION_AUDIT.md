# Question Audit Pipeline

A two-pass quality check for generated MC questions. Anyone with a Gemini API key can
run an audit from the **Bank tab** on any chapter that has MC questions.

## Hint system background

Each MC choice can optionally include explanatory text after an em-dash:
`"Associative learning — linking two events via stimulus-response pairing"`. The quiz UI
hides the text after the dash behind a **Hint** button. If a student taps Hint, all four
hints are revealed — but a correct answer after using a hint only earns **half credit**.

This means the explanatory text in choices is a feature, not a bug. It helps struggling
students learn while preserving the challenge for those who don't use it.

## What the audit catches

### Pass 1 — hint coverage (instant, no API calls)

Scans each MC question's choices for the `"Term — hint"` pattern and reports:

- How many questions **have** hint text (Hint button will appear)
- How many questions **don't** have hint text (no Hint button — plain choices only)

Questions without hints aren't broken — they just don't participate in the hint system.
Re-generating those questions with the current prompts will produce hint text
automatically.

### Pass 2 — Gemini-powered (requires API key)

Sends each MC question (stem + 4 choices + claimed correct_index) to Gemini and asks:

> Given the question and choices, is the choice at correct_index genuinely and
> unambiguously the best answer? If not, which index is correct and why?

Questions where Gemini disagrees with the stored `correct_index` are flagged. The auditor
sees a diff view and can accept the fix (update `correct_index`), delete the question, or
skip.

## How to run an audit

1. Open the **Bank tab**.
2. Find a chapter row and tap **Audit**.
   - The button appears for any signed-in user with a Gemini API key set.
3. **Pass 1** runs immediately and shows hint coverage stats.
4. **Pass 2** (optional) sends questions to Gemini for verification.
   - Tap **Verify with Gemini** to start. Progress shows inline.
   - Each flagged question shows the original vs. suggested correction.
   - **Accept** updates `correct_index` on the server.
   - **Delete** removes the question entirely.
   - **Skip** leaves it unchanged.

## Prompt for Pass 2

**System instruction:**

> You are a meticulous MCAT question reviewer. For each question you receive, evaluate
> whether the choice at `correct_index` is genuinely and unambiguously the best answer.
> Consider whether the stem is clear, whether any distractor could also be correct, and
> whether the explanation matches the indicated answer. Return your verdict.

**User message (per batch of ~8 questions):**

> Review these N MC questions. For each, say whether the claimed correct answer is
> actually correct.
>
> --- Question 1 ---
> Stem: {question}
> A. {choices[0]}
> B. {choices[1]}
> C. {choices[2]}
> D. {choices[3]}
> Claimed correct: {letter} (index {correct_index})
> Explanation: {explanation}

**Response schema:**

```json
{
  "results": [{
    "index": 0,
    "correct": true|false,
    "suggested_index": 0-3,
    "reason": "string"
  }]
}
```

## Design notes

- Pass 1 is informational only — no mutations. It tells you how many questions will
  show the Hint button in the quiz.
- Pass 2 costs Gemini tokens but catches genuinely wrong answers. Worth running once per
  chapter after initial generation.
- The audit never silently overwrites questions. Every change requires human confirmation.
- Corrected indices are pushed via the same `putChapterStage` API that contribution
  uses — no new backend endpoints needed.

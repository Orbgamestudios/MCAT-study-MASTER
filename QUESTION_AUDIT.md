# Question Audit Pipeline

A two-pass quality check for generated MC questions. Anyone with a Gemini API key can
run an audit from the **Bank tab** on any chapter that has MC questions.

## What the audit catches

### Pass 1 — client-side (instant, no API calls)

1. **Choice trimming.** Strips explanatory text after ` — `, ` - `, or `: ` in answer
   choices. The raw Gemini output sometimes produces choices like
   `"Associative learning — both involve linking two events"`. The audit trims these to
   just `"Associative learning"` so the explanation doesn't give the answer away.

2. **Length-based flagging.** If any single choice is more than 2× the average length of
   the other three, the question is flagged for review — the long choice is usually the
   correct answer and stands out visually.

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
3. **Pass 1** runs immediately and shows how many choices were trimmed.
   - Tap **Apply trims** to push the cleaned choices to the server.
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

**User message (per question):**

> Question: {question.question}
> Choices: A. {choices[0]} / B. {choices[1]} / C. {choices[2]} / D. {choices[3]}
> Claimed correct: {letter} (index {correct_index})
> Explanation: {question.explanation}
>
> Is the claimed correct answer actually correct?

**Response schema:**

```json
{
  "correct": true|false,
  "suggested_index": 0-3,
  "reason": "string"
}
```

## Design notes

- Pass 1 is deterministic and free — no Gemini calls. It should be run on every chapter.
- Pass 2 costs Gemini tokens but catches genuinely wrong answers. Worth running once per
  chapter after initial generation.
- The audit never silently overwrites questions. Every change requires human confirmation.
- Trimmed choices and corrected indices are pushed via the same `putChapterStage` API that
  contribution uses — no new backend endpoints needed.

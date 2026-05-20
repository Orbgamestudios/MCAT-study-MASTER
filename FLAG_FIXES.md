# Flag → Fix pipeline

A lightweight question-correction system. While taking a quiz, a user can flag any MC
question with a short description of what's wrong. Gemini then processes flagged
questions individually and applies the smallest fix that addresses the user's complaint.

## The user side

In the quiz UI, when a question has been answered (so the correct answer is visible), a
small **⚑ Flag** button appears next to the Next button. Tapping it opens a modal where
the user types a short description — e.g.:

- "B and C are basically the same answer"
- "The marked correct answer doesn't match the explanation"
- "Question stem is missing context — what state of the patient?"
- "Choice D has weird formatting after the dash"

The flag is stored two places:

1. **Local queue** in `localStorage` under `mcat:flagQueue`. Always present so the user
   can process flags with their own Gemini key even on chapters they never published.
2. **Server-side** on the chapter row (`flags_json` column) if the chapter exists on the
   cloud bank and the user is signed in. This makes flags visible across devices.

## Running the pipeline

The bottom of the **Library** tab shows a `⚑ Flagged questions` panel when the local
queue has entries. Tapping **Run pipeline** processes each pending flag in sequence using
the user's Gemini key.

For each flag, Gemini receives the original question, the flag description, and the
chapter label, then returns one of two actions:

| action | meaning |
| --- | --- |
| `edit` | Returns a corrected stem / choices / correct_index / explanation. |
| `skip` | The flag does not describe a real problem; leave the question unchanged. |

**Questions are never deleted.** Term-coverage MC questions in particular must stay so
that every key term in a chapter remains testable. If a question seems irredeemable,
Gemini is instructed to edit it into something usable rather than delete.

The fix is applied locally to the user's library, and if the chapter exists on the cloud
bank, also pushed via `PUT /chapters/{id}/stage/mc`.

## Rate-limit handling

If Gemini returns 429 / quota-exceeded, the pipeline stops and the remaining flags stay
in the local queue with `status: pending`. The user can run the pipeline again later
(typically the next day when the daily quota resets). Already-processed flags are not
re-run.

## Prompt sent to Gemini

**System instruction:**

> You are a meticulous MCAT question editor. A user has flagged an MC question as having
> a problem. Read their description carefully and apply the smallest fix that addresses
> it. Set action to "edit" and return the full corrected question (stem, all four choices,
> the corrected correct_index, and a 1-2 sentence explanation). NEVER delete questions —
> every question must be preserved (especially term-coverage questions). If the flag does
> not describe a real problem, set action to "skip". If a question seems irredeemable,
> still edit it into something usable rather than deleting. Always provide a short rationale.

**User message:**

> Chapter: {chapter_label}
>
> --- Flagged question ---
> Stem: {question}
> A. {choices[0]}
> B. {choices[1]}
> C. {choices[2]}
> D. {choices[3]}
> Current correct: {letter} (index {correct_index})
> Current explanation: {explanation}
>
> --- User's flag ---
> {description}
>
> Decide on action and (if editing) return the full corrected question.

**Response schema:**

```json
{
  "action": "edit | skip",
  "question": "string (only if action=edit)",
  "choices": ["A", "B", "C", "D"] /* only if action=edit */,
  "correct_index": 0,
  "explanation": "string",
  "rationale": "string"
}
```

## Design notes

- One Gemini call per flag — keeps token use small and means a rate-limit mid-batch
  cleanly stops without losing in-flight work.
- The pipeline only touches MC questions (`mode: 'mc'`). Short-answer and two-part flags
  are still recorded but currently aren't auto-fixed.
- The local queue is the source of truth. Server flags are a convenience for syncing
  across devices, not a separate workflow.
- Resolved flags stay in the queue (status = `editd` / `deleted` / `skipped`) so the user
  can review what was changed before clearing them with **Clear resolved**.

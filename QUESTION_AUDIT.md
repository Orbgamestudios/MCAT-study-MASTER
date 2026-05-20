# Question Audit

A one-time correctness check for each chapter's MC questions. Triggered from the Bank tab
on a chapter row via the **Audit** button.

## What it does

Sends every MC question (stem, 4 choices, claimed `correct_index`, explanation) to Gemini
in batches of 8 and asks:

> Is the choice at `correct_index` genuinely and unambiguously the best answer? If not,
> which index is correct?

For each question Gemini disagrees with, the auditor sees a diff view and can either
**Accept fix** (writes the corrected `correct_index` to the cloud bank — and to the
auditor's local library copy if downloaded) or **Skip**.

**Questions are never deleted.** Term-coverage MC questions in particular must stay so
that every key term remains testable. The worst the audit can do is change which index is
marked correct.

When the audit completes (regardless of whether any fixes were accepted), the chapter is
marked `audited` on the server with `audited_by` and `audited_at`. The **Audit** button
disappears from the row for everyone and a `✓ audited` badge takes its place.

## Re-auditing

To audit a chapter that's already been audited, enable **Allow re-auditing** under
Settings → Audit. With that toggle on, audited chapters show a **Re-audit** button
instead of the badge. With it off, audited chapters are locked from further audits to
avoid wasting Gemini quota and to prevent thrash.

## Prompt sent to Gemini

**System instruction:**

> You are a meticulous MCAT question reviewer. For each question, evaluate whether the
> choice at correct_index is genuinely and unambiguously the best answer. Consider whether
> the stem is clear, whether any distractor could also be correct, and whether the
> explanation matches the indicated answer. Return one result per question in the same
> order. NEVER suggest deletion — at worst suggest a different correct_index, since every
> question must be preserved.

**User message (per batch of 8):**

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

## Relation to the flag pipeline

The **audit** runs across all MC questions in a chapter at once and is a one-shot
correctness sweep. The **flag pipeline** (see `FLAG_FIXES.md`) is per-question and
user-driven — students flag problems as they encounter them, and Gemini fixes each one
individually. Both pipelines update the same `mc_json` payload via `PUT
/chapters/{id}/stage/mc` and neither ever deletes questions.

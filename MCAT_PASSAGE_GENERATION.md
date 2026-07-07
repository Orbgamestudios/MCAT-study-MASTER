# MCAT Practice Passage Generation Guide

Purpose: this is the instruction file the app sends to Gemini when generating practice passages in the Passages tab. It is based on public AAMC descriptions of MCAT structure, passage sources, and reasoning skills. Generate original practice only. Do not copy AAMC, Khan Academy, UWorld, Kaplan, Blueprint, Jack Westin, or any other proprietary passage or question text.

## Research basis

Official AAMC sources describe the exam as four multiple-choice sections. The three science sections each contain 59 questions: 10 passage-based sets with 4-6 questions per set plus 15 independent questions in 95 minutes. CARS contains 53 questions: 9 passage-based sets with 5-7 questions per set in 90 minutes.

AAMC says the natural and social science sections require students to combine content knowledge with scientific inquiry and reasoning skills. It lists four Scientific Inquiry and Reasoning Skills:

1. Knowledge of Scientific Concepts and Principles.
2. Scientific Reasoning and Problem-Solving.
3. Reasoning about the Design and Execution of Research.
4. Data-Based and Statistical Reasoning.

AAMC describes Skill 3 questions as asking students to show they can "do science": understand methodology, hypotheses, study design, samples, and how scientists test and extend knowledge. AAMC describes Skill 4 as reasoning with data from tables, graphs, and charts, identifying patterns, drawing conclusions, recognizing uncertainty, judging associations versus causation, and finding claims that go beyond evidence.

AAMC describes CARS passages as excerpts from books, journals, and magazines college students are likely to read, from social sciences and humanities. CARS tests comprehension, analysis, and reasoning from the passage only, with no outside content knowledge required. Social science passages tend to be more factual or scientific in tone; humanities passages often focus on relationships between ideas and may be conversational or opinionated.

The AAMC Store states that official prep questions are written by the same people who write the actual MCAT exam. Treat this as a quality signal: AAMC-style practice should be blueprint-driven, skill-tagged, and explanation-rich, not merely "science trivia in paragraph form."

## Core design model

Each generated practice set is one passage plus six multiple-choice questions. The set is shorter than a full section but should feel like one real MCAT passage block.

The passage must do three jobs:

1. Create a realistic information environment.
2. Force the student to decide which facts matter.
3. Support questions that require reasoning, not just lookup.

For science sections, write the passage as a compact research vignette, clinical observation, experimental setup, model system, or data interpretation problem. Include enough background that the student can reason from the passage, but require MCAT content knowledge to choose between close options.

For CARS, write an original humanities or social-science passage with an arguable thesis, tonal nuance, and no reliance on outside knowledge.

## Section profiles

### C/P - Chemical and Physical Foundations of Biological Systems

Use general chemistry, organic chemistry, biochemistry-adjacent chemistry, physics, and math in biological or medical contexts.

Good passage frames:

- Enzyme kinetics with inhibitor data and a Lineweaver-Burk style description.
- Buffering, titration, pH, electrochemistry, thermodynamics, equilibrium, or kinetics in a biological lab.
- Separation/purification method with elution order, charge, polarity, or molecular weight.
- Fluid, circuit, optics, sound, radiation, or mechanics problem in a physiological setup.
- Organic reaction or spectroscopy problem tied to biomolecules or lab synthesis.

Common reasoning moves:

- Translate variables and units.
- Predict direction of change.
- Identify the controlling equation or proportional relationship.
- Separate mechanism from correlation.
- Choose the best experimental method.

### B/B - Biological and Biochemical Foundations of Living Systems

Use molecular biology, biochemistry, cell biology, genetics, physiology, microbiology, and experimental biology.

Good passage frames:

- Mutant versus wild-type experiment.
- Protein structure/function assay.
- Metabolic pathway perturbation.
- Gene expression, signaling, receptor, transporter, or enzyme regulation study.
- Organ-system physiology with a cellular or biochemical mechanism.
- Experimental result requiring a control, knockout, rescue, or inhibitor comparison.

Common reasoning moves:

- Trace cause and effect across levels of organization.
- Predict phenotype from mechanism.
- Interpret a gel, blot, table, graph, or assay.
- Identify control groups and confounds.
- Distinguish necessary versus sufficient evidence.

### P/S - Psychological, Social, and Biological Foundations of Behavior

Use psychology, sociology, research methods, statistics, public health, behavior change, identity, culture, inequality, learning, cognition, emotion, and social structure.

Good passage frames:

- Behavioral experiment with operational definitions and possible confounds.
- Survey, cohort, case-control, or ethnographic study.
- Intervention or public health campaign with measured outcomes.
- Social stratification, demographic, identity, or group-process scenario.
- Neuropsychological or sensory/perceptual phenomenon tied to behavior.

Common reasoning moves:

- Identify the concept illustrated by a scenario.
- Match a theory to data.
- Critique sampling, validity, reliability, ethics, and confounds.
- Interpret correlations, group differences, and effect sizes.
- Avoid overclaiming causation from observational data.

### CARS - Critical Analysis and Reasoning Skills

Use humanities and social sciences only. Do not test science content. Do not ask for facts outside the passage.

Good passage frames:

- A critic reassesses an artist, institution, historical interpretation, or cultural trend.
- An author distinguishes two similar ideas and argues one has been misunderstood.
- A social scientist explains a phenomenon while warning against a tempting simplification.
- A philosopher, historian, literary critic, political theorist, or anthropologist advances a nuanced claim.

Common reasoning moves:

- Identify main idea, tone, author attitude, and passage structure.
- Infer what the author would agree or disagree with.
- Explain the function of a paragraph, example, concession, or analogy.
- Apply the author's reasoning to a new case.
- Eliminate choices that are true but not responsive, too extreme, reversed, or too broad.

## Passage construction rules

### Science passage length and shape

- Write 350-550 words.
- Use 3-6 paragraphs.
- Include a concrete study, model, patient/lab scenario, or data description.
- Include one structured `table` object, figure description, equation, pathway, or numerical result when useful.
- Keep the passage dense but readable. It should not be a textbook lesson.
- Do not embed markdown tables, pipe-delimited tables, tab-delimited tables, or aligned columns inside `passage`. If a table is useful, put it in the separate `table` object.
- All necessary passage facts must be present.
- Use realistic but not overly specialized names for genes, proteins, compounds, and study variables.

### CARS passage length and shape

- Write 500-600 words.
- Use 4-6 paragraphs.
- No headings, tables, equations, or bullet lists.
- Build around a single arguable thesis.
- Include a concession, contrast, tonal shift, or subtle distinction.
- The thesis should be inferable, not announced as a simple topic sentence.
- Never require outside knowledge.

## Question construction rules

Generate exactly six questions.

For science sections:

- Include at least one Skill 1 question.
- Include at least one Skill 2 question.
- Include at least one Skill 3 question.
- Include at least one Skill 4 question.
- At least four questions must depend on the passage.
- At least one question should require data/table/figure/equation interpretation.
- At least one question should test experimental design, controls, confounds, or validity.
- At least one question should require applying outside MCAT content knowledge to the passage.

For CARS:

- Generate two Foundations of Comprehension questions.
- Generate two Reasoning Within the Text questions.
- Generate two Reasoning Beyond the Text questions.
- At least two questions must require synthesizing more than one paragraph.
- Include at least one LEAST/EXCEPT/would most disagree question.

Every question:

- Has exactly four answer choices.
- Has exactly one best answer.
- Has a zero-based `correct_index`.
- Uses similar length and register across choices.
- Avoids "all of the above" and "none of the above."
- Avoids giveaway wording.
- Includes a 2-4 sentence explanation.
- Includes four `choice_explanations`, one for each choice.

## Distractor rules

Wrong answers should be plausible for a half-prepared student. Use these distractor types:

- Technically true but not responsive.
- Right concept, wrong scope.
- Reversed cause and effect.
- Confuses similar mechanisms or theories.
- Correct for a different condition or group.
- Too extreme compared with the evidence.
- Overstates correlation as causation.
- Uses the right equation with the wrong variable, sign, or units.
- Misreads a control group, baseline, or comparison.

At least one question per set should have a very tempting distractor that sounds reasonable until the student checks the exact passage logic.

## Data and methods expectations

Science passages should often include one of these:

- A compact structured `table` object with 2-4 rows and 2-4 columns.
- A graph described in words, including axes and trend.
- A short equation and variable definitions.
- A pathway with an intervention.
- A treatment/control comparison.
- A mutant, inhibitor, knockout, rescue, or dose-response result.

When data are included, at least one question must require interpretation of the data rather than restating it.

## Difficulty target

Aim slightly harder than a single real MCAT passage block. A strong student should usually get 4-5 out of 6, not 6 out of 6. Difficulty should come from reasoning and close distractors, not obscure content.

## Output schema

Return strict JSON matching this shape:

```json
{
  "section": "C/P",
  "discipline": "Biochemistry",
  "title": "string",
  "passage": "string",
  "table": {
    "title": "string",
    "columns": ["string", "string"],
    "rows": [["string", "string"], ["string", "string"]],
    "note": "string"
  },
  "questions": [
    {
      "question": "string",
      "choices": ["string", "string", "string", "string"],
      "correct_index": 0,
      "category": "Skill 2",
      "subtype": "mechanistic reasoning",
      "content_category": "5B",
      "sirs_skill": 2,
      "explanation": "string",
      "choice_explanations": ["string", "string", "string", "string"]
    }
  ]
}
```

Use `table: null` when no table is needed. Never put table data in `passage`.

For CARS, `category` should be one of:

- Foundations of Comprehension
- Reasoning Within the Text
- Reasoning Beyond the Text

For science sections, `category` should be `Skill 1`, `Skill 2`, `Skill 3`, or `Skill 4`.

If unsure about `content_category`, use an empty string rather than hallucinating.

## Final quality checklist

Before returning, verify:

- The passage is original.
- Any table is in the structured `table` field, not embedded in `passage`.
- The section matches the selected section.
- There are exactly six questions.
- Every question has exactly four choices.
- `correct_index` is 0, 1, 2, or 3.
- The correct answer is uniquely best.
- Explanations actually justify the answer.
- At least four science questions require the passage.
- CARS questions require no outside knowledge.
- No answer choice is obviously wrong filler.

## Research sources

- AAMC, "What's on the MCAT Exam?": https://students-residents.aamc.org/whats-mcat-exam/publication-chapters/whats-mcat-exam
- AAMC, "Scientific Inquiry and Reasoning Skills: Overview": https://students-residents.aamc.org/whats-mcat-exam/scientific-inquiry-reasoning-skills-overview
- AAMC, "Scientific Inquiry and Reasoning Skills - Skill 3": https://students-residents.aamc.org/scientific-inquiry-and-reasoning-skills/scientific-inquiry-reasoning-skills-skill-3-reasoning-about-design-and-execution-research
- AAMC, "Scientific Inquiry and Reasoning Skills - Skill 4": https://students-residents.aamc.org/scientific-inquiry-and-reasoning-skills/scientific-inquiry-reasoning-skills-skill-4-data-based-statistical-reasoning
- AAMC, "Critical Analysis and Reasoning Skills Section - Passage Types": https://students-residents.aamc.org/critical-analysis-and-reasoning-skills/critical-analysis-and-reasoning-skills-section-passage-types
- AAMC Store, "AAMC MCAT Official Prep Online-Only Bundle": https://store.aamc.org/online-only-official-mcat-prep-bundle.html

---
name: campaign-pipeline-orchestrator
description: >
  DEPRECATED — superseded by the 8-block flywheel (phase-doc-setup → research → ideation → creation → implementation → reporting → learning → updating). This 3-phase pipeline is preserved in archive/ for reference. Do not invoke. The current entry point is `/start-campaign` in the terminal, which walks the operator through the intake inline and dispatches `phase-doc-setup`.

  --- ORIGINAL DESCRIPTION BELOW (for historical reference) ---
  The master marketing pipeline. Accept any input — a product URL, a brief sentence, an idea, a competitor URL, uploaded assets — and run the full 3-phase connected research-to-ad pipeline. Every phase uses the output of the previous phase as its input, so the research informs the hooks, the hooks inform the copy, and the copy informs the creative. Outputs a complete Campaign Packet: Research Brief + Persona Doc + Hook & Creative Brief + Ad Copy Package.
---

# Campaign Pipeline Orchestrator

You are the creative director, strategist, and project manager of the full marketing pipeline. You accept any input at any stage of completeness and run a connected, three-phase process that ends with production-ready ad assets. Every output from Phase 1 is an input to Phase 2. Every output from Phase 2 is an input to Phase 3. Nothing gets to Phase 3 until Phase 2 is complete. Nothing gets to Phase 2 until Phase 1 is complete.

---
> ℹ️ **NOTE — When to use this skill:**
>
> This is the **fast-mode end-to-end runner**. It runs an internal 3-phase sequence (Research → Hooks → Production) and outputs a Campaign Packet in one go, WITHOUT per-phase human review.
>
> For the **canonical reviewed flow** (the 8-block flywheel with tick-box approval gates per phase), use the **Marketing Command Center dashboard** — it dispatches the `phase-doc-setup` → `phase-doc-research` → ... → `phase-doc-updating` chain with operator review at each block.
>
> Internal "Phase 1/2/3" references below refer to THIS skill's own 3-phase sequence — NOT the 8-block flywheel. They are different scopes.

This is not a checklist. It is a thinking system. At each gate, synthesise what you've learned and make it explicit before moving forward.

**Skill references for each phase:**
- Phase 1 → `icp-persona-engine` (persona), `apify-pain-research` (VOC), web research (competitors), `master-wordsmith` (language)
- Phase 2 → `hook-creative-generator` (hooks + creative strategy)
- Phase 3 → `paid-ads-expert` (copy + offer), `cinematic-prompt-architect` (visual prompts), `expert-communicator` (persuasion audit)

---

## How to Take Input

Accept inputs in any form. Never ask for more information than necessary before starting.

| Input type | What to do |
|------------|-----------|
| Product URL | Fetch, read, extract product, positioning, and any VOC available |
| One-line idea | Start Phase 1 with web research immediately |
| Existing campaign assets | Audit first, then identify which phase to enter |
| Competitor URL | Analyse competitor as research input, pivot to Phase 1 |
| "I'll add more later" | Start with what you have, flag assumptions clearly |
| Uploaded files | Read all files before starting Phase 1 |

**Opening move:** State in one line what you've understood the input to be, then immediately begin Phase 1. Don't ask permission to start.

---

## The Three-Phase Pipeline

---

### PHASE 1 — RESEARCH SPRINT
*Goal: Build a Campaign Research Brief that everything else is derived from.*

The research sprint runs four parallel tracks. Each track produces a specific output that feeds the brief.

#### Track A — Pain + VOC Research
Using `apify-pain-research` if available, or web search (Reddit, reviews, forums, Amazon, Trustpilot, G2, app stores):
- Identify the top 3-5 pain clusters (groups of related complaints)
- Extract exact customer language for each cluster (verbatim quotes)
- Note the emotional intensity of each cluster (frustrated, ashamed, desperate, resigned)
- Find the "nightmare scenario" — the worst case customers are trying to avoid

**Output:** Pain Cluster Map with verbatim phrases

#### Track B — Competitor Analysis
Using `marketing-engine:market-competitors` or web research:
- Identify 3-5 direct competitors
- Document what each competitor claims (their primary hook/promise)
- Find what competitors are NOT saying (the gap = your opportunity)
- Mine competitor reviews for unmet needs ("I wish it also…", "The one thing missing…")
- Identify the most tired/overused messaging in the category (what to avoid)

**Output:** Competitor Gap Map

#### Track C — ICP + Persona Build
Using `icp-persona-engine`:
- Build the trigger event
- Map the pain stack (surface → identity)
- Map the desire map (surface → identity)
- Extract power phrases
- Establish awareness level
- Define the identity frame
- Document platform behaviour

**Output:** `campaign-persona.md`

#### Track D — Language + Promise Mining
Using `master-wordsmith` principles:
- Extract exact words customers use (not marketing words — their words)
- Identify the category the product should claim or create
- Map the promise architecture: primary promise → supporting promises → proof points
- Build the "words we use / words we avoid" table

**Output:** Language + Promise Map

#### Phase 1 Gate — The Research Synthesis

Before moving to Phase 2, produce the **Campaign Research Brief**. This is the single document that all Phase 2 and Phase 3 work is derived from.

```markdown
# Campaign Research Brief: [Product/Brand Name]
**Date:** [date] | **Pipeline run by:** campaign-pipeline-orchestrator

## The One Insight
[Single most important thing the research revealed — one paragraph]

## Pain Cluster Map
### Cluster 1: [Name] (Intensity: High/Medium/Low)
[3-5 verbatim quotes]
### Cluster 2: [Name]
[3-5 verbatim quotes]
[Repeat for each cluster]

## Competitor Gap Map
| Competitor | What they claim | What they don't say |
|-----------|----------------|-------------------|
[Table of 3-5 competitors]

## Untapped Angles (our opportunity)
[2-3 angles no competitor is owning]

## Language + Promise Architecture
- Primary Promise: [...]
- Supporting Promises: [...]
- Proof Points: [...]
- Words We Use: [...]
- Words We Avoid: [...]

## Awareness Level Recommendation
[Level + rationale]

## Phase 2 Handoff Notes
[Specific instructions for hook-creative-generator based on this research]
```

**Save as:** `campaign-research-brief.md`

**Phase 1 CHECKPOINT — State out loud:**
> "Phase 1 complete. The research reveals [one-sentence summary of the most important finding]. This means our hook should [specific direction]. Moving to Phase 2."

---

### PHASE 2 — HOOK + CREATIVE STRATEGY
*Goal: Build the Hook + Creative Brief. Everything in Phase 3 is derived from this.*

Using `hook-creative-generator`, and grounding every hook in the Campaign Research Brief:

#### Step 1: Hook Generation (15 hooks across 6 creative types)
- Before/After (2-3 hooks): derived from Pain Stack + Desire Map
- Visual Pattern Interrupter (2 hooks): derived from Competitor Gap Map
- Curiosity + Cognitive (3 hooks): derived from Trigger Event + Power Phrases
- Trust + Authenticity (2 hooks): derived from most intense pain cluster
- Narrative + Format (2 hooks): derived from the "nightmare scenario"
- Meme + Cultural (1-2 hooks): only if platform behaviour confirms meme consumption

**Every hook has a [Research Source] tag. No hook without a source.**

#### Step 2: Scroll-Stop Scoring
Score all 15 hooks across: Specificity | Relevance | Curiosity Gap | Pattern Interrupt | Identity Resonance

Threshold:
- 40-50: Ship
- 30-39: Test
- <30: Rewrite

#### Step 3: Top 3 Creative Concepts
For the 3 highest-scoring hooks, build a full Creative Concept Card:
- Hook text
- Visual direction (first frame description)
- Sound-on and sound-off versions
- Caption structure (framework + CTA)
- Cinematic prompt direction (ready for `cinematic-prompt-architect`)
- Why it will work (research anchor)

#### Step 4: A/B Test Architecture
Identify which 2 concepts to test first and what variable they isolate (hook mechanism? creative format? awareness level? pain angle?).

**Phase 2 CHECKPOINT — State out loud:**
> "Phase 2 complete. Top hook: [hook text] — Scroll-Stop Score: [X/50]. Research source: [source]. Creative format: [format]. Moving to Phase 3."

---

### PHASE 3 — AD CREATION
*Goal: Produce a complete, production-ready Ad Package for immediate use.*

Phase 3 runs three parallel streams:

#### Stream A — Copy + Offer (using `paid-ads-expert` + `positioning-engine`)

For each of the Top 3 creative concepts, produce:

**Ad Copy Set:**
- Primary text (3 length variants: short 25 words, medium 80 words, long 150+ words)
- Headline (5 variants: pain-led, outcome-led, curiosity-led, social proof, contrarian)
- Description line (for Google/Meta)
- CTA button text (3 options)

**Copy Construction Rules:**
- All copy traceable to research (no generic claims)
- Opening line = the hook, adapted for the copy placement
- Body uses the framework selected in the Creative Concept Card (PAS / AIDA / BAB)
- All social proof is specific (names, numbers, timelines)
- CTA is action-specific ("Start your free trial" beats "Learn more")

**Offer Stack (if applicable):**
Using the Hormozi Value Equation — pull all four levers:
- Dream Outcome (bigger + more visceral)
- Perceived Likelihood (more believable)
- Time Delay (faster first milestone)
- Effort & Sacrifice (do more for them)

#### Stream B — Visual + Video Direction (using `cinematic-prompt-architect`)

For each creative concept, produce:
- **AI video prompt** (ready to paste into Veo/Kling/Runway/Sora/Seedream)
- **Still image prompt** (for Meta static, thumbnail, story)
- **Platform specs** (dimensions, length, format requirements)
- **Brand direction** (tone, colour feel, talent direction if UGC)

Use the cinematic direction from the Creative Concept Card as the input.

#### Stream C — Persuasion Audit (using `expert-communicator`)

Before the ad package ships, run a quick persuasion audit:
- Awareness level match: does the copy entry point match where the audience actually is?
- Aristotle audit: ethos → pathos → logos in the right order?
- Objection check: are the top 3 objections from the persona handled in the copy?
- Identity frame check: does the copy speak to who they want to become?

Flag any issues as **MUST FIX** (blocks Phase 3 completion) or **NICE TO HAVE**.

---

### PHASE 3 GATE — The Campaign Packet

Compile and deliver the complete **Campaign Packet**:

```
campaign-packet/
  ├── campaign-research-brief.md     ← Phase 1 output
  ├── campaign-persona.md            ← Phase 1 output  
  ├── hook-creative-brief.md         ← Phase 2 output
  ├── ad-copy-package.md             ← Phase 3 output
  └── visual-prompt-library.md       ← Phase 3 output
```

**`ad-copy-package.md` structure:**
```markdown
# Ad Copy Package: [Campaign Name]
**Platform:** [platform] | **Awareness Level:** [level]

## Creative #1 — [Hook Name]
### Hook: [exact hook text]
### Primary Text (Short): [25 words]
### Primary Text (Medium): [80 words]
### Primary Text (Long): [150+ words]
### Headlines (5 variants):
1. [Pain-led]
2. [Outcome-led]
3. [Curiosity-led]
4. [Social proof]
5. [Contrarian]
### CTA Options: [3 options]

[Repeat for Creative #2 and #3]

## Google Ads (if applicable)
### Headlines (15 × 30 chars):
### Descriptions (4 × 90 chars):

## Offer Stack
[Value Equation analysis + offer recommendation]
```

**`visual-prompt-library.md` structure:**
```markdown
# Visual Prompt Library: [Campaign Name]

## Creative #1 — AI Video Prompt
[Ready-to-paste prompt for Veo/Kling/Runway]

## Creative #1 — Still Image Prompt
[Ready-to-paste prompt for Midjourney/DALL-E/Flux]

## Creative #1 — Platform Specs
[Dimensions, length, format for each placement]

[Repeat for #2 and #3]
```

---

## Campaign Entry Points

Users don't always enter at Phase 1. Handle all entry points gracefully:

| Entry Point | How to handle |
|-------------|--------------|
| "I already have research, skip to Phase 2" | Read what they have, confirm Phase 1 gaps, proceed to Phase 2 |
| "I have hooks, help me with the creative" | You're mid-Phase 2 — run Scroll-Stop Scoring, then build Creative Concepts |
| "I have copy, make it better" | Phase 3 audit mode — run persuasion audit, rewrite, deliver |
| "Audit my existing campaign" | Run all three phases in reverse: audit Phase 3 outputs → trace back to Phase 2 → identify Phase 1 research gaps |
| "I have a product but no time for full research" | Rapid-mode: 20-minute research sprint, build assumptions-explicit brief, proceed |

---

## Rapid Pipeline Mode (time-constrained)

When the user needs output fast, offer Rapid Mode:

**Rapid Mode = 3 questions → 3 hooks → 1 ad in 15 minutes**

1. What does it do and what does buying it change?
2. Who buys it and what's their #1 pain?
3. Which platform, and what's the offer?

From these three answers, generate:
- A 5-hook shortlist (scored)
- 1 full Creative Concept Card
- 1 complete ad copy set (all lengths)
- 1 visual direction prompt

Label all output clearly as **RAPID MODE — research not complete.** Recommend running full pipeline when time allows.

---

## Anti-Patterns — What This Pipeline Prevents

1. **Generic hooks** — because every hook is traced to research
2. **Wrong awareness level** — because awareness level is established in Phase 1
3. **Copy that doesn't match creative** — because both are derived from the same Creative Concept Card
4. **Ads with no research basis** — because Phase 2 and 3 are gated behind Phase 1
5. **Copycat positioning** — because the Competitor Gap Map explicitly shows what not to claim
6. **Visual without message strategy** — because cinematic prompts are generated from the Creative Concept Card, not independently

---

## The Pipeline Contract

This pipeline makes one promise: **every output is traceable back to a research finding.** If a claim in the copy cannot be traced to a VOC quote, a competitor gap, a trigger event, or a proven framework — it doesn't belong in the ad.

Marketing that guesses fails. Marketing that listens wins.


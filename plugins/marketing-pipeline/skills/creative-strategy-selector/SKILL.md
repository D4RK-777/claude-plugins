---
name: creative-strategy-selector
description: >
  Selects ONE creative strategy per campaign (from the 6 in library-creative-strategies: Before/After, Visual Pattern Interrupter, Curiosity + Cognitive, Trust + Authenticity, Narrative + Format, Meme + Cultured Trend) with declared rationale. Runs AFTER persona + character + theme are locked, BEFORE hook-creative-generator. Two modes — TOLD (user dictates the strategy) or DERIVED (skill picks based on research signals). In either mode, the rationale is logged so the choice is defensible. Outputs: creative-strategy-declaration-[campaign].md + Decision Log entry. Trigger on: "pick a creative strategy", "what creative approach", "decide format direction", "select strategy", "should we do before/after or pattern interrupt", "creative direction", or as sub-phase of Block 3 Ideation (after theme + persona + character).
---

# Creative Strategy Selector
> **Position in pipeline:** Block 3 Ideation, sub-phase 3.4 — after persona + character + theme are locked, before hook-creative-generator. Constrains the creative options so hook generation has a defined posture to write against.

---

## ROLE

You are a creative director making one decision: which of the 6 strategic creative postures fits this campaign best, AND can you defend the choice. The 6 strategies are not equally good for every campaign — each wins in specific conditions and fails in others. Picking the wrong strategy produces work that's well-crafted but commercially flat.

You operate in one of two modes:
- **TOLD** — the user has already decided ("we want to run a Before/After campaign"). Your job is to validate that the choice fits the rest of the pipeline, flag any conflicts, and log the rationale.
- **DERIVED** — the user hasn't decided. Your job is to read all upstream signals (persona, character, theme, research) and select the strategy that best serves them, then defend the choice.

---

## WHEN TO INVOKE

Trigger when:
- Persona + character + theme are locked and the campaign is about to enter creative generation
- The user asks "what creative strategy should we use", "what creative direction", "which of the strategies fits"
- The user names a strategy directly ("let's do Pattern Interrupter") — run in TOLD mode to validate
- Creative work has been started without a declared strategy and you suspect drift — re-derive and lock

**Do NOT** run if a `creative-strategy-declaration-[campaign].md` already exists for the current campaign phase. Offer to update if context has changed.

---

## INPUTS REQUIRED

1. **Brand Brief** (`brand-brief-[project].md`)
2. **Theme Declaration** (`theme-declaration-[campaign].md`) — REQUIRED. Strategy choice is heavily constrained by theme.
3. **Campaign Persona Document** — required.
4. **Character Profile** — required (decision style is a major filter).
5. **library-creative-strategies.md** — the 6 strategies + compatibility matrices.
6. **library-creative-types.md** — the format×style taxonomy. The selected strategy will recommend 2–4 compatible format×style combos.
7. **(Optional)** Apify pain research, competitive scan, or other research outputs — used in DERIVED mode for evidence.
8. **(If TOLD mode)** The strategy name the user is dictating.

---

## THE SELECTION PROCESS

### STEP 1 — DECLARE MODE

```
MODE: [TOLD / DERIVED]
- TOLD: User dictated strategy = [name]. Skill validates and defends.
- DERIVED: No strategy dictated. Skill selects from research signals.
```

### STEP 2 — IF TOLD MODE: VALIDATION

Run the dictated strategy through the three compatibility checks:

1. **Strategy × Theme** — from library-creative-strategies compatibility table. Score ✓✓ / ✓ / ⚠ / ✗.
2. **Strategy × Decision Style** — same table.
3. **Strategy × Awareness × Sophistication** — pull from the strategy's "When this wins / When this fails" block in library-creative-strategies.

If all three score ✓ or better: validate, write declaration, lock.
If any score ⚠: validate with caveats, write declaration noting the caveats, ask user to confirm.
If any score ✗: FLAG. Surface the conflict to the user and propose an alternative. Do not silently lock a misfit.

### STEP 3 — IF DERIVED MODE: SELECTION

Score all 6 strategies against the three compatibility checks (same as above). Cut any with ✗ on any axis. From the remaining strategies, apply secondary filters:

- **Channel fit** — TikTok cold acquisition favours Narrative + Format and Meme + Trend; Google Search favours Curiosity + Cognitive and Trust + Authenticity; LinkedIn favours Trust + Authenticity and Narrative.
- **Production budget** — Pattern Interrupter and Narrative + Format can require strong art direction or video production. If the project has limited budget, lean toward Before/After or Trust + Authenticity which can be executed leanly.
- **Brand creative permission** — Meme + Cultured Trend requires brand standing to be playful. Trust + Authenticity requires brand has real proof. Don't pick a strategy the brand can't execute credibly.
- **Format constraints** — short placements (6s pre-rolls, story bumpers) rule out Narrative + Format and Curiosity + Cognitive (no room to build).

Result: 1 strategy (sometimes 2 if the campaign warrants a primary + variation strategy).

### STEP 4 — WRITE THE DECLARATION

```
DECLARED CREATIVE STRATEGY: [name]
MODE: [TOLD / DERIVED]
RATIONALE: [2-3 sentences — why THIS strategy for THIS theme × persona × character]

ALIGNMENT SCORECARD:
- Strategy × Theme: [✓✓ / ✓ / ⚠]
- Strategy × Decision Style: [...]
- Strategy × Awareness × Sophistication: [...]
- Strategy × Channel: [...]
- Strategy × Brand Permission: [...]
- Strategy × Budget/Production: [...]

COMPATIBLE FORMAT × STYLES (from library-creative-types):
- [format 1] × [style 1]
- [format 2] × [style 2]
- [format 3] × [style 3]

ALIGNED HOOK STRUCTURES (from library-hook-structures):
- [hook structure 1]
- [hook structure 2]

FAIL MODE TO AVOID:
[Specific to this strategy — from library-creative-strategies "fail mode" section]

SECONDARY STRATEGY (optional, for variant creative within same campaign):
[Name + when to use]

EXCLUSIONS:
[Strategies explicitly ruled out + why]
```

### STEP 5 — LOG TO CAMPAIGN STATE

Append to `campaign-state-[project].md` Decision Log:

```
- **[date]** — DECISION: Creative Strategy = [name]. Mode: [TOLD/DERIVED]. Rationale: [one line]. Compatible format×styles: [list]. See: creative-strategy-declaration-[campaign].md
```

---

## OUTPUT FORMAT — creative-strategy-declaration-[campaign].md

```markdown
# Creative Strategy Declaration: [Campaign Name]
**Selected:** [date] | **Mode:** [TOLD / DERIVED] | **Status:** LOCKED

## DECLARED STRATEGY
**[Name]**

## RATIONALE
[2-3 sentences citing theme, persona pain, character decision style, awareness × sophistication, and any research evidence.]

## ALIGNMENT SCORECARD
| Filter | Score | Reason |
|--------|-------|--------|
| × Theme | [...] | [...] |
| × Decision Style | [...] | [...] |
| × Awareness × Sophistication | [...] | [...] |
| × Channel | [...] | [...] |
| × Brand Permission | [...] | [...] |
| × Budget / Production | [...] | [...] |

## SHORTLIST CONSIDERED (transparency — DERIVED mode only)
| Strategy | × Theme | × DS | × Aw×Soph | Why not chosen |
|----------|---------|------|-----------|----------------|
| [strategy 2] | [...] | [...] | [...] | [...] |
| [strategy 3] | [...] | [...] | [...] | [...] |

## COMPATIBLE FORMAT × STYLE COMBOS
*hook-creative-generator and cinematic-prompt-architect should select from these:*
1. [format 1] × [style 1] — [one line why this combo serves the strategy]
2. [format 2] × [style 2] — [...]
3. [format 3] × [style 3] — [...]

## ALIGNED HOOK STRUCTURES
1. [hook structure 1] — [one line]
2. [hook structure 2] — [...]

## FAIL MODE TO AVOID
[Specific. From library-creative-strategies. Creative-interrogator will check work against this fail mode.]

## SECONDARY STRATEGY (optional)
[Name + when to deploy — e.g., "Trust + Authenticity for retargeting Stage 3 where pure Pattern Interrupter may have over-stimulated."]

## DOWNSTREAM CONTRACT
Every skill that produces creative for this campaign MUST:
- Open by reading this declaration
- Select format × style only from the compatible list above
- Use hook structures only from the aligned list above
- Honour the fail mode (do NOT produce work that triggers it)
- Cite this strategy in its output

If a downstream skill needs to deviate, it MUST raise the deviation as a Decision Log entry, not silently change strategies.
```

---

## PROCESS RULES

1. **One strategy per campaign.** Mixed-strategy campaigns produce mixed creative that doesn't compound. A secondary strategy is allowed for variants (e.g., retargeting Stage 4 might use a complementary strategy) but the primary is binding.

2. **Theme is the constraint, not negotiable.** If the theme is Loss Aversion (Stage 3) and the user wants Meme + Cultured Trend, that's a conflict — surface it, don't paper over it. Either change theme or change strategy.

3. **TOLD mode still requires defence.** If the user dictates, you still write the rationale and the scorecard. The defensibility layer is the whole point.

4. **DERIVED mode runs the full shortlist process.** Show the user the shortlist + why others lost, not just the winner. Builds trust in the recommendation.

5. **Compatible format×styles are a recommendation, not a cage.** hook-creative-generator can use one of the recommended combos OR justify a deviation. Strategy constrains direction; format×style is execution.

6. **Channel context is binding.** A strategy that fits the theme but fails on the declared channel is the wrong choice. Channel-fit is not a tie-breaker — it's a filter.

7. **Save as `creative-strategy-declaration-[campaign].md`** via present_files. Append to campaign-state Decision Log.

---

## DOWNSTREAM SKILL INTEGRATION

The strategy declaration feeds:
- **hook-creative-generator** — constrains hook generation to aligned hook structures + theme alignment
- **lp-copy-generator** — LP visual register and copy posture match the strategy (a Trust + Authenticity LP looks different than a Pattern Interrupter LP)
- **cinematic-prompt-architect** — visual prompts honour the strategy's aesthetic
- **library-creative-types** — provides the format×style taxonomy from which compatible combos are drawn
- **design-system-architect** — picks design system / components consistent with the strategy register
- **creative-interrogator** — audits work against strategy compliance + fail mode

---

> **First principle:** Theme is the bet. Strategy is the mechanic. Format is the execution. Pick the bet first (theme-selector), pick the mechanic second (this skill), then let format flow. Pipelines that pick format first produce beautiful work that doesn't convert.

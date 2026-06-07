---
name: persona-stress-test
description: >
  Simulation skill — takes a character (or set of characters) from icp-character-builder and roleplays them moving through an ad → landing page → checkout. Runs 3 parallel simulations of the SAME character on the SAME asset (5 for high-variance categories) and uses majority-vote analysis to determine if the creative works. Correlation = ship. Divergence = revise. Includes scent match check between ad copy and LP hero, objection-chain trace, and bounce-point identification. Trigger on: "stress test this ad", "simulate the persona", "would [character] click this", "test this landing page", "run the simulation", "does this convert", "persona test", "roleplay the buyer", "what would [character] do", or any creative gating decision where the answer is "we don't know if this lands."
---

# Persona Stress Test
> **Position in pipeline:** AFTER icp-character-builder, RUNS PARALLEL TO creative-interrogator. Creative-interrogator audits the work from the outside (was it built right?). Persona-stress-test audits it from the inside (would the buyer respond?). Both must pass before launch.

---

## ROLE

You are a behavioural simulator. You roleplay a specific named character — built by icp-character-builder — moving through a real marketing asset. You speak in the character's voice, think their thoughts, fire their objections in their declared order, and bounce or convert based on their declared decision style.

You are not the marketer. You are the buyer. The marketer's intent is irrelevant — the question is what the buyer actually does.

You will be run **3 times in parallel** on the same asset (or 5 for high-variance categories) and the results will be majority-voted. This is the statistical layer that turns simulation into evidence.

---

## WHY 3 PARALLEL SIMULATIONS (THE STATISTICAL LOGIC)

A single simulation is one opinion. Three simulations of the same character on the same asset reveal whether the creative is *robust* or *fragile*:

- **3/3 correlate (all convert OR all bounce):** The creative produces a consistent response. The signal is strong. Ship if positive; rebuild if negative.
- **2/3 correlate:** Soft signal. Lean toward majority but flag the divergent case — there's a real cohort that responds differently. Revise the divergent's blocker if it's a meaningful audience slice.
- **1/2/3 fully diverge:** The creative is fragile. It works for some, fails for others, and the path is unclear. Revise the asset.

For high-variance categories (consumer DTC, lifestyle, identity-driven purchases) run 5 simulations. Majority vote remains the rule (3+ = signal). The extra two are variance buffer.

**This is the bare minimum statistical layer that doesn't overburden the pipeline.** It is not a substitute for actual user testing. It IS a substitute for "I think this is good" / "I think this is bad" — and that alone is worth the runtime.

---

## WHEN TO INVOKE

Trigger this skill when:
- A creative asset (ad, landing page, email, funnel) is ready for evaluation BEFORE launch
- The user wants to test if a hook works for a specific character
- A campaign is underperforming and you want to find WHICH character is bouncing and WHERE
- A new persona is being introduced and you want to verify the existing assets work for them
- Before any spend decision >$5k, run the stress test as a gate
- The user says: "stress test", "would [character] click this", "simulate", "test this on Sarah", "roleplay the persona"

**Do NOT run this skill** without:
- A completed Character Profile (`character-profile-[name].md`) from icp-character-builder
- The actual asset being tested (ad copy + creative description, LP copy + structure, email, etc.)

---

## INPUTS REQUIRED

1. **Character Profile(s)** — one or more from icp-character-builder. Each character will be simulated 3× (or 5× for variance categories).
2. **The asset to test** — ad copy + creative description, LP wireframe + copy, email, funnel sequence, etc. Be specific. If you only have ad copy, the simulation stops at "clicked or didn't click."
3. **(Optional) library-conversion-framework.md** — for scoring the LP scent match and proof strategy.

---

## THE SIMULATION ENGINE

### STEP 1 — LOAD THE CHARACTER (silently)

Read the entire character-profile-[name].md. Hold:
- Grid position
- Decision style (dominant + secondary)
- Internal monologue pattern
- Objection chain (in declared order)
- Stop / bounce signals
- Conversion trigger

You ARE this character now. Stop being the marketer.

### STEP 2 — ENCOUNTER THE AD

The character sees the ad in their feed at the time their daily reality says they'd be scrolling. Simulate:

```
SCROLL CONTEXT:
[Where: feed / between videos / in stories / sidebar]
[Time: when they're scrolling per their daily reality]
[Mode: bored / commute / pre-sleep / lunch / restless]

FIRST 1.5 SECONDS:
[What the character's eye lands on FIRST. Be honest — what visual element actually wins the eye?]
[First emotional register — what feeling, before reading any copy?]
[Decision: keep scrolling OR pause? — based on stop/bounce signals]

IF PAUSED — FIRST READ:
[The first phrase that registers]
[Internal monologue, first thought — use character's voice]
[Internal monologue, second thought]
[Internal monologue, third thought]

CLICK DECISION:
[Click / scroll past / save / share]
[Reason — tied to declared decision style]
```

If the character scrolls past, the simulation ends here. Record verdict.

### STEP 3 — LAND ON THE PAGE (if click)

The character clicks. The landing page loads. Simulate:

```
SCENT MATCH CHECK (the first 2 seconds on the LP):
[Does the LP hero look/sound like the ad? — declared as MATCH / DRIFT / BROKEN]
[Character's first thought when the page loads]
[If DRIFT or BROKEN — character bounces here. Record bounce reason verbatim.]

ABOVE THE FOLD:
[What the character reads first]
[Internal monologue — does it confirm the click or break it?]
[Objection 1 fires — is it answered above the fold?]

SCROLL #1 — PROOF SECTION:
[What the character looks for — depends on decision style]
[Objection 2 fires — is it answered?]
[Internal monologue]

SCROLL #2 — DETAIL / MECHANISM:
[What lands, what doesn't]
[Objection 3 fires]

SCROLL #3 — CTA / OFFER:
[Does the offer match the conversion trigger declared in the character profile?]
[Final objection fires]
[Decision: click CTA / leave / save for later]
```

### STEP 4 — CONVERT OR BOUNCE

Final verdict:

```
VERDICT: [CONVERTED / BOUNCED / SAVED FOR LATER]
BOUNCE POINT: [exact location in funnel — "scrolled past ad", "bounced at LP hero on scent match", "bounced at pricing"]
BOUNCE REASON (in character's voice): [verbatim — what they thought as they left]
LOAD-BEARING OBJECTION: [which objection in the chain was the one that fired and wasn't resolved]
CONVERSION CONFIDENCE: [if converted — how strong? would they recommend, refund, churn?]
```

---

## THE 3-AGENT MAJORITY VOTE

This is the statistical layer. **Run STEPS 1–4 THREE TIMES** for the same character on the same asset. Each run is a fresh simulation — do not let prior runs contaminate the next. (In practice: structure as three sequential blocks, each starting from STEP 1, before producing the vote.)

### VOTE TALLY

```
RUN 1 VERDICT: [CONVERTED / BOUNCED / SAVED]
RUN 2 VERDICT: [CONVERTED / BOUNCED / SAVED]
RUN 3 VERDICT: [CONVERTED / BOUNCED / SAVED]

MAJORITY: [3/3 / 2/3 / divergent]
```

### INTERPRETATION RULES

| Result | Interpretation | Action |
|--------|---------------|--------|
| 3/3 CONVERTED | Strong signal: creative converts for this character | Ship. No further test runs needed for this character on this asset. |
| 3/3 BOUNCED | Strong signal: creative does not work for this character | Revise. Identify the cross-run common bounce point and fix it specifically. |
| 2/3 CONVERTED | Soft positive: creative converts most of the time but is fragile | Identify the divergent run's bounce reason. If it's a small audience slice, ship and monitor. If it's a meaningful slice, revise. |
| 2/3 BOUNCED | Soft negative: creative fails most of the time but works under some conditions | Revise. The 1/3 conversion is interesting but not enough to justify spend. |
| All divergent | Creative is fragile — works only in narrow conditions | Revise. Likely fails the 1.5-second test, scent match, or has weak proof. |

### WHEN TO RUN 5 (NOT 3)

Use 5 simulations instead of 3 when:
- The category is high-variance: consumer DTC, fashion, lifestyle, identity-driven purchases
- The character's decision style is "impulsive" (more variance in real life)
- This is a $50k+ campaign budget decision
- A prior 3-run came back as divergent and you want to break the tie

Majority vote remains 3+ of 5. The extra two simulations are variance buffer, not consensus shift.

---

## RUNNING ACROSS MULTIPLE CHARACTERS

A campaign with 5 characters means 5 stress tests × 3 runs each = 15 simulations on the same asset. This sounds heavy but produces a powerful matrix:

```
CHARACTER × ASSET MATRIX

           | Char A | Char B | Char C | Char D | Char E |
Ad v1      | 3/3 ✓ | 2/3 ✓ | 0/3 ✗ | 3/3 ✓ | 1/3 ?  |
Ad v2      | 3/3 ✓ | 3/3 ✓ | 1/3 ?  | 2/3 ✓ | 2/3 ✓ |
Ad v3      | 2/3 ✓ | 3/3 ✓ | 3/3 ✓ | 1/3 ?  | 3/3 ✓ |
```

Reading the matrix:
- **Ad v3 wins overall** — strongest performance across the character base
- **Char C didn't respond to Ad v1** — different message needed for that segment
- **Ad v1 has the weakest reach** — kill or substantially revise

This matrix is the deliverable when the user has multiple characters and multiple assets.

---

## OUTPUT FORMAT — stress-test-report-[asset-name].md

```markdown
# Stress Test Report: [Asset Name]
**Built:** [date] | **Characters tested:** [N] | **Runs per character:** [3 or 5]

## Asset Tested
[Brief description: which ad, LP, email, funnel — with links/copy attached]

## Character Roster
- [Name 1] — Grid: [...], Decision style: [...]
- [Name 2] — Grid: [...], Decision style: [...]
- [...]

## SIMULATION RESULTS

### [Character Name] — Run Set

**RUN 1:**
[Scroll context → hook reaction → LP simulation → verdict in character's voice]

**RUN 2:**
[Same — fresh simulation, no contamination from Run 1]

**RUN 3:**
[Same — fresh simulation]

**MAJORITY: [3/3 / 2/3 / divergent]**
**VERDICT: [CONVERTED / BOUNCED / MIXED]**
**LOAD-BEARING ISSUE: [The single thing the simulation revealed — the bounce point, the load-bearing objection, or the conversion trigger that fired]**

[Repeat for each character]

---

## CHARACTER × ASSET MATRIX

[Table of all character results]

## DIAGNOSTIC SUMMARY

**Strongest performance:** [Asset/character pairs that hit 3/3 convert]
**Weakest performance:** [Asset/character pairs that hit 3/3 bounce — these need fixing]
**Fragile (divergent results):** [Asset/character pairs with no majority — flag for revision]

## RECOMMENDED ACTIONS

1. [Specific fix — tied to a load-bearing objection or scent match failure]
2. [Specific fix]
3. [Specific fix]

## OPEN QUESTIONS FOR FOLLOW-UP

[Anything the simulation revealed that needs further investigation — e.g., a character segment we didn't have a profile for]
```

---

## PROCESS RULES

1. **Run 3 simulations minimum, 5 for high-variance.** Single runs are opinion, not evidence.

2. **Each run must start fresh.** Do not let Run 1's reasoning bias Run 2. Reload the character. Re-encounter the asset.

3. **Speak in the character's voice.** Not "the persona would think X" — "I'm scrolling and I see this and I think 'oh god not another one of these'." First person. Roleplay.

4. **Honour the declared grid position.** A Solution-Aware × Stage 3 character does NOT respond to a Most-Aware × Stage 1 ad like they would to one written for them. Mismatch is a real bounce signal, not a creative failure to fix with better copy.

5. **Use the objection chain in declared order.** Objection 2 does not fire until Objection 1 is resolved. The point at which the chain breaks IS the bounce point.

6. **Cite RESEARCH LOCK language when the character is "speaking."** If the character profile includes verbatim anchors, use them in the internal monologue — that's the whole point of capturing them.

7. **The verdict is the verdict.** Do not soften it. If 3/3 bounced, the creative does not work. The marketer's affection for the asset is irrelevant.

8. **Pair with creative-interrogator, do not replace it.** Interrogator audits craft from the outside. Stress-test audits response from the inside. They check different things.

9. **Modular by design.** A project with 3 personas and one campaign needs 9 simulations. A project with 20 personas and 5 assets needs 300. The skill scales — but the user decides the depth based on stakes.

10. **Save as `stress-test-report-[asset-name]-[date].md`** using present_files.

---

## DOWNSTREAM SKILL INTEGRATION

Outputs from this skill feed:
- **creative-interrogator** — uses the bounce points and load-bearing objections as inputs to the audit
- **hook-creative-generator** (on revise loop) — uses the verbatim bounce reasons to rewrite hooks
- **library-conversion-framework** — uses the scent match outcomes to score LP structure
- **paid-ads-expert** — uses the character × asset matrix to decide audience routing and budget allocation

---

> **First principle:** A stress test that doesn't get a clean verdict is information. A stress test with 3/3 convergence is evidence. The point of the 3-agent vote is to separate the two cheaply and unambiguously — so spend decisions are made on signal, not affection for the work.

## OUTPUT CONTRACT

The phase-doc orchestrator captures this skill's output into the phase doc's `section:gate-verdicts` (Phase 5) — specifically the per-character-per-asset stress test verdict.

**Target section:** `section:gate-verdicts` (per-asset stress-test sub-rows)
**No standalone file** (verdicts live inside the phase doc)
**Format:** markdown table rows or per-asset sub-sections
**Confidence required:** HIGH (KILL is irreversible)

**Required fields per asset × character:**
- Asset name
- Character name (from `character-profile-{name}.md`)
- 3 verdicts (3-parallel simulation, majority vote)
- Verdict aggregation: 3/3 same → that verdict. 2/3 same + 1 different → majority + flag dissent. 3/3 different → KILL.
- Divergence point (where the character's predicted behavior diverged from the asset's intent)

**Hard rules:**
- Write ONLY verdicts into `section:gate-verdicts`. Do NOT modify the audited assets.
- 3-parallel simulation is MANDATORY. One agent's verdict is not a verdict.
- The character is INHERITED from `icp-character-builder` (Awareness × Sophistication grid + decision style + objection chain). Do NOT re-derive.
- Use the character's verbatim internal monologue (from `character-profile-{name}.md`) to evaluate the asset. The character's voice is the source of truth.
- KILL is a hard block. Dissent is a yellow flag (operator reviews).
- Build each character at least 3 times with different anchor details (different city, last-3-purchases, physical environment) for variance. The persona is the same; the character is a sampled instance.
- Append Decision Log: `stress test = [asset × character] = [aggregated verdict] | persona-stress-test | [one-line] | majority + dissent flag`.

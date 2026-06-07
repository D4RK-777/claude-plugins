---
name: phase-doc-implementation
description: "Emits the Phase 5 Implementation phase doc — the launch-ready package. Triggers on '# Run Phase 5 — Implementation for project {slug}'. Consumes approved {brand_slug}/{project_slug}/4-creation.md. Runs the Triple Gate (creative-interrogator + persona-stress-test + funnel-audit), forecaster, audience-architect, paid-ads-expert deployment specs, retargeting-cascade, and compiles the GTM execution document. Output: {brand_slug}/{project_slug}/5-implementation.md plus companion go-to-market-{slug}.html."
---

# Phase Doc Emitter — Phase 5: Implementation

## When to fire

Trigger: `# Run Phase 5 — Implementation for project {slug}`

## Pre-conditions

- `{brand_slug}/{project_slug}/4-creation.md` `status: approved`

## Inputs

- `4-creation.md` (all creative assets to be gated)
- `5-implementation` consumers: campaign-forecaster, audience-architect, paid-ads-expert, retargeting-cascade, gtm-document-builder
- `intake.json` (channels in scope, budget, KPI, hard NOs)
- **Brand libraries** from `{marketing_root}/{brand_slug}/_libraries/` — `voice.md` (gated assets must match voice), `hard-nos.md` (any hard-NO violation = automatic RED), `channel-specs` (via library), `industry-benchmarks` (via library, for forecast context)

## What you do (in order)

1. **Triple Gate** — for every creative asset from Phase 4:
   - `creative-interrogator` (all 7 phases incl. channel-fit)
   - `persona-stress-test` (3-parallel simulation per character × asset — produces 3 verdicts that need aggregation per the rule below)
   - `funnel-audit` (cross-asset handoff coherence)
   - **Aggregate verdicts per the Triple Gate rule** (see below)
2. `campaign-forecaster` — produce Best / Likely / Worst forecasts with scale/watch/kill rules
3. `audience-architect` — produce targeting + budget structure per channel
4. `paid-ads-expert` — deployment specs (tracking, EMQ, attribution, learning phase strategy)
5. `retargeting-cascade` — 5-stage warm-funnel definition (if scope includes paid)
6. `gtm-document-builder` — render companion `go-to-market-{slug}.html` (executable doc with copy-to-clipboard, character counts, monospace prompts, sticky ICP)
7. Emit `{brand_slug}/{project_slug}/5-implementation.md`

## Required sections

- `section:gate-verdicts` — per-asset GREEN/AMBER/RED/KILL with one-line reason
- `section:gate-aggregation` — per-asset aggregation trace: 3 verdicts + which rule was applied + any dissent flag

## Triple Gate aggregation rule (binding)

After the 3 gate skills each emit their verdict for an asset, the FINAL verdict for that asset is determined by the rule below. This is **not** "majority vote" — there is no majority if 3/3 differ. The rule is explicit and binding.

**For each asset:**

| Interrogator | Stress Test (3 votes) | Funnel Audit | FINAL VERDICT |
|---|---|---|---|
| GREEN | All 3 GREEN | GREEN | **GREEN** |
| GREEN | 2/3 GREEN + 1 dissent | GREEN | **GREEN** (with dissent note in Open Questions) |
| GREEN | 2/3 GREEN + 1 dissent | AMBER | **AMBER** (dissenter wins, but dissent note still logged) |
| GREEN | 2/3 GREEN + 1 dissent | RED | **RED** (funnel-audit blocks) |
| AMBER | All 3 AMBER | GREEN | **AMBER** |
| AMBER | 2/3 AMBER + 1 dissent | GREEN | **AMBER** (dissent note) |
| RED | All 3 RED | any | **RED** |
| RED | All 3 RED | GREEN | **RED** (interrogator RED blocks) |
| Any | 3/3 DIFFERENT verdicts | any | **KILL** (no consensus — cannot ship) |
| Any | KILL from any vote | any | **KILL** |
| AMBER | GREEN/AMBER mix | GREEN | **AMBER** (lowest wins) |
| RED | GREEN | GREEN | **AMBER** (interrogator is the floor) |
| AMBER | RED | RED | **RED** (lowest wins) |

**Rule priority (highest first):**
1. **Any KILL → KILL** (overrides everything; the asset cannot be approved)
2. **3/3 different stress-test verdicts → KILL** (no consensus)
3. **Lowest gate verdict wins** (interrogator+stress+audit — worst case is the verdict, conservative shipping)
4. **Dissents are LOGGED but don't override** (2/3 + 1 dissent = majority verdict, with the dissent surfaced in Open Questions for operator review)

**For the persona-stress-test in particular:**
- 3 votes means 3 separate simulation runs (different anchor details per `icp-character-builder`'s variance rule)
- The 3 votes are aggregated per the table above (3/3 same → that verdict; 2/3 + 1 dissent → majority, with dissent flagged; 3/3 different → KILL)
- If the character has only 1 named instance (e.g. small campaign), 3 votes means 3 runs of the same character with different reasoning emphasis

## Update campaign-state (mandatory final step)

At the end of every phase-doc emission, call `campaign-state` to update the registry + decision log. This is **mandatory** — not optional, not a SHOULD. The dashboard, the state file, and any operator reading the campaign state depends on it.

At the end of every phase-doc emission, call `campaign-state` to update the registry + decision log. This is **mandatory** — not optional, not a SHOULD. The dashboard, the state file, and any operator reading the campaign state depends on it.

Call `campaign-state` with:
- **The new phase doc** (`5-implementation.md`) — for the artifact registry
- **The strategic decisions made this phase:**
  - `gate_verdicts = [{asset_id, interrogator, stress, audit, aggregated, dissent}]` (per-asset gate aggregation results, including any KILL verdicts)
  - `kill_count` (how many assets were KILLED)
  - `dissents_logged` (any 2/3 + 1 dissent cases for operator review)
  - `campaign_health` (final aggregated health: GREEN / AMBER / RED)
  - `launch_ready` (boolean: GREEN+0 KILL = ready; anything else = blocked)
- **A health assessment** for the phase:
  - `GREEN` if 0 KILL verdicts + 0 dissents + all assets aggregated to SHIP
  - `AMBER` if some dissents OR some KILLs (with replacement plan) OR borderline assets
  - `RED` if multiple KILLs without replacement OR 3/3 different verdicts OR campaign-level fail

`campaign-state` then:
- Updates `## ARTIFACT REGISTRY` with the new Block 5 entry
- Adds a row to `## DECISION LOG`: `phase 5 implementation = [N assets gated + M KILLED + campaign health = X] | phase-doc-implementation | [one-line] | gate aggregation summary + Triple Gate verdicts per asset + launch readiness`
- Computes `## HEALTH SUMMARY.gate_integrity` from KILL count + dissent count + launch readiness
- Adds a row to `## CHANGE LOG`
- Updates `Current phase: 5 (Implementation complete, awaiting approval)`

## Seeds for Phase 6 (Reporting)

**Per-asset output format for `section:gate-verdicts`:**

```
| Asset | Interrogator | Stress Test (3 votes) | Funnel Audit | Final | Reason |
|-------|--------------|----------------------|--------------|-------|--------|
| Hook #1 (Meta Feed) | GREEN | 2 GREEN, 1 AMBER (dissenter) | GREEN | GREEN | Score 38/50, persona opens at scroll-depth 80% |
| LP Hero | RED (cliché test) | All 3 RED | AMBER | RED | Cliché: "Welcome to the future" — replace |
| Email #2 | AMBER | All 3 AMBER | GREEN | AMBER | Subject too long (>60 chars) |
| Ad Image #3 | AMBER | 3/3 DIFFERENT | AMBER | KILL | Stress test no consensus — re-run Phase 4 for this asset |
```

**Hard rules:**
- KILL assets CANNOT be approved. Operator must re-run Phase 4 for that asset (or all of it — see v1.7.0 roadmap for partial-regen).
- 3/3-different KILL is non-overridable. The asset must be regenerated.
- AMBER assets ship but with a flagged risk. Operator can override with explicit note.
- RED assets require an explicit operator override note in Open Questions, OR are blocked.
- GREEN assets ship. Dissent notes are informational, not blocking.
- `section:forecast` — Best / Likely / Worst columns + scale/watch/kill thresholds
- `section:audience-architecture` — tiered cold/warm cards, exclusions, budget split
- `section:deployment-specs` — pixel/CAPI/EMQ requirements, attribution window, learning phase guard
- `section:retargeting-cascade` — 5 stages (if applicable)
- `section:gtm-document` — link to the companion HTML doc + summary

## Open questions

- Any RED asset that operator wants to ship anyway: requires explicit override note
- Any KILL asset: blocked from shipping (cannot be overridden — must regenerate in Phase 4)
- Forecaster confidence below MEDIUM: ask operator to expand budget or narrow audience
- Tracking gaps (pixel not set up, CAPI missing): surface as launch blockers

## Seeds for Phase 6 (Reporting)

- `forecast.best_likely_worst` → Phase 6 weekly comparison
- `gate_verdicts` → Phase 6 weekly creative refresh decisions
- `audience_definitions` → Phase 6 audience health checks
- `tracking_setup` → Phase 6 data quality baseline

## TL;DR template

- What we found: {N_assets} assets gated — {green_count} GREEN, {amber_count} AMBER, {red_count} RED, {kill_count} KILL.
- What it means: Forecast Likely is {likely_cpl} CPL / {likely_volume} on {budget}.
- What's next: Ship — companion GTM doc at {gtm_path}. Then Phase 6 Reporting.

## Frontmatter (canonical v1.5.0 template)

```yaml
phase: 5
block_id: implementation
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
project_display_name: {project_display_name}
status: awaiting_review
confidence_overall: HIGH | MEDIUM | LOW
human_attention_required: true if any KILL assets, RED without override, or tracking gaps
schema_version: 1
upstream_phases_consumed: [1-setup, 2-research, 3-ideation, 4-creation]
brand_libraries_loaded:
  - voice.md
  - hard-nos.md
  - audiences.md
sources_consumed:
  materials_count: {N_materials_from_intake}
  urls_fetched: []
  inherited_from: {campaign_slug_or_null}
created_at: {ISO 8601 timestamp}
last_updated: {ISO 8601 timestamp}
approved_at: null
approved_by: null
```

## Pre-emit validation (run ALL before writing the file)

**Common checks (every phase):** see `phase-doc-setup` for the full list. Summary: frontmatter complete, status awaiting_review, approved fields null, at least one section, every section has Title/Confidence/Source/Why/Content, OQ + Seeds sections exist, correct file path.

**Phase 5 specific:**
9. ✅ All required sections present: `gate-verdicts` + `forecast` + `audience-architecture` + `deployment-specs` + `gtm-document` (5 always) + `retargeting-cascade` (only if `paid` in `campaign_channels`). That's 5 always + 1 conditional.
10. ✅ Every creative asset from Phase 4 has a verdict in `section:gate-verdicts` (GREEN / AMBER / RED / KILL). No asset is left un-gated.
11. ✅ KILL assets are documented as **blocked from approval** — Phase 5 cannot be approved while any KILL remains. The asset name, the interrogator's specific violation, and what the operator must do (re-run Phase 4 for that asset) are all spelled out in Open Questions.
12. ✅ RED assets either have an explicit operator override note in Open Questions, OR are blocked. They cannot be silently approved.
13. ✅ `section:forecast` has Best / Likely / Worst columns with specific numbers, not handwaves. Confidence is set from sample-size and benchmark-fidelity, not vibes.
14. ✅ `section:deployment-specs` covers pixel / CAPI / EMQ / attribution window / learning-phase guard. Any tracking gap is a launch blocker surfaced in Open Questions.
15. ✅ Companion `go-to-market-{slug}.html` was written alongside the phase doc. The path is captured in the phase doc's "What's next" line.
16. ✅ **Triple Gate aggregation rule was applied** — `section:gate-verdicts` shows per-asset verdicts with all 3 gate results (interrogator + stress-test votes + funnel-audit) and the final verdict derived per the binding rule (not "majority vote"). Any 3/3-different or any KILL → final KILL. Any 2/3 + 1 dissent → majority verdict with dissent flagged in Open Questions. The rule is **not** "majority vote" — it's the explicit table in `## Triple Gate aggregation rule`.

## Hard rules

1. KILL assets cannot be approved. Operator must re-run Phase 4 for that asset.
2. RED assets require explicit operator override note with reasoning.
3. The companion GTM doc is generated as `go-to-market-{slug}.html` in the project's GTM folder — it is the operator's paste-ready execution doc.
4. End with: `✓ Phase 5 doc ready: {path}. GTM doc: {gtm_path}.`

## Wraps

- `creative-interrogator-SKILL.md`
- `persona-stress-test-SKILL.md`
- `funnel-audit-SKILL.md`
- `campaign-forecaster-SKILL.md`
- `audience-architect-SKILL.md`
- `paid-ads-expert-SKILL.md`
- `retargeting-cascade-SKILL.md`
- `gtm-document-builder-SKILL.md`

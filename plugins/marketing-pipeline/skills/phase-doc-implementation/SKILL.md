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
   - `persona-stress-test` (3-parallel simulation per character × asset, majority vote)
   - `funnel-audit` (cross-asset handoff coherence)
   - Aggregate verdicts: GREEN / AMBER / RED / KILL per asset
2. `campaign-forecaster` — produce Best / Likely / Worst forecasts with scale/watch/kill rules
3. `audience-architect` — produce targeting + budget structure per channel
4. `paid-ads-expert` — deployment specs (tracking, EMQ, attribution, learning phase strategy)
5. `retargeting-cascade` — 5-stage warm-funnel definition (if scope includes paid)
6. `gtm-document-builder` — render companion `go-to-market-{slug}.html` (executable doc with copy-to-clipboard, character counts, monospace prompts, sticky ICP)
7. Emit `{brand_slug}/{project_slug}/5-implementation.md`

## Required sections

- `section:gate-verdicts` — per-asset GREEN/AMBER/RED/KILL with one-line reason
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

## Frontmatter

```yaml
phase: 5
block_id: implementation
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
status: awaiting_review
upstream_phases_consumed: [1-setup, 2-research, 3-ideation, 4-creation]
schema_version: 1
```

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

---
name: phase-doc-reporting
description: "Emits the Phase 6 Reporting phase doc — the live performance state. Triggers on '# Run Phase 6 — Reporting for project {slug}' AND on a weekly cadence after launch. Continuously updated; status stays awaiting_review with each refresh until campaign ends. Consumes raw data exports (Meta, Google, LinkedIn, TikTok, GA4, CRM) + the approved forecast from Phase 5. Output: {brand_slug}/{project_slug}/6-reporting.md (rolling)."
---

# Phase Doc Emitter — Phase 6: Reporting

## When to fire

- Trigger: `# Run Phase 6 — Reporting for project {slug}` (manual)
- Trigger: weekly scheduled task (every Monday) once campaign is live
- Trigger: data export uploaded → re-emit

## Pre-conditions

- `{brand_slug}/{project_slug}/5-implementation.md` `status: approved`
- Live data exports available in the project's data folder

## Inputs

- `{brand_slug}/{project_slug}/5-implementation.md` for forecast baseline + gate verdicts
- Raw exports (Meta, Google, LinkedIn, TikTok, Supermetrics, GA4, CRM) — auto-detected from the project's data folder
- Previous `6-reporting.md` (preserve weekly history)

## What you do (in order)

1. Update `campaign-state-{slug}.md` Decision Log with any new operator decisions
2. Compare actuals vs forecast (Best / Likely / Worst) per the rules
3. Run `campaign-reporter` — verdicts + narrative
4. Surface scale / watch / kill triggers from forecast
5. Emit `{brand_slug}/{project_slug}/6-reporting.md` (append week N row to a rolling table)

## Required sections

- `section:weekly-snapshot` — current week's KPIs vs forecast
- `section:rolling-history` — table: week-by-week KPIs
- `section:scale-watch-kill` — which audiences/creatives trigger which action this week
- `section:decision-log-delta` — new entries added to Decision Log this period
- `section:next-actions` — operator's prioritized checklist for the week ahead

## Open questions

- Any KPI off-forecast by >30%: surface for operator decision (scale / cut / hold)
- Any creative hitting fatigue thresholds: ask "refresh from Phase 4 library or build new?"
- Any audience exhaustion: ask "expand or pivot?"

## Seeds for Phase 7 (Learning)

- `weekly_kpis[]` → Phase 7 cohort + attribution analysis
- `creative_fatigue_signals` → Phase 7 creative-fatigue curve fit
- `audience_saturation` → Phase 7 audience CPL distribution
- `decision_log_entries` → Phase 7 character validation (did our predicted character behavior hold?)

## TL;DR template

- What we found: Week {N}: CPL {actual} vs forecast Likely {likely} ({pct_off}% off).
- What it means: {scale|watch|kill}-trigger fired on {asset/audience}.
- What's next: {one specific action for the week}.

## Frontmatter

```yaml
phase: 6
block_id: reporting
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
status: awaiting_review   # stays awaiting_review while campaign is live
upstream_phases_consumed: [5-implementation]
schema_version: 1
```

## Hard rules

1. This phase is ROLLING. Each weekly run appends to history, doesn't overwrite.
2. Status never moves to approved while campaign is live. Operator approves each weekly snapshot as a checkpoint, not the phase as "done."
3. End with: `✓ Phase 6 week {N} ready: {path}.`

## Wraps

- `campaign-state-SKILL.md` (continuous)
- `campaign-reporter-SKILL.md`
- `campaign-forecaster-SKILL.md` (re-runs weekly with new actuals)

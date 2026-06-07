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
2. Re-read `{brand_slug}/_libraries/voice.md`, `hard-nos.md`, `audiences.md` (brand libraries are auto-loaded every phase)
3. Compare actuals vs forecast (Best / Likely / Worst) per the rules
4. Run `campaign-reporter` — verdicts + narrative
5. **Run `retention-engine`** — weekly retention pulse on converted customers (activation rate, cohort retention curve, churn signal, LTV-vs-CAC trend). Writes the retention pulse into the same phase doc as a separate section. Closes the LTV side of the acquisition × LTV equation so acquisition is judged on LTV, not just CPL.
6. Surface scale / watch / kill triggers from forecast
7. Emit `{brand_slug}/{project_slug}/6-reporting.md` (append week N row to a rolling table)

## Required sections

- `section:weekly-snapshot` — current week's KPIs vs forecast
- `section:rolling-history` — table: week-by-week KPIs
- `section:scale-watch-kill` — which audiences/creatives trigger which action this week
- `section:retention-pulse` — weekly retention metrics: activation rate, cohort retention curve, churn signals, LTV-vs-CAC trend. From `retention-engine`.
- `section:decision-log-delta` — new entries added to Decision Log this period
- `section:next-actions` — operator's prioritized checklist for the week ahead

## Open questions

- Any KPI off-forecast by >30%: surface for operator decision (scale / cut / hold)
- Any creative hitting fatigue thresholds: ask "refresh from Phase 4 library or build new?"
- Any audience exhaustion: ask "expand or pivot?"

## Update campaign-state (mandatory final step)

At the end of every phase-doc emission, call `campaign-state` to update the registry + decision log. This is **mandatory** — not optional, not a SHOULD. The dashboard, the state file, and any operator reading the campaign state depends on it.

Call `campaign-state` with:
- **The new phase doc** (`6-reporting.md`) — for the artifact registry
- **The strategic decisions made this phase:**
  - `kpi_dashboard = [{kpi, target, actual, delta_pct, status}]` (per-KPI actual vs forecast)
  - `creative_fatigue_curves` (when each creative peaked + decayed)
  - `audience_signals` (early indicators from live data — segment performance, frequency saturation)
  - `spend_pacing` (daily/weekly spend actual vs planned)
  - `campaign_health_current` (rolling health: GREEN / AMBER / RED based on KPI deltas)
  - `scale_watch_kill_signals` (any creative hit fatigue threshold, any audience exhausted)
- **A health assessment** for the phase:
  - `GREEN` if all KPIs within ±10% of forecast + no fatigue signals
  - `AMBER` if some KPIs ±10-30% OR early fatigue signals
  - `RED` if any KPI off-forecast >30% OR creative hit kill threshold OR audience exhausted

`campaign-state` then:
- Updates `## ARTIFACT REGISTRY` with the new Block 6 entry
- Adds a row to `## DECISION LOG`: `phase 6 reporting = [week N complete + KPIs vs forecast] | phase-doc-reporting | [one-line] | KPI dashboard snapshot + creative fatigue state + scale/watch/kill actions taken`
- Computes `## HEALTH SUMMARY.campaign_performance` from KPI deltas + fatigue state
- Adds a row to `## CHANGE LOG`
- Updates `Current phase: 6 (Reporting week N, ongoing)`

## Seeds for Phase 7 (Learning)

These are what Phase 6 produces in 6-reporting.md (sections + frontmatter), and what Phase 7 reads + analyzes.

Always include in the Seeds section:
- `weekly_kpis[]` (from 6-reporting.md `section:weekly-snapshot` + `section:rolling-history`) → Phase 7 cohort + attribution analysis
- `retention_metrics[]` (from 6-reporting.md `section:retention-pulse`: activation rate, cohort retention curve, churn signals, LTV-vs-CAC trend) → Phase 7 character validation + LTV trend analysis
- **creative fatigue signals** (from 6-reporting.md `section:scale-watch-kill` — where any creative flagged for fatigue is documented) → Phase 7 creative-fatigue curve fit. The signal lives INSIDE `section:scale-watch-kill`, not as a separate field.
- **audience saturation** (from 6-reporting.md `section:scale-watch-kill` — where any audience exhaustion is documented) → Phase 7 audience CPL distribution. Same — the data lives INSIDE `section:scale-watch-kill`, not as a separate field.
- `decision_log_entries` (from 6-reporting.md `section:decision-log-delta`) → Phase 7 character validation (did our predicted character behavior hold?)

## TL;DR template

- What we found: Week {N}: CPL {actual} vs forecast Likely {likely} ({pct_off}% off). Activation {activation_rate}%. Cohort M1 retention {m1_retention}%.
- What it means: {scale|watch|kill}-trigger fired on {asset/audience}. LTV/CAC trending {up|down|flat}.
- What's next: {one specific action for the week}.

## Frontmatter (canonical v1.5.0 template)

```yaml
phase: 6
block_id: reporting
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
project_display_name: {project_display_name}
status: awaiting_review   # stays awaiting_review while campaign is live
confidence_overall: HIGH | MEDIUM | LOW
human_attention_required: true if any KPI off-forecast >30% or audience exhaustion
schema_version: 1
upstream_phases_consumed: [5-implementation]
brand_libraries_loaded:
  - voice.md
  - hard-nos.md
  - audiences.md
sources_consumed:
  materials_count: 0
  urls_fetched: []
  inherited_from: {campaign_slug_or_null}
created_at: {ISO 8601 timestamp}   # first week of reporting
last_updated: {ISO 8601 timestamp} # updated each weekly run
approved_at: null
approved_by: null
```

## Pre-emit validation (run ALL before writing the file)

**Common checks (every phase):** see `phase-doc-setup` for the full list. Summary: frontmatter complete, status awaiting_review, approved fields null, at least one section, every section has Title/Confidence/Source/Why/Content, OQ + Seeds sections exist, correct file path.

**Phase 6 specific:**
9. ✅ All 6 required sections present: `weekly-snapshot`, `rolling-history`, `scale-watch-kill`, `retention-pulse`, `decision-log-delta`, `next-actions`.
10. ✅ `section:retention-pulse` is NEVER skipped — even in week 1 with zero conversions, log `0 activated, 0 churn` as the baseline. The time series matters for Phase 7's analysis.
11. ✅ `section:rolling-history` is APPEND-ONLY — never delete prior weeks. The first emission creates a new week-N row, subsequent emissions add week N+1, N+2, etc.
12. ✅ `section:scale-watch-kill` cites the specific forecast thresholds from Phase 5 that triggered each action. Don't trigger an action without showing the math.
13. ✅ `status: awaiting_review` is preserved across weekly runs. This phase never moves to `approved` while the campaign is live.

## Hard rules

1. This phase is ROLLING. Each weekly run appends to history, doesn't overwrite.
2. Status never moves to approved while campaign is live. Operator approves each weekly snapshot as a checkpoint, not the phase as "done."
3. Retention pulse is mandatory. Skipping it (because the campaign "isn't long enough yet") is a real failure mode — even in week 1, log zero customers activated and zero churn as the baseline. Phase 7 needs the time series.
4. End with: `✓ Phase 6 week {N} ready: {path}.`

## Wraps

- `campaign-state-SKILL.md` (continuous)
- `campaign-reporter-SKILL.md`
- `campaign-forecaster-SKILL.md` (re-runs weekly with new actuals)
- `retention-engine-SKILL.md` (weekly retention pulse — closes the LTV side of the equation)

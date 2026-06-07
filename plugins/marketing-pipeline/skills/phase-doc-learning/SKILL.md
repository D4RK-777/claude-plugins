---
name: phase-doc-learning
description: "Emits the Phase 7 Learning phase doc — deep analysis after campaign end (or at mid-campaign checkpoint). Triggers on '# Run Phase 7 — Learning for project {slug}'. Consumes Phase 6 rolling reporting + raw data. Cohort analysis, attribution decomposition, audience CPL distribution, creative fatigue, character validation (did predicted behavior match actuals?). Output: {brand_slug}/{project_slug}/7-learning.md."
---

# Phase Doc Emitter — Phase 7: Learning

## When to fire

- Trigger: `# Run Phase 7 — Learning for project {slug}` (operator-initiated at campaign end OR mid-campaign checkpoint)

## Pre-conditions

- `{brand_slug}/{project_slug}/6-reporting.md` has at least 4 weeks of data OR campaign is over
- Raw data exports available

## Inputs

- `6-reporting.md` (rolling weekly, including retention-pulse section)
- `5-implementation.md` (forecast + gate verdicts)
- `campaign-persona.md` + `character-profile.md` from Phase 3 (for character validation)
- **Brand libraries** from `{marketing_root}/{brand_slug}/_libraries/` — `audiences.md` is the source of truth for which audience segments were actually used (vs. hypothesised). Cross-check Phase 1's audience architecture against actuals.

## What you do (in order)

1. Run `data-analyst` semantics:
   - Cohort analysis (by audience tier, by creative, by week)
   - Attribution decomposition (which touchpoints drove conversions)
   - Audience CPL distribution + creative fatigue curves
   - LP friction quantification
   - Statistical significance for any A/B claims
2. Run **character validation** — did the persona/character profile's predicted behavior match actual? Compare:
   - Predicted scroll-stop signals vs actual click-through patterns
   - Predicted objections vs actual abandonment points
   - Predicted decision style vs actual decision velocity
3. Surface campaign-level insights with statistical confidence
4. Output: structured insights JSON (for Phase 8 to consume) + the phase doc

## Required sections

- `section:cohort-analysis` — performance by audience + creative + time
- `section:attribution-decomposition` — actual conversion paths
- `section:audience-cpl-distribution` — which audiences performed; depth vs breadth
- `section:creative-fatigue-curves` — when each creative peaked + decayed
- `section:character-validation` — predicted vs actual behavior, with deltas
- `section:lp-friction` — where users dropped on the LP (if data available)
- `section:campaign-verdict` — overall win/break-even/loss with reasoning

## Open questions

- Any insight with statistical significance below threshold: ask if operator wants to act on it anyway (with caveat)
- Any character profile delta >30%: ask "update the character or write off as campaign-specific?"
- Any audience finding contradicts Phase 1's customer truth: surface the conflict

## Seeds for Phase 8 (Updating)

- `library_update_proposals[]` → Phase 8 feedback-loop-back as candidate library changes
- `character_refinements[]` → Phase 8 character profile updates
- `chatinc_specific_benchmarks` → Phase 8 library-industry-benchmarks override candidates
- `watch_list_entries[]` → Phase 8 library-watch-list (low-confidence findings to confirm next campaign)

## TL;DR template

- What we found: Campaign result {WIN|BREAK_EVEN|LOSS} with {final_kpi} vs target {target_kpi}.
- What it means: Character profile was {accurate|off by X%}; top-driver audience was {audience}.
- What's next: Run Phase 8 Updating — {N} library updates proposed for review.

## Frontmatter (canonical v1.5.0 template)

```yaml
phase: 7
block_id: learning
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
project_display_name: {project_display_name}
status: awaiting_review
confidence_overall: HIGH | MEDIUM | LOW
human_attention_required: true if any insight below statistical threshold or major character delta
schema_version: 1
upstream_phases_consumed: [5-implementation, 6-reporting]
brand_libraries_loaded:
  - voice.md
  - hard-nos.md
  - audiences.md
sources_consumed:
  materials_count: 0
  urls_fetched: []
  inherited_from: {campaign_slug_or_null}
created_at: {ISO 8601 timestamp}
last_updated: {ISO 8601 timestamp}
approved_at: null
approved_by: null
```

## Pre-emit validation (run ALL before writing the file)

**Common checks (every phase):** see `phase-doc-setup` for the full list. Summary: frontmatter complete, status awaiting_review, approved fields null, at least one section, every section has Title/Confidence/Source/Why/Content, OQ + Seeds sections exist, correct file path.

**Phase 7 specific:**
9. ✅ All 7 required sections present: `cohort-analysis`, `attribution-decomposition`, `audience-cpl-distribution`, `creative-fatigue-curves`, `character-validation`, `lp-friction`, `campaign-verdict`.
10. ✅ `learning-insights.json` was written to `{project_root}/learning-insights.json` AND validates against the schema below.
11. ✅ Every statistical claim includes `sample_size: N` + `confidence: 0.X` in the insights JSON. No false precision.
12. ✅ `section:character-validation` has at least one delta (predicted vs actual) for the primary character — even if the delta is "no significant divergence," surface that explicitly.
13. ✅ `section:campaign-verdict` is one of WIN / BREAK_EVEN / LOSS with specific reasoning tied to the original KPI target.

## `learning-insights.json` schema (read by Phase 8)

```json
{
  "campaign_slug": "{slug}",
  "brand_slug": "{brand_slug}",
  "generated_at": "{ISO 8601}",
  "insights": [
    {
      "id": "INS-001",
      "library_target": "library-conversion-framework.md",
      "section_anchor": "Part 4 - Friction patterns",
      "current_value": "Current state of the library entry (or null if new)",
      "proposed_value": "What it should be after this insight",
      "evidence_campaign": "{this campaign slug}",
      "confidence": "HIGH | MEDIUM | LOW",
      "rationale": "Why this change is being proposed",
      "linked_phase_section": "section:lp-friction",
      "sample_size": 1234,
      "statistical_confidence": 0.95
    }
  ],
  "character_refinements": [
    {
      "character_name": "Sarah",
      "current_profile_path": "{path to character-profile-sarah.md}",
      "predicted_vs_actual": "summary of the gap",
      "proposed_update": "what should change in the profile",
      "confidence": "MEDIUM"
    }
  ],
  "watch_list_entries": [
    {
      "id": "WL-001",
      "claim": "the low-confidence finding",
      "supporting_evidence": "what data supported it",
      "next_campaign_action": "what to check next time",
      "campaigns_observed": ["{this-campaign}"]
    }
  ],
  "library_watch_list_path": "{marketing_root}/{brand_slug}/_libraries/library-watch-list.md"
}
```

This is the contract Phase 8 reads. Don't write a different shape.

## Hard rules

1. Statistical claims must include sample size + confidence level. No false precision.
2. Character validation is mandatory — even if hard to quantify, surface qualitative deltas.
3. Don't propose library updates here — that's Phase 8. Here you surface CANDIDATES with rationale.
4. End with: `✓ Phase 7 doc ready: {path}. Insights JSON: {json_path}.`

## Wraps

- `data-analyst-SKILL.md`

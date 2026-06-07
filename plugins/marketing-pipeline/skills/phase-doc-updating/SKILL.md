---
name: phase-doc-updating
description: "Emits the Phase 8 Updating phase doc — closes the loop. Triggers on '# Run Phase 8 — Updating for project {slug}'. Consumes Phase 7 insights JSON + campaign-reporter post-mortem. Proposes library updates + character refinements with explicit operator approval gates. Each proposal is a tickbox the operator approves or rejects. Approved changes get written to the libraries with footnote citing source campaign. Output: {brand_slug}/{project_slug}/8-updating.md."
---

# Phase Doc Emitter — Phase 8: Updating

## When to fire

- Trigger: `# Run Phase 8 — Updating for project {slug}`

## Pre-conditions

- `{brand_slug}/{project_slug}/7-learning.md` `status: approved`
- `{brand_slug}/{project_slug}/learning-insights.json` exists

## Inputs

- `7-learning.md` + `learning-insights.json`
- **Brand libraries** from `{marketing_root}/{brand_slug}/_libraries/` — these are the files Phase 8 proposes updates TO. Read them first so the proposals cite current state accurately.

## What you do (in order)

1. Run `feedback-loop-back` semantics:
   - Read insights JSON
   - Match each insight to its corresponding library (industry-benchmarks, campaign-themes, creative-strategies, channel-specs, conversion-framework, art-direction, character profiles)
   - For each matched insight, propose a library edit with: what changes, why, evidence
2. For low-confidence findings: stage them on `library-watch-list.md` for next-campaign confirmation
3. Surface each proposal in the phase doc as a tick-box for operator approval
4. ONLY apply approved proposals — never auto-update libraries
5. For each applied change: write a footnote in the library file (`<!-- Updated YYYY-MM-DD via feedback-loop-back from {slug} — reason: {short} -->`)

## Required sections

- `section:proposed-library-updates` — table of proposals with tick-boxes:
  - Library file
  - Section / row affected
  - Current value
  - Proposed value
  - Evidence (linked to Phase 7 insight)
  - [ ] Approve  [ ] Reject  [ ] Defer to watch list
- `section:character-refinements` — proposed updates to character profiles
- `section:benchmark-updates` — proposed ChatInc-specific benchmark overrides replacing generic library values
- `section:watch-list-additions` — low-confidence findings staged for next-campaign confirmation
- `section:closure-summary` — what was learned, what compounds going forward

## Open questions

Per proposal: tick to approve / reject / defer. Each rejection should ideally have a one-line reason (optional but useful for the next loop iteration).

## Seeds for next campaign

- All approved library updates are now in force for the NEXT campaign's Phase 1+
- Character refinements seed the next icp-character-builder run
- Watch list items prompt the next campaign's Phase 7 to confirm or reject

## TL;DR template

- What we found: {N} proposals across {M} libraries.
- What it means: Pipeline now {N_compounding} ChatInc-specific data points smarter.
- What's next: Approve / reject proposals. Next campaign starts smarter.

## Frontmatter (canonical v1.5.0 template)

```yaml
phase: 8
block_id: updating
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
project_display_name: {project_display_name}
status: awaiting_review
confidence_overall: HIGH | MEDIUM | LOW
human_attention_required: true if any proposal pending operator decision
schema_version: 1
upstream_phases_consumed: [7-learning]
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

**Phase 8 specific:**
9. ✅ All 5 required sections present: `proposed-library-updates`, `character-refinements`, `benchmark-updates`, `watch-list-additions`, `closure-summary`.
10. ✅ Every proposal in `section:proposed-library-updates` has all 7 fields: `library`, `section_anchor`, `current_value`, `proposed_value`, `evidence` (linked to Phase 7 insight ID), tick-box for `[ ] Approve`, tick-box for `[ ] Reject`, tick-box for `[ ] Defer to watch list`.
11. ✅ NO library file has been written to disk yet. Phase 8 emits the proposals and waits for operator tick-boxes. After the operator approves (via dashboard or `/approve-phase {project} 8`), the changes are written — NOT before.
12. ✅ `learning-insights.json` was read end-to-end. Every insight that maps to a library target is in the proposals table. Insights with no library target (purely campaign-specific learnings) go in `section:closure-summary` instead.

## Footnote anchor-point rules (where the footnote goes when written)

When an operator approves a proposal, the change is written to the library with a footnote. The footnote's location is library-format-specific:

| Library | Format | Footnote location |
|---|---|---|
| `library-campaign-themes.md` | Table (Theme × Awareness) | Append to the row being changed |
| `library-creative-strategies.md` | Table (Strategy × compatibility) | Append to the row being changed |
| `library-channel-specs.md` | Table (Channel × spec) | Append to the row being changed |
| `library-industry-benchmarks.md` | Table (Metric × tier) | Append to the row being changed |
| `library-conversion-framework.md` | Sections (Part 1, 2, 3...) | Append to the section being changed |
| `library-creative-types.md` | Sections (Format × Style) | Append to the section being changed |
| `library-design-foundations.md` | Sections (8 Foundations) | Append to the section being changed |
| `library-art-direction.md` | Sections (8 Principles) | Append to the section being changed |
| `library-hook-structures.md` | Sections (Hook patterns) | Append to the section being changed |
| `library-paid-acquisition-playbooks.md` | Sections (Channels) | Append to the section being changed |
| `library-competitive-intelligence.md` | Sections (per competitor) | Append to the entry being changed |

**Footnote format (use exactly):**
```html
<!-- Updated YYYY-MM-DD via feedback-loop-back from {slug} — reason: {short} -->
```

The `{short}` is the one-line rationale. Max 100 characters. Truncate the Phase 7 insight's rationale if needed.

**Hard rules for writing approved changes:**
- **NEVER** apply a library change before the operator ticks `[ ] Approve`. Every change is gated.
- **NEVER** write a change without a footnote. The footnote is the audit trail.
- **ALWAYS** preserve the rest of the file. Read it first, edit minimally, write back atomically.

## Hard rules

1. NEVER auto-apply library updates. Every change requires explicit operator approval in the phase doc.
2. Every applied change MUST include a footnote citing source campaign + date in the library file.
3. After 5-10 loop-backs, libraries become ChatInc-specific intelligence (vs generic starting frameworks). This is the compounding behavior.
4. Watch-list entries that hit 2+ confirmations across campaigns → promote to library (proposed in NEXT phase 8 run).
5. End with: `✓ Phase 8 doc ready: {path}. Loop closed — {N} proposals awaiting approval.`

## Wraps

- `feedback-loop-back-SKILL.md`

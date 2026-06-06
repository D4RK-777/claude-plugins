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

## Frontmatter

```yaml
phase: 8
block_id: updating
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
status: awaiting_review
upstream_phases_consumed: [7-learning]
schema_version: 1
```

## Hard rules

1. NEVER auto-apply library updates. Every change requires explicit operator approval in the phase doc.
2. Every applied change MUST include a footnote citing source campaign + date in the library file.
3. After 5-10 loop-backs, libraries become ChatInc-specific intelligence (vs generic starting frameworks). This is the compounding behavior.
4. Watch-list entries that hit 2+ confirmations across campaigns → promote to library (proposed in NEXT phase 8 run).
5. End with: `✓ Phase 8 doc ready: {path}. Loop closed — {N} proposals awaiting approval.`

## Wraps

- `feedback-loop-back-SKILL.md`

---
name: phase-doc-ideation
description: "Emits the Phase 3 Ideation phase doc — the strategic spine. Triggers on '# Run Phase 3 — Ideation for project {slug}'. Consumes approved {brand_slug}/{project_slug}/2-research.md. Locks theme + ICP + character + creative strategy + positioning in ONE doc. Invokes theme-selector + icp-persona-engine + icp-character-builder + creative-strategy-selector + positioning-engine. Output: {brand_slug}/{project_slug}/3-ideation.md."
---

# Phase Doc Emitter — Phase 3: Ideation

## When to fire

Trigger: `# Run Phase 3 — Ideation for project {slug}`

## Pre-conditions

- `{brand_slug}/{project_slug}/2-research.md` `status: approved`

## Inputs

- Phase 1 (for brand truth + campaign context)
- Phase 2 (for pain themes + competitive whitespace + positioning hypothesis)
- Operator's answers to any Phase 2 open questions
- **Brand libraries** from `{marketing_root}/{brand_slug}/_libraries/` — `voice.md`, `hard-nos.md`, `positioning.md` (if it exists), `campaign-history.md` (if it exists). Voice and hard NOs are enforced as rails on theme + persona + character.
- **`intake.json.inherited_artifacts`** (if set) — inherited theme, persona, positioning from a past campaign. Used as the starting baseline; the operator can override, but they get a fast track.

## What you do (in order)

1. Run `theme-selector` — pick ONE strategic theme with defended rationale. Log to Decision Log.
2. Run `icp-persona-engine` — build the buyer profile with Awareness × Sophistication grid (required output).
3. Run `icp-character-builder` — turn the persona into a simulatable named character with internal monologue + objection chain + decision style. If the operator declared 1 persona, build 1 character. If 3, build 3. If 20, build 20. (Modular.)
4. Run `creative-strategy-selector` — pick ONE of 6 strategies (Loss Aversion / Transformation / Identity / Authority / Social Proof / Contrarian) with defended rationale.
5. Run `positioning-engine` — final positioning statement validated against research + competitive whitespace.
6. Emit `{brand_slug}/{project_slug}/3-ideation.md`

## Required sections

- `section:theme-locked` — the chosen theme + why (linked to Phase 2 pain themes)
- `section:icp-persona` — Awareness × Sophistication + demographic + psychographic
- `section:character-profile` — named character(s) with monologue, decision style, objection chain
- `section:creative-strategy` — strategy choice + why + what it locks for creative phase
- `section:positioning-statement` — final positioning (replaces Phase 2's hypothesis)

## Open questions

- If theme + strategy combination has a known weak fit (see library-campaign-themes): surface it
- If multiple personas were built and they conflict on positioning: ask which to prioritize as primary

## Update campaign-state (mandatory final step)

At the end of every phase-doc emission, call `campaign-state` to update the registry + decision log. This is **mandatory** — not optional, not a SHOULD. The dashboard, the state file, and any operator reading the campaign state depends on it.

Call `campaign-state` with:
- **The new phase doc** (`3-ideation.md`) — for the artifact registry
- **The strategic decisions made this phase:**
  - `theme_locked` (which campaign theme, sourced from `library-campaign-themes` if used)
  - `strategy` (the 2-3 sentence strategic angle, `section:strategy-locked`)
  - `narrative_arc` (the locked story spine)
  - `positioning_statement` (final 1-2 sentence positioning)
  - `big_idea_concept` (one-line creative direction)
- **A health assessment** for the phase:
  - `GREEN` if theme + strategy + narrative all lock clean + no OQ
  - `AMBER` if any are MEDIUM confidence OR any open questions
  - `RED` if any can't lock or are LOW confidence

`campaign-state` then:
- Updates `## ARTIFACT REGISTRY` with the new Block 3 entry
- Adds a row to `## DECISION LOG`: `phase 3 ideation = [theme + strategy + narrative locked] | phase-doc-ideation | [one-line] | library references + positioning rationale + brand alignment check`
- Computes `## HEALTH SUMMARY.strategic_clarity` from the theme/strategy/narrative lock confidence
- Adds a row to `## CHANGE LOG`
- Updates `Current phase: 3 (Ideation complete, awaiting review)`

## Seeds for Phase 4 (Creation)

These are what Phase 3 produces in 3-ideation.md (or frontmatter), and what Phase 4 reads + builds on.

Always include in the Seeds section:
- `theme` (from 3-ideation.md `section:theme-locked`) → all creative skills as locked rail.
- `character_profile.voice` (from 3-ideation.md `section:character-profile`) → copywriter, hook-creative-generator, email-sequence-from-character.
- `character_profile.objection_chain` (from 3-ideation.md `section:character-profile`) → lp-copy-generator.
- **Awareness × Sophistication grid** (from 3-ideation.md `section:icp-persona`) → every creative skill. The grid position determines hook specificity, headline register, LP architecture. EXPLICIT SEED — Phase 4 must read it.
- `creative_strategy` (from 3-ideation.md `section:creative-strategy`) → ad-image-architect, hook-creative-generator.
- `positioning_statement` (from 3-ideation.md `section:positioning-statement`) → lp-copy-generator, paid-ads-expert.
- `brand.hard_nos[]` (still in force from Phase 1, lives in 1-setup.md `section:campaign-context`) → every creative output.

## TL;DR template

- What we found: ICP is {character_name} at {awareness}/{sophistication}; theme locked as {theme}.
- What it means: Strategy is {strategy}; positioning is "{positioning_statement}".
- What's next: Run Phase 4 Creation — all rails locked.

## Frontmatter (canonical v1.5.0 template)

```yaml
phase: 3
block_id: ideation
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
project_display_name: {project_display_name}
status: awaiting_review
confidence_overall: HIGH | MEDIUM | LOW
human_attention_required: true if any LOW-confidence sections
schema_version: 1
upstream_phases_consumed: [1-setup, 2-research]
brand_libraries_loaded:
  - voice.md
  - hard-nos.md
  - audiences.md
  - positioning.md
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

**Phase 3 specific:**
9. ✅ All 5 required sections present: `theme-locked`, `icp-persona`, `character-profile`, `creative-strategy`, `positioning-statement`.
10. ✅ `section:icp-persona` includes the **Awareness × Sophistication grid** (not optional).
11. ✅ `section:character-profile` uses ONLY verbatim pain language from Phase 2's `section:pain-language`. No invented voice. If a needed phrase isn't in Phase 2, flag it as an open question rather than invent it.
12. ✅ `section:theme-locked`, `section:creative-strategy`, `section:positioning-statement` are explicitly labeled as LOCKS — Phase 4-8 treat them as rails and will refuse changes without re-running Phase 3.
13. ✅ If `intake.json.inherited_artifacts` is set, the inherited theme/persona/positioning are referenced explicitly in the relevant sections (with an "inherited from {campaign}" marker).

## Hard rules

1. Theme + strategy + positioning are LOCKS for downstream. Once approved, they cannot be changed without re-running Phase 3.
2. Awareness × Sophistication grid is required, not optional.
3. Characters use only pain language from Phase 2 verbatim. No invented voice.
4. End with: `✓ Phase 3 doc ready: {path}.`

## Wraps

- `theme-selector-SKILL.md`
- `icp-persona-engine-SKILL.md`
- `icp-character-builder-SKILL.md`
- `creative-strategy-selector-SKILL.md`
- `positioning-engine-SKILL.md`

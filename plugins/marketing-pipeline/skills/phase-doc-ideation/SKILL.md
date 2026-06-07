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

## Seeds for Phase 4 (Creation)

- `theme` → all creative skills as locked rail
- `character_profile.voice` → copywriter, hook-creative-generator, email-sequence
- `character_profile.objection_chain` → lp-copy-generator
- `creative_strategy` → ad-image-architect, hook-creative-generator
- `positioning_statement` → lp-copy-generator, paid-ads-expert
- `brand.hard_nos[]` (still in force from Phase 1) → every creative output

## TL;DR template

- What we found: ICP is {character_name} at {awareness}/{sophistication}; theme locked as {theme}.
- What it means: Strategy is {strategy}; positioning is "{positioning_statement}".
- What's next: Run Phase 4 Creation — all rails locked.

## Frontmatter

```yaml
phase: 3
block_id: ideation
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
status: awaiting_review
upstream_phases_consumed: [1-setup, 2-research]
schema_version: 1
```

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

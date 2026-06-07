---
name: phase-doc-creation
description: "Emits the Phase 4 Creation phase doc — the full creative package. Triggers on '# Run Phase 4 — Creation for project {slug}'. Consumes approved {brand_slug}/{project_slug}/3-ideation.md. Generates hooks + LP copy + email sequence + ad image prompts + cinematic prompts + design system in ONE doc, channel-scoped by the campaign's channels-in-scope declaration. Output: {brand_slug}/{project_slug}/4-creation.md."
---

# Phase Doc Emitter — Phase 4: Creation

## When to fire

Trigger: `# Run Phase 4 — Creation for project {slug}`

## Pre-conditions

- `{brand_slug}/{project_slug}/3-ideation.md` `status: approved`

## Inputs

- `3-ideation.md` (theme + ICP + character + creative strategy + positioning)
- `1-setup.md` (campaign context + brand intent + hard NOs)
- `intake.json` (campaign channels in scope, hard NOs, materials)
- **Brand libraries** from `{marketing_root}/{brand_slug}/_libraries/` — `voice.md` (anti-voice rules enforced on all copy), `hard-nos.md` (banned-word violations flagged in Open Questions), `audiences.md` (audience reference cards), `design-foundations` (via library, not direct file)

## Channel-scope gating

Read `campaign.channels` from Phase 1. Only generate creative for declared channels:
- Meta → hooks + ad images + LP if landing-page is in scope
- Google Ads → search RSA + PMax assets
- LinkedIn → text ads + image ads + sponsored content
- TikTok → cinematic prompts + hooks (short-form)
- YouTube → cinematic prompts + script outlines
- Email → email-sequence-from-character
- SEO/Content → seo-content-engine briefs
- Organic social → caption-expert + design-system thumbnails

Skip sections for channels NOT declared. Don't generate orphan assets.

## What you do (per-skill capture spec)

Each sub-skill has a label — REQUIRED, CONDITIONAL, or OPTIONAL — and a fixed destination section in the phase doc. Follow the dependency order: design tokens → hooks → concepts → visual + copy execution → specialised polish. Do not run a sub-skill before its inputs are ready.

| # | Status | Sub-skill | Reads from | Writes to `section:` | Notes |
|---|--------|-----------|-----------|---------------------|-------|
| 1 | **REQUIRED** | `design-system-architect` | (none — produces tokens) | `section:design-system` | First. All visual steps depend on its tokens. |
| 2 | **REQUIRED** | `hook-creative-generator` | 3-ideation.md (theme + persona + strategy) | `section:hooks` | Produces N hooks per declared channel. |
| 3 | **REQUIRED** | `creative-expert` | hooks from step 2 | (no own section — feeds steps 4-7) | The bridge. Top hooks become Creative Concept Briefs that steps 6-7 read. |
| 4 | **CONDITIONAL** | `lp-copy-generator` | 3-ideation.md (character + objection chain) | `section:lp-copy` | Required if `intake.json.campaign_channels` includes Meta or Google. Skip silently otherwise. |
| 5 | **CONDITIONAL** | `email-sequence-from-character` | 3-ideation.md (character) | `section:email-sequence` | Required if `Email` in campaign_channels. Skip silently otherwise. |
| 6 | **CONDITIONAL** | `ad-image-architect` | tokens (step 1) + concepts (step 3) | `section:ad-image-prompts` | Required if any visual channel (Meta / Google / TikTok / organic) in scope. |
| 7 | **CONDITIONAL** | `cinematic-prompt-architect` | tokens (step 1) + concepts (step 3) | `section:cinematic-prompts` | Required if any video channel (TikTok / YouTube / Reels) in scope. |
| 8 | **REQUIRED** | `paid-ads-expert` | hooks (step 2) + concepts (step 3) | `section:ad-copy-units` | Maps copy units to hooks. Use brand libraries' voice + hard NOs as rails. |
| 9 | **OPTIONAL** | `copywriter` / `master-wordsmith` / `expert-communicator` / `caption-expert` | (varies) | (polish within their parent section) | Run only when step 8 produced copy that needs specialist polish. Don't auto-run all four. |
| 10 | **CONDITIONAL** | `seo-content-engine` | 3-ideation.md (positioning) | `section:seo-briefs` | Required if `SEO/Content` in campaign_channels. |

**Dependency graph (must respect):**
```
[1] design-system-architect
       │
       ├──► [3] creative-expert  (also reads [2])
       │         │
       │         ├──► [6] ad-image-architect  (tokens + concept)
       │         ├──► [7] cinematic-prompt-architect
       │         └──► [8] paid-ads-expert
       │
[2] hook-creative-generator  ─► [3] creative-expert
       │                      ─► [8] paid-ads-expert
       │
[4] lp-copy-generator  (independent of visual chain)
[5] email-sequence-from-character  (independent)
[10] seo-content-engine  (independent)
```

**Hard rules for execution:**
- **NEVER skip step 1.** Every visual downstream depends on locked design tokens. If you skip step 1, steps 6 and 7 have nothing to inherit.
- **NEVER skip step 3.** Hooks alone are not production-ready. The Creative Concept Brief is the bridge that makes steps 6-8 coherent.
- **NEVER confuse section destinations.** Each sub-skill's output has exactly ONE primary destination (the table above). Don't paste creative-expert's concept brief into `section:ad-copy-units` — it goes into the parent sections of steps 6/7/8 as their conceptual upstream.
- **CONDITIONAL skips are silent.** If Meta/Google not in scope, `section:lp-copy` does NOT appear in the output. The dashboard parser will treat it as optional.
- **OPTIONAL means don't auto-run.** If step 8's copy is already strong, skip steps 9 entirely. Don't add polish that adds nothing.
- **Verify each section before emit.** The Pre-emit validation (below) checks every section that's REQUIRED or in-scope CONDITIONAL exists with Confidence + Source + Why this matters.

## Required sections (only those with channels in scope)

- `section:design-system` — locked tokens + rationale
- `section:hooks` — N hooks per channel with scroll-stop scores
- `section:lp-copy` — full LP scaffold (if applicable)
- `section:email-sequence` — sequence with subject lines + bodies (if applicable)
- `section:ad-image-prompts` — image gen prompts per ad
- `section:cinematic-prompts` — video prompts (if applicable)
- `section:ad-copy-units` — full ad copy (headlines, body, CTAs) per channel
- `section:seo-briefs` — content briefs (if applicable)

## Open questions

- Any hook with scroll-stop score below threshold: ask operator to choose stronger alternative
- Any LP section flagged as DRIFT from ad scent: surface the mismatch
- Any banned-word violation against `brand.hard_nos`: surface + ask for replacement

## Seeds for Phase 5 (Implementation)

These are what Phase 4 produces in 4-creation.md (or frontmatter), and what Phase 5 reads + gates.

Always include in the Seeds section:
- All creative assets in 4-creation.md → Phase 5 triple gate (creative-interrogator + persona-stress-test + funnel-audit)
- `ad-copy-units` (from 4-creation.md) → Phase 5 audience-architect + paid-ads-expert deployment specs
- `design-system` (from 4-creation.md) → Phase 5 gtm-document-builder render layer
- `lp-copy` (from 4-creation.md, if applicable) → Phase 5 funnel-audit handoff check
- `email-sequence` (from 4-creation.md, if Email in scope) → Phase 5 funnel-audit (each email is a touchpoint) + paid-ads-expert (for paid+email coordination). [EXPLICIT SEED — Phase 5 must read this section even though it doesn't have a specific consumer listed in the Wraps.]
- `cinematic-prompts` (from 4-creation.md, if applicable) → Phase 5 creative-interrogator (channel-fit audit)
- `ad-image-prompts` (from 4-creation.md, if applicable) → Phase 5 creative-interrogator (channel-fit audit)
- `seo-briefs` (from 4-creation.md, if applicable) → not consumed by Phase 5 directly (Phase 6 reporting tracks organic performance)

## TL;DR template

- What we found: Generated {N} hooks, {M} ad units, {L} email steps for {channels}.
- What it means: Design system locked; all creative inherits the same rails.
- What's next: Run Phase 5 Implementation — gates + targeting + GTM.

## Frontmatter (canonical v1.5.0 template)

```yaml
phase: 4
block_id: creation
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
project_display_name: {project_display_name}
status: awaiting_review
confidence_overall: HIGH | MEDIUM | LOW
human_attention_required: true if any LOW-confidence sections or hard-NO violations
schema_version: 1
upstream_phases_consumed: [1-setup, 2-research, 3-ideation]
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

**Phase 4 specific:**
9. ✅ Every REQUIRED sub-skill produced a section in the phase doc:
   - `section:design-system` ← `design-system-architect`
   - `section:hooks` ← `hook-creative-generator`
   - `section:ad-copy-units` ← `paid-ads-expert`
   (These 3 are non-negotiable regardless of channel scope.)
10. ✅ Every in-scope CONDITIONAL sub-skill produced its section:
   - `section:lp-copy` ← `lp-copy-generator` (if Meta or Google in `campaign_channels`)
   - `section:email-sequence` ← `email-sequence-from-character` (if Email in scope)
   - `section:ad-image-prompts` ← `ad-image-architect` (if any visual channel)
   - `section:cinematic-prompts` ← `cinematic-prompt-architect` (if any video channel)
   - `section:seo-briefs` ← `seo-content-engine` (if SEO/Content in scope)
11. ✅ For every out-of-scope CONDITIONAL sub-skill, the section is OMITTED (not empty, not "(skipped)").
12. ✅ Every creative asset in any section has an explicit `**Source:**` (hook source, brief path, character reference) so Phase 5's `creative-interrogator` can audit traceability.
13. ✅ Brand hard NOs checked: every copy unit, hook, LP section, and email subject was scanned against `voice.md` (anti-voice) and `hard-nos.md` (banned words). Any violation → surfaced in Open Questions with the specific phrase flagged. NEVER silently edited out.
14. ✅ Scent match check: every LP hero is checked against every ad headline for thematic alignment. Drift = an Open Question.

## Hard rules

1. Every creative asset must respect Phase 3 theme + strategy + positioning. Verify before emitting.
2. Every creative asset must respect Phase 1 brand hard NOs. Verify before emitting.
3. Scent match check: every LP hero must match its corresponding ad headline. Flag mismatches.
4. End with: `✓ Phase 4 doc ready: {path}.`

## Wraps

- `design-system-architect-SKILL.md`
- `hook-creative-generator-SKILL.md`
- `creative-expert-SKILL.md` (turns winning hooks into production-ready concepts; bridges to image/copy/video execution)
- `lp-copy-generator-SKILL.md`
- `email-sequence-from-character-SKILL.md`
- `ad-image-architect-SKILL.md`
- `cinematic-prompt-architect-SKILL.md`
- `paid-ads-expert-SKILL.md`
- `copywriter-SKILL.md`, `master-wordsmith-SKILL.md`, `expert-communicator-SKILL.md`, `caption-expert-SKILL.md`
- `seo-content-engine-SKILL.md`

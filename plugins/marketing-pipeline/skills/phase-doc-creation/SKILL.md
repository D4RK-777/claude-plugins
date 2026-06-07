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

## What you do (in order)

1. Run `design-system-architect` — produce locked design tokens (colors, type, spacing) that all visual creative inherits
2. Run `hook-creative-generator` — N hooks per declared channel
3. **Run `creative-expert`** — turn top hooks into full Creative Concept Briefs (concept, format, art direction, emotional arc, visual logic). Bridges "winning hook" → "production-ready concept." Output flows to ad-image-architect, cinematic-prompt-architect, copywriter, caption-expert.
4. Run `lp-copy-generator` — full LP scaffold (only if Meta or Google ads in scope)
5. Run `email-sequence-from-character` — sequence (only if Email in scope)
6. Run `ad-image-architect` — image prompts per ad (consumes creative-expert output)
7. Run `cinematic-prompt-architect` — video prompts (only if video channels declared; consumes creative-expert output)
8. Run `paid-ads-expert` — ad copy units mapped to hooks
9. Run `copywriter` / `master-wordsmith` / `expert-communicator` / `caption-expert` as needed for specific assets
10. Run `seo-content-engine` — content briefs (only if SEO/Content in scope)
11. Emit `{brand_slug}/{project_slug}/4-creation.md`

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

- All creative assets → Phase 5 triple gate (creative-interrogator + persona-stress-test + funnel-audit)
- `ad-copy-units` → Phase 5 audience-architect + paid-ads-expert deployment specs
- `design-system` → Phase 5 gtm-document-builder render layer
- `lp-copy` → Phase 5 funnel-audit handoff check

## TL;DR template

- What we found: Generated {N} hooks, {M} ad units, {L} email steps for {channels}.
- What it means: Design system locked; all creative inherits the same rails.
- What's next: Run Phase 5 Implementation — gates + targeting + GTM.

## Frontmatter

```yaml
phase: 4
block_id: creation
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
status: awaiting_review
upstream_phases_consumed: [1-setup, 2-research, 3-ideation]
schema_version: 1
```

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

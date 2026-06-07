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

## Research Citations (mandatory per asset)

Every creative asset produced in Phase 4 MUST cite the RT-IDs from 2-research.md that justify it. This is the research-lineage system: every creative decision traces back to a research finding. The gate-runner verifies this and flags uncited assets.

**Citation format (per asset, in the asset's metadata block):**

```markdown
### Asset: {asset_id}
- Type: {ad | lp | email | image-prompt | video-prompt | hook}
- Hook / concept: {one-line}
- Cites: RT-001, RT-003, RT-020
- Source findings: {why these IDs — one line each}
  - RT-001: "Setup takes 2+ hours" — drives the "in minutes, not months" hook angle
  - RT-003: "Launch in a day" — reinforces the time-to-value promise
  - RT-020: Solution-aware — justifies leading with mechanism, not education
```

**Rules:**
- **Minimum 2 citations per asset.** A hook citing zero findings is rejected by the gate-runner.
- **Maximum 5 citations per asset.** More than 5 = the asset is trying to do too much; narrow scope.
- **Cited RT-IDs must exist in 2-research.md's `## RESEARCH FINDINGS INDEX`.** The gate-runner cross-references.
- **The "Source findings" line is mandatory** — it explains WHY each RT-ID is cited. This is the audit trail.
- **Banned words / brand hard NOs are checked at the gate** — not here. (The gate-runner enforces.)

**Per-asset-type citation requirements:**

| Asset type | Required citations |
|------------|---------------------|
| Hook | 1+ Pain (RT-001..009) + 1+ Desire (RT-010..019) |
| Ad copy | 1+ Pain + 1+ Desire + 1+ Awareness/Sophistication |
| LP | 1+ Pain + 1+ Desire + 1+ Trust (RT-070..079) + 1+ Competitive (RT-050..059) |
| Email subject | 1+ Pain OR Desire |
| Email body | 1+ Pain + 1+ Desire + 1+ Objection (RT-080..089) |
| Image prompt | 1+ Desire (visual representation) + 1+ Trust signal (if customer/logo) |
| Video prompt | 1+ Pain + 1+ Desire |
| Cinematic | 1+ Pain (the tension) + 1+ Desire (the resolution) |

**The `## RESEARCH CITATIONS` section in 4-creation.md (after the per-asset blocks, before the verdict table):**

```markdown
## RESEARCH CITATIONS

| Asset | Cites RT-IDs | Has source-finding line | Min-citations met |
|-------|--------------|------------------------|--------------------|
| ad-v1 | RT-001, RT-003, RT-020 | ✓ | ✓ (3 ≥ 2) |
| ad-v2 | RT-001, RT-020 | ✓ | ✓ |
| ad-v3 | RT-001, RT-030, RT-040 | ✓ | ✓ |
| lp-v1 | RT-001, RT-003, RT-070, RT-050 | ✓ | ✓ (4 ≥ 2) |
| hook-1 | (none) | ✗ | ✗ — KILL by gate |
```

**Gate-runner behavior (Phase 4):**
- Every asset with `Cites:` field empty or fewer than the per-asset-type minimum → **KILL** (cite-fail)
- Every asset with citations but no "Source findings" line → **KILL** (lineage-fail)
- Soft warning (not KILL) for assets citing >5 RT-IDs (focus issue)
- The verdict table includes a new column: `| cites_ok |` (✓ / ✗)

**This is what makes the marketing "based on research and findings" mechanically.** An asset that doesn't trace to a research finding is a creative decision unsupported by evidence. The gate blocks it.

## Update campaign-state (mandatory final step)

At the end of every phase-doc emission, call `campaign-state` to update the registry + decision log. This is **mandatory** — not optional, not a SHOULD. The dashboard, the state file, and any operator reading the campaign state depends on it.

Call `campaign-state` with:
- **The new phase doc** (`4-creation.md`) — for the artifact registry
- **The strategic decisions made this phase:**
  - `creative_assets = [{asset_id, type, hook, format, gate_verdict}]` (all assets produced, with their gate results)
  - `hooks_library_size` (total hooks generated + how many passed scroll-stop threshold)
  - `lps_produced` (list of LP variants with their structure)
  - `email_sequences` (count + step count)
  - `visual_identity_assets` (logos, images, video refs)
- **A health assessment** for the phase:
  - `GREEN` if all assets passed gates + no banned-word violations + no OQ
  - `AMBER` if some assets are at risk (low scores) OR minor violations flagged
  - `RED` if any KILL verdicts OR major violations OR critical asset missing

`campaign-state` then:
- Updates `## ARTIFACT REGISTRY` with the new Block 4 entry (all creative sub-skill captures)
- Adds a row to `## DECISION LOG`: `phase 4 creation = [N assets produced + M passed gates] | phase-doc-creation | [one-line] | per-sub-skill capture list + gate summary + brand compliance check`
- Computes `## HEALTH SUMMARY.creative_quality` from gate pass rate + brand compliance + scroll-stop scores
- Adds a row to `## CHANGE LOG`
- Updates `Current phase: 4 (Creation complete, awaiting review)`

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

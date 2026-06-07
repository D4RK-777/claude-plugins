---
name: phase-doc-setup
description: "Emits the Phase 1 Setup phase doc. Reads the operator's materials bundle (URLs, PDFs, brief docs, brand voice files, past campaign data) BEFORE fetching anything. Auto-loads brand libraries from {brand}/_libraries/ and inherits persona/positioning from past campaigns if --from-campaign was used. Fills every section with HIGH/MEDIUM/LOW confidence + source citation. Operator's job is to REVIEW and tick/override — not to fill blanks. Output: {marketing_root}/{brand_slug}/{project_slug}/1-setup.md."
---

# Phase Doc Emitter — Phase 1: Setup (AI-first)

## The doctrine

**The operator provided 9 essentials. You fill EVERYTHING else.**

The operator does not type product descriptions, brand voice guesses, customer hypotheses, or competitor names. You extract all of that from the URL they provided + any pasted docs. The operator's job is to review your work — accept, override, or ask for a regen on individual sections. They are not data entry.

If you find yourself thinking "let me ask the operator what their product does" — STOP. Fetch the URL. Read the homepage. Read /about. Read /pricing. The answer is on their site.

If you can't find an answer after thorough research, mark the section LOW confidence with a clear `Why this matters` line + a specific question in the open questions block. Don't fabricate. But also don't ask trivial questions you could have answered by reading their site.

## When to fire

Triggers:
- `# Run Phase 1 — Setup` from the dashboard
- `# Intake submission` from the dashboard's intake form
- `/start-campaign` invocation completes (after operator confirms 9 essentials)

## Pre-conditions

- `{marketing_root}/{brand_slug}/{project_slug}/intake.json` exists with all 9 essentials populated.
- Brand slug + project slug are kebab-case (no spaces, no caps).
- `_materials/` folder exists at `{marketing_root}/{brand_slug}/{project_slug}/_materials/` IF the operator passed any file/folder materials.
- If `inherited_from` is set, the inherited campaign's `1-setup.md` + `3-ideation.md` exist at `{marketing_root}/{any-brand}/{inherited_campaign}/`.

If any pre-condition fails, refuse and tell the operator which condition wasn't met. Don't try to recover or invent.

## Inputs you receive

The dashboard (or `/start-campaign`) saves `{marketing_root}/{brand_slug}/{project_slug}/intake.json` containing the operator's 9 essentials PLUS the materials bundle:

```json
{
  "brand_name": "ChatInc",
  "brand_slug": "chatinc",
  "project_name": "Flex Shopify Launch",
  "project_slug": "flex-shopify-launch",
  "product_url": "https://chatinc.com/flex",
  "campaign_goal": "leadgen",
  "campaign_channels": "Meta, Google Ads, Email",
  "campaign_budget": "$25k total / $5k test, $15k scale, $5k sustain",
  "campaign_kpi": "CPL $80 (range $60-$140)",
  "campaign_timeline": "Launch Sept 12, hard end Dec 1, 12-week run",
  "brand_hard_nos": "No FDA claims; no competitor names; no unsubstantiated performance claims",
  "composite_key": "chatinc/flex-shopify-launch",
  "materials": [
    { "type": "url", "path": "https://chatinc.com/flex", "fetched_at": "2026-05-27T..." },
    { "type": "file", "path": "_materials/chatinc-q3-brief.pdf", "size_bytes": 245000, "summary": "12-page campaign brief, version 3.2" },
    { "type": "folder", "path": "_materials/past-campaigns/", "files_count": 8, "key_files": ["gloss-q1-2026/3-ideation.md"] }
  ],
  "inherited_from": "gloss-q1-2026",
  "inherited_artifacts": {
    "theme": "Trust without theatre",
    "persona": "Sarah (ops director at <50 SaaS, sophistication stage 4)",
    "positioning": "The attribution tool your CFO actually trusts"
  },
  "brand_libraries_loaded": ["voice.md", "hard-nos.md", "audiences.md"]
}
```

The `_materials/` folder next to intake.json contains copies of every file/folder the operator dropped in. Read those, plus the brand libraries at `{marketing_root}/{brand_slug}/_libraries/`, plus the inherited campaign's phase docs (if any) at `{marketing_root}/{any-brand}/{inherited_campaign}/`.

**Path resolution:** every path in `intake.json.materials[].path` is relative to the project root, starting with `_materials/`. To read a file, use `{project_root}/{path}` — NOT `_materials/{path}`. The /start-campaign command and the dashboard's intake form both write `path: "_materials/chatinc-q3.pdf"` (already prefixed). Phase 1 must read the file as-is, not double-prefix it.

## What you do (in order)

### 1. Read the materials bundle (FIRST, before fetching URLs)

Before fetching any URLs, read everything in the operator's materials. These are higher-fidelity than a site scrape.

- For each file in `intake.json.materials[]`, read the file from `{project_root}/{path}` (where `path` is the `_materials/...` path already in the JSON).
- For each folder, recurse into `{project_root}/{path}` and read the key files (`.md`, `.txt`, `.pdf`).
- Read every brand library listed in `brand_libraries_loaded` from `{marketing_root}/{brand_slug}/_libraries/`.
- If `inherited_from` is set, read the inherited campaign's `1-setup.md` and `3-ideation.md`. These give you theme + persona + positioning to build on.

Sources of truth, ranked by authority (use this order when facts conflict):
1. `intake.json` (operator's explicit decisions — never override)
2. Brand libraries (`{brand}/_libraries/voice.md` etc — brand official position)
3. Operator's uploaded materials (briefs, docs, past campaign data)
4. URL scrape (last resort, lower confidence than the operator's own docs)

### 2. Fetch the URL — only if no other materials covered it

If `intake.json.materials` is empty OR the materials didn't cover product truth / brand voice / pricing, fetch the URL.

- Homepage, `/about`, `/pricing`, `/customers`, `/case-studies`, `/blog`, `/contact`
- Use `mcp__workspace__web_fetch` in parallel where possible
- If a page is client-rendered (returns shell), use `mcp__Claude_in_Chrome__navigate` + `get_page_text`
- Cite source URL + confidence for every field extracted this way

### 3. Extract from the fetched content + materials

For each AI-filled field, extract from the materials FIRST, then the URL. Cite both sources if both contributed.

**Product truth (extract from materials → site):**
- `one_liner` — operator's brief, or hero headline / sub-hero / tagline. Often literal from homepage.
- `product_what` — synthesize from brief + About + Product pages. What it actually does mechanically.
- `product_outcome` — value props / customer testimonials / case studies. The outcome they pay for.
- `product_pricing` — from operator's brief, or `/pricing`. Model + tiers + ranges. If gated, mark LOW + ask.
- `product_avoid` — the pain language ON THE BRAND SITE (their messaging tells you what they say their product helps avoid). HIGH confidence if it's repeated as a value prop.
- `product_achieve` — desired-state language on the site.

**Brand intent (from brand libraries → site):**
- `brand_voice` — from `{brand}/_libraries/voice.md` if it exists, else analyze the homepage copy. Register (formal/casual/technical). Sentence rhythm. Adjectives the brand uses about itself.
- `brand_antivoice` — inverse of brand_voice. What the tone explicitly avoids.
- `brand_visual` — colors, fonts, photography style detectable from the rendered page + CSS + images.
- `brand_mission` — from `/about` page mission statement or operator's brief.
- `brand_personality` — 3-5 adjectives synthesized from copy tone + visual + positioning.
- `brand_taglines` — exact taglines/positioning lines visible on the site or in the brief.

**Customer hypothesis (from inherited persona → site signals):**
- `customer_hypothesis` — if inherited from past campaign, use that persona as a HIGH-confidence starting point. Otherwise, infer from site: who is in testimonials, what job titles appear in case studies, the language register, pricing tier. Frame as a hypothesis: "The site speaks to {best-guess persona}. Phase 2 Research will validate."

**Competitor hunches (from inherited research → web search):**
- `competitor_hunches` — if inherited from past campaign with competitors, reuse those. Otherwise, web search "{brand} vs", "{brand} alternatives", "{brand} competitors". Surface 3-5 named competitors with 1-line each. Mark as HUNCHES, not validated — Phase 2 deepens.

**Edge hypothesis (from inherited edge → site differentiation):**
- `edge_hypothesis` — if inherited, use that. Otherwise, from the site: what it claims makes them different.

**Existing assets (from site footer/sitemap):**
- `campaign_existing_assets` — detected: LP at /pricing? Email signup present? Blog with N posts? Active social? List what's visible.

### 4. Apply the operator's hard NOs as enforced rails

The operator's `brand_hard_nos` is the only legal/ethical constraint you can't infer. Apply it as a check: if any AI-filled section drifts into a hard NO topic, flag it + ask the operator to confirm.

### 4. Emit `{marketing_root}/{brand_slug}/{project_slug}/1-setup.md`

Use the schema in `templates/phase-doc-schema.md`. Every section comes with:
- Confidence pill (HIGH | MEDIUM | LOW)
- Source URL (the page you got it from)
- Why this matters line

## Required sections (exact IDs)

**Operator-confirmed (sourced from intake essentials — always HIGH confidence):**
- `section:campaign-context` — goal, channels, budget, KPI, timeline, hard NOs

**AI-filled from URL research:**
- `section:product-truth` — what / outcome / pricing / avoid / achieve / one-liner
- `section:brand-intent` — voice + anti-voice + visual + mission + personality + taglines
- `section:existing-assets` — what's detectable on the site (LP, blog, email, social)

**AI-generated hypotheses (clearly labeled, ALL confidence:LOW or MEDIUM — Phase 2 will validate):**
- `section:customer-hypothesis` — title MUST read "Customer hypothesis (AI from site signals — Phase 2 will validate)"
- `section:competitor-hunches` — title MUST read "Competitor hunches (AI from web search — Phase 2 will deepen)"
- `section:edge-hypothesis` — title MUST read "Edge hypothesis (AI from site differentiation messaging — Phase 2 will validate)"

## Open questions to surface

ONLY surface questions you genuinely couldn't answer from the URL:
- Pricing gated behind login or sales conversation: "I couldn't access pricing — what's the model + entry price?"
- No about page: "Brand mission/origin not visible on site — share one line?"
- Multiple personas visible in testimonials: "I see 3 distinct buyer types — which is primary for this campaign?"
- Hard NO ambiguity: "Site mentions X claim — is that allowed for this campaign or hard-NO?"

DO NOT ask about things the site clearly says. DO NOT ask "what is your product" — read the site.

## Seeds for Phase 2 (Research)

Always include:
- `product_url` (plus discovered sub-pages) → Phase 2 deep-fetch targets
- `brand_hard_nos` → enforced rails on every research conclusion
- `customer_hypothesis` → Phase 2 review-mining target (validate or refute)
- `competitor_hunches` (named + URL'd) → Phase 2 competitive scan starting list
- `edge_hypothesis` → Phase 2 will validate against competitive whitespace
- `campaign_channels` → governs Phase 2 audience signal detection
- `_materials/` folder path → Phase 2 should re-read operator's docs before deep-fetching
- `{brand_slug}/_libraries/` → brand official voice + hard NOs (Phase 2 enforces them)
- `inherited_from` (if set) → past campaign's phase docs are pre-loaded as defaults

## Confidence honesty

- HIGH = the value is from operator-confirmed source (intake essentials, brand library, or operator's brief).
- HIGH (URL) = the value is literally on the brand's own page, in clear language.
- MEDIUM = synthesized from multiple signals (e.g. brand voice from analyzing tone of homepage + about + pricing).
- LOW = best guess from limited info; operator should review carefully.

If the operator dropped high-fidelity materials (briefs, past campaigns, brand voice docs), most fields should be HIGH confidence. URL scraping is only for filling gaps the materials didn't cover.

## TL;DR template (3 lines)

- What I found: {N_materials} operator materials + {N_urls} URLs + {N_libs} brand libraries. {brand_name} is {one_liner} ({pricing_tier}).
- What it means: Operator's goal is {goal} on {channels} with {budget} targeting {kpi}.{inherited_line_if_any}
- What's next: Review the AI fills below — tick / override / regen any section. Then Phase 2 validates the hypotheses with real VOC + competitor scans.

If `inherited_from` is set, add: `Built on {inherited_from}'s theme "{theme}" and persona "{persona}".`

## Frontmatter (canonical v1.5.0 template)

```yaml
phase: 1
block_id: setup
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
project_display_name: {project_display_name}
status: awaiting_review
confidence_overall: HIGH | MEDIUM | LOW
human_attention_required: true if any LOW-confidence sections or open questions
schema_version: 1
upstream_phases_consumed: []
brand_libraries_loaded:
  - {library1.md}
sources_consumed:
  materials_count: {N_materials}
  urls_fetched:
    - {url1}
  inherited_from: {campaign_slug_or_null}
created_at: {ISO 8601 timestamp}
last_updated: {ISO 8601 timestamp}
approved_at: null
approved_by: null
```

## Pre-emit validation (run ALL before writing the file)

**Common checks (every phase):**
1. ✅ Frontmatter contains ALL of: `phase`, `block_id`, `brand_slug`, `brand_display_name`, `project_slug`, `project_display_name`, `status`, `confidence_overall`, `human_attention_required`, `schema_version`, `upstream_phases_consumed`, `brand_libraries_loaded`, `sources_consumed`, `created_at`, `last_updated`. None null except `approved_at` / `approved_by`.
2. ✅ `status: awaiting_review` (never `approved` in a fresh emit — that's the operator's job).
3. ✅ `approved_at: null` and `approved_by: null` (untouched).
4. ✅ At least one `### section:[id]` exists.
5. ✅ Every `section:` has `**Title:**`, `**Confidence:** HIGH|MEDIUM|LOW`, `**Source:**`, `**Why this matters:**`, and a non-empty content block.
6. ✅ `## Open questions for human` section exists (write `(none)` if empty — never omit the section).
7. ✅ `## Seeds for next phase` section exists.
8. ✅ File path is `{project_root}/{N}-{block_id}.md`.

**Phase 1 specific:**
9. ✅ All 7 required sections present: `campaign-context`, `product-truth`, `brand-intent`, `existing-assets`, `customer-hypothesis`, `competitor-hunches`, `edge-hypothesis`.
10. ✅ The 3 hypothesis sections (`customer-hypothesis`, `competitor-hunches`, `edge-hypothesis`) have titles prefixed with "Phase 2 will validate/deepen" so the operator knows they're unverified.
11. ✅ `human_attention_required: true` if any section is LOW confidence OR open questions non-empty.

If any check fails, FIX IT before writing the file. Do not emit a malformed phase doc.

## Hard rules

1. **NEVER ask the operator for data you could fetch from materials or the URL.** Read everything first. Surface real open questions only.
2. **Materials rank higher than URL scraping.** If the operator's brief says budget is $25k, that's the truth — don't re-derive it from the site.
3. **Brand libraries rank higher than operator's brief.** If `_libraries/hard-nos.md` says "no competitor names," that's a brand-wide rule, not a campaign-specific one. Enforce it always.
4. **NO fabrication.** Every AI-filled value cites a source (URL, file path, library, or intake.json).
5. **Hypothesis sections must be CLEARLY LABELED** with the phrase "Phase 2 will validate" in the title.
6. **VERBATIM tags** only when the source is a real review/quote with a fetchable URL + date. Don't fake them.
7. NEVER set `status: approved` — that's the dashboard's approval gate.
8. End with: `✓ Phase 1 doc ready: {path}. Open the dashboard to review — every section has a tick-box.`

## Wraps

- `campaign-state-SKILL.md` (initializes Decision Log)

> **Note:** Earlier drafts of this skill listed `brand-project-setup` and `preflight-research` as wrapped skills. Both are pre-flywheel legacy skills that did the work this skill now does inline (intake + URL fetch + competitor hunches). They remain in `skills/` for backward compatibility but are NOT invoked here. If you want a deep pre-Phase-1 research sprint, run them manually before invoking this skill.

## Companion file

ALSO create `{marketing_root}/{brand_slug}/{project_slug}/campaign-state.md` with the Decision Log initialised from the operator's strategic decisions.

## What the operator sees in the dashboard

After this skill writes the phase doc, the dashboard renders each section as a card:
```
┌──────────────────────────────────────────────┐
│ Product truth — Outcome             [HIGH]   │
│                                              │
│ "Real-time attribution that survives iOS     │
│  privacy changes for B2B SaaS marketers."    │
│                                              │
│ Source: https://chatinc.com/flex            │
│                                              │
│ [✓ Accept]  [✗ Override]  [↻ Change just this]│
└──────────────────────────────────────────────┘
```

The operator clicks Accept on what's right. Override on what's wrong (with their correction). Regen on what needs another pass with their note. That's the entire interaction — no form-filling.

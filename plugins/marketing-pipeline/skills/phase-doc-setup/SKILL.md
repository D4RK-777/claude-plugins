---
name: phase-doc-setup
description: "Emits the Phase 1 Setup phase doc. The operator provides ONLY the strategic essentials (brand, project name, URL, goal, channels, budget, KPI, timeline, hard NOs). YOU do all the rest of the work — fetch the URL, analyze the brand voice from existing copy, web-search for competitors, infer customer hypothesis from the site's audience signals, propose edge hypothesis from the visible differentiation. Every section in the phase doc is AI-filled with HIGH/MEDIUM/LOW confidence + source citation. The operator's job is to REVIEW and tick/override — not to fill blanks. Output: {marketing_root}/{brand_slug}/{project_slug}/1-setup.md."
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

## Inputs you receive

The dashboard saves `{marketing_root}/{brand_slug}/{project_slug}/intake.json` containing ONLY the operator's 9 essentials:

```json
{
  "brand_name": "ChatInc",
  "brand_slug": "chatinc",
  "project_name": "Flex Shopify Launch",
  "project_slug": "flex-shopify-launch",
  "product_url": "https://chatinc.com/flex",
  "paste_docs": "(optional pasted internal docs / brand brief)",
  "campaign_goal": "leadgen",
  "campaign_channels": "Meta, Google Ads, Email",
  "campaign_budget": "...",
  "campaign_kpi": "...",
  "campaign_timeline": "...",
  "brand_hard_nos": "..."
}
```

Everything else is yours to discover.

## What you do (in order)

### 1. Fetch the URL — deep
- Homepage, `/about`, `/pricing`, `/customers`, `/case-studies`, `/blog`, `/contact`
- Use `mcp__workspace__web_fetch` in parallel where possible
- If a page is client-rendered (returns shell), use `mcp__Claude_in_Chrome__navigate` + `get_page_text`

### 2. Extract from the fetched content
For each AI-filled field, extract from the site. Cite source URL + confidence.

**Product truth (extract from site):**
- `one_liner` — hero headline / sub-hero / tagline. Often literal from homepage.
- `product_what` — synthesize from About + Product pages. What it actually does mechanically.
- `product_outcome` — value props / customer testimonials / case studies. The outcome they pay for.
- `product_pricing` — from /pricing. Model + tiers + ranges. If gated, mark LOW + ask.
- `product_avoid` — the pain language ON THE BRAND SITE (their messaging tells you what they say their product helps avoid). HIGH confidence if it's repeated as a value prop.
- `product_achieve` — desired-state language on the site.

**Brand intent (extract from existing copy):**
- `brand_voice` — analyze tone of the homepage copy. Register (formal/casual/technical). Sentence rhythm. Adjectives the brand uses about itself.
- `brand_antivoice` — inverse of brand_voice. What the tone explicitly avoids (use signals from the analysis).
- `brand_visual` — colors, fonts, photography style detectable from the rendered page + CSS + images.
- `brand_mission` — from /about page mission statement if present.
- `brand_personality` — 3-5 adjectives synthesized from copy tone + visual + positioning.
- `brand_taglines` — exact taglines/positioning lines visible on the site.

**Customer hypothesis (from site signals):**
- `customer_hypothesis` — who the site is talking to. Often inferable from: who is in testimonials, what job titles appear in case studies, the language register, pricing tier. Frame as a hypothesis: "The site speaks to {best-guess persona}. Phase 2 Research will validate."

**Competitor hunches (web search + site mentions):**
- `competitor_hunches` — web search "{brand} vs", "{brand} alternatives", "{brand} competitors". Surface 3-5 named competitors with 1-line each. Mark these as HUNCHES, not validated — Phase 2 deepens.

**Edge hypothesis (from site differentiation messaging):**
- `edge_hypothesis` — what the site claims makes them different. Often in a "Why us" or "What makes us different" section, or in repeated value props vs competitors.

**Existing assets (from site footer/sitemap):**
- `campaign_existing_assets` — detected: LP at /pricing? Email signup present? Blog with N posts? Active social? List what's visible.

### 3. Apply the operator's hard NOs as enforced rails

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

## Confidence honesty

- HIGH = the value is literally on the brand's own page, in clear language.
- MEDIUM = synthesized from multiple signals (e.g. brand voice from analyzing tone of homepage + about + pricing).
- LOW = best guess from limited info; operator should review carefully.

Set `confidence_overall: LOW` if the URL failed to fetch or returned minimal content. The operator can then decide whether to paste docs or pick a different URL.

## TL;DR template (3 lines)

- What I found: {brand_name} is {one_liner} ({pricing_tier}); {N} pages analyzed.
- What it means: Operator's goal is {goal} on {channels} with {budget} targeting {kpi}.
- What's next: Review the AI fills below — tick / override / regen any section. Then Phase 2 validates the hypotheses with real VOC + competitor scans.

## Frontmatter

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
sources_fetched:
  - {url1}
  - {url2}
```

## Hard rules

1. **NEVER ask the operator for data you could fetch from their URL.** Read the site first. Surface real open questions only.
2. **NO fabrication.** Every AI-filled value cites a source URL.
3. **Hypothesis sections must be CLEARLY LABELED** with the phrase "Phase 2 will validate" in the title.
4. **VERBATIM tags** only when the source is a real review/quote with a fetchable URL + date. Don't fake them.
5. NEVER set `status: approved` — that's the dashboard's approval gate.
6. End with: `✓ Phase 1 doc ready: {path}. Open the dashboard to review — every section has a tick-box.`

## Wraps

- `brand-project-setup-SKILL.md` (semantic structure)
- `preflight-research-SKILL.md` (research protocol — fetching + analysis + competitor scan)
- `campaign-state-SKILL.md` (initializes Decision Log)

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

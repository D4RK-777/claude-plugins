---
name: preflight-research
description: "Auto-populates the Campaign Intake Wizard from a brand URL + optional competitor URLs + context. Runs deep brand discovery (URL fetch, public review mining, competitive scan, voice analysis) and returns a structured JSON payload mapped 1:1 to wizard field IDs. The wizard renders each suggested value with a tick-box (default ✓ accept) — Chris uncheckes anything he wants to override manually. Use this when the wizard sends a 'Preflight research request' message. NEVER fabricate. Every field is either grounded in fetched content + cited, or marked null with a clear reason."
---

# Preflight Research — Wizard Auto-Populate Engine

## When this fires

The Campaign Intake Wizard's Preflight pre-step sends a prompt that starts with:

```
# Preflight research request — Campaign Intake Wizard
```

containing:
- `brand_url` (required) — the main product / company URL
- `competitor_urls` (optional, up to 3)
- `context_note` (optional free-text from Chris)
- `project_slug` (kebab-case identifier)

That's the trigger. Do NOT run this skill outside that trigger — it's the wizard's research half.

## Hard rules

1. **No fabrication.** Every populated field must be backed by content actually fetched. If a field can't be researched, set it to `null` and put a reason in `_meta.skipped` array.
2. **VERBATIM tagging.** Any customer-voice field (`customer_problem`, `customer_vocab`, `research_reviews`) MUST use `[VERBATIM: "exact quote" — source, date]` format. Source must be a real, fetchable URL. Date must be the review/post date if available, else the fetch date in `YYYY-MM-DD` and a `[FETCH-DATE]` flag.
3. **Confidence tagging.** Every populated field gets `confidence: HIGH | MEDIUM | LOW` based on:
   - HIGH = stated directly on the brand's own page in clear language
   - MEDIUM = synthesized from multiple sources or inferred from strong signals
   - LOW = best-guess from limited info; user should review carefully
4. **Source citation.** Every field has a `source` URL.
5. **Locale awareness.** Don't assume US — read TLD + page language + currency.

## Research protocol

### Step 1 — Fetch the brand URL
- `mcp__workspace__web_fetch` on `brand_url`
- If 404 / blocked / JS-rendered shell → try `mcp__Claude_in_Chrome__navigate` + `get_page_text`
- Also fetch (in parallel where possible): `/about`, `/pricing`, `/customers`, `/case-studies`, `/blog` (if discoverable from homepage links)

### Step 2 — Brand voice scan
From the fetched content extract:
- Hero headline (literal, for one_liner candidate)
- Sub-hero / tagline lines
- Repeating value props
- Adjectives the brand uses about itself (for `brand_personality`)
- Sentence rhythm + register (formal/casual/technical) for `brand_voice`
- Footer mission / about excerpt

### Step 3 — Pricing scan
Fetch `/pricing` if available. Extract:
- Pricing model (subscription / one-time / freemium / usage-based / enterprise-quote)
- Public price points
- Plan tiers (number + naming)

### Step 4 — Competitive intel
For each competitor_url (or if none provided, do web search for "[brand] vs" and "[brand] alternatives"):
- Fetch the competitor homepage
- Extract their positioning headline
- Note 1-line positioning summary for `comp_direct_*` fields
- If no competitor URLs: web search `[brand] alternatives 2026` and pull top 3 named alternatives

### Step 5 — Public review mining
- Web search: `"[brand]" site:trustpilot.com`, `"[brand]" site:g2.com`, `"[brand]" reviews`, `"[brand]" Reddit`
- For B2B SaaS: also `site:g2.com`, `site:capterra.com`
- For ecom/DTC: `site:trustpilot.com`, `site:reviews.io`, app store
- Extract 5-10 verbatim quotes that capture: pain language, objections, alternative comparisons, success stories
- Each quote → `[VERBATIM: "..." — source-url, date]`

### Step 6 — Category noise scan
- Web search: `"[category]" best 2026`, `[category] software comparison`
- Read 2-3 top results
- Identify the dominant claim/mechanism in the category for `comp_category_noise`

### Step 7 — Synthesize the JSON

Output ONE JSON block, exactly matching the schema below.

## JSON Output Schema

```json
{
  "_meta": {
    "skill": "preflight-research",
    "project_slug": "[from request]",
    "research_date": "YYYY-MM-DD",
    "sources_fetched": [
      { "url": "...", "title": "...", "kind": "homepage|pricing|about|review|competitor|category" }
    ],
    "skipped": [
      { "field_id": "comp_admired", "reason": "Subjective — user must provide" }
    ],
    "verbatim_count": 7,
    "research_confidence": "HIGH|MEDIUM|LOW"
  },
  "fields": {
    "product_url":          { "value": "https://...",        "confidence": "HIGH",   "source": "user-provided" },
    "one_liner":            { "value": "...",                "confidence": "HIGH",   "source": "https://.../homepage" },
    "product_what":         { "value": "...",                "confidence": "MEDIUM", "source": "https://.../about" },
    "product_outcome":      { "value": "...",                "confidence": "MEDIUM", "source": "https://.../homepage" },
    "product_differentiator": { "value": "...",              "confidence": "MEDIUM", "source": "synthesized" },
    "product_pricing":      { "value": "$X/mo subscription", "confidence": "HIGH",   "source": "https://.../pricing" },
    "product_avoid":        { "value": "...",                "confidence": "MEDIUM", "source": "synthesized" },
    "product_achieve":      { "value": "...",                "confidence": "MEDIUM", "source": "synthesized" },
    "customer_best":        { "value": "...",                "confidence": "MEDIUM", "source": "https://.../customers" },
    "customer_problem":     { "value": "[VERBATIM: \"...\" — url, date]\n[VERBATIM: \"...\" — url, date]", "confidence": "HIGH", "source": "g2/trustpilot mining" },
    "customer_alternatives": { "value": "...",               "confidence": "MEDIUM", "source": "review mining" },
    "customer_objection":   { "value": "...",                "confidence": "LOW",    "source": "negative reviews" },
    "customer_platforms":   { "value": "...",                "confidence": "LOW",    "source": "inferred from category" },
    "customer_vocab":       { "value": "[VERBATIM: \"...\" — url, date]", "confidence": "HIGH", "source": "review mining" },
    "comp_direct_1":        { "value": "Name — positioning", "confidence": "HIGH",   "source": "https://competitor.com" },
    "comp_direct_2":        { "value": "Name — positioning", "confidence": "HIGH",   "source": "https://competitor.com" },
    "comp_direct_3":        { "value": "Name — positioning", "confidence": "MEDIUM", "source": "web search" },
    "comp_indirect":        { "value": "...",                "confidence": "MEDIUM", "source": "synthesized" },
    "comp_strengths":       { "value": "...",                "confidence": "MEDIUM", "source": "competitor sites" },
    "comp_edge":            { "value": "...",                "confidence": "MEDIUM", "source": "synthesized" },
    "comp_category_noise":  { "value": "...",                "confidence": "MEDIUM", "source": "category scan" },
    "brand_personality":    { "value": ["adjective1", "adjective2", "adjective3"], "confidence": "MEDIUM", "source": "tone analysis of homepage + about" },
    "brand_voice":          { "value": "...",                "confidence": "MEDIUM", "source": "tone analysis" },
    "brand_antivoice":      { "value": "...",                "confidence": "LOW",    "source": "inverse of brand_voice" },
    "brand_visual":         { "value": "...",                "confidence": "MEDIUM", "source": "css + images on homepage" },
    "brand_taglines":       { "value": "...",                "confidence": "HIGH",   "source": "https://.../homepage" },
    "brand_mission":        { "value": "...",                "confidence": "HIGH",   "source": "https://.../about" },
    "research_reviews":     { "value": "[VERBATIM: ...]\n[VERBATIM: ...]", "confidence": "HIGH", "source": "g2/trustpilot/reddit aggregation" }
  }
}
```

### Fields NEVER auto-populated (user-only)

These MUST appear in `_meta.skipped` with a reason. Do not include them in `fields`:

- `project_name` — user-chosen slug
- `campaign_codename` — user-internal
- `customer_badfit` — user-defined exclusion logic
- `comp_admired` — subjective aesthetic taste
- `brand_hard_nos` — legal / ethical / category-specific, user must declare
- `campaign_goal` — user strategic decision
- `campaign_channels` — user budget/team scope
- `campaign_budget` — confidential
- `campaign_kpi` — user target setting
- `campaign_timeline` — user calendar
- `campaign_existing_assets` — private inventory
- `campaign_prior_attempts` — internal history
- `theme_hunch` — user intuition
- `research_sales_calls` — private
- `research_support` — private
- `research_forums` — paste-only (optional manual upload)
- `research_other` — paste-only

## Output protocol — what to do AFTER research

1. Save the full JSON to `C:\Users\chris\.claude\projects\Marketing\preflight-research-{project_slug}.json`. Use Write tool.
2. Render a SHORT chat summary in this exact format:

```
✓ Preflight research complete for [brand_url]

Sources fetched: [N]
Verbatim quotes extracted: [N]
Research confidence: HIGH | MEDIUM | LOW
Fields populated: [N of ~22]
Fields skipped (user-only): [list]

File saved: C:\Users\chris\.claude\projects\Marketing\preflight-research-{slug}.json

To load into the wizard:
1. Open the file (computer://C:\Users\chris\.claude\projects\Marketing\preflight-research-{slug}.json)
2. Copy the entire JSON contents
3. Paste into the wizard's "Load research" textarea
4. Click "Load + Review"
5. Tick/untick each field, override where needed
```

3. Also paste the JSON in a fenced ```json block in the chat so Chris can copy it directly without opening the file.

4. End with: "**Open the wizard and paste the JSON into the 'Load research' field. Ready when you are.**"

## When research is sparse

If brand URL returns minimal content, or no public reviews exist:
- Populate what you CAN (homepage scrape only)
- Mark `_meta.research_confidence` as `LOW`
- In `_meta.skipped`, list every field that couldn't be researched + reason
- Suggest: "Consider running `apify-pain-research` after intake to deepen the RESEARCH LOCK before persona work."

## Anti-patterns — never do these

1. ❌ Make up a verbatim quote. If you don't have one, leave the field null and skip it.
2. ❌ Set confidence to HIGH unless the value is literally on the brand's own page in clear language.
3. ❌ Pad pricing with assumptions. If pricing isn't public, mark it null + skip.
4. ❌ Use "industry standard" generic phrasing. Brand voice fields must reflect the actual tone of the fetched content.
5. ❌ Reuse boilerplate across brands. Every preflight must be original to the brand.

## Pairs with

- `brand-project-setup` — receives the wizard payload after Chris finishes review
- `apify-pain-research` — runs DEEPER review mining if preflight confidence is LOW
- `library-competitive-intelligence` — preflight feeds initial competitor data; library skill goes deeper later

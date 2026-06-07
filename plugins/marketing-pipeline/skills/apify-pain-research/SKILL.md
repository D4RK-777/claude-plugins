---
name: apify-pain-research
description: >
  Reviews and public VOC (voice of customer) mining. Finds verbatim pain language, unmet needs, and "I wish it also..." requests for the target product/category. Sources: G2, Capterra, Trustpilot, Reddit (subreddits matching the category), app store reviews, Amazon reviews, indie hacker communities, Twitter/X complaints, YouTube comment sections on competitor review videos. Currently uses WebSearch + WebFetch as a portable stub. UPGRADEABLE to the real Apify scraper once an API key is configured (see "Future: real Apify integration" at the bottom). Trigger on: "find pain language", "mine reviews", "VOC", "what are people complaining about", "what do users wish this product did", "unmet needs", "verbatim quotes from reviews", "competitive review scan", "voice of customer research", "what do real users say", "apify pain research", or as sub-step of phase-doc-research Block 2.
---

# Pain Research (Apify-Ready Stub)

> **Current implementation:** WebSearch + WebFetch. Works in any Claude Code environment, no API keys.
> **Production path:** swap to Apify scrapers when an API key is configured (instructions at bottom).

You mine public reviews and community discussions for **verbatim pain language** — the exact words customers use to describe their problems. This is the foundation of every downstream creative output. Hooks, copy, persona, positioning, and creative strategy all derive from the quotes you surface.

The orchestrator (`phase-doc-research`) calls this skill in Phase 2 to validate or refute the customer hypothesis from Phase 1. It can also be called standalone for ad-hoc pain research.

---

## ROLE

You are a research analyst. You do not invent, paraphrase, or polish customer quotes. You find what real people said, in their own words, with attribution. The rough edge IS the truth.

**Verbatim format (use exactly):**
`[VERBATIM: "exact quote with original spelling, grammar, and emotion" — source-url-or-platform, date]`

Examples:
- `[VERBATIM: "i literally cannot figure out which ad is making me money" — G2 review, 2025-03]`
- `[VERBATIM: "honestly i just want to stop feeling like a fraud every monday" — sales call transcript, 2025-04-12]`
- `[VERBATIM: "everyone says use HubSpot but it's so complicated I gave up" — Reddit r/marketing, 2024-11]`

If the source has no date, mark `date-unknown`. If the source is unattributed (e.g. someone paraphrased a review they read), mark `source-unattributed` and do NOT use the quote as evidence.

---

## WHEN TO INVOKE

Trigger when:
- Phase 2 (`phase-doc-research`) is running and needs to validate/refute the customer hypothesis from Phase 1
- The user asks for pain language mining, VOC, reviews research, "what are people complaining about"
- A new campaign needs the verbatim quotes that drive hook + copy work

Don't trigger when:
- The user has their own verbatim quotes from support tickets, sales calls, or DMs — use those directly instead
- A category has <5 reviews anywhere on the public web (fall back to forum threads, social, YouTube)

---

## INPUTS REQUIRED

1. **Product or category name** (required) — e.g. "attribution software for B2B SaaS"
2. **Competitor names (optional)** — e.g. "HubSpot, Mixpanel, Triple Whale"
3. **Target persona hint (optional)** — e.g. "marketing managers at <50-person SaaS companies"
4. **Specific pain hypotheses to validate (optional)** — from Phase 1's customer-hypothesis, e.g. "people can't figure out which ad is making them money"
5. **Source priorities (optional)** — defaults to G2 + Capterra + Trustpilot + Reddit + app stores; can be expanded to YouTube comments, Twitter/X, indie hacker communities, Amazon

---

## THE PROCESS

### STEP 1 — PLAN THE SEARCH QUERIES

For each source, design 3-5 search queries that will surface pain language. Patterns:

**G2 / Capterra / Trustpilot:**
- "{product} reviews"
- "{product} complaints"
- "{product} cons"
- "{product} vs {competitor} reviews"
- "site:g2.com {product} {pain_keyword}"
- "site:trustpilot.com {product}"

**Reddit (subreddit discovery first):**
- Find the right subreddit: r/SaaS, r/marketing, r/analytics, r/startups, category-specific subs
- "{pain_keyword} site:reddit.com"
- "what's your biggest pain with {category}"
- "anyone else struggling with {category}"

**App stores:**
- "{app} reviews"
- "{app} 1 star reviews"
- "{app} complaints"

**YouTube comments (for video review content):**
- "site:youtube.com {product} review"
- "site:youtube.com {product} vs {competitor}"

### STEP 2 — RUN THE SEARCHES (parallel where possible)

Use `WebSearch` to find candidate URLs. For each top result, use `WebFetch` to extract the full review content.

**Target: 15+ verbatim quotes across 4+ sources.** If you can't get there in 30 minutes of searching, the category is too thin — flag LOW confidence and recommend the user provide their own support tickets / sales call transcripts as the primary source.

### STEP 3 — TAG AND ORGANISE

For each verbatim quote:
- Tag with `[VERBATIM: "..." — source, date]`
- Assign to a pain cluster (group of related complaints)
- Note the emotional intensity: frustrated / ashamed / desperate / resigned / angry / confused
- Mark the cluster's "nightmare scenario" — the worst case this pain leads to

Organise into a Pain Cluster Map:

```
## Pain Cluster 1: [Name] (Intensity: HIGH)
The user's verbatim words:

- [VERBATIM: "..." — G2 review, 2025-03]
- [VERBATIM: "..." — Reddit r/marketing, 2024-11]
- [VERBATIM: "..." — Trustpilot, 2025-01]

The nightmare scenario this pain leads to:
[Worst case the customer is trying to avoid by solving this problem]

## Pain Cluster 2: [Name] (Intensity: MEDIUM)
...
```

### STEP 4 — VALIDATE OR REFUTE THE PHASE 1 HYPOTHESIS

If the operator passed in a `customer_hypothesis` from Phase 1, compare it to what you found:
- **VALIDATED** — the public VOC matches the Phase 1 guess. Cluster this with confidence HIGH.
- **REFINED** — the pain is real but the persona/segment is different from what Phase 1 suggested. Surface the delta.
- **REFUTED** — the public VOC shows a completely different pain. State the actual finding. Set `RESEARCH_CONFIDENCE: LOW` and require operator confirmation before continuing.

### STEP 5 — PRODUCE THE OUTPUT

Output structure:

```markdown
# Pain Research: [Product/Category]
**Date:** [ISO date]
**Sources searched:** G2, Capterra, Trustpilot, Reddit, app stores
**Quotes found:** [N] verbatim across [M] sources
**Confidence:** HIGH | MEDIUM | LOW

## Pain Cluster Map
[the clusters from Step 3]

## Verbatim Quote Bank
[every quote, organised by cluster, with full attribution]

## Phase 1 Hypothesis Verdict
[VALIDATED / REFINED / REFUTED with delta callout]

## Emotional Intensity Distribution
- HIGH intensity: [N] quotes
- MEDIUM intensity: [N] quotes
- LOW intensity: [N] quotes

## Open Questions for the Operator
- [Things you couldn't find — e.g. "no Reddit threads for this category in 2024-2025, recommend providing 3+ support tickets"]
- [Sources that were thin — e.g. "Trustpilot only has 12 reviews, G2 only 8 — confidence is MEDIUM not HIGH"]

## Seeds for Phase 3
- top 3 pain clusters → feeds theme-selector
- verbatim language → feeds icp-persona-engine (as VOC)
- emotional intensity distribution → feeds creative-strategy-selector
- unmet needs ("I wish it also...") → feeds positioning-engine
```

---

## SOURCES RANKED (by authority)

1. **Direct customer quotes from operator's own data** (support tickets, sales calls, DMs) — HIGHEST authority. Always prefer over public web.
2. **G2 / Capterra** — B2B SaaS reviews, often detailed, role-disclosed
3. **Trustpilot** — consumer + some B2B, often emotional
4. **Reddit** — community-grounded, often raw language
5. **App store reviews** — mobile-specific, often very raw
6. **YouTube comments on review videos** — unfiltered reactions
7. **Amazon reviews** — physical products, consumer
8. **Twitter/X** — short, often emotional, hard to attribute
9. **Indie hacker communities** — early adopters, more technical

If the operator provided their own quotes (e.g. dropped a support-tickets.csv into the materials bundle), use THOSE as the primary source. The web search is secondary in that case.

---

## HARD RULES

1. **NO fabrication.** Every verbatim quote must have a real, fetchable source. If you can't attribute it, mark `source-unattributed` and don't use it as evidence.
2. **NO paraphrasing.** The rough edge IS the truth. Don't clean up grammar or spelling. The downstream pipeline depends on the raw language.
3. **15+ quotes across 4+ sources is the floor** for HIGH confidence. If you can't get there, mark MEDIUM or LOW and surface what you couldn't find in Open Questions.
4. **Don't extrapolate from one quote.** A single "I hate X" doesn't make a pain cluster. Cluster = 3+ related quotes from 2+ sources.
5. **Date matters.** Recent quotes (2024-2026) weight higher than old ones (pre-2023). For categories that change fast, prefer last 12 months.
6. **Surface conflicts.** If 3 quotes say X and 2 quotes say opposite-of-X, surface the contradiction in Open Questions. Don't pick silently.
7. **End with the output file path** so Phase 2 can pick it up. The orchestrator reads the output, you don't write to the phase doc directly.

---

## FUTURE: REAL APIFY INTEGRATION

When an `APIFY_API_TOKEN` is set in the environment, replace the WebSearch + WebFetch calls with Apify scrapers:

| Source | Apify actor |
|---|---|
| G2 reviews | `bebity/g2-reviews-scraper` |
| Trustpilot reviews | `epctex/trustpilot-reviews-scraper` |
| Reddit threads + comments | `dtrungle/reddit-scraper` or `maxcopell/reddit-scraper` |
| Google Play reviews | `epctex/google-play-reviews-scraper` |
| Apple App Store reviews | `epctex/apple-app-store-reviews-scraper` |
| YouTube comments | `epctex/youtube-comments-scraper` |
| Amazon reviews | `epctex/amazon-reviews-scraper` |
| Twitter/X | `apidojo/twitter-scraper` (rate-limited) |

```js
// pseudocode — to be added when APIFY_API_TOKEN is configured
const response = await fetch(
  `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`,
  {
    method: 'POST',
    body: JSON.stringify({
      productName: productName,
      maxItems: 50,
      sortBy: 'most-recent'
    })
  }
);
const reviews = await response.json();
return reviews.map(r => ({
  source: r.source,
  rating: r.rating,
  date: r.date,
  text: r.text,
  author: r.author
}));
```

Until that env var is set, this skill runs in WebSearch-stub mode. The output structure is identical so downstream phases don't notice the difference.

---

## WRAPS

- WebSearch tool (MCP or built-in)
- WebFetch tool (MCP or built-in)
- (Future) Apify API client

## OUTPUT CONTRACT

The phase-doc orchestrator captures this skill's output into the phase doc's `section:pain-language` (Phase 2) AND saves the full output file to disk.

**Target section:** `section:pain-language`
**Saved file:** `{project_root}/pain-research-{project_slug}-{date}.md`
**Format:** markdown with YAML frontmatter
**Confidence required:** HIGH (15+ verbatim quotes across 4+ sources) / MEDIUM (10-14 quotes or 3 sources) / LOW (fewer)

**Required fields in the section content:**
- Pain Cluster Map (3-5 clusters, each with intensity: HIGH/MEDIUM/LOW and 3-5 VERBATIM quotes)
- Nightmare scenario (the worst case each cluster leads to)
- Verbatim Quote Bank (every quote with full attribution)
- Phase 1 Hypothesis Verdict (VALIDATED / REFINED / REFUTED with delta callout)
- Emotional Intensity Distribution (HIGH/MEDIUM/LOW counts)
- Open Questions (sources that were thin, gaps in coverage)

**Required frontmatter on the saved file:**
- `campaign`, `product_or_category`, `date`
- `sources_searched` (list)
- `quotes_found` (count)
- `sources_with_quotes` (count)
- `confidence` (HIGH / MEDIUM / LOW)
- `phase1_hypothesis_verdict` (VALIDATED / REFINED / REFUTED)

**Hard rules:**
- Write ONLY into `section:pain-language` (phase doc) and `pain-research-{project_slug}-{date}.md` (research file). Do NOT touch any other section.
- NO fabrication. Every `[VERBATIM: "..." — url, date]` tag must have a real, fetchable URL and a date. If you can't attribute it, mark `source-unattributed` and don't use as primary evidence.
- 15+ verbatim quotes across 4+ sources is the floor for HIGH confidence. Below that, mark MEDIUM or LOW and surface what you couldn't find in Open Questions.
- Date matters: recent quotes (2024-2026) weight higher than old ones (pre-2023). For fast-changing categories, prefer last 12 months.
- Operator's own quotes (from support tickets, sales calls, DMs) take priority over public web. If materials bundle contains them, use those FIRST.
- Append Decision Log: `VOC = [N quotes across M sources] | apify-pain-research | [one-line] | phase1 verdict + confidence + source breakdown`.

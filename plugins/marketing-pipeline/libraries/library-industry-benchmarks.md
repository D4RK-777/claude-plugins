# Library: Industry Benchmarks
> Reference of paid-media performance benchmarks by industry × channel × ad type. Consumed primarily by `campaign-forecaster` as the always-on evidence base when historical ChatInc data isn't yet available, and as a defensible reference point when explaining forecast ranges to stakeholders. Pairs with `campaign-state` performance metrics (live data) and the user's own historical data files (when present in folder).

> **Currency note:** Figures sourced from major industry reports (Wordstream, Wordstream Google Ads Industry Benchmarks 2024, AdEspresso/Hootsuite Meta Benchmarks 2024-25, LinkedIn Marketing Solutions, TikTok For Business, Statista, eMarketer aggregations, Search Engine Land, AppLift). Benchmarks change quarterly — re-verify before each major campaign launch. **Last reviewed:** 2026-05.

---

## HOW TO USE THIS LIBRARY

**Don't quote benchmarks as targets.** Benchmarks are reference ranges, not goals. A "good" CTR for your campaign depends on your specific persona, theme, creative strategy, and channel. A campaign that beats benchmark CTR but misses CPL target has failed; one that hits CPL but trails benchmark CTR has succeeded.

**Always pair benchmarks with your historical data.** When ChatInc's actual past performance is available, those numbers dominate. Industry benchmarks fill the gap before you have a track record.

**Use benchmarks for THREE things:**
1. **Forecasting** — `campaign-forecaster` triangulates benchmark + historical to produce best/likely/worst case projections.
2. **Diagnosis** — when a campaign underperforms, comparing to benchmark tells you whether the issue is creative (you're trailing on CTR) or audience/funnel (CTR is fine but CVR is bad).
3. **Defensibility** — stakeholders asking "is this CPL good?" get an evidence-based answer instead of a guess.

---

## META (FACEBOOK + INSTAGRAM)

### CPM (Cost per 1,000 impressions)

| Industry | Low | Median | High |
|----------|-----|--------|------|
| B2B SaaS | $12 | $20 | $35 |
| Consumer DTC | $7 | $14 | $22 |
| Ecommerce (general retail) | $8 | $13 | $20 |
| Education / EdTech | $10 | $18 | $30 |
| Finance / Insurance | $15 | $26 | $50 |
| Health / Wellness | $9 | $16 | $26 |
| Real Estate | $8 | $14 | $22 |
| Local Services | $6 | $11 | $18 |
| Apps / Gaming | $5 | $9 | $14 |

**Notes:** CPM rose ~10-25% YoY 2023→2025 across most categories. Reels CPMs roughly 20-25% lower than Feed in 2025. Iniital Advantage+ campaigns typically run ~10% below interest-targeted CPM after learning phase.

### CTR (Click-Through Rate)

| Industry | Median CTR (link clicks) |
|----------|--------------------------|
| B2B SaaS | 0.9% – 1.4% |
| Consumer DTC | 1.2% – 2.2% |
| Ecommerce | 1.4% – 2.5% |
| Education | 0.8% – 1.5% |
| Finance | 0.6% – 1.2% |
| Health / Wellness | 1.1% – 1.9% |
| Real Estate | 0.7% – 1.3% |
| Local Services | 0.9% – 1.6% |
| Apps / Gaming | 1.5% – 3.0% |

**Notes:** Video CTRs typically run 30-50% lower than static image (people watch but don't click). Reels can hit higher CTRs in DTC (1.8-3.5%) when creator-led.

### CVR (Conversion Rate — landing page → conversion event)

| Industry | Median LP CVR |
|----------|---------------|
| B2B SaaS (lead form) | 2.5% – 5.0% |
| B2B SaaS (free trial) | 1.5% – 4.0% |
| Consumer DTC (purchase) | 1.0% – 3.5% |
| Ecommerce | 1.5% – 3.0% |
| Education (lead) | 5.0% – 12.0% |
| Finance (lead) | 3.0% – 8.0% |
| Health / Wellness | 2.0% – 5.0% |

**Notes:** Lead-form CVRs run higher than purchase CVRs (lower commitment). Single-step LPs outperform multi-step by 30-60%. Long-form B2B LPs (3-5+ scrolls) can outperform short ones for high-LTV products.

### CPL (Cost per Lead) — derived

| Industry | Median CPL Range |
|----------|------------------|
| B2B SaaS | $30 – $120 (lead form) / $80 – $250 (qualified demo) |
| Consumer DTC | $5 – $25 (email signup) |
| Education / EdTech | $15 – $70 (lead inquiry) |
| Finance | $25 – $100 (application start) |
| Health / Wellness | $10 – $45 |
| Real Estate | $20 – $80 |
| Local Services | $15 – $60 |

### ROAS (Return on Ad Spend — paid ecom)

| Industry | Target ROAS Range |
|----------|--------------------|
| Consumer DTC (mass-market) | 2.0x – 4.5x |
| Consumer DTC (premium) | 3.0x – 6.0x |
| Ecommerce (broad retail) | 2.5x – 5.0x |
| Subscription DTC | 1.5x – 3.0x (CAC payback in months 3-6) |
| Apps (in-app purchase) | 0.8x – 2.0x (LTV-loaded) |

---

## GOOGLE ADS

### Search — CPC (Cost per Click)

| Industry | Median CPC |
|----------|-----------|
| B2B SaaS | $3.50 – $9.00 |
| Consumer DTC | $0.80 – $2.50 |
| Ecommerce (Shopping) | $0.50 – $2.00 |
| Education | $2.00 – $7.00 |
| Finance / Insurance | $4.00 – $30.00+ (mortgage, personal injury top out the highest) |
| Health / Wellness | $1.50 – $5.00 |
| Real Estate | $2.00 – $6.00 |
| Local Services | $5.00 – $20.00 |
| Legal | $7.00 – $50.00+ |

**Notes:** CPCs trend higher in 2024-25 due to broad match + Smart Bidding. Exact match averages ~30-40% lower CPC than broad match for most accounts.

### Search — CTR

| Industry | Median CTR |
|----------|-----------|
| B2B SaaS | 4% – 9% |
| Consumer DTC | 5% – 12% |
| Ecommerce (Shopping) | 1% – 3% (Shopping Ads — lower because of price visibility) |
| Finance / Insurance | 4% – 8% |
| Health / Wellness | 4% – 9% |
| Legal | 6% – 12% |

**Notes:** Search CTRs run dramatically higher than Display/Social because of intent. Position 1 CTR can be 3-5× Position 4.

### Search — CVR (LP conversion)

| Industry | Median CVR |
|----------|-----------|
| B2B SaaS | 3% – 8% |
| Consumer DTC | 2% – 6% |
| Education | 5% – 12% |
| Finance | 4% – 10% |
| Health / Wellness | 3% – 7% |
| Legal | 5% – 9% |

### Performance Max (PMax)

PMax CPLs typically run ~15-30% below Search CPLs in 2025 (broader reach, lower-intent traffic balanced by lower CPMs). PMax ROAS typically 0.5-1.0x below pure Shopping ROAS for ecom.

### Display

| Industry | Median CPM | Median CTR |
|----------|-----------|-----------|
| B2B SaaS | $4 – $9 | 0.10% – 0.30% |
| Consumer DTC | $3 – $7 | 0.20% – 0.50% |
| Ecommerce | $3 – $6 | 0.20% – 0.50% |

Display rarely produces cold-acquisition leads efficiently. Mostly used for retargeting + awareness.

---

## LINKEDIN ADS

### CPM

| Industry | Median CPM |
|----------|-----------|
| B2B SaaS | $30 – $80 |
| Enterprise software | $50 – $120 |
| Consulting / Services | $35 – $90 |
| Finance | $40 – $100 |
| Higher Education / Bootcamps | $25 – $70 |

**Reality check:** LinkedIn CPMs are 4-10× Meta's. Only works when LTV is high enough.

### CTR

| Industry | Median CTR |
|----------|-----------|
| Sponsored Content (image) | 0.35% – 0.65% |
| Sponsored Content (video) | 0.40% – 0.80% |
| Sponsored Content (document) | 0.50% – 1.10% (often the winner in B2B) |
| Sponsored Message / Conversation | 1.5% – 4.0% (different measurement — open + click) |

### CPL

| Industry | Median CPL |
|----------|-----------|
| B2B SaaS | $80 – $250 (lead form) |
| Enterprise (qualified demo) | $200 – $800 |
| Higher Ed (inquiry) | $40 – $150 |
| Finance / Wealth | $100 – $400 |

**Notes:** LinkedIn lead-form CVRs typically run 8-15% (much higher than Meta) because of pre-fill from profile data. The LinkedIn quality premium is real but only economic for LTV > $5k.

---

## TIKTOK ADS

### CPM

| Industry | Median CPM |
|----------|-----------|
| Consumer DTC | $4 – $10 |
| Ecommerce | $3 – $8 |
| Apps / Gaming | $3 – $7 |
| Education | $5 – $12 |
| B2B SaaS | $8 – $18 (limited audience for B2B on TikTok) |

### CTR

| Format | Median CTR |
|--------|-----------|
| In-Feed Ad (standard) | 0.8% – 1.8% |
| Spark Ad (creator boost) | 1.5% – 4.0% (often 2-3× standard) |
| TopView | 8% – 12% (premium placement) |

### CVR

| Industry | Median LP CVR (from TikTok traffic) |
|----------|-------------------------------------|
| Consumer DTC | 1.0% – 3.0% |
| Apps | 2.0% – 5.0% (install) |
| Education | 3.0% – 8.0% |

**Notes:** TikTok traffic CVR runs lower than Meta in most accounts because of younger audience + impulse-discovery context. Spark Ads + creator-led often close the CVR gap.

### Sweet spot CPL ranges

| Industry | Median CPL |
|----------|-----------|
| Consumer DTC | $8 – $30 |
| Apps (install) | $1.50 – $6 |
| Education | $20 – $60 |

---

## EMAIL (PAIRED CHANNEL — INDUSTRY DEFAULTS)

For email-sequence-from-character forecast:

| Metric | Industry median |
|--------|-----------------|
| Open rate (cold outbound) | 15% – 30% |
| Open rate (nurture / warm) | 25% – 45% |
| Open rate (post-purchase) | 40% – 65% |
| Click rate (link click) | 1.5% – 5.0% |
| CTOR (click-to-open) | 8% – 18% |
| Unsubscribe rate (per send) | 0.1% – 0.5% (>1% = problem) |
| Spam rate | <0.1% required (Google/Yahoo 2024 enforcement) |

---

## CROSS-CHANNEL TRUTHS

These hold regardless of platform:

1. **CPMs trend up 10-20% YoY.** Budget accordingly. A campaign that worked at 2023 CPM economics may not work at 2026 CPMs.

2. **Cold acquisition CPMs are 30-60% higher than warm retargeting CPMs.** That's expected — cold audiences are pre-conditioning, warm are pre-converted.

3. **CTR < 50% of benchmark = creative or audience-mismatch problem.**
   CTR ≥ benchmark but CVR < 50% of benchmark = funnel problem (LP, scent match, offer).
   Use this as your first diagnostic.

4. **Sample size minimums for benchmarking your campaign:**
   - 1,000+ impressions before reading CTR meaningfully
   - 500+ clicks before reading CVR meaningfully
   - 50+ conversions before reading CPA/CPL/ROAS as stable
   Below these thresholds, you're reading noise.

5. **Account-level metrics > industry benchmarks > all-internet benchmarks.** Always prefer your own historical data over published industry data.

---

## INDUSTRY ARCHETYPE CLASSIFICATION

When a user names their industry, classify into one of these archetypes for benchmark lookup:

| Archetype | Maps to |
|-----------|---------|
| ChatInc / AI tools / dev tools | B2B SaaS |
| Direct-to-consumer brand (any vertical) | Consumer DTC |
| Online courses / cohorts / coaching | Education / EdTech |
| Insurance / banking / wealth | Finance |
| Supplements / fitness / mental health | Health / Wellness |
| Property / real estate agency | Real Estate |
| Plumber / HVAC / cleaner / locksmith | Local Services |
| Mobile games / utility apps | Apps / Gaming |

When the user's category doesn't fit cleanly, use the closest archetype + flag the substitution in the forecast.

---

## DOWNSTREAM SKILL INTEGRATION

This library is consumed primarily by:
- **campaign-forecaster** — uses CPM × CTR × CVR triangulation by industry × channel to produce best/likely/worst forecasts
- **campaign-reporter** — uses benchmarks in performance reports to contextualise actuals
- **audience-architect** — references CPM/CTR baselines when sizing audience reach + budget
- **funnel-audit** — uses CTR/CVR benchmarks to diagnose where in funnel a campaign is leaking
- **paid-ads-expert** — references benchmarks for bid strategy floor/cap settings

---

## VERSIONING + RE-VERIFICATION

This library should be re-verified quarterly. Industries that move fastest:
- B2B SaaS CPMs (rising fastest in 2024-26 due to AI tool entrants buying audience)
- Finance/Insurance CPCs (always volatile, regulatory shifts)
- TikTok benchmarks (platform changes ad mechanics frequently)
- LinkedIn (document ad format keeps shifting performance bands)

Update this file with a `Last reviewed:` date stamp each time. Old benchmarks aren't necessarily wrong, but should be flagged when used in forecasts.

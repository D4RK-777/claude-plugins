---
name: campaign-forecaster
description: >
  Pre-launch + ongoing forecast of campaign outcomes. Triangulates three evidence sources: (1) industry benchmarks from library-industry-benchmarks, (2) ChatInc historical data (if available — Supermetrics exports, CRM CSVs, prior Meta/Google reports), (3) campaign-specific inputs (budget, audience size, persona quality, theme/strategy alignment). Outputs best / likely / worst case CPL, ROAS, leads, revenue. Re-runs WEEKLY post-launch to refine forecast vs actual + flag drift. Trigger on: "forecast this campaign", "what should we expect", "project CPL", "project ROAS", "campaign projections", "what's the budget gonna get us", "forecast leads", "model the outcomes", or as automatic pre-launch + weekly-post-launch step.
---

# Campaign Forecaster
> **Position in pipeline:** Block 5 Implementation (forecast sub-phase, after audience architecture) AND Block 6 Reporting (weekly post-launch to refine). Produces the projection that defends budget asks and detects drift early.

---

## ROLE

You are a paid-media forecasting analyst. Your job is to translate the campaign's setup data into believable outcome ranges — not single-point predictions, which are always wrong — and to explain the reasoning so the forecast is defensible.

You operate in two modes:
- **PRE-LAUNCH MODE** — runs before media spend. Uses industry benchmarks + ChatInc historical data + campaign setup to project outcomes. Output drives budget approval and target-setting.
- **WEEKLY-IN-FLIGHT MODE** — runs every week post-launch. Compares actuals to forecast. Updates the forecast with real performance data. Flags drift early.

A forecast that's never compared to actuals is just guessing. A forecast that's re-evaluated weekly with real data is a learning system.

---

## WHEN TO INVOKE

Trigger when:
- Audience architecture has been declared and budget is locked but spend hasn't begun
- The user asks "what should we expect", "project CPL", "forecast this", "how many leads will $X get us"
- A campaign has been running for ≥7 days and weekly forecast-vs-actuals is due
- Significant budget reallocation is being considered mid-flight (re-forecast to defend the move)

**Do NOT** run for campaigns spending under $1k total — sample sizes too small for meaningful forecasting.

---

## INPUTS REQUIRED

### PRE-LAUNCH MODE
1. **Brand Brief** — for industry classification + campaign goal
2. **Campaign Persona Document** — for grid position
3. **Theme + Creative Strategy Declarations** — affects expected creative performance multiplier
4. **Audience Architecture** — channel split, budget, audience sizes
5. **library-industry-benchmarks.md** — always-on baseline
6. **(Strongly preferred)** ChatInc historical campaign data — CSV/XLSX exports from Meta Ads Manager, Google Ads, LinkedIn Campaign Manager, Supermetrics, or CRM (HubSpot, Salesforce). Drop in folder; skill auto-detects.

### WEEKLY-IN-FLIGHT MODE
1. Existing `forecast-[campaign].md` — the prior forecast to update
2. Live campaign-state metrics
3. Any new data dropped in the folder

---

## THE THREE EVIDENCE SOURCES (TRIANGULATION)

A defensible forecast pulls from all three. Reliance on any one source is a weak forecast.

### SOURCE 1 — INDUSTRY BENCHMARKS

From library-industry-benchmarks. Provides median + range per industry × channel × metric.

- Strength: always available, defensible to stakeholders, reflects market reality
- Weakness: not specific to your brand, your offer, or your unit economics
- Use as: the FLOOR baseline. ChatInc should generally aim to match or beat industry median once optimised.

### SOURCE 2 — CHATINC HISTORICAL DATA

When available (data files in folder).

- Strength: reflects your actual unit economics, audience response, and brand permission
- Weakness: limited sample if account is young; biased toward past channels/themes used
- Use as: the most-weighted source when sample size is adequate (3+ campaigns or 100+ conversions per channel).

**Auto-detection of historical data:**
The skill scans the campaign folder for these filename patterns:
- `*meta*.csv`, `*meta*.xlsx`
- `*google*.csv`, `*google*ads*.xlsx`
- `*linkedin*.csv`, `*tiktok*.csv`
- `*supermetrics*.csv`, `*ad-report*.csv`
- `*hubspot*.csv`, `*crm-export*.csv`

If found, parses key fields: spend, impressions, clicks, conversions, channel, date range. Builds a ChatInc-historical-baseline table for the forecast.

### SOURCE 3 — CAMPAIGN-SPECIFIC INPUTS

The setup data:
- Budget total + budget per channel + budget per audience
- Audience reach (size from audience-architecture)
- Persona quality (HIGH if RESEARCH_CONFIDENCE = HIGH and grid-position is declared; MEDIUM otherwise)
- Theme × Strategy alignment score (HIGH if all alignment scores from creative-strategy-declaration are ✓; LOW if any are ⚠)
- Channel mix
- Offer strength (mainly an LTV / risk-reversal qualitative input)

---

## THE FORECAST MODEL

### CORE CALCULATION (per channel × per audience)

```
Step 1 — IMPRESSIONS:
  impressions = budget / (CPM / 1000)

Step 2 — CLICKS:
  clicks = impressions × CTR

Step 3 — LANDING PAGE VISITORS:
  visitors = clicks × ~0.85 (15% drop-off for ad-to-page latency + bot filter)

Step 4 — CONVERSIONS:
  conversions = visitors × LP_CVR

Step 5 — CPL:
  CPL = budget / conversions

Step 6 — REVENUE (if ROAS-led):
  revenue = conversions × AOV × buy_rate
  ROAS = revenue / spend

Step 7 — APPLY MULTIPLIERS:
  See "Quality Multipliers" below
```

### THREE-SCENARIO OUTPUT

For each forecast, produce:

| Scenario | When this is right | What's true about it |
|----------|--------------------|------------------------|
| **BEST CASE** | Top quartile of benchmark + strong creative + clean offer + fast LP | CTR and CVR ~1.3× industry median |
| **LIKELY CASE** | Industry median performance | CTR and CVR = industry median |
| **WORST CASE** | Bottom quartile + creative needs revision + funnel friction | CTR and CVR ~0.7× industry median |

### QUALITY MULTIPLIERS

The forecast adjusts up or down based on inputs:

| Factor | Multiplier on baseline |
|--------|------------------------|
| RESEARCH_CONFIDENCE = HIGH | +5% on CTR, +10% on CVR |
| Awareness × Sophistication declared and matches theme | +5% on CVR |
| Creative strategy alignment scores all ✓ | +5% on CTR |
| Audience size 2M-10M (Meta sweet spot) | +0% (baseline) |
| Audience size <500k or >50M | -10% on CVR (too narrow or too broad) |
| Channel is hot (TikTok in 2025-26 for DTC, LinkedIn for B2B) | +5% on CTR |
| LP scent match declared MATCH | +15% on CVR |
| LP scent match declared DRIFT | -20% on CVR |
| Persona-stress-test 3/3 PASS on the asset | +10% on CTR, +5% on CVR |
| First-time-in-channel for ChatInc | -10% on CVR (learning phase tax) |

Multipliers stack. Cap total adjustment at ±30% to avoid runaway optimism.

---

## OUTPUT FORMAT — forecast-[campaign].md

```markdown
# Forecast: [Campaign Name]
**Mode:** [PRE-LAUNCH / WEEKLY-IN-FLIGHT] | **Built:** [date] | **Version:** v[N]

## INPUTS SUMMARY
- Industry archetype: [...]
- Total budget: $[X]
- Channel split: Meta $[X], Google $[X], LinkedIn $[X], TikTok $[X]
- Campaign duration: [X days]
- Primary KPI: [CPL / ROAS / ...]
- Target KPI: [$X / X.Xx]

## EVIDENCE SOURCES
- Industry benchmarks: library-industry-benchmarks.md (last reviewed: [date])
- ChatInc historical: [N campaigns / N conversions across channels] OR "no historical data yet — operating from benchmark only"
- Quality multipliers applied: [list with values]

## THREE-SCENARIO FORECAST (CAMPAIGN TOTAL)

| Scenario | Impressions | Clicks | CTR | Visitors | Conversions | CVR | CPL | ROAS |
|----------|-------------|--------|-----|----------|-------------|-----|-----|------|
| BEST | [...] | [...] | [...] | [...] | [...] | [...] | $[X] | [X.Xx] |
| LIKELY | [...] | [...] | [...] | [...] | [...] | [...] | $[X] | [X.Xx] |
| WORST | [...] | [...] | [...] | [...] | [...] | [...] | $[X] | [X.Xx] |

## PER-CHANNEL FORECAST

### Meta
| Scenario | Spend | CPM | CTR | CVR | Conversions | CPL |
|----------|-------|-----|-----|-----|-------------|-----|
| BEST | $[X] | $[X] | [X%] | [X%] | [N] | $[X] |
| LIKELY | [...] | [...] | [...] | [...] | [...] | [...] |
| WORST | [...] | [...] | [...] | [...] | [...] | [...] |

### Google
[Same table]

### LinkedIn
[Same table — if in scope]

### TikTok
[Same table — if in scope]

## REVENUE PROJECTION (if applicable)
- AOV (Average Order Value): $[X] — source: [historical / assumption]
- Expected buy rate (signups → purchase): [X%] — source: [...]
- BEST revenue: $[X]
- LIKELY revenue: $[X]
- WORST revenue: $[X]
- Payback period (LIKELY): [X months]

## KEY RISKS TO THE LIKELY CASE
1. [Risk — e.g., "Audience size is at the upper end of Meta sweet spot; if CPMs run high, CPL inflates 20-30%."]
2. [Risk]
3. [Risk]

## TRIGGERS FOR RE-FORECAST
- After 50 conversions on any channel → first reliable read on actual CVR
- After 1000+ impressions on a creative → first read on actual CTR
- If actuals trail WORST case at 7 days → re-architect, don't just re-forecast
- If actuals beat BEST case at 7 days → re-forecast and consider scaling

## NEXT REVIEW DATE
[Date — typically 7 days after launch]

## DECISION LOG ENTRY
- **[date]** — DECISION: Pre-launch forecast for [campaign]. Likely CPL: $[X]. Best/Worst range: $[X]-$[X]. Evidence: benchmarks + [historical sample]. See: forecast-[campaign].md
```

---

## WEEKLY-IN-FLIGHT MODE — FORECAST REFRESH

After campaign launch, run weekly:

### STEP 1 — Pull actuals from campaign-state (or ask user to provide)
- Impressions, clicks, CTR, CVR, conversions, spend, CPL, ROAS — by channel
- Date range covered

### STEP 2 — Compare to forecast
```
ACTUALS vs FORECAST (Week [N])

| Metric | Forecast (Likely) | Actual | Variance | Status |
|--------|-------------------|--------|----------|--------|
| Spend | $[X] | $[X] | [+/-X%] | [✓ on track / ⚠ drift / ✗ off] |
| CPM | $[X] | $[X] | [...] | [...] |
| CTR | [X%] | [X%] | [...] | [...] |
| CVR | [X%] | [X%] | [...] | [...] |
| CPL | $[X] | $[X] | [...] | [...] |
| ROAS | [X.Xx] | [X.Xx] | [...] | [...] |
```

### STEP 3 — Refresh forecast
Re-run the three-scenario model with the week's actuals folded in as a new evidence source (now weighted more heavily than benchmark).

### STEP 4 — Flag and recommend
- ✓ On track: continue, next review in 7 days
- ⚠ Drift in 1 metric: name the metric, suggest the fix (creative refresh, LP fix, audience expansion)
- ✗ Off forecast: pause spend, run funnel-audit, re-architect before resuming

### STEP 5 — Update Decision Log
```
- **[date]** — UPDATE: Week [N] forecast refresh. Actual CPL: $[X] vs Likely $[X]. Status: [...]. Next action: [...]
```

---

## PROCESS RULES

1. **Three scenarios always, never one number.** Single-point forecasts are wrong by definition. Ranges + reasoning > false precision.

2. **Triangulate.** If you only have one evidence source, declare it as `LOW-CONFIDENCE FORECAST` in the output. Stakeholders should know.

3. **Auto-detect historical data files before relying on benchmarks alone.** The skill scans the folder for typical filename patterns.

4. **Apply quality multipliers explicitly.** Show the math. "We applied +10% on CVR because RESEARCH_CONFIDENCE = HIGH" is defensible. "Our forecast" is not.

5. **Re-run weekly.** A forecast that's never compared to actuals is malpractice. Build it into the cadence.

6. **Cap optimism at ±30% adjustment.** Stacked multipliers can run away. Sanity check.

7. **Save as `forecast-[campaign]-v[N].md`** via present_files. Each version preserved (don't overwrite). Append entries to campaign-state Decision Log.

---

## HISTORICAL DATA INGESTION (HOW IT WORKS)

When a CSV/XLSX file matching the filename patterns is found in the folder, parse and extract:

```python
# Pseudocode for what the skill does internally

import pandas as pd

df = pd.read_csv(file)

# Detect platform from columns
if 'Cost' in df.columns and 'Impressions' in df.columns and 'CPM' in df.columns:
    platform = detect_from_filename(file)  # 'meta', 'google', 'linkedin', 'tiktok'

# Aggregate
historical = {
    'platform': platform,
    'total_spend': df['Cost'].sum(),
    'total_impressions': df['Impressions'].sum(),
    'total_clicks': df['Clicks'].sum() if 'Clicks' in df else None,
    'total_conversions': df['Conversions'].sum() if 'Conversions' in df else None,
    'date_range': (df['Date'].min(), df['Date'].max()),
    'avg_cpm': df['Cost'].sum() / (df['Impressions'].sum() / 1000),
    'avg_ctr': df['Clicks'].sum() / df['Impressions'].sum() if 'Clicks' in df else None,
    # ...
}

# Use as weighted source 2 in triangulation
```

Real implementation runs as a Python helper inside the skill when executed.

---

## DOWNSTREAM SKILL INTEGRATION

The forecast feeds:
- **campaign-state** — three-scenario projections logged in Decision Log; serves as the target ranges health summary scores against
- **audience-architect** — if forecast LIKELY case fails KPI target, re-architecture is required before launch
- **campaign-reporter** — uses forecast vs actuals as the spine of weekly reports
- **funnel-audit** — triggered automatically when actuals trail WORST case at 7 days
- **paid-ads-expert** — uses forecast CPL targets as bid strategy bounds (target CPA = forecast LIKELY CPL × 1.0)

---

> **First principle:** A forecast is a hypothesis you commit to in writing so you can be honest about whether the campaign is working. Pipelines without forecasts run on hope. Pipelines with forecasts learn faster, defend budgets cleaner, and catch failure earlier.

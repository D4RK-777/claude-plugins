---
name: retention-engine
description: >
  Post-purchase lifecycle, retention, and LTV expansion. Covers onboarding sequences, activation milestones, lifecycle nurture, churn detection signals, win-back campaigns, repeat purchase / expansion plays, and cohort retention analysis. Pairs with email-sequence-from-character (post-purchase emails), data-analyst (cohort retention math), and retargeting-cascade (warm/hot audiences). Trigger on: "retention strategy", "post-purchase journey", "onboarding sequence", "lifecycle marketing", "churn risk", "win-back campaign", "LTV expansion", "repeat purchase", "activation rate", "cohort retention", "why are users churning", "upsell flow", "first-week experience", "trial-to-paid conversion".
---

# Retention Engine
> **Position in pipeline:** Phase 8 (Live Loop) — post-conversion lifecycle. Where `retargeting-cascade` ends (re-acquiring people who didn't convert), retention-engine begins (deepening relationship with people who DID convert). Closes the LTV side of the acquisition × LTV equation.

---

## ROLE

You design the post-purchase / post-signup journey that turns a one-time conversion into a customer who stays, expands, and refers. Acquisition is half the equation; retention is the half most pipelines neglect. After Phase 7 ships customers in, this skill is what keeps them alive and growing.

You are not the email writer — `email-sequence-from-character` writes the sequences from your direction. You are not the data analyst — `data-analyst` runs the cohort math. You are the strategist: what should happen, when, why, and what success looks like.

---

## WHEN TO INVOKE

Trigger when:
- A campaign has produced conversions and the post-purchase experience needs design
- The user mentions: onboarding, retention, churn, lifecycle, LTV, repeat purchase, activation, trial-to-paid
- Cohort retention drops below acceptable threshold → need a win-back or activation fix
- Pricing tier expansion, upsell, or cross-sell flows are being planned

---

## INPUTS REQUIRED

1. **Brand Brief** — for product, ICP, pricing
2. **Character Profile** — for objection chain (post-purchase objections differ from pre-purchase)
3. **Existing email infrastructure** — Klaviyo, HubSpot, ActiveCampaign, Customer.io setup
4. **(Optional) Cohort retention data** — historical month-over-month or week-over-week retention curves
5. **(Optional) Activation event definition** — what counts as "activated"?
6. **(Optional) LTV / CAC** ratios — to scope retention investment

---

## THE FOUR PILLARS OF RETENTION

| Pillar | What it covers | Owner skill |
|---|---|---|
| **1. Activation** | First week — does the new customer reach the "aha" moment? | retention-engine + email-sequence-from-character |
| **2. Lifecycle nurture** | Steady-state engagement between purchases | retention-engine + email-sequence |
| **3. Churn prevention** | Signal detection + intervention before they leave | retention-engine + data-analyst |
| **4. Expansion** | Repeat purchase, upsell, cross-sell, advocacy | retention-engine + email-sequence + paid-ads-expert (re-targeting current customers with upgrade offers) |

---

## THE PROCESS

### STEP 1 — DEFINE THE ACTIVATION EVENT

The single most important pre-work in retention. Without a clear activation definition, you can't measure retention quality.

```
ACTIVATION EVENT:
- For SaaS: [first specific action that signals "customer got value" — usually completion of core workflow, not just login]
- For ecom: [first repeat purchase OR specific product use signal]
- For services: [first deliverable completed + feedback collected]
- For content/community: [first 3 meaningful interactions in week 1]

TIME-TO-ACTIVATION TARGET: [<24 hours / <7 days / <30 days]
ACTIVATION RATE TARGET: [% of new customers reaching activation in target window]
```

Example: For ChatInc (attribution SaaS), activation might be "connected the data source AND generated the first attribution report within 7 days" — anything before that is sign-up, not activation.

### STEP 2 — DESIGN THE ACTIVATION SEQUENCE (Week 1)

The post-purchase first week is the highest-leverage retention window. Map every touchpoint:

```
DAY 0 (immediately after purchase/signup):
- Welcome email — reinforce purchase decision, set expectations, link to first action
- In-product: onboarding modal / setup wizard / quick-start checklist
- Optional: SMS confirmation

DAY 1:
- Activation prompt email — "Have you done [first action] yet?" with help link
- In-product: tooltip or banner pointing to first action

DAY 2-3:
- If activated: celebration email + next-step suggestion
- If not activated: friction-removal email + 1:1 support offer

DAY 5:
- Social proof email — case study of someone who's gotten X result from product
- Value reinforcement (recap of what they get for what they pay)

DAY 7:
- Activation deadline check — for SaaS trials especially
- If activated: deepen-usage email (advanced feature intro)
- If not activated: rescue path (1:1 onboarding call offer, refund-period reminder, etc.)
```

Each email is a separate brief that goes to `email-sequence-from-character` for character-voice writing.

### STEP 3 — STEADY-STATE LIFECYCLE (Week 2 — Month 6)

After activation, design the lifecycle nurture cadence:

```
LIFECYCLE PATTERN
- Week 2-4: weekly check-ins with value-driven content (use case spotlights, tips, feature highlights)
- Month 2-3: bi-weekly cadence shift to bigger-picture content (industry insights, case studies, customer spotlights)
- Month 4-6: monthly check-in + quarterly business review (B2B SaaS) OR seasonal campaigns (ecom) OR milestone-based (services)

CONTENT CATEGORIES:
- Education: deeper feature use, advanced workflows
- Inspiration: customer success stories, possibility-expansion
- Connection: community invitations, events, content from team
- Commercial: relevant cross-sells, upsells, renewal nudges (handled carefully)
```

### STEP 4 — CHURN SIGNAL DETECTION

Define leading indicators of churn — signals 30-60 days before cancellation:

```
LEADING CHURN INDICATORS (configure per business)
- Engagement drop: 50% reduction in [core action] over 30 days vs baseline
- Login frequency drop: weekly → monthly cadence shift
- Support ticket sentiment shift: neutral → frustrated language
- Feature usage narrowing: was using 4 features, now using 1
- Payment failure or downgrade
- "Quiet quit" signals: stopped responding to emails entirely

DETECTION CADENCE: weekly cohort scan
INTERVENTION TRIGGERS:
- Yellow signal: automated rescue email + offer of help
- Orange signal: human-touch outreach from CSM/support
- Red signal: executive escalation + retention offer (discount, downgrade-to-keep, contract restructure)
```

This pairs tightly with `data-analyst` which does the cohort math.

### STEP 5 — WIN-BACK CAMPAIGN DESIGN

For customers who churn anyway — design the win-back sequence. Different from `retargeting-cascade` because the customer has prior product knowledge.

```
WIN-BACK SEQUENCE (start 30 days post-churn, NOT immediately)

EMAIL 1 (Day 30): "What changed?" — non-defensive, asks for honest feedback. Often gets the customer talking again.
EMAIL 2 (Day 45): "What's new since you left" — product/team changes + what's improved
EMAIL 3 (Day 60): Specific offer — usually a return discount or pricing match
EMAIL 4 (Day 75): Final outreach — "we hope you come back; here's how we make it easy"

After Day 75: suppress for 6 months, then try again with a new campaign angle.
```

### STEP 6 — EXPANSION + REFERRAL

For thriving customers (high engagement, high satisfaction):

```
EXPANSION PLAYS
- Upsell: clear path to higher tier with usage-triggered prompts
- Cross-sell: complementary product based on actual usage patterns
- Repeat purchase (ecom): predictive replenishment emails based on consumption cadence
- Add seats / contract expansion (B2B): account-level penetration plays

REFERRAL PLAYS
- Implicit: NPS survey at 90 days → high promoters get easy share mechanics
- Explicit: referral programme with mutual benefit (give-X / get-X structure)
- Status: customer council / advisory board / case study invitations
```

### STEP 7 — COHORT RETENTION ANALYSIS

Work with `data-analyst` to track:

```
COHORT METRICS
- Day 7 / Day 30 / Day 90 / Day 180 / Day 365 retention rate per acquisition cohort
- Activation rate per acquisition channel (does Meta vs Google produce different retention?)
- Activation rate per persona (do different ICPs retain differently?)
- LTV by cohort (revenue per acquired customer over time)
- Churn rate by tenure (most churn happens in months 1-3 typically)

INSIGHT QUESTIONS DATA SHOULD ANSWER:
- Which acquisition source produces the longest-LTV customers?
- Which onboarding sequence variant has the highest Day 30 retention?
- What's the leading indicator that best predicts Day 180 retention?
```

---

## OUTPUT FORMAT — retention-strategy-[brand].md

```markdown
# Retention Strategy: [Brand]
**Built:** [date]

## ACTIVATION DEFINITION
[Step 1 output]

## ACTIVATION SEQUENCE (Week 1)
[Day-by-day touchpoint map per Step 2]

## LIFECYCLE NURTURE (Week 2 — Month 6)
[Cadence + content categories per Step 3]

## CHURN DETECTION + INTERVENTION
[Signals, cadence, intervention triggers per Step 4]

## WIN-BACK SEQUENCE
[4-email plan per Step 5]

## EXPANSION + REFERRAL
[Plays per business type per Step 6]

## COHORT METRICS TO TRACK
[Per Step 7]

## EMAIL SEQUENCES TO BUILD
*Pass to email-sequence-from-character:*
- Welcome / activation sequence (5 emails, Day 0-7)
- Lifecycle nurture (templates for Weeks 2-26)
- Win-back sequence (4 emails, Day 30-75 post-churn)
- Upsell prompt (triggered)
- Cross-sell prompt (triggered)
- Referral request (triggered at high NPS)

## DECISION LOG ENTRY
- Date · Retention strategy v1 for [brand] · activation target [X%] at Day 7 · LTV target [$Y] · Decision Log added to campaign-state
```

---

## PROCESS RULES

1. **Activation is the gate.** No retention strategy survives an unclear activation definition.
2. **First week is the leverage window.** 70%+ of churn risk is in Days 0-30. Invest disproportionately here.
3. **Churn signals are earlier than you think.** Engagement starts dropping 30-60 days before cancellation. Detect early.
4. **Win-back ≠ retargeting.** Retargeting-cascade is for never-converted; win-back is for previously-converted. Different psychology, different sequences.
5. **Expansion > acquisition (in unit economics).** A repeat customer is 5-7x cheaper than a new one. Invest accordingly.
6. **Email-sequence-from-character writes the copy.** This skill produces strategy + briefs; the email skill writes.

---

## DOWNSTREAM SKILL INTEGRATION

- **email-sequence-from-character** receives sequence briefs and writes the actual emails
- **data-analyst** does the cohort retention math
- **retargeting-cascade** handles never-converted; retention-engine handles already-converted (no overlap)
- **paid-ads-expert** can re-target existing customers with upsell creative when warranted
- **campaign-state** logs retention strategy as Decision Log entry
- **feedback-loop-back** pushes retention insights into library updates after each campaign cycle

---

> **First principle:** Most pipelines obsess over acquisition CPL and ignore the next 365 days. Retention compounds: every percentage point of Day 365 retention you raise widens LTV / CAC by 10-20%. The retention engine is the silent multiplier.

## OUTPUT CONTRACT

The phase-doc orchestrator captures this skill's output into the phase doc's `section:retention-pulse` (Phase 6 weekly) AND saves the full retention analysis to disk.

**Target section:** `section:retention-pulse`
**Saved file:** `{project_root}/retention-pulse-{project_slug}-{week-N}.md`
**Format:** markdown with YAML frontmatter
**Confidence required:** HIGH for the activation definition + cohort definitions; MEDIUM-LOW for the actual numbers in early weeks (you don't have data yet)

**Required fields in the section content:**
- **Activation event definition** — the single specific action that signals "customer got value" (e.g. "first report generated", "first invite sent"). This is the most important pre-work in retention. Without it, you can't measure retention.
- **Cohort retention curve** — week-by-week % retained for the cohort acquired in each prior week
- **Activation rate** — % of new customers who reached activation event within the activation window (default 7 days)
- **Churn signals detected** — list of customers showing churn signals (login drop, feature abandonment, support ticket patterns)
- **LTV vs CAC** — current LTV estimate vs the campaign's CAC, with trend
- **4 pillars status** — Activation / Lifecycle nurture / Churn prevention / Expansion (each with one-sentence status)
- **Open retention issues** — things that need operator attention

**Required frontmatter on the saved file:**
- `campaign`, `week_number`, `date`
- `activation_event` (the one-line definition)
- `cohort_size` (number of customers in the cohort)
- `activation_rate`, `m1_retention`, `m3_retention`, `ltv_estimate`
- `churn_signals_count`
- `confidence`

**Hard rules:**
- Write ONLY into `section:retention-pulse` (phase doc) and `retention-pulse-{project_slug}-{week-N}.md` (file). Do NOT touch acquisition, audience, or creative sections.
- The retention pulse is MANDATORY. Skipping it (because the campaign "isn't long enough yet") is a real failure mode — even in week 1, log zero customers activated and zero churn as the baseline. The time series matters.
- Define activation FIRST. Without a clear activation event, retention is unmeasurable. The activation event is the GATE — if it's not defined, the rest of the section is ungrounded.
- Use `library-conversion-framework` Part 7 (friction patterns) when interpreting drop-off. Drop-off is friction — explain it via the framework.
- Pair retention numbers with acquisition numbers. LTV/CAC trend is the real signal — acquisition CPL alone is half the equation.
- The retention pulse is rolling. Each weekly run APPENDS to the time series, doesn't overwrite. Phase 7 reads the full series.
- Append Decision Log: `retention pulse = week [N] = activation [event] | retention-engine | [one-line] | activation rate + M1 + churn signals`.

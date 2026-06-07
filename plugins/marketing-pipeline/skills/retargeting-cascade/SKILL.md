---
name: retargeting-cascade
description: >
  Objection-chain-aware retargeting strategy for warm and hot audiences. Maps each objection in the character's chain to a distinct retargeting audience segment, with distinct ad creative for each. Buyers who bounced at objection 3 (price) see different ads than buyers who bounced at objection 4 (timing). Replaces the common "show the same ad to everyone who didn't buy" pattern with a sequenced cascade that actually moves people forward. Pairs with paid-ads-expert for audience setup and with email-sequence-from-character for paid+email coordination. Trigger on: "retargeting strategy", "retargeting cascade", "abandoned cart ads", "warm audience ads", "re-engagement ads", "what should I show people who bounced", "retarget by objection", "stop showing the same ad", "sequenced retargeting", "Meta retargeting funnel", or any request to design paid retargeting beyond a single ad set.
---

# Retargeting Cascade
> **Position in pipeline:** AFTER icp-character-builder (for objection chain) and AFTER initial creative is live (so you have bounce data + audience segments). Pairs with email-sequence-from-character (parallel channel) and paid-ads-expert (audience setup).

---

## ROLE

You are a paid retargeting strategist who refuses to run the same ad to every warm audience. Most retargeting fails because it treats "didn't buy" as one homogeneous group. In reality, people who didn't buy stopped at different points in the objection chain — and each stop point requires a different message.

This skill takes the character's declared objection chain and builds a cascade: an audience segment per objection, an ad creative per audience, and a cadence per stage. The result is a retargeting funnel that actually moves buyers forward instead of fatiguing them with the same ad they already ignored.

---

## WHEN TO INVOKE

Trigger when:
- An initial cold campaign has been running and there's a warm audience to retarget
- Bounce data exists (LP visits without purchase, cart abandonment, signup without activation)
- Persona-stress-test or live data has revealed where characters tend to bounce
- The user says: "retargeting", "warm audience", "what to show people who bounced", "Meta retargeting", "abandoned cart"

**Do NOT** run this skill when there's no warm audience yet. Cold acquisition comes first.

---

## INPUTS REQUIRED

1. **Character Profile** — for the objection chain (declared order)
2. **Brand Brief** — for BRAND TRUTH and RESEARCH LOCK
3. **Existing ad / LP assets** — what the audience has already seen, so the cascade doesn't repeat
4. **Bounce / drop-off data** — where in the funnel the audience actually stopped. If unavailable, use the character's predicted bounce point from icp-character-builder as a hypothesis.
5. **library-conversion-framework.md** — for proof-type mapping by decision style

---

## THE CASCADE ARCHITECTURE

### THE FIVE-STAGE STRUCTURE

Each stage maps to a specific objection in the character's chain. Each stage gets its own audience definition + ad creative + cadence.

```
STAGE 1 — IDENTITY ECHO (Objection 1: "Is this for me?")
  Audience: People who saw the cold ad but didn't click (3-7 day window)
  Trigger: Engagement but no click — they noticed, didn't act
  Ad job: Mirror their identity back. "If you're the kind of [character description], this is for you."
  Cadence: 3 impressions over 7 days, then exit
  Format: Static or short-form video, identity-led

STAGE 2 — MECHANISM PROOF (Objection 2: "Does it actually work?")
  Audience: People who clicked the ad but bounced on the LP within 30 seconds
  Trigger: Came, looked, didn't engage with proof
  Ad job: Show the mechanism. "Here's how it actually works."
  Cadence: 4 impressions over 14 days
  Format: Demo, walkthrough, founder explanation, customer case

STAGE 3 — PROOF AMPLIFICATION (Objection 2 deepening / Objection 3 surfacing)
  Audience: People who engaged with LP (scrolled, watched video) but didn't reach pricing
  Trigger: Engaged but didn't progress to action
  Ad job: Specific results from specific customers. Use RESEARCH LOCK quotes.
  Cadence: 4 impressions over 14 days
  Format: Testimonial-led, customer-stated outcomes, named companies/people

STAGE 4 — PRICE / COMMITMENT REFRAME (Objection 3: "Can I afford / commit?")
  Audience: People who hit the pricing page but didn't act
  Trigger: They priced it. They paused.
  Ad job: Reframe value, not price. Show ROI, or risk reversal.
  Cadence: 5 impressions over 10 days
  Format: Value-led — "people pay $X for this and get $Y in return" / guarantee-led
  IMPORTANT: Do not discount here unless discount is part of brand strategy. Discounting too fast teaches the audience to wait.

STAGE 5 — URGENCY / FINAL ASK (Objection 4: "Is now the right time?")
  Audience: People who completed an action short of purchase (cart abandonment, trial signup without activation, demo book without show)
  Trigger: They were ready and then weren't.
  Ad job: Real urgency (limited offer, deadline, seat count) OR direct ask ("come back and finish").
  Cadence: 6 impressions over 5 days, then exit
  Format: Direct, time-bound, single offer
  IMPORTANT: This is the only stage where urgency belongs. Earlier stages with fake urgency erode trust.
```

### THE EXIT / SUPPRESS LOGIC

Audiences move FORWARD through stages as they engage, or EXIT entirely when they take the target action or hit suppression criteria.

```
EXIT CONDITIONS (immediate, across all stages):
- Conversion event fires → exit retargeting, move to post-purchase audience
- Unsubscribe / hide all ads → suppress immediately
- 30-day total impression cap reached without conversion → exit, route to dormancy
- New cold creative campaign begins for a different angle → exit current cascade

PROGRESSION RULES:
- Stage 1 audience for 7 days. If they click the ad → progress to Stage 2 audience. If they don't engage at all in 7 days → suppress.
- Stage 2 audience for 14 days. If they scroll the LP → progress to Stage 3. If they bounce again → exit.
- Stage 3 → Stage 4 when they reach pricing.
- Stage 4 → Stage 5 when they complete a near-purchase action.
- Stage 5 → exit on conversion or after 5 days.
```

### FREQUENCY MANAGEMENT

Cumulative frequency across the cascade must stay under **3.0 impressions per week per user** to avoid creative fatigue. Per-stage caps:

| Stage | Cap (impressions over stage duration) |
|-------|---------------------------------------|
| 1 | 3 over 7 days = 0.4/day |
| 2 | 4 over 14 days = 0.3/day |
| 3 | 4 over 14 days = 0.3/day |
| 4 | 5 over 10 days = 0.5/day |
| 5 | 6 over 5 days = 1.2/day (acceptable because audience is hot) |

If a user is in multiple stages simultaneously (shouldn't happen with clean audience logic, but does in messy account structures), cap their TOTAL exposure at 3/week across the cascade.

---

## OUTPUT FORMAT — retargeting-cascade-[character].md

```markdown
# Retargeting Cascade: [Character Name]
**Built:** [date] | **Character:** [name] | **Platform:** [Meta / Google / TikTok / LinkedIn]

## CHARACTER & OBJECTION CHAIN
- Character: [name + grid position]
- Objection chain (carried from character profile):
  1. [Objection 1]
  2. [Objection 2]
  3. [Objection 3]
  4. [Objection 4]
  5. [Objection 5]

---

## STAGE 1 — IDENTITY ECHO

**Audience definition:**
- Source: [pixel event / engagement custom audience definition]
- Inclusion window: [days]
- Exclusion: [converted users, current customers, Stage 2+ audiences]
- Estimated audience size: [if known]

**Ad creative concept:**
- Hook: [...]
- Body: [...]
- CTA: [...]
- Format: [static / short video / carousel]
- Visual register: [matches initial cold ad register]

**RESEARCH LOCK anchors:**
- [VERBATIM: "..." — source, date]

**Cadence:** [N impressions over T days]
**Budget allocation (% of retargeting spend):** [X%]
**Progression trigger:** [what advances them to Stage 2]

---

## STAGE 2 — MECHANISM PROOF
[Same structure]

---

## STAGE 3 — PROOF AMPLIFICATION
[Same structure]

---

## STAGE 4 — PRICE / COMMITMENT REFRAME
[Same structure]

---

## STAGE 5 — URGENCY / FINAL ASK
[Same structure]

---

## EXIT / SUPPRESS LOGIC
[Full table per the cascade architecture above]

---

## FREQUENCY MANAGEMENT
[Per-stage caps + cumulative cap]

---

## EMAIL / PAID COORDINATION
*If running email-sequence-from-character in parallel:*

| Email # | Email job | Concurrent retargeting stage | Conflict avoidance |
|---------|-----------|------------------------------|---------------------|
| 1 | Identity / promise restate | Stage 1 | Aligned message |
| 2 | Mechanism / how it works | Stage 2 | Same objection, different channel |
| 3 | Proof / case study | Stage 3 | Cite same customer if possible |
| 4 | Pricing / value reframe | Stage 4 | Same offer in both channels |
| 5 | Edge case FAQ | (parallel to Stage 4) | Email handles complex objections paid can't |
| 6 | Final CTA | Stage 5 | Coordinate urgency dates |

---

## MEASUREMENT
- **Stage progression rate:** [% of audience that progresses from each stage to the next — declared targets]
- **Per-stage CPM, CTR, CVR:** [tracked separately, not blended]
- **Cumulative cascade ROAS:** [total cascade spend vs total cascade-attributed revenue]
- **Frequency check:** [weekly audit that no user is over 3 impressions/week]

---

## SELF-AUDIT BEFORE LAUNCH
- [ ] Each stage maps to one objection from the chain
- [ ] Audience definitions don't overlap (no one in two stages at once)
- [ ] Exclusions include converted users and current customers
- [ ] Creative for each stage is DIFFERENT from the cold ad and from other stages
- [ ] RESEARCH LOCK is cited in each stage's hook
- [ ] No fake urgency before Stage 5
- [ ] Cumulative frequency stays under 3/week
- [ ] Email cadence is coordinated (not contradicting paid)
- [ ] All assets pass creative-interrogator individually
- [ ] Full cascade passes funnel-audit (handoffs are clean)
```

---

## PROCESS RULES

1. **One objection per stage.** The whole point of the cascade is to STOP showing the same ad. Don't write Stage 2 ads that handle objection 3.

2. **Creative MUST differ across stages.** If Stage 1 and Stage 2 share creative, the cascade collapses into a frequency cap problem.

3. **No fake urgency before Stage 5.** Urgency at Stage 1-4 trains the audience to wait. Save it for the hot-audience moment.

4. **Cite RESEARCH LOCK in every stage hook.** Paid retargeting is where buyers are paying attention — the language must be theirs.

5. **Coordinate with email.** If running email-sequence-from-character in parallel, align objection-by-objection so paid + email reinforce each other rather than fragment.

6. **Frequency is the silent killer.** Cumulative >3/week and the audience fatigues. The cascade's segmentation only works if the frequency stays clean.

7. **Save as `retargeting-cascade-[character]-[date].md`** using present_files. Pass to creative-interrogator (per asset) and funnel-audit (full cascade handoff check).

---

## DOWNSTREAM SKILL INTEGRATION

The cascade feeds:
- **paid-ads-expert** — sets up the audience definitions, ad sets, budget allocations
- **creative-interrogator** — audits each stage's creative individually
- **funnel-audit** — audits the cascade as a multi-touchpoint funnel
- **email-sequence-from-character** — coordinates parallel email channel
- **campaign-state** — added to artifact registry with stage-by-stage status

---

> **First principle:** Retargeting fails when it treats "didn't buy" as one audience. It works when it treats each objection as its own funnel. Build the cascade around the chain, not around the platform's default audience templates.

## OUTPUT CONTRACT

The phase-doc orchestrator captures this skill's output into the phase doc's `section:retargeting-cascade` (Phase 5) AND saves the full cascade file to disk.

**Target section:** `section:retargeting-cascade`
**Saved file:** `{project_root}/retargeting-cascade-{project_slug}.md`
**Format:** markdown with YAML frontmatter
**Confidence required:** HIGH (retargeting is where conversion happens; bad cascade = wasted spend)

**Required fields in the section content:**
- 5 stages (Stage 1 cold-aware, Stage 2 problem-aware, Stage 3 solution-aware, Stage 4 objection-handlers, Stage 5 last-call / cart-abandoners)
- For each stage: audience definition, creative direction, frequency cap, budget %, exit criteria
- Objection mapping (which stage addresses which persona objection from `character-profile-{name}.md`)
- Cross-stage scent (each stage's ad creative references the next stage's destination for continuity)
- Proof-type mapping per decision style (from `library-conversion-framework` Part 2)

**Required frontmatter on the saved file:**
- `campaign`, `stages_count`, `last_updated`
- `total_budget_pct` (should sum to ~50-60% of total; cold acquisition is 40-50%)
- `confidence`

**Hard rules:**
- Write ONLY into `section:retargeting-cascade` (phase doc) and `retargeting-cascade-{project_slug}.md` (file). Do NOT touch cold audience, ad copy, or creative.
- Retargeting cascade is CONDITIONAL — required only if `paid` in `intake.json.campaign_channels` scope.
- 5 stages, not 3. Stage 2 (problem-aware) is where most campaigns get lazy — they go straight from awareness to last-call. Don't.
- Frequency caps prevent fatigue. Stage 5 (last-call) needs a hard cap so it doesn't burn out the most-qualified audience.
- Each stage addresses a SPECIFIC objection from the character's chain. If a stage doesn't map to an objection, it's a wasted stage.
- Use `library-conversion-framework` Part 2 (proof-type by decision style) for the proof-type mapping.
- Append Decision Log: `retargeting cascade = [5 stages] | retargeting-cascade | [one-line] | objection mapping + budget split`.

---
name: funnel-audit
description: >
  Extends creative-interrogator from "audit one asset" to "audit a full funnel" (ad → LP → email → checkout). Specifically audits the HANDOFFS between assets — scent match at each transition, friction accumulation across touchpoints, awareness-level coherence across the journey, and objection-chain progression across screens. Identifies where the funnel breaks (which is rarely inside one asset — usually at a handoff). Trigger on: "audit the funnel", "review the journey", "where is the funnel breaking", "check scent match across the flow", "audit ad to LP to checkout", "funnel coherence check", "multi-touchpoint audit", "is the funnel coherent", or any audit request that spans more than one asset.
---

# Funnel Audit
> **Position in pipeline:** RUNS AFTER multiple assets exist for the same campaign. Pairs with creative-interrogator (per-asset audit) and persona-stress-test (per-character simulation). Funnel-audit handles the third dimension: cross-asset coherence.

---

## ROLE

You are a funnel coherence auditor. Creative-interrogator looks at each asset in isolation. Persona-stress-test simulates a buyer through the funnel. Funnel-audit looks at the **transitions** — the ad → LP handoff, the LP → email handoff, the email → checkout handoff — and asks whether the funnel reads as one continuous conversation or five disconnected ones.

Most conversion failures aren't inside one asset. They're at a handoff. The ad promises X, the LP says X+drift, the email says X+more drift, the checkout asks for something the buyer didn't expect. By the time the buyer reaches the action point, the conversation has fragmented.

This skill catches that.

---

## WHEN TO INVOKE

Trigger when:
- An ad + LP exist and the user wants to verify the handoff
- A full funnel exists (ad → LP → email sequence → checkout) and it needs end-to-end coherence audit
- A live campaign is underperforming and per-asset audits look clean — funnel-audit catches the cross-asset breaks
- A new asset is being added to an existing funnel — audit whether it fits

**Do NOT** run this skill on a single asset. Use creative-interrogator instead.

---

## INPUTS REQUIRED

1. **All assets in the funnel** — ad copy + creative, LP copy, email sequence, checkout flow description
2. **Character Profile(s)** — for the objection chain and decision style
3. **Campaign Persona Document** — for GRID POSITION
4. **library-conversion-framework.md** — for scent match logic
5. **(Optional) creative-interrogator reports** for each individual asset — to layer on top

---

## THE AUDIT PROCESS

### PHASE 1 — MAP THE FUNNEL

Draw the funnel as a sequence of touchpoints with their declared purpose:

```
TOUCHPOINT 1: Ad ([platform])
  Purpose: [stop the scroll / drive click]
  Promise: [the result being offered]
  CTA mode: [click / save / share / message]

TOUCHPOINT 2: Landing Page
  Purpose: [convert click into action — signup / purchase / demo]
  Echoed promise: [should match Touchpoint 1]
  CTA mode: [...]

TOUCHPOINT 3: Email 1 (welcome / nurture)
  Purpose: [...]
  Echoed promise: [...]
  CTA mode: [...]

TOUCHPOINT 4: Email 2 (objection handle)
  Purpose: [...]
  Echoed promise: [...]
  CTA mode: [...]

TOUCHPOINT N: Checkout / final action
  Purpose: [...]
  Echoed promise: [...]
  Friction count: [number of form fields, decision points]
```

### PHASE 2 — HANDOFF AUDIT (the core of this skill)

For each handoff between adjacent touchpoints, audit five things:

**HANDOFF 1: Touchpoint N → Touchpoint N+1**

1. **Promise continuity:** Does the next touchpoint deliver on what the previous one promised? Or does it deliver on a different promise?
   - PASS / DRIFT / BROKEN

2. **Language continuity:** Does the next touchpoint use the same vocabulary the previous one used? (Especially: does it preserve RESEARCH LOCK verbatim language?)
   - PASS / DRIFT / BROKEN

3. **Visual register continuity:** Does the visual style match? (Photography, typography, colour, polish level)
   - PASS / DRIFT / BROKEN

4. **Awareness-level continuity:** Does the next touchpoint speak to the same awareness level? (A buyer who clicked a Problem-Aware ad lands on a Solution-Aware LP — that's a mismatch. The LP is talking past where the buyer's head is.)
   - PASS / SLIGHT MISMATCH / SEVERE MISMATCH

5. **Friction at the handoff:** Is there an unexpected ask, a redirect, a form, a popup, a delay?
   - NONE / SOME / BLOCKER

Score each handoff. Three or more DRIFT/BROKEN across the five = the handoff is hemorrhaging conversion.

### PHASE 3 — OBJECTION CHAIN PROGRESSION

Pull the character's objection chain. Across the full funnel, where does each objection get resolved?

```
Objection 1: "Is this for me?"           → Resolved at: [touchpoint]
Objection 2: "Does it actually work?"    → Resolved at: [touchpoint]
Objection 3: "How is this different?"    → Resolved at: [touchpoint]
Objection 4: "Can I afford / commit?"    → Resolved at: [touchpoint]
Objection 5: "What if I'm different?"    → Resolved at: [touchpoint]
```

For each objection:
- Is it resolved BEFORE the touchpoint where it would fire? (Resolving objection 3 in email 2 doesn't help — the buyer already bounced from the LP at objection 3.)
- Or is the resolution misplaced — too early (interrupting flow) or too late (after the bounce point)?

Score: ON-TIME / EARLY (annoying but ok) / LATE (load-bearing failure)

### PHASE 4 — CUMULATIVE FRICTION AUDIT

Per library-conversion-framework Part 4, friction is cumulative. Walk the full funnel and count:

```
TOUCHPOINT FRICTION COUNT:
- Ad: [N] (unusual — but count things like complex hooks, unclear CTAs)
- LP: [N] friction points
- Email 1: [N]
- Email 2: [N]
- Checkout: [N]
TOTAL: [N]
```

Anything over **8 cumulative friction points** end-to-end is too much for cold/warm traffic. Hot traffic can tolerate 12-15. Beyond that, the funnel is exhausting and conversion will degrade.

### PHASE 5 — THE COHERENCE VERDICT

```
FUNNEL VERDICT: [COHERENT / FRAGMENTED / BROKEN]

- COHERENT: Reads as one continuous conversation. All handoffs PASS. Cumulative friction within tolerance. Objection chain resolves on-time.
- FRAGMENTED: One or two handoffs drift. Friction is high but not blocking. Some objections resolve late. Conversion is degraded but not collapsed.
- BROKEN: Multiple handoffs broken, awareness mismatches, or cumulative friction over 12. The funnel will not convert at the rate the assets in isolation suggest.
```

### PHASE 6 — THE LOAD-BEARING FIX

The most important deliverable: what is the SINGLE highest-leverage fix in this funnel? Not a list of 20. The one fix that, if made, moves the funnel from BROKEN to COHERENT or from FRAGMENTED to COHERENT.

Almost always this is one of three things:
1. A scent match break at the ad → LP handoff
2. An awareness mismatch (LP written for a different stage than the ad's audience)
3. A cumulative friction overload at the checkout

Name it specifically.

---

## OUTPUT FORMAT — funnel-audit-report-[campaign].md

```markdown
# Funnel Audit Report: [Campaign Name]
**Audited:** [date] | **Touchpoints in scope:** [N] | **Character source:** [name]

---

## FUNNEL MAP
[Sequenced touchpoints with purposes and CTAs]

---

## HANDOFF AUDIT

### Handoff 1: Ad → LP
- Promise continuity: [PASS / DRIFT / BROKEN] — [note]
- Language continuity: [...] — [note]
- Visual register continuity: [...] — [note]
- Awareness-level continuity: [...] — [note]
- Friction at handoff: [...] — [note]
- **Handoff verdict: [CLEAN / DRIFTING / BROKEN]**

### Handoff 2: LP → Email
[Same structure]

### Handoff 3: Email → Checkout
[Same structure]

---

## OBJECTION CHAIN PROGRESSION

| # | Objection | Should fire at | Resolved at | Verdict |
|---|-----------|----------------|-------------|---------|
| 1 | [...] | [touchpoint] | [touchpoint] | [ON-TIME / EARLY / LATE] |
| 2 | [...] | [touchpoint] | [touchpoint] | [...] |
| ... | ... | ... | ... | ... |

---

## CUMULATIVE FRICTION COUNT
- Ad: [N]
- LP: [N]
- Email 1: [N]
- Email 2: [N]
- Checkout: [N]
- **TOTAL: [N] / Tolerance for this traffic temperature: [8 cold / 12 warm / 15 hot]**

---

## OVERALL VERDICT
**[COHERENT / FRAGMENTED / BROKEN]**
[2-3 sentences explaining the verdict]

---

## THE LOAD-BEARING FIX
[One specific fix, with the specific asset and the specific change. Not a list — the single highest-leverage change.]

---

## FOLLOW-ON FIXES (if load-bearing fix is shipped)
[Up to 5 additional fixes, prioritised by leverage. Only relevant if the load-bearing fix unblocks the funnel.]
```

---

## PROCESS RULES

1. **Audit handoffs, not assets.** Creative-interrogator already audits assets. This skill's value is in the transitions.

2. **The load-bearing fix is the deliverable.** A list of 20 issues is overwhelming and gets ignored. ONE fix that moves the verdict gets shipped.

3. **Score honestly.** A funnel that performs at 1% CVR can have all assets passing creative-interrogator individually. The audit catches what per-asset audits miss.

4. **Awareness mismatch is a kill condition.** A Problem-Aware ad sending traffic to a Solution-Aware LP is broken. No amount of LP polish fixes that — the LP itself is wrong for the audience.

5. **Friction is cumulative across the funnel.** Each touchpoint's friction adds. By checkout, the buyer is exhausted. Audit the cumulative count, not just per-asset.

6. **Save as `funnel-audit-report-[campaign]-[date].md`** using present_files. Feed result back into campaign-state.

---

## DOWNSTREAM SKILL INTEGRATION

Outputs feed:
- **campaign-state** — updates funnel health metric
- **lp-copy-generator / hook-creative-generator** — receives the load-bearing fix and revises the named asset
- **paid-ads-expert** — adjusts audience routing if awareness mismatch is identified
- **persona-stress-test** — re-runs after fixes to verify the funnel now converges

---

> **First principle:** Most funnels don't fail because the assets are bad. They fail because the assets don't add up to a single conversation. Audit the joins, not just the parts.

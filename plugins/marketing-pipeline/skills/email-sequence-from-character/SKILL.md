---
name: email-sequence-from-character
description: >
  Writes multi-email sequences (welcome, nurture, abandoned cart, re-engagement, post-purchase, win-back) using a Character Profile's internal monologue, decision style, and objection chain as the structural backbone. Each email maps to ONE objection from the chain in declared order, written in language the character would actually use (drawn from RESEARCH LOCK). Honours awareness × sophistication grid. Designed to be auditable by creative-interrogator and survivable by persona-stress-test. Trigger on: "write an email sequence", "nurture emails", "welcome series", "abandoned cart sequence", "win-back emails", "re-engagement", "post-purchase sequence", "write emails for [character]", "email funnel", "drip campaign", or any request for a multi-email flow tied to a specific persona/character.
---

# Email Sequence From Character
> **Position in pipeline:** AFTER icp-character-builder. Pairs with lp-copy-generator and hook-creative-generator. Produces emails that read as if the character wrote them to themselves.

---

## ROLE

You are an email copywriter who works exclusively from a Character Profile. You do not write "best practice" emails — you write the emails that THIS character would actually open, read, and act on. The character's internal monologue (icp-character-builder Layer 5) becomes the voice. The objection chain (Layer 6) becomes the sequence's spine. The decision style (Layer 4) becomes the proof strategy.

Each email handles exactly one job — typically one objection from the character's chain. Sequences that try to do everything in every email get deleted.

---

## WHEN TO INVOKE

Trigger when:
- A Character Profile exists and the campaign needs an email sequence
- The user names a sequence type: welcome, nurture, abandoned cart, re-engagement, post-purchase, win-back, free trial activation
- An LP has been built and the post-conversion nurture flow is being designed
- A retargeting campaign needs the email layer alongside the paid layer (see also: retargeting-cascade)

**Do NOT** run this skill without a Character Profile. Generic email best-practice is not the goal here.

---

## INPUTS REQUIRED

1. **Character Profile** (`character-profile-[name].md`)
2. **Brand Brief** — for BRAND TRUTH (voice, hard NOs) and RESEARCH LOCK
3. **Sequence type** — declared by user or inferred from context (welcome, nurture, cart, win-back, etc.)
4. **(Optional) The ad and/or LP** the buyer came through — for scent match continuity
5. **(Optional) Campaign goal / KPI** — what this sequence is supposed to drive

---

## THE SEQUENCE TYPES

| Sequence | When sent | Primary job | Typical length |
|----------|-----------|-------------|----------------|
| Welcome | After signup / first action | Confirm decision + set expectations + deliver promised value | 3-5 emails over 7 days |
| Nurture | Ongoing post-signup, pre-purchase | Move from Solution-Aware → Product-Aware → Most-Aware | 5-7 emails over 2-3 weeks |
| Abandoned cart | After cart abandonment | Surface the specific objection that caused the bounce | 2-3 emails over 48 hours |
| Re-engagement | After 30-90 days of inactivity | Reconnect with the original promise + name the silence | 2-3 emails over 7 days |
| Post-purchase | After purchase confirmation | Validate decision + set up next behaviour (use, refer, repurchase) | 3-5 emails over 14-30 days |
| Win-back | After churn or cancellation | Acknowledge what changed + offer to return without pressure | 2 emails, weeks apart |
| Free trial activation | During free trial period | Drive activation moment + handle pre-purchase objections | 5-7 emails over trial length |

The sequence type determines:
- Length and cadence
- Which objections from the chain to handle
- The awareness level at the start vs end (sequences usually move the buyer through 1-2 awareness levels)

---

## THE WRITE PROCESS

### STEP 1 — MAP THE SEQUENCE SPINE

Pull the character's objection chain. Allocate one email per objection, in declared order, with one or two amplifier emails at the bookends.

```
SEQUENCE: [Type]
CHARACTER: [Name]
GRID POSITION (start): [Awareness × Sophistication]
GRID POSITION (target end): [if sequence is meant to move them — e.g., Problem-Aware → Solution-Aware]

EMAIL 1: [Promise restate + scent match to LP/ad] — Objection focus: 1 ("Is this for me?")
EMAIL 2: [Mechanism / "how it works"] — Objection focus: 2 ("Does it work?")
EMAIL 3: [Proof / case study] — Objection focus: 2 amplified
EMAIL 4: [Pricing / value reframe] — Objection focus: 3 ("Can I afford / commit?")
EMAIL 5: [Edge case / FAQ] — Objection focus: 5 ("What if I'm different?")
EMAIL 6: [Final CTA + risk reversal] — Objection focus: 4 ("Is now the right time?")
```

Email count depends on sequence type (see table). Each email handles one job. Resist the urge to bundle.

### STEP 2 — WRITE FROM THE INTERNAL MONOLOGUE

The character's voice IS the email's voice. Open the Character Profile's Internal Monologue section. The phrasing used there — the worry, the doubt, the hope — becomes the email's tone.

Bad: "We know you're busy, so here's why our product matters."
Good: "I keep thinking about something you said about not being sure which ads are actually working — and how it feels to look at the dashboard and just... not know."

The second one reads as if the character wrote it to themselves. That's the bar.

### STEP 3 — STRUCTURE EACH EMAIL

```
EMAIL [N] — [Internal name, for tracking]

SUBJECT LINE OPTIONS (3 variants):
- A: [Pattern interrupt, draws from RESEARCH LOCK if possible]
- B: [Curiosity / specificity]
- C: [Directness / question form]

PREVIEW TEXT: [Extends the subject — does not repeat it]

BODY:

[Opening — 1-2 sentences. Often: the character's own thought, named back to them. Pulls from RESEARCH LOCK where possible.]

[Mechanism / point of the email — 2-3 short paragraphs. The ONE job this email is doing.]

[Proof or evidence — 1 specific thing, not a list. Quote, screenshot, data point, named customer.]

[Transition to action — 1 sentence that reframes the action as the next natural step, not a sales push.]

CTA BUTTON: [Verb-led, mode-matched to LP CTA — "See how it works" / "Start your trial" / "View the breakdown"]

P.S. (optional): [Often where the highest-impact content lives. Use for: an objection handle, a specific name-drop, or a single line of urgency. Never just "Thanks!"]
```

### STEP 4 — RESEARCH LOCK CITATIONS

Every email's opening line and subject line should draw from RESEARCH LOCK where possible. Cite at the bottom:

```
RESEARCH LOCK ANCHORS USED:
- Subject line A draws from: [VERBATIM: "..." — source, date]
- Opening line draws from: [VERBATIM: "..." — source, date]
- Proof anchor: [VERBATIM: "..." — source, date]

Any line not citing RESEARCH LOCK is flagged [INTERPRETATION].
```

### STEP 5 — CADENCE + EXIT LOGIC

```
CADENCE:
Email 1: Send immediately (or T+0)
Email 2: T+1 day
Email 3: T+3 days
Email 4: T+5 days
Email 5: T+8 days
Email 6: T+12 days

EXIT CONDITIONS:
- Recipient takes target action (purchase / signup / book) → exit, route to post-action sequence
- Recipient opens but doesn't click after Email 4 → branch to "soft objection" path (1 follow-up, then suppress)
- Recipient never opens after Email 2 → branch to "subject line miss" path (1 different-angle email, then suppress)
- Recipient unsubscribes / spam → exit immediately, suppress across all campaigns
```

---

## OUTPUT FORMAT — email-sequence-[type]-[character].md

```markdown
# Email Sequence: [Type] for [Character]
**Built:** [date] | **Character:** [name] | **Sequence type:** [welcome / nurture / cart / ...] | **Length:** [N emails over T days]

## SEQUENCE SPINE
- Email 1 — [job] — handles objection [N]
- Email 2 — [job] — handles objection [N]
- ...

## GRID POSITION
- Start: [Awareness × Sophistication]
- Target end: [Awareness × Sophistication]
- Sequence goal: [move buyer X → Y / drive specific action Z]

---

## EMAIL 1 — [Name]

**Subject A:** [...]
**Subject B:** [...]
**Subject C:** [...]
**Preview:** [...]

**Body:**
[Full email copy in the character's voice]

**CTA button:** [...]

**P.S.:** [...]

**Send:** T+[0] | **Objection handled:** [N — "[objection text]"]

---

## EMAIL 2 — [Name]
[Same structure]

---

[Repeat for each email]

---

## CADENCE + EXIT LOGIC
[Table or list per Step 5]

---

## RESEARCH LOCK CITATIONS
[Per Step 4 — line by line]

---

## SELF-AUDIT BEFORE SHIP
- [ ] Each email handles exactly one job / one objection
- [ ] Subject lines and openings draw from RESEARCH LOCK where possible
- [ ] Voice matches character's internal monologue
- [ ] Awareness level progression is honest (don't claim to move Problem-Aware → Most-Aware in one email)
- [ ] CTAs are mode-matched (all "start trial" or all "book call" — not mixed)
- [ ] Exit conditions are defined
- [ ] No bundled emails (one job per email)
- [ ] No hard NOs from Brand Brief
```

---

## PROCESS RULES

1. **One job per email.** Bundled emails get skimmed and deleted. Single-job emails get read.

2. **Voice = character's internal monologue.** Read the Character Profile Layer 5 before writing a single subject line. Match the rhythm and the worry-vocabulary.

3. **Subject lines from RESEARCH LOCK.** Verbatim customer language in subject lines outperforms invented copy almost universally.

4. **Map each email to ONE objection from the chain.** If an email doesn't resolve a declared objection, it doesn't earn its place in the sequence.

5. **P.S. is real estate.** Most readers scan the P.S. before reading the body. Put the highest-impact content there: an objection handle, a specific name-drop, or a single line of social proof.

6. **Cadence respects the buying window.** Cart abandonment is 48 hours, not 14 days. Nurture is 2-3 weeks, not 3 months. Match the cadence to how the character actually decides.

7. **Save as `email-sequence-[type]-[character]-[date].md`** using present_files. Pass to creative-interrogator AND persona-stress-test (run a 3-agent simulation per email subject for high-stakes sequences).

---

## DOWNSTREAM SKILL INTEGRATION

The sequence feeds:
- **creative-interrogator** — audits each email individually
- **persona-stress-test** — simulates the character opening, reading, and acting (or not)
- **funnel-audit** — emails become touchpoints in the funnel handoff audit
- **campaign-state** — sequence added to artifact registry
- **paid-ads-expert** — pairs with retargeting-cascade for paid+email coordination

---

> **First principle:** An email sequence isn't a content calendar. It's a structured argument that handles objections in the order they fire — written in the buyer's own voice. Most "nurture sequences" are actually "broadcast schedules." This skill writes the former, not the latter.

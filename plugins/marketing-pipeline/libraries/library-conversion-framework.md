# Library: Conversion Framework
> Reference library. The structural logic for landing pages, funnels, and any asset that has to convert intent into action. Consumed by persona-stress-test (for scent match and proof scoring), creative-interrogator (for LP audit), hook-creative-generator (to ensure ads create the right intent), and any future LP-copy skill. This is the conversion physics — what actually moves a buyer from cursor-hover to click-buy.

---

## THE CORE TRUTH

> **Conversion is not persuasion. Conversion is permission to act on a decision the buyer has already made.**

Most buyers who land on your page have already decided "maybe." The job of the page is not to convince them — it is to remove every reason to NOT act. Friction-reduction beats persuasion 9 times out of 10. The exception is the unaware buyer, who needs the decision built from scratch — but that buyer rarely lands on an LP; they're being earned through content or interrupted in feed.

The five mechanics that close the gap between intent and action are: **scent match, proof, objection handling, friction reduction, and offer clarity**. Every other tactic is a subset of these.

---

## PART 1: SCENT MATCH

The first 2 seconds on the landing page decide 40% of bounce. The buyer arrives with a *specific expectation* set by the ad — and the page either confirms it instantly or breaks it.

### THE THREE STATES OF SCENT MATCH

- **MATCH** — The LP hero echoes the ad's promise, language, and visual register so closely that the buyer thinks: "yes, this is the thing." Conversion proceeds.
- **DRIFT** — The LP is on the right topic but the language has been smoothed, the visual register has shifted, or the promise has been softened. Buyer thinks: "is this what I clicked?" Cognitive friction. Conversion rate drops 20-40%.
- **BROKEN** — The LP doesn't match the ad at all. Different topic, different tone, different image, different promise. Buyer bounces almost immediately. Conversion rate drops 60%+.

### WHAT GETS SCENT-MATCHED

Five elements must echo from ad → LP hero:

1. **The exact phrase or pain language** — if the ad said "stop pretending you know what's working," the hero must use those words or words close enough that the buyer feels recognition.
2. **The visual register** — colour palette, photography style, typographic mood, level of polish. A raw, hand-shot ad should not land on a slick corporate LP. A glossy product ad should not land on a Notion-doc LP.
3. **The promise (the result being offered)** — same outcome, stated the same way. Not paraphrased into "increase efficiency" if the ad said "stop losing two hours a day to admin."
4. **The protagonist or character** — if the ad featured a specific person/founder, that person should be visible above the fold on the LP.
5. **The CTA mirror** — if the ad said "see how it works," the primary CTA should say something close to that. Not "Start Free Trial" (different mode), not "Get Started" (vague).

### THE SCENT MATCH CHECK

For any ad → LP pair, score each of the 5 elements:

```
EXACT PHRASE / PAIN LANGUAGE: [✓ Match / ⚠ Drift / ✗ Broken]
VISUAL REGISTER: [✓ / ⚠ / ✗]
PROMISE: [✓ / ⚠ / ✗]
PROTAGONIST: [✓ / ⚠ / ✗ / N/A]
CTA MIRROR: [✓ / ⚠ / ✗]

OVERALL SCENT MATCH: [MATCH / DRIFT / BROKEN]
```

Two or more drifts = the LP is bleeding conversion. One broken = the ad is wasting spend.

---

## PART 2: PROOF STRATEGY

Once scent is matched, the buyer needs evidence. But "more proof" isn't the answer — *the right kind of proof for THIS decision style* is.

### THE FIVE PROOF TYPES

| Proof type | What it is | Wins which decision style | Watch out for |
|------------|------------|---------------------------|---------------|
| **Social proof** | Other buyers — quotes, logos, counts, reviews, UGC | Social-proof-driven, identity-driven | Generic testimonials read as fake. Specific names + faces + companies + outcomes win. |
| **Specificity proof** | Concrete numbers, named mechanisms, exact dates, screenshots | Analytical, authority-driven | Vague metrics ("we save you time") fail. "Cut reporting from 4 hours to 12 minutes" works. |
| **Credential proof** | Awards, certifications, press, expert endorsement, named experts | Authority-driven, risk-averse | Stale logos (G2 2019 award) read as decay. Currency matters. |
| **Demonstration proof** | Video walkthrough, live demo, sandbox, "try without signing up" | Analytical, impulsive (if frictionless) | Long videos kill momentum. 90 seconds max above the fold. |
| **Result proof** | Specific outcomes a real customer got, with the data | Authority-driven, risk-averse, analytical | Numbers without context (no baseline, no time frame) feel fabricated. |

### MATCHING PROOF TO DECISION STYLE

Pull the dominant decision style from the character profile (icp-character-builder Layer 4). Lead with the proof type that wins THAT style. Stack the secondary style's proof type below.

```
Impulsive             → Lead with social proof + demonstration (low friction, fast trust)
Analytical            → Lead with specificity + result proof (data first)
Social-proof-driven   → Lead with social proof + credential (volume + authority)
Identity-driven       → Lead with social proof (lookalike customers) + visual register
Authority-driven      → Lead with credential + result proof (named experts + outcomes)
Risk-averse           → Lead with result proof + credential (proof it worked + safety nets)
```

### THE PROOF STRATEGY CHECK

For any LP, ask:
1. What are the dominant decision styles of the characters this page is targeting?
2. Are the first two proof elements above-the-fold the ones that match those styles?
3. Is each piece of proof specific enough to be believed, or generic enough to be ignored?

If the answer to #3 is "generic," the proof is decoration, not evidence. Replace.

---

## PART 3: OBJECTION HANDLING

Pull the objection chain from the character profile (Layer 6). The LP must answer each objection BEFORE the buyer scrolls past where it would fire.

### THE OBJECTION CHAIN ARCHITECTURE

The chain fires in declared order. Block the first objection and the second becomes load-bearing.

```
Objection 1 (fires above the fold): [usually "is this for me?"]
   → Resolve with: scent match + identity language ("for [character description]")

Objection 2 (fires in the first scroll): [usually "does this actually work?"]
   → Resolve with: result proof + specificity

Objection 3 (fires near the offer): [usually price / commitment]
   → Resolve with: risk reversal (guarantee, trial, free tier, money back)

Objection 4 (fires at the CTA): [usually "is this the right time?"]
   → Resolve with: urgency (real, not fabricated) OR "no pressure" framing

Objection 5 (final pre-action): [usually "what if it doesn't work for me specifically?"]
   → Resolve with: edge case proof OR FAQ that names that exact worry
```

### THE OBJECTION-LP MAPPING

For each objection in the chain, the LP must have a specific section that resolves it. Map them:

```
Objection 1: "Is this for me?"          → Above-fold hero + identity proof
Objection 2: "Does it work?"            → First scroll proof block (results)
Objection 3: "Can I afford it?"         → Pricing section + value framing
Objection 4: "Is now the time?"         → Urgency element OR risk reversal
Objection 5: "What if I'm different?"   → FAQ + edge case testimonial
```

If an objection has NO corresponding LP section, the page has a hole. Buyers will bounce at that point in the scroll.

### THE INVERSE — DEAD WEIGHT

LPs accumulate sections that DON'T resolve a declared objection. Common offenders: vague feature lists, founder bios that don't anchor credibility, "as seen in" logos that aren't relevant, animated graphics. If a section doesn't resolve an objection or close the offer, **it is friction in disguise**. Cut it.

---

## PART 4: FRICTION REDUCTION

Every micro-decision the buyer has to make before action is friction. Friction is cumulative — the third "wait, what?" is the one that kills the click.

### THE FRICTION AUDIT

Walk the page and count:

1. **Cognitive friction** — anything that makes the buyer pause to figure something out. Vague headlines, jargon, multi-clause sentences, ambiguous CTAs.
2. **Decision friction** — every choice point that's not the primary action. Multiple CTAs above the fold. "Or sign up for our newsletter." Pricing tiers with no clear default.
3. **Form friction** — every form field is a percentage point of drop-off. 7 fields ≈ 50% drop-off vs 3 fields. Auto-fill, social login, and progressive disclosure all reduce form friction.
4. **Trust friction** — anything that triggers a "wait, is this safe?" check. No HTTPS lock. Unknown brand. No privacy mention. No return policy.
5. **Visual friction** — slow load, layout shift, pop-ups that fire before reading, autoplay video with sound, unexpected scroll behaviour.

### THE TARGETS

Above-the-fold:
- One primary CTA (one mode of action)
- Zero pop-ups
- One promise, one sub-promise, one visual anchor
- Page loads in <2s on mobile, <1.5s on desktop

In the conversion form:
- Maximum 4 fields for top-of-funnel (email + 1-3 qualifying questions)
- Maximum 7 fields for purchase (and that's a stretch)
- No CAPTCHA unless absolutely required
- Show progress on multi-step forms

### THE FRICTION SCORE

For any LP, count the friction points. Score:
- 0-2 friction points: lean and converting
- 3-5: typical, room to improve
- 6+: drowning in friction — radical edit needed before spend

---

## PART 5: OFFER CLARITY

The offer is the *exact thing the buyer gets when they act*. It must be unmistakable.

### THE OFFER CLARITY TEST

A buyer looking at the LP for 5 seconds must be able to answer all three:
1. **What do I get?** — the deliverable
2. **What does it cost?** — the price (or "free")
3. **What happens when I click?** — the immediate next step

If any of these is unclear, the offer is leaking. Buyers will not click into ambiguity.

### THE OFFER STACK

Build the offer in this order:

```
1. Core deliverable: [the product/service in one sentence]
2. Specific outcome: [what happens for them — concrete, time-bound]
3. Time to value: [when they get the result — same day? 30 days?]
4. Price + structure: [number + cadence — $X/month, $X one-time, free with X]
5. Risk reversal: [what protects them — guarantee, trial, refund, free tier]
6. Bonus / urgency (optional): [extra reason to act now]
```

The first three are required. The last three are amplifiers.

---

## PART 6: AWARENESS-LEVEL × LP STRUCTURE

The LP structure changes based on the Awareness Level declared in the persona (icp-persona-engine Layer 5).

### UNAWARE (Schwartz Awareness 1)

The buyer doesn't know they have the problem. **They should rarely land directly on a sales LP.** Use an editorial/content LP first, then route to the offer.

LP structure:
- Lead with a story or observation (no product mention)
- Build the problem awareness
- Introduce the category
- Offer the product as one solution
- CTA is "learn more" or "see how it works", not "buy"

### PROBLEM-AWARE (Awareness 2)

The buyer feels the pain, doesn't know solutions exist.

LP structure:
- Hero names the pain in their language (RESEARCH LOCK)
- Agitate the pain (cost of not solving it)
- Introduce the category and the product
- Mechanism: how it works (especially Stage 3+)
- Proof
- Offer + low-commitment CTA

### SOLUTION-AWARE (Awareness 3)

The buyer knows solutions exist, doesn't know yours. **This is the most common LP type for SaaS and B2B.**

LP structure:
- Hero: differentiation in one sentence ("the only X that does Y")
- Mechanism: what makes you specifically different
- Result proof
- Comparison or "vs. [competitor]" section (especially Stage 4+)
- Pricing
- CTA: free trial / demo / sandbox

### PRODUCT-AWARE (Awareness 4)

The buyer knows you, hasn't bought.

LP structure:
- Hero: directly address the objection that's been holding them back
- Heavy proof (results, testimonials, named customers)
- Risk reversal prominent (guarantee, trial, refund)
- Pricing
- CTA: action-direct ("Start your free trial", "Buy now")

### MOST AWARE (Awareness 5)

The buyer is ready. They want the deal.

LP structure:
- Hero: the offer, large and clear
- Urgency (real)
- Minimal proof (they're past that)
- Direct CTA
- Often a single-purpose LP — pricing page or checkout

---

## PART 7: THE LP AUDIT CHECKLIST

For any LP, run this 25-point check. Used by persona-stress-test and creative-interrogator.

```
SCENT MATCH (ad → LP):
[ ] Exact phrase / pain language matches
[ ] Visual register matches
[ ] Promise matches
[ ] Protagonist matches (or N/A)
[ ] CTA mirror matches

PROOF STRATEGY:
[ ] Dominant decision style identified
[ ] First two proof elements above-fold match dominant style
[ ] Each proof item is specific, not generic
[ ] No stale credentials (>2 years old)
[ ] Result proof has baseline + time frame

OBJECTION HANDLING:
[ ] Objection 1 resolved above the fold
[ ] Objection 2 resolved in first scroll
[ ] Objection 3 (price/commitment) resolved at offer section
[ ] Objection 4 (timing) resolved at or near CTA
[ ] Objection 5 (edge case) resolved in FAQ or final section
[ ] No sections that don't resolve a declared objection (cut dead weight)

FRICTION:
[ ] One primary CTA above the fold
[ ] No pop-ups before first scroll
[ ] Page loads <2s mobile
[ ] Form ≤4 fields top-of-funnel, ≤7 purchase
[ ] No CAPTCHA unless required

OFFER CLARITY:
[ ] "What do I get?" answerable in 5 seconds
[ ] "What does it cost?" answerable in 5 seconds
[ ] "What happens when I click?" answerable in 5 seconds
[ ] Risk reversal present
[ ] Awareness-level structure correct for declared persona
```

A passing LP scores 23+ of 25. Anything below 20 is bleeding conversion.

---

## DOWNSTREAM SKILL INTEGRATION

This library is consumed by:
- **persona-stress-test** — uses scent match check, objection mapping, and friction audit as scoring rubrics during simulation
- **creative-interrogator** — uses the 25-point checklist as the LP audit phase
- **hook-creative-generator** — uses the awareness × LP structure to ensure ad creates correct intent
- **future LP-copy skill (TBD)** — will write LPs directly against this framework

---

> **First principle:** A great ad sends qualified intent. A great LP removes every reason to not act on it. Most conversion failures aren't persuasion failures — they're scent match failures, proof mismatches, or unresolved objections firing at the wrong moment. Fix those first.

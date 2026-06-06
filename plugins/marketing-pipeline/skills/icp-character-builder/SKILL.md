---
name: icp-character-builder
description: >
  Takes a completed Campaign Persona Document and builds a full named, simulatable character — a buyer with a name, a daily life, an internal monologue, a decision style, and a declared Awareness × Sophistication grid position. The strategic persona answers "who is this." The character answers "how do they behave when an ad lands in front of them." This is the input to persona-stress-test, which roleplays the character through ad → landing page → checkout. Run AFTER icp-persona-engine, BEFORE hook-creative-generator. Trigger on: "build the character", "make the persona simulatable", "give me a named buyer", "I want to stress-test the funnel", "build a character for [persona]", "turn this persona into a character", or any step in the pipeline that needs a roleplayable buyer.
---

# ICP Character Builder
> **Position in pipeline:** AFTER icp-persona-engine, BEFORE hook-creative-generator. Builds 1..N simulatable characters from the strategic persona profile. Each character is roleplay-ready for persona-stress-test.

---

## ROLE

You are a character writer who serves the marketing pipeline. Your job is to take the strategic abstraction (the Campaign Persona Document) and make it into a *person who can walk down the funnel*. A novelist would call this character development. A user researcher would call this a behavioural persona. A media buyer would call this an avatar. You are doing all three.

The strategic persona is *who* the buyer is. The character is *how the buyer behaves* when an ad slides into their feed at 9:47pm on a Tuesday. The first is a profile. The second is a simulation.

A good character has:
- A first name and an age
- A specific job and a specific frustration
- A specific phone, a specific feed, a specific scroll behaviour
- A declared Awareness × Sophistication grid position (carried forward from the persona — REQUIRED)
- An internal monologue when a hook lands
- A decision-style fingerprint (impulsive, analytical, social-proof-driven, identity-driven)
- An objection chain that fires in a specific order
- A "what would make them stop scrolling" answer and a "what would make them bounce" answer

The character is dropped into persona-stress-test, which roleplays them through ads and landing pages. Multiple characters (3 minimum, 5 for high-variance categories) are run in parallel and majority-voted to decide if a creative works.

---

## WHEN TO INVOKE

Trigger this skill when:
- icp-persona-engine has produced a Campaign Persona Document and the next step is creative
- The user wants to stress-test ads or landing pages and needs a roleplayable buyer
- A campaign has multiple personas (5, 10, 20+) and each one needs to be made simulatable
- The user says "build the character", "make this simulatable", "give me an avatar", "turn this persona into someone I can roleplay"
- A campaign result is bad and you want to interrogate WHICH persona didn't convert and why

**Do NOT run this skill** if no Campaign Persona Document exists. Run icp-persona-engine first.

---

## INPUTS REQUIRED

1. **Campaign Persona Document** (`campaign-persona-[name].md`) — produced by icp-persona-engine
2. **Brand Brief** (`brand-brief-[project].md`) — for RESEARCH LOCK verbatim language and BRAND TRUTH
3. **(Optional)** library-competitive-intelligence.md — for understanding what feeds the character is exposed to

If any of these are missing, request them before proceeding.

---

## THE CHARACTER ARCHITECTURE

Build in this order. Each layer compounds.

### LAYER 1 — Identity

- **Name:** First name only. Make it plausible for the demographic. (Sarah, Marcus, Priya, Tom — not "Persona A" or "User_47".)
- **Age:** Specific. Not "30s". 34.
- **Location:** City + country. Specific. Affects accent, references, time zone.
- **Job title + tenure:** "VP Marketing, 18 months in role" not "marketer".
- **Company stage:** Series A bootstrap, public co, agency, freelancer, etc.
- **Direct report count / team size:** Affects authority, autonomy, budget access.
- **One physical fact:** Glasses, a specific commute, a left-handed mouse, a standing desk. Anchors them as a person.

### LAYER 2 — Daily Reality

- **What's on their calendar this week:** Specific. "Board prep deck, 1:1 with their CMO, conference in Vegas Thursday."
- **What's on their mind at 9pm on a Tuesday:** Specific. The thing they're worrying about while their phone is in their hand.
- **What feeds they doom-scroll:** Twitter/X, LinkedIn, Instagram, TikTok, Reddit — and WHICH subset (creator economy Twitter, sales LinkedIn, founder Twitter, B2B marketing Twitter).
- **Which apps get the most screen time:** Slack, Gmail, Notion, Linear, Figma, ClickUp, etc. — affects how they evaluate other software.
- **Last 3 things they bought online:** Specific. Reveals price sensitivity, brand preferences, decision speed.

### LAYER 3 — Grid Position (REQUIRED — carry from persona)

Pull directly from the Campaign Persona Document:

```
AWARENESS LEVEL: [carry from persona — do not change]
SOPHISTICATION STAGE: [carry from persona — do not change]
GRID POSITION: [e.g., Problem-Aware × Stage 3]
COPY ENTRY POINT: [carry from persona]
```

If the persona did not declare both axes, HALT and return to icp-persona-engine. This is a gated input.

### LAYER 4 — Decision Style

Choose ONE dominant style. Most humans are a blend but one will dominate.

| Style | How they decide | What stops them |
|-------|-----------------|-----------------|
| Impulsive | Fast, emotional, "this feels right" | Friction, surprise costs, second-thoughts buttons |
| Analytical | Slow, comparison-driven, spreadsheet builder | Missing data, vague specs, no pricing page |
| Social-proof-driven | Defers to what others have chosen | No reviews, no logos, unknown brand |
| Identity-driven | "Does this match who I am?" | Bad aesthetic, wrong tribe signals, cringe copy |
| Authority-driven | Defers to expert recommendation | No expert endorsement, no credentials, no science |
| Risk-averse | Looks for reasons NOT to buy | No guarantee, no free trial, complex onboarding |

Declare the dominant style + the secondary style. The dominant style determines what wins. The secondary determines what blocks if the dominant is satisfied.

### LAYER 5 — Internal Monologue Pattern

The voice in the character's head when they see your ad. Write it as actual sentences they'd think. Use the RESEARCH LOCK verbatim language wherever possible.

Format:
```
WHEN THE HOOK LANDS:
First thought: [what registers in the first 1.5 seconds — usually emotional]
Second thought: [the rational follow-up — "is this me?"]
Third thought: [the decision pivot — keep watching/scrolling/clicking]

WHEN THE CTA APPEARS:
First thought: [trust check]
Second thought: [cost-benefit]
Third thought: [last objection]

WHEN THE LANDING PAGE LOADS:
First thought: [scent match check — does this look like the ad?]
Second thought: [credibility scan]
Third thought: [what they look for to confirm or bounce]
```

This is the most important layer. It is what persona-stress-test will simulate.

### LAYER 6 — Objection Chain

The specific order in which objections fire for THIS character. Most personas have 4-6 active objections but they fire in sequence — block the first one and the second one becomes load-bearing.

```
OBJECTION 1 (fires immediately): [e.g., "is this for someone like me?"]
OBJECTION 2 (fires if 1 is handled): [e.g., "does this actually work?"]
OBJECTION 3 (fires if 2 is handled): [e.g., "can I afford it?"]
OBJECTION 4 (fires if 3 is handled): [e.g., "is now the right time?"]
OBJECTION 5 (final): [e.g., "what if I commit and it doesn't work?"]
```

Each objection includes: the trigger that fires it, the specific fear underneath it, and the single piece of evidence that would resolve it.

### LAYER 7 — Stop / Bounce Signals

Two specific behavioural answers:

- **"What would make this character STOP scrolling?"** — a specific visual, phrase, or pattern interrupt. Be concrete. Not "good creative" — "a hand-drawn whiteboard with one black-marker sentence". Not "emotional copy" — "the exact phrase they say to their partner at 11pm: 'I have no idea what's working anymore'."
- **"What would make this character BOUNCE off the landing page?"** — specific friction. Not "bad design" — "a hero section that's all stock photo handshakes and 'Empower Your Team'". Not "vague copy" — "no price visible above the fold".

### LAYER 8 — Conversion Trigger

One sentence: what is the SINGLE thing this character needs to see / read / feel that takes them from cursor-hover to click-buy?

This becomes the conversion north star. It's what library-conversion-framework will check the LP against.

---

## OUTPUT FORMAT — character-profile-[name].md

```markdown
# Character Profile: [First Name]
**Built:** [date] | **Persona source:** campaign-persona-[name].md | **Grid:** [position]

## Identity
- Name: [First name]
- Age: [specific]
- Location: [city, country]
- Job: [title, tenure, company stage]
- Team / authority: [direct reports, budget authority]
- Anchor detail: [one physical/behavioural fact]

## Daily Reality
- This week's calendar: [...]
- 9pm Tuesday thought: [...]
- Feeds: [...]
- Apps with most screen time: [...]
- Last 3 online purchases: [...]

## GRID POSITION (carried from persona — REQUIRED)
- Awareness Level: [...]
- Sophistication Stage: [...]
- Grid Position: [...]
- Copy Entry Point: [...]

## Decision Style
- Dominant: [...]
- Secondary: [...]

## Internal Monologue
**When the hook lands:**
- First thought: [...]
- Second thought: [...]
- Third thought: [...]

**When the CTA appears:**
- First thought: [...]
- Second thought: [...]
- Third thought: [...]

**When the LP loads:**
- First thought: [...]
- Second thought: [...]
- Third thought: [...]

## Objection Chain
1. [Objection 1] — Trigger: [...] | Fear: [...] | Resolves with: [...]
2. [Objection 2] — Trigger: [...] | Fear: [...] | Resolves with: [...]
3. [Objection 3] — Trigger: [...] | Fear: [...] | Resolves with: [...]
4. [Objection 4] — Trigger: [...] | Fear: [...] | Resolves with: [...]
5. [Objection 5] — Trigger: [...] | Fear: [...] | Resolves with: [...]

## Stop / Bounce Signals
- **Would stop scrolling for:** [concrete description]
- **Would bounce off LP if:** [concrete description]

## Conversion Trigger
[One sentence — the single thing this character needs to see/read/feel to convert]

## RESEARCH LOCK Anchors
*The verbatim quotes from the Brand Brief that this character "speaks":*
- [VERBATIM: "..." — source, date]
- [VERBATIM: "..." — source, date]
- [VERBATIM: "..." — source, date]

## Stress-Test Notes
*For persona-stress-test:*
- This character should respond strongly to: [hook style / copy mechanism]
- This character should respond poorly to: [hook style / copy mechanism]
- Predicted bounce point: [where in funnel they're most likely to drop]
- Predicted conversion path: [the journey they'd actually take if it worked]
```

---

## PROCESS RULES

1. **Build from the persona, not from imagination.** Every field must be defensible by something in the Campaign Persona Document or the RESEARCH LOCK.

2. **Make them specific, not statistical.** "Sarah, 34, VP Marketing at a 40-person Series A in Austin" beats "VP Marketing persona, mid-stage SaaS." The specificity is what makes the simulation work.

3. **Carry the grid position verbatim.** Do not re-derive awareness or sophistication. They were declared in icp-persona-engine. The character inherits them.

4. **Use RESEARCH LOCK language in the internal monologue.** The voice in the character's head is the voice in the customer's head — and the customer's voice is in the RESEARCH LOCK. Quote it.

5. **One character per persona, minimum.** If the campaign has 5 personas, you produce 5 characters. If it has 20, you produce 20. Each gets their own file.

6. **For stress-testing variance:** When a character will be stress-tested, build it AT LEAST 3 times with different anchor details (different city, different physical anchor, different last-3-purchases). The persona is the same — the character is a sampled instance. This gives persona-stress-test the variance it needs to vote.

7. **Pass to persona-stress-test next.** The character is an input to simulation, not an end-state document.

8. **Save as `character-profile-[name].md`** using present_files.

---

## DOWNSTREAM SKILL INTEGRATION

The character profile is consumed by:
- **persona-stress-test** — roleplays the character through ads and landing pages
- **hook-creative-generator** — uses the internal monologue to write hooks the character would actually stop for
- **library-conversion-framework** — uses the objection chain to score landing page proof strategy
- **creative-interrogator** — uses the character as a check ("would Sarah actually click this?")

Every downstream skill MUST read the GRID POSITION first. If awareness × sophistication don't match what the skill is producing, the work fails.

---
name: brand-project-setup
description: "DEPRECATED — superseded by the 8-block flywheel (v1.3.0+). The 8-block flywheel uses /start-campaign to capture the 9 essentials inline in the terminal + auto-loads brand libraries. Phase 1 (phase-doc-setup) does brand truth + voice + intent inline. There is no longer a separate 'brand intake' step. Kept in archive for reference. Do NOT invoke."
---

# SKILL: Brand & Project Setup
> **Position in pipeline:** FIRST. Run before research, before ICP, before hook writing, before ad creation. This skill seeds the entire marketing pipeline with the brand's own truth. Without this, research is directionless and output is generic.

---

## ROLE

You are a strategic brand intake specialist. Your job is to extract the complete picture of a brand, product, or project in a single structured conversation. You ask smart questions, listen to what's said AND what isn't, and synthesise everything into a Brand Brief that every downstream skill — research, ICP, hooks, copy, creative — can consume.

The output of this skill is a **Brand Brief** — a single living document that travels through the entire pipeline and ensures every AI output reflects reality, not assumptions.

---

## WHEN TO INVOKE

Trigger this skill when:
- A new project, product, or campaign is being set up for the first time
- The user says "I want to start marketing [X]", "we're launching [X]", or "help me build a campaign for [X]"
- The user pastes a URL, product description, or brief without established brand context
- Any downstream skill is missing critical context about the brand (product, audience, competitors, tone)
- The user says "start from scratch", "new brand", "new product", or "we've never done this before"
- A Brand Brief doesn't exist yet for this project

**Do NOT re-run the full intake** if a Brand Brief already exists. Instead, offer to UPDATE specific sections.

---

## INTAKE PROCESS

Run in phases. Each phase is conversational, not a form dump. Ask questions naturally. Group related questions. Always explain why you're asking — it helps the user think more deeply.

---

### PHASE 1: THE PRODUCT / OFFER

**Goal:** Understand exactly what is being sold and why it matters.

Ask the user:

**1a. What is the product or service? Describe it like you'd describe it to a smart friend who's never heard of it.**
*(Avoid jargon. What does it actually do?)*

**1b. What does someone get when they buy this? What is the primary outcome they're paying for?**
*(Not features — outcomes. What changes in their life or business?)*

**1c. What makes this product different from every other option they have?**
*(Push past generic answers. "Better quality" and "great service" don't count. What is the actual, specific difference?)*

**1d. What is the pricing model and price point? Is it one-time, subscription, usage-based, tiered?**

**1e. What is the #1 thing this product helps someone AVOID, and the #1 thing it helps them ACHIEVE?**
*(Two sides of the same coin — most campaigns need both)*

**1f. Are there any claims you CANNOT make? Regulatory, legal, or ethical constraints?**

**Synthesise into:**
```
PRODUCT TRUTH:
- Core offer: [what it is in 1 sentence]
- Primary outcome: [what the customer gets/feels/achieves]
- Differentiator: [specific, provable difference vs alternatives]
- Pricing model: [structure + price point]
- The Avoid: [what it saves them from]
- The Achieve: [what it gets them to]
- Constraints: [what cannot be said/claimed]
```

---

### PHASE 2: THE CUSTOMER

**Goal:** Build the real person, not a demographic. **Capture verbatim language at source.**

> **RESEARCH LOCK RULE (READ BEFORE ASKING).** Whenever the user provides a real customer quote — from a review, DM, support ticket, sales call, Reddit post, comment, or testimonial — capture it as a verbatim quote using the format below. Do not paraphrase. Do not polish. The rough edge IS the truth, and the downstream pipeline (icp-persona-engine, hook-creative-generator, copywriter, creative-interrogator) depends on it surviving intact.
>
> **Verbatim format (use exactly):**
> `[VERBATIM: "exact quote with original spelling, grammar, and emotion" — source, date]`
>
> Examples:
> - `[VERBATIM: "i literally cannot figure out which ad is the one making me money" — G2 review, 2025-03]`
> - `[VERBATIM: "honestly i just want to stop feeling like a fraud every monday" — sales call transcript, 2025-04-12]`
> - `[VERBATIM: "everyone says use HubSpot but it's so complicated I gave up" — Reddit r/marketing, 2024-11]`
>
> If the user gives you a source but no date, mark it `date-unknown`. If they give you a quote but no source, mark it `source-unattributed` — but PUSH for a source. Unsourced quotes are weaker evidence and the pipeline needs to know.

Ask the user:

**2a. Who is your best customer? Not all customers — your BEST one. Describe them as a real person.**
*(Job title, day-to-day reality, what they worry about, what they're responsible for)*

**2b. What is their #1 problem that this product solves? Not the problem you assumed — the one THEY describe.**
*(If you have customer quotes, feedback, reviews, or call notes — paste them here. Capture each one with `[VERBATIM: "..." — source, date]`. They're worth more than any assumption.)*

**2c. What have they tried before your product? Why didn't those alternatives work?**
*(Competitive context AND insight into their frustration history. If they've described what failed in their own words, capture as VERBATIM.)*

**2d. What objection do they almost always have before they buy?**
*(Price? Trust? Timing? Complexity? Relevance? If you have the exact objection language a customer used, capture as VERBATIM.)*

**2e. Where does your best customer spend time online? What do they read, watch, or follow?**
*(Platforms, communities, media, influencers, publications)*

**2f. What language do they use to describe their problem? Their exact words.**
*(This is ICP vocabulary — it feeds hooks, copy, and ad angles directly. Every phrase that came from a real customer gets the VERBATIM tag. Phrases the founder or marketer invented do NOT get the tag — they're hypotheses, not evidence.)*

**2g. Are there customer types you do NOT want? Who is NOT a good fit?**

**Synthesise into:**
```
CUSTOMER TRUTH:
- ICP profile: [role + industry + company stage]
- Primary pain (verbatim if available): [VERBATIM: "..." — source, date] OR [paraphrased — no verbatim source]
- Trigger event: [what makes them start looking for a solution?]
- Alternatives tried: [what they've used/done before]
- Main objection (verbatim if available): [VERBATIM: "..." — source, date] OR [paraphrased]
- Platforms & communities: [where they live online]
- Their vocabulary: [list of [VERBATIM: "..." — source, date] entries, one per line]
- Bad fit: [who to exclude]
```

**Confidence flag:** If fewer than 3 entries in CUSTOMER TRUTH carry a VERBATIM tag, mark the brief as `RESEARCH_CONFIDENCE: LOW` and recommend the user run apify-pain-research or pull more real reviews before the pipeline continues. The hook-creative-generator and copywriter cannot do their best work on assumptions.

---

### PHASE 3: THE COMPETITIVE LANDSCAPE

**Goal:** Understand who else is competing for this customer's attention and budget.

Ask the user:

**3a. Name your top 3 competitors. Direct competitors — same category.**

**3b. Name their indirect competitors — the alternatives your customer considers that aren't the same category.**
*(e.g. "doing it manually", "hiring someone", "using spreadsheets", "doing nothing")*

**3c. What do your competitors do WELL that you don't? Be honest.**

**3d. What do you do that your competitors can't, won't, or haven't?**

**3e. What is the dominant message in your category right now? What are competitors all saying?**
*(The white space — what nobody is saying — is often the best place to be)*

**3f. Is there a competitor you admire from a marketing perspective, even outside your category?**
*(Gives insight into aesthetic and tone aspiration)*

**Synthesise into:**
```
COMPETITIVE TRUTH:
- Direct competitors: [name + their core positioning]
- Indirect alternatives: [what customers do instead of buying anything]
- Competitor strengths: [what they do well]
- Our edge: [what only we do]
- Category noise: [what everyone is saying]
- White space: [what no one is saying — opportunity]
- Marketing admiration: [brand(s) whose marketing approach we respect]
```

---

### PHASE 4: THE BRAND

**Goal:** Capture voice, tone, visual identity, and brand rules.

Ask the user:

**4a. How would you describe your brand's personality? Choose 3–5 words.**
*(If your brand were a person at a dinner party, how would they talk? What would they wear?)*

**4b. What is your brand's tone of voice? What does it NEVER sound like?**
*(e.g. "Direct and confident, never arrogant. Warm, never cheesy. Smart, never condescending.")*

**4c. What topics, approaches, or messages are absolutely OFF-LIMITS for your brand?**
*(Hard NOs — protect brand trust and legal exposure)*

**4d. Do you have brand assets? Paste or describe:**
- Logo (URL or upload)
- Brand colours (hex codes or description)
- Typography / fonts
- Photography style
- Existing ad examples (URLs or uploads)

**4e. What is the brand's mission or reason for existing beyond making money?**
*(Optional but powerful for storytelling and founder hooks)*

**4f. Do you have any existing taglines, positioning statements, or slogans?**

**Synthesise into:**
```
BRAND TRUTH:
- Personality words: [3–5 adjectives]
- Voice: [how it sounds]
- Anti-voice: [what it never sounds like]
- Hard NOs: [topics/approaches/messages forbidden]
- Visual identity: [colours, style, existing assets]
- Mission: [why this company exists]
- Existing positioning: [tagline or statement, if any]
```

---

### PHASE 5: THE CAMPAIGN CONTEXT

**Goal:** Understand what THIS specific campaign needs to accomplish.

Ask the user:

**5a. What is the goal of this campaign? Choose one primary goal:**
- [ ] Cold audience awareness (new people finding the brand)
- [ ] Lead generation (capturing contact info)
- [ ] Trial or free tier signups
- [ ] Direct purchase / conversion
- [ ] Retargeting / re-engagement of warm audience
- [ ] Retention / upsell of existing customers
- [ ] Brand building (no direct response KPI)

**5b. What channels are in scope for this campaign?**
*(Meta, Google, TikTok, LinkedIn, Email, WhatsApp, Organic social, SEO, etc.)*

**5c. What is the budget — and how is it structured?**
*(Total, monthly, per channel, test phase vs. scale phase)*

**5d. What are the success metrics? What does "it worked" look like?**
*(ROAS, CPL, CPA, revenue target, CAC, volume of leads)*

**5e. What is the timeline? Are there hard deadlines?**
*(Launch date, event-driven, seasonal?)*

**5f. What assets exist? What needs to be created?**
*(Existing creative, landing pages, copy, offers — or starting from zero?)*

**5g. What has already been tried for this campaign? What worked and what didn't?**

**Synthesise into:**
```
CAMPAIGN CONTEXT:
- Primary goal: [one clear objective]
- Channels: [in scope]
- Budget: [structure + amount]
- Success metrics: [specific KPIs]
- Timeline: [launch date + any hard deadlines]
- Existing assets: [what's ready]
- Prior attempts: [what was tried, what the result was]
```

---

### PHASE 6: THE AD PILLARS (Optional — AI-Assisted)

**Goal:** Translate all the above into 3–5 campaign angles ("pillars") that cover different entry points to the same purchase decision.

After completing Phases 1–5, offer to generate Ad Pillars based on the Brand Brief:

> "Based on everything you've shared, I'm seeing [X] distinct angles we could run. Want me to map those out as ad pillars? Each pillar would cover a different reason someone buys — so we're not running the same message everywhere."

**Pillar structure:**
```
PILLAR [#]: [One-line name]
- Core belief: [what this pillar asserts]
- Target pain: [which pain/desire it addresses]
- Hook angle: [how it opens — which hook mechanism]
- Creative style: [what format/style fits best]
- Audience segment: [who this pillar is for — awareness level]
- Call to action: [what we ask them to do]
```

---

## OUTPUT: THE BRAND BRIEF

Once all phases are complete, synthesise everything into a single Brand Brief document. This document is saved as `brand-brief-[project-name].md` and is passed to every downstream skill.

```markdown
# Brand Brief: [Project Name]
*Created: [date]*
*Last updated: [date]*

---

## PRODUCT TRUTH
[Phase 1 synthesis]

---

## CUSTOMER TRUTH
[Phase 2 synthesis]

---

## RESEARCH LOCK
*Every verbatim customer quote captured during intake. Downstream skills MUST treat this section as immutable — no paraphrasing, no smoothing, no "improving the grammar." This is the source-of-truth language pool for hooks, copy, and creative.*

```
RESEARCH LOCK — DO NOT PARAPHRASE

PAIN LANGUAGE:
[VERBATIM: "..." — source, date]
[VERBATIM: "..." — source, date]
[VERBATIM: "..." — source, date]

OBJECTION LANGUAGE:
[VERBATIM: "..." — source, date]
[VERBATIM: "..." — source, date]

DESIRE / OUTCOME LANGUAGE:
[VERBATIM: "..." — source, date]
[VERBATIM: "..." — source, date]

TRIGGER EVENT LANGUAGE:
[VERBATIM: "..." — source, date]

RESEARCH_CONFIDENCE: [HIGH / MEDIUM / LOW]
- HIGH: 8+ verbatim quotes across 3+ sources
- MEDIUM: 4-7 verbatim quotes across 2+ sources
- LOW: <4 verbatim quotes or single source — recommend deeper VOC research before pipeline runs
```

**Pipeline contract:** Every downstream skill that produces copy MUST cite the RESEARCH LOCK entry it is drawing from, OR explicitly flag the line as `[INTERPRETATION]` so the creative-interrogator can audit drift. Polished copy with no citation and no interpretation flag fails research integrity.

---

## COMPETITIVE TRUTH
[Phase 3 synthesis]

---

## BRAND TRUTH
[Phase 4 synthesis]

---

## CAMPAIGN CONTEXT
[Phase 5 synthesis]

---

## AD PILLARS
[Phase 6 output — or marked "TBD — generate after intake"]

---

## QUICK REFERENCE
*For downstream skills — the most critical facts at a glance:*

- **What we sell:** [1 sentence]
- **Who buys it:** [ICP in 1 sentence]
- **Why they buy:** [primary pain + outcome]
- **Why us:** [core differentiator]
- **Never say:** [hard NOs]
- **Always sound like:** [voice in 3 words]
- **Campaign goal:** [one objective]
- **Success looks like:** [primary KPI + target]
```

---

## HOW TO RUN THIS SKILL

1. **Start with Phase 1 and work forward.** Don't ask all questions at once — it overwhelms. Ask 2–3 at a time, listen, then proceed.

2. **Honour what they give you.** If the user pastes a URL or an existing document, extract what you can before asking. Never ask for information you can observe.

3. **Push past generic answers.** If they say "we're better quality", ask: "What specifically makes it better? Can you give me an example a customer has actually told you?" Generic answers produce generic output.

4. **Flag gaps.** If a critical field is unknown or vague, mark it `[TBD — needs research]`. The research phase may fill it. Don't block progress on unknowns.

5. **Confirm before saving.** Read the Quick Reference section back to the user and ask: "Does this accurately represent the product and where you want to take it? Anything wrong or missing?" Get explicit confirmation.

6. **Make the brief available.** Save as `brand-brief-[project-name].md` in the project folder. Reference it in every downstream skill prompt.

---

## DOWNSTREAM SKILL INTEGRATION

Every skill that follows should open with:

```
> Load brand-brief-[project-name].md before proceeding.
> All output must align with BRAND TRUTH (voice, hard NOs) and target CUSTOMER TRUTH (ICP, vocabulary, pain).
> Campaign output must serve CAMPAIGN CONTEXT (goal, channels, KPIs).
> RESEARCH LOCK is immutable. Quote verbatim language with attribution. If you paraphrase, mark as [INTERPRETATION] so the creative-interrogator can audit drift. Unattributed copy = failed research integrity.
```

**Skills that consume the Brand Brief:**
- `apify-pain-research` — uses ICP profile + competitor names to direct scraping
- `icp-persona-engine` — uses Customer Truth as a starting seed, not a blank slate
- `hook-creative-generator` — uses ICP vocabulary + ad pillars + awareness levels
- `phase-doc-setup` (Block 1) — uses the Brand Brief as the seed for internal-truths + AI-filled fields. **Note:** the prior reference to `campaign-pipeline-orchestrator` is deprecated and archived; the 8-block flywheel is the current pipeline.
- `fb-paid-media-expert` — uses budget, channels, and campaign context
- `content-writer` — uses brand voice rules (never violate hard NOs)
- `cinematic-prompt-architect` — uses visual identity and brand aesthetic
- `market-seo` — uses product truth and ICP vocabulary for keyword intent

---

## BRIEF MAINTENANCE

The Brand Brief is a **living document**, not a one-time form.

Update it when:
- A new campaign phase begins with different goals
- Customer research reveals new pain language or objections
- Competitive landscape shifts
- Pricing or offer changes
- New creative performance data reveals what's resonating

Version the brief with a date stamp. Previous versions should be archived, not deleted — they preserve decision history.

---

> **First principle:** The brand that knows itself makes better ads. The brand that knows itself AND its customer makes ads that convert. This skill ensures every AI output in the pipeline is built on reality — not assumptions, templates, or guesswork.

---
name: theme-selector
description: >
  Selects ONE strategic theme per campaign with declared rationale, drawing from library-campaign-themes. Runs EARLY in the pipeline — immediately after Brand Brief intake (and ideally before icp-persona-engine, though it can also run after persona for sharper alignment). Locks the campaign's emotional/psychological centre of gravity so every downstream creative decision serves the same argument. Output: theme-declaration-[campaign].md + Decision Log entry in campaign-state. Trigger on: "pick a theme", "what's the campaign theme", "lock the theme", "campaign direction", "what story are we telling", "strategic posture", "what mechanic is this campaign betting on", or as sub-phase 3.1 of Block 3 Ideation — runs first inside the ideation block.
---

# Theme Selector
> **Position in pipeline:** Block 3 Ideation, sub-phase 3.1 — first decision in the strategic spine, before (or right after) persona development. The theme steers every downstream skill.

---

## ROLE

You are a campaign strategist whose only job is to pick ONE theme — the campaign's strategic posture — and defend the choice in writing so that every subsequent skill in the pipeline can serve it without ambiguity.

You do not pick "what sounds nice." You pick what fits the buyer, the awareness × sophistication grid, the campaign goal, and the brand's permission to operate in that register. Themes are powerful when honoured and destructive when ignored — a campaign with no declared theme produces fragmented creative that argues with itself.

---

## WHEN TO INVOKE

Trigger when:
- A Brand Brief has just been completed and the campaign is moving into research/persona
- The user asks "what theme should this campaign run on" / "what story are we telling" / "what mechanic should we bet on"
- An existing campaign is producing inconsistent creative and you suspect the theme isn't declared
- Re-selecting for a new phase of a multi-phase campaign (different theme per phase is fine — but declare each)

**Do NOT** run if a `theme-declaration-[campaign].md` already exists for this campaign and is still applicable. Offer to update instead.

---

## INPUTS REQUIRED

1. **Brand Brief** (`brand-brief-[project].md`) — required. Without it, theme is a guess.
2. **Campaign Persona Document** (`campaign-persona-[name].md`) — strongly preferred. Without it, theme is selected against assumed persona traits.
3. **Character Profile** (`character-profile-[name].md`) — optional. Strengthens theme selection by ensuring it serves the dominant decision style.
4. **library-campaign-themes.md** — the menu of options.

If persona/character are missing, declare theme provisionally and flag the declaration as `PROVISIONAL — re-validate after persona development.`

---

## THE SELECTION PROCESS

### STEP 1 — READ THE SIGNAL

Pull from inputs:
- **Awareness Level** (from persona)
- **Sophistication Stage** (from persona)
- **Dominant decision style** (from character, if available)
- **Primary pain** (verbatim from RESEARCH LOCK if possible)
- **Primary desire / outcome**
- **Campaign goal** (from Brand Brief Phase 5)
- **Channel(s) in scope**
- **Brand permission** — does this brand have the standing to play in [Contrarian / Meme / Identity / etc.] registers? Or is it overreaching?

### STEP 2 — SHORTLIST FROM library-campaign-themes

Run the inputs against the two compatibility tables in library-campaign-themes:
- **Theme × Awareness Level Fit**
- **Theme × Sophistication Stage Fit**

Eliminate any theme that scores ✗ on either axis for this combination. Result: a shortlist of 3–5 themes that fit.

### STEP 3 — APPLY THE THREE FILTERS

For each shortlisted theme, score against:

1. **Buyer fit** — does this theme map cleanly to the persona's pain stack and desire map? Does it serve the dominant decision style?
2. **Brand permission** — does the brand have the standing/aesthetic/track record to play in this register without looking like it's trying too hard?
3. **Channel fit** — does this theme execute well on the declared channels? (Loss Aversion crushes on Google Search but underperforms on TikTok; Identity crushes on TikTok but feels generic on Google.)

Score each shortlisted theme HIGH / MEDIUM / LOW on each filter. The theme with the highest overall score wins.

### STEP 4 — WRITE THE DECLARATION

Use the format from library-campaign-themes:

```
DECLARED THEME: [name]

ONE-LINE ARGUMENT: "This campaign is asking [persona] to feel [emotional posture] about [topic] and to act because [reason]."

RATIONALE:
[2-3 sentences explaining why THIS theme — citing persona/character data, awareness × sophistication grid, channel context, and any verbatim RESEARCH LOCK that supports the choice.]

ALIGNMENT SCORECARD:
- Buyer fit: HIGH/MED/LOW — [one line why]
- Brand permission: HIGH/MED/LOW — [one line why]
- Channel fit: HIGH/MED/LOW — [one line why]

SECONDARY THEME (optional):
[If a complementary theme should lean in at warmer stages of the funnel — e.g., Loss Aversion for cold + Social Proof for retargeting. State explicitly so retargeting-cascade can lean on it.]

EXCLUSIONS:
[Themes explicitly ruled out for this campaign + one-line why. Protects against drift.]

PROVISIONAL FLAG: [yes/no]
- "yes" if persona/character were missing at selection time. Re-validate after their completion.
```

### STEP 5 — LOG TO CAMPAIGN STATE

Append an entry to `campaign-state-[project].md` Decision Log:

```
- **[date]** — DECISION: Theme = [theme name]. Source: theme-selector. Rationale: [one line]. Defensible against: persona awareness × sophistication, brand permission, channel fit. See: theme-declaration-[campaign].md
```

This is the defensibility layer. Any future "why did we pick X" question is answered by the declaration file + the Decision Log entry.

---

## OUTPUT FORMAT — theme-declaration-[campaign].md

```markdown
# Theme Declaration: [Campaign Name]
**Selected:** [date] | **Selected by:** theme-selector | **Status:** [LOCKED / PROVISIONAL]

## DECLARED THEME
**[Theme name]**

## ONE-LINE ARGUMENT
"This campaign is asking [persona] to feel [emotional posture] about [topic] and to act because [reason]."

## RATIONALE
[2-3 sentences]

## ALIGNMENT SCORECARD
| Filter | Score | Reason |
|--------|-------|--------|
| Buyer fit | HIGH/MED/LOW | [...] |
| Brand permission | HIGH/MED/LOW | [...] |
| Channel fit | HIGH/MED/LOW | [...] |

## SHORTLIST CONSIDERED (transparency)
| Theme | Buyer | Brand | Channel | Why not chosen |
|-------|-------|-------|---------|----------------|
| [theme 2] | [...] | [...] | [...] | [...] |
| [theme 3] | [...] | [...] | [...] | [...] |

## SECONDARY THEME (optional)
[Name + when to lean on it]

## EXCLUSIONS
| Excluded Theme | Reason |
|----------------|--------|
| [...] | [...] |

## DOWNSTREAM CONTRACT
Every skill that produces creative for this campaign MUST:
- Open by reading this declaration
- Treat the theme as a hard constraint (no off-theme work)
- Cite the theme in its own output (e.g., "hook serves Loss Aversion theme by...")
- Flag any tension or violation rather than silently drifting
```

---

## PROCESS RULES

1. **One theme per campaign.** Multi-theme campaigns produce confused buyers. If two themes seem to fit, run two campaigns or two phases — don't merge them.

2. **Defend the choice in writing.** The defensibility layer isn't optional. If you can't articulate WHY this theme, you don't yet know enough to declare it.

3. **Cite verbatim RESEARCH LOCK whenever possible.** Themes feel hypothetical until anchored to real customer language.

4. **Brand permission matters as much as buyer fit.** A perfect-buyer-fit Contrarian theme fails if the brand has zero standing to be contrarian.

5. **Channel context is not optional.** The same persona on Google vs TikTok responds to different themes. Select for the dominant channel.

6. **Provisional declarations are OK but mark them.** If persona/character aren't ready, declare provisionally and flag for re-validation. Don't block the pipeline.

7. **Save as `theme-declaration-[campaign].md`** via present_files. Append to campaign-state Decision Log. Notify subsequent skills (icp-persona-engine if not run yet; hook-creative-generator + lp-copy-generator + email-sequence + retargeting-cascade).

---

## DOWNSTREAM SKILL INTEGRATION

The theme declaration feeds:
- **icp-persona-engine** — persona description leans into theme-relevant pain/desire layers
- **icp-character-builder** — character's internal monologue is consistent with the theme
- **creative-strategy-selector** — uses library-creative-strategies × theme compatibility matrix to constrain strategy choice
- **hook-creative-generator** — every hook is an expression of the theme
- **lp-copy-generator** — LP scroll progression argues the theme's case
- **email-sequence-from-character** — sequence is the theme's argument over time
- **retargeting-cascade** — leans on secondary theme at warmer stages if declared
- **creative-interrogator** — audits whether work serves the declared theme

---

## OUTPUT CONTRACT

The phase-doc orchestrator captures this skill's output into the phase doc's `section:theme-locked` (Phase 3).

**Target section:** `section:theme-locked`
**Format:** markdown content block
**Confidence required:** HIGH (the theme is a LOCK; LOW confidence = use provisional flag in TL;DR)

**Required fields in the section content:**
- The chosen theme name
- Core belief (one-sentence thesis)
- Defended rationale (3+ sentences, tied to Phase 2 pain themes / brand permission / channel context)
- `* Provenance: RESEARCH LOCK verbatim quote, Phase 2 section:pain-language reference, brand permission reference`
- Provisional flag (only if not enough info — declare provisional, don't block)

**Hard rules:**
- Write ONLY into `section:theme-locked`. Do NOT touch persona, character, strategy, or positioning sections — those have their own skills.
- ONE theme per campaign. If two themes fit, declare a primary + flag a secondary for warmer stages.
- Cite the RESEARCH LOCK verbatim quote that anchors the theme — this is the "why" the operator approves against.
- Append a Decision Log entry to `campaign-state.md`: `theme = [name] | theme-selector | [one-line rationale] | brand permission + pain themes + channel context`.

---

> **First principle:** A theme is the campaign's emotional thesis statement. Pick one. Defend it on paper. Honour it everywhere. Pipelines without declared themes produce inconsistent creative; pipelines with declared themes produce campaigns that compound.

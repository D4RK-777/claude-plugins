---
name: gtm-document-builder
description: "Terminal output skill — compiles all approved phase doc artifacts into ONE executable Go-to-Market HTML document. Project-scope-gated (only renders sections relevant to declared channels-in-scope). Locked design principles from library-art-direction + library-design-foundations. Swappable CSS tokens. Use when a campaign is launch-ready and needs a paste-readable executive GTM doc. Output: go-to-market-{slug}.html. Triggers on: build GTM document, generate go-to-market doc, render execution doc, build campaign packet."
---

# Go-to-Market Document Builder
> **Position in pipeline:** Phase 8 (Launch-ready output). Runs AFTER all upstream phases are complete and BEFORE the campaign goes live. Produces the single document the operator opens to ship — no hunting through folders.

---

## ROLE

You compile the pipeline. Every artifact produced upstream gets distilled into ONE executive document — `go-to-market-[project].html` — that the operator can take straight to the platforms they need to act on (Meta Ads Manager, image-gen tools, email platform, CMS).

The Bezos chair sits at the top of the document and never leaves. Every section that follows is in service of that ICP.

You don't make creative or strategic decisions here. Those were made upstream. You package, frame, and sequence.

---

## WHEN TO INVOKE

Trigger when:
- All required pipeline artifacts exist (brand-brief, persona, character, theme-declaration, creative-strategy-declaration, plus channel-relevant assets)
- Triple-gate has been passed (creative-interrogator + persona-stress-test + funnel-audit — for multi-asset campaigns)
- The user says: "build the GTM", "compile the campaign", "we're ready", "generate the doc", "wrap this up"
- A campaign needs to ship and the operator needs everything in one place

**Do NOT run** if upstream artifacts are missing. Halt and report which artifacts are absent — don't fabricate.

---

## INPUTS REQUIRED

For ALL projects:
- `brand-brief-[project].md`
- `campaign-state-[project].md`
- `theme-declaration-[campaign].md`
- `campaign-persona-[name].md`
- `character-profile-[name].md`
- `creative-strategy-declaration-[campaign].md`
- `design-system-selection-[campaign].md` (defines the tokens)
- `forecast-[campaign]-v[N].md`

For channels declared in scope (only fetch what's relevant):
- **Meta / TikTok / LinkedIn:** ad copy package, image-prompt-package, audience-architecture, retargeting-cascade
- **Google Search/PMax:** ad copy package, keyword strategy
- **Landing page:** `lp-copy-[asset].md`
- **Email:** `email-sequence-[type]-[character].md`
- **SEO:** `seo-strategy-[brand].md`
- **Video:** cinematic-prompt-architect output

Triple-gate verdicts:
- `creative-audit-report.md` (from creative-interrogator)
- `stress-test-report.md` (from persona-stress-test)
- `funnel-audit-report.md` (from funnel-audit, if multi-asset)

---

## DESIGN PRINCIPLES (LOCKED — do not change without explicit user instruction)

These are baked into the HTML structure. They derive from `library-art-direction.md` (8 principles) and `library-design-foundations.md` (8 foundations):

1. **One idea per section.** Each section's heading + first card communicates the section's job inside 1.5 seconds.
2. **Hierarchy through size, weight, and space — never colour alone.** WCAG AA contrast minimums non-negotiable.
3. **Status colours have fixed semantics.** Green = ship / approved. Amber = caution / fail mode. Red = kill / over limit. No decorative use of these colours.
4. **Verbatim quotes get pull-quote treatment.** Italic, hanging indent, attribution beneath. Never paraphrased, never embedded inline.
5. **The ICP card sits sticky-top through the entire document.** The Bezos chair, literalised.
6. **Section ordering is fixed:** §1 ICP → §2 Strategy → §3 Ads → §4 Creative → §5 Audience → §6 Launch → §7 Forecast → §8 Triple Gate → §9 Live Loop. Channels in scope determine which sub-sections render inside §3-§5; the ordering of §1-§9 is constant.
7. **Paste-readiness is the design constraint.** Every artifact a user needs to copy gets a copy-to-clipboard affordance. Char-count badges where length caps matter.
8. **Restraint is sophistication.** Empty space is intentional. One decisive visual per section beats three competing ones.

---

## DESIGN TOKENS (SWAPPABLE on explicit user request)

Exposed as CSS variables. Changeable only when the user says "change the design tokens" or equivalent. Never auto-update.

```css
:root {
  /* Surface + text */
  --gtm-bg: #fafaf9;
  --gtm-surface: #ffffff;
  --gtm-surface-2: #f5f5f4;
  --gtm-border: #e7e5e4;
  --gtm-text: #1c1917;
  --gtm-text-muted: #57534e;
  --gtm-text-faint: #a8a29e;

  /* Action + status (semantic — do NOT repurpose) */
  --gtm-action: #1d4ed8;
  --gtm-action-bg: #eff6ff;
  --gtm-success: #166534;
  --gtm-success-bg: #dcfce7;
  --gtm-warning: #92400e;
  --gtm-warning-bg: #fef3c7;
  --gtm-danger: #991b1b;
  --gtm-danger-bg: #fee2e2;

  /* Typography */
  --gtm-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
  --gtm-font-serif: ui-serif, Georgia, "Times New Roman", serif;
  --gtm-font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;

  /* Geometry */
  --gtm-radius: 10px;
  --gtm-radius-sm: 6px;
  --gtm-spacing-unit: 4px;  /* 4pt grid */
  --gtm-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
}
```

When the user requests a token change (e.g., "make the brand colour our purple"), update only the relevant variables and confirm the change in chat. NEVER swap tokens because "they feel old" or "I think this looks better" — you have no authority to change design without explicit instruction.

---

## SECTION-BY-SECTION COMPILATION

### §1 — ICP (Bezos chair, sticky-top)

**Message:** A real person, not data.
**Source:** `character-profile-[name].md` + relevant VERBATIM from `brand-brief` RESEARCH LOCK.

**Visual treatment:**
- ONE card. White surface. Subtle shadow.
- Headline: Persona name · age · role · "[location]"
- One-line decision-style + grid position as small tags
- **Pull-quote** of the top verbatim pain (italic, hanging indent, larger font size, attribution beneath as small caps)
- Sticky-top via `position: sticky; top: 0` so it never leaves the field of view

**Data fields populated:**
- name, age, location, role
- decision_style (dominant)
- grid_position (Awareness × Sophistication)
- top_verbatim_pain (one quote — the most visceral)
- top_verbatim_source + date

### §2 — Strategy Locked

**Message:** Here's the bet, why it works, what kills it.
**Source:** `theme-declaration` + `creative-strategy-declaration` + competitive scan from Phase 1.

**Visual treatment:**
- 3 stacked statement cards
- Each: bold name (e.g., "Loss Aversion" theme) · one-line rationale beneath · fail-mode line in amber

**Data fields populated:**
- theme_name + theme_one_liner + theme_rationale
- strategy_name + strategy_mechanic + strategy_failmode
- sophistication_stage_call + competitor_positioning_gap

### §3 — The Ads (paste-ready)

**Message:** Ship these.
**Source:** ad copy from hook-creative-generator + paid-ads-expert outputs. Channel-scoped.

**Visual treatment:**
- One card per ad variant (3-5 typical)
- Each card shows: hook · primary text · headline · description · CTA · paired image prompt (collapsed under toggle by default)
- Char-count badge per field: green if within limit, amber if approaching, red if over
- Copy-to-clipboard button per field
- Image prompt collapsed behind disclosure toggle — user wants the copy first, the prompt is reference

**Data fields populated per ad:**
- hook
- primary_text + char_count
- headline + char_count
- description + char_count
- cta_button (mode-matched)
- image_prompt_package_ref
- scent_match_note (vs LP if LP in scope)

### §4 — Creative Assets

**Message:** Paste these and go.
**Source:** `image-prompt-package-[asset].md` + cinematic-prompt-architect output if video.

**Visual treatment:**
- Monospace blocks (code-shaped — visual signal that this is paste-able instruction)
- Per-tool tabs (Midjourney / Flux / Ideogram / DALL-E / Imagen / Reve / Sora 2 — only show tabs for tools the user uses)
- Aspect-ratio variants stacked under each tool tab (1:1 / 4:5 / 9:16 / 1.91:1 per channel needs)
- Each block has copy-to-clipboard

**Data fields populated per concept:**
- subject + action + composition + lighting + palette + texture + style + negative
- one prompt per (tool × aspect ratio)
- reference image paths if visual conditioning used

### §5 — Audience Architecture (paste-ready)

**Message:** Exactly who sees this.
**Source:** `audience-architecture-[campaign].md` + `retargeting-cascade-[character].md`.

**Visual treatment:**
- Tiered: Cold (top) → Warm/Hot (below) — mirrors how spend flows
- Per-audience card: definition · estimated size · budget allocation · bid strategy
- One horizontal bar visualising budget split across audiences (single decisive visual — no chartjunk)
- Retargeting cascade as 5-stage progression with audience def + creative ref + cadence per stage

**Data fields populated:**
- per cold audience: name, definition, est_size, budget_pct, bid_strategy
- per cascade stage: audience def, creative ref, cadence, frequency cap, exit logic

### §6 — Launch Configuration

**Message:** Don't skip these or it breaks.
**Source:** Launch checklist from paid-ads-expert + tracking-attribution requirements.

**Visual treatment:**
- Real checkboxes the user ticks off as they go
- Each item has a "why this matters" tooltip (hover/tap) — accessible without cluttering eye line
- Grouped by: Tracking · Campaign setup · Creative upload · Audience setup · QA

**Data fields populated:**
- per checklist item: text, why-tooltip, link-to-platform-docs (if applicable)

### §7 — Forecast

**Message:** Here's what to expect. Here's when to scale, here's when to kill.
**Source:** `forecast-[campaign]-v[N].md`.

**Visual treatment:**
- 3 columns: Best · Likely · Worst (left to right, signalling optimism gradient)
- Big numbers, small labels (the numbers ARE the headline — restraint principle)
- Below the three columns: decision rules as conditional sentences ("If CPL > $X for 7 days → KILL", "If CPL < $Y for 7 days → DOUBLE")

**Data fields populated:**
- per scenario (best/likely/worst): CPL, ROAS, lead_volume, total_revenue
- scale_criteria (text)
- kill_criteria (text)
- review_cadence

### §8 — Triple Gate Audit

**Message:** Audited. Verdict.
**Source:** `creative-audit-report.md` + `stress-test-report.md` + `funnel-audit-report.md`.

**Visual treatment:**
- 3 traffic-light pills horizontally: Interrogator / Stress-Test / Funnel-Audit
- Pill colour reflects worst element per gate (green=all clear, amber=revise, red=kill)
- If amber/red on any gate: load-bearing fix called out in ONE sentence below
- No forensics dump — user opened the doc to ship, not to read audit minutiae. Detail lives in the linked report files.

**Data fields populated:**
- interrogator_verdict + load_bearing_issue
- stress_test_verdict (e.g., "3/3 ✓ Sarah" / "2/3 ✓ Marcus") + load_bearing_issue
- funnel_audit_verdict + load_bearing_fix (only if multi-asset)

### §9 — Live Loop

**Message:** Here's how this improves itself.
**Source:** `campaign-reporter` cadence + `data-analyst` data-drop expectations + `feedback-loop-back` schedule.

**Visual treatment:**
- Weekly cadence as a small visual schedule (Mon · Wed · Fri data-pull cues)
- "Drop your data files here" cue with the auto-detected filename patterns
- Decision Log skeleton (empty rows ready to fill as the campaign runs)

**Data fields populated:**
- weekly_review_day
- data_file_patterns to drop (Meta CSV, Google CSV, etc.)
- next_review_date
- decision_log_template

---

## PROJECT-SCOPE GATING

The Intake Wizard collects:
- `campaign.primary_goal` (one of: awareness / leadgen / trial / purchase / retarget / retention / brand)
- `campaign.channels_in_scope` (multi-select: Meta, Google, LinkedIn, TikTok, YouTube, X, Email, Organic social, SEO/Content, Other)

The GTM doc renders only what's relevant:

| If channels in scope include... | Render in §3-§5... |
|---|---|
| Meta, TikTok, LinkedIn | Paid social ad cards + image prompts + audience architecture + retargeting cascade |
| Google Search/PMax | Search ad cards + keyword strategy + Google audience signals |
| Email | Email sequence cards (per email: subject lines, body, send time, CTA) |
| Organic social | Organic post cards (caption-led, no audience architecture) |
| SEO/Content | Content brief cards from seo-content-engine (linked) |
| Landing page (always if any conversion goal) | LP copy reference + scent match diagram |

If a channel isn't in scope, **skip the sub-section entirely**. Don't render empty cards. Don't fabricate content for channels we're not running.

---

## OUTPUT — `go-to-market-[project].html`

A single self-contained HTML file with:
- Sticky-top ICP card (§1)
- Sections §2-§9 in fixed order
- Channel-scoped sub-sections per the wizard inputs
- All design tokens as CSS variables
- All copy-to-clipboard affordances functional
- Print-friendly stylesheet (so the user can PDF it for share)
- Mobile-responsive (the operator may open it on phone before pushing publish)

Save to `C:\Users\chris\.claude\projects\Marketing\go-to-market-[project].html`.

Also save the structured data payload (`go-to-market-[project].json`) so future tools (Canva, Figma, automation) can consume the same data without HTML parsing.

---

## PROCESS RULES

1. **Compile only what exists.** If an upstream artifact is missing, HALT and report — don't fabricate.
2. **Project-scope respected.** Never render sections for channels not in scope. Never invent assets for channels the user didn't ask for.
3. **Verbatim is sacred.** Quotes pulled from RESEARCH LOCK keep their exact wording + source + date. Never paraphrased. Never polished.
4. **Triple-gate verdicts are surfaced honestly.** If a gate failed, that failure is shown in §8 with the load-bearing fix. Don't hide failures.
5. **Design principles are locked.** Don't change hierarchy, ordering, or status-colour semantics. EVER. Only token values (specific hex codes, font choices) can be changed — and only on explicit user request.
6. **Save as `go-to-market-[project].html` + companion `.json`.** Both files. The HTML is for humans; the JSON is for future tooling.

---

## DOWNSTREAM (post-GTM-doc)

After the GTM doc is built and the operator ships:
- `campaign-state` Decision Log gets a "Campaign launched" entry
- `data-analyst` waits for data files to be dropped
- `feedback-loop-back` runs after campaign concludes, pushing insights into the libraries

---

> **First principle:** A pipeline that doesn't terminate in a single ready-to-execute document is just expensive note-taking. The GTM doc is the difference between "we built a marketing strategy" and "we shipped a campaign." Everything else exists to make THIS document accurate and complete.

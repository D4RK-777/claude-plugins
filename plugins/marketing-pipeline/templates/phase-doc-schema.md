# Phase Doc Schema — universal contract

Every phase emitter in this pipeline produces a phase doc that follows this exact shape. The Marketing Command Center dashboard expects this format and renders it into reviewable tick-boxed sections automatically. Deviate from the schema and the dashboard breaks.

## Why this schema exists

The old pipeline scattered outputs across 10+ files per campaign. The operator had to hunt. The phase doc consolidates one phase's entire output into ONE file the dashboard reads, renders, and gates approval on.

Operators don't read these files directly — they're rendered inline in the dashboard. But the file is the source of truth.

## File location convention

`{marketing_root}/{brand_slug}/{project_slug}/{N}-{block_id}.md`

Examples:
- `Marketing/chatinc/flex-shopify/1-setup.md`
- `Marketing/chatinc/flex-shopify/2-research.md`
- `Marketing/gloss/q1-2026-launch/1-setup.md`
- `Marketing/konekt/onboarding-revamp/3-ideation.md`

Both `{brand_slug}` and `{project_slug}` are kebab-case (no spaces, no caps). Each brand gets its own folder; within a brand, each project gets its own subfolder; all 8 phase docs + intake.json + companion files live in the project subfolder.

Brand-level shared resources (overridden libraries, brand-specific assets) live at `{marketing_root}/{brand_slug}/_libraries/`.

## File format

```markdown
---
phase: 2
block_id: research
brand_slug: chatinc
brand_display_name: ChatInc
project_slug: flex-shopify
project_display_name: Flex Shopify
status: awaiting_review   # not_started | running | awaiting_review | approved
created_at: 2026-05-27T15:42:00Z
last_updated: 2026-05-27T16:18:00Z
approved_at: null
approved_by: null
confidence_overall: HIGH   # HIGH | MEDIUM | LOW
human_attention_required: true
schema_version: 1
upstream_phases_consumed:
  - 1-setup
---

# Phase 2 — Research Synthesis

## TL;DR
[Exactly 3 lines]
- What we found: ...
- What it means: ...
- What's next: ...

## Sections

### section:pain-language
**Title:** Customer pain language
**Confidence:** HIGH
**Source:** g2-reviews + trustpilot + reddit
**Why this matters:** [One sentence — what downstream phase uses this]

[CONTENT BLOCK — markdown, may include verbatim quotes tagged [VERBATIM: "quote" — source, date]]

---

### section:competitive-whitespace
**Title:** Competitive whitespace
**Confidence:** MEDIUM
**Source:** competitor scan + category noise analysis
**Why this matters:** ...

[CONTENT BLOCK]

---

### section:opportunities-gaps
**Title:** Opportunities + gaps
**Confidence:** MEDIUM
**Source:** synthesized from VOC + competitive
**Why this matters:** ...

[CONTENT BLOCK]

---

### section:positioning-hypothesis
**Title:** Positioning hypothesis
**Confidence:** MEDIUM
**Source:** synthesized
**Why this matters:** ...

[CONTENT BLOCK]

---

## Open questions for human
[Each question is a SPECIFIC ask. Not "what do you think" — a real decision the AI can't make.]

- Q1: Should we exclude markets outside the US?
- Q2: Is "FlexPro" a competitor or a partner?
- Q3: ...

## Seeds for next phase
[Explicit handoff. Each item below carries into the next phase.]

- Pain vocab (verbatim quotes) → Ideation/icp-character-builder
- Competitive whitespace summary → Ideation/positioning-engine
- Opportunities list → Ideation/theme-selector
- Open questions → block downstream work until resolved
```

## Setup vs Research — what goes where

**Setup (Phase 1)** = INTERNAL TRUTHS the operator already knows + OPTIONAL HYPOTHESES.

Internal truths (required, locked):
- Product: what it is, outcome, pricing, what it helps avoid/achieve
- Brand: voice intent, anti-voice intent, hard NOs, visual identity
- Campaign: goal, channels in scope, budget, KPI, timeline, existing assets

Operator hypotheses (optional, flagged as "to validate in Phase 2"):
- Customer best-guess
- Competitor hunches (names only)
- Edge hypothesis (what we think makes us different)

**Research (Phase 2)** = EXTERNAL VALIDATION. The AI does the work — fetches sites, mines public reviews, scans competitors. This is the phase that:
- Validates / refutes / replaces the Setup hypotheses with real evidence
- Mines verbatim customer pain language
- Produces the real competitive landscape
- Identifies opportunities + gaps
- Proposes a positioning hypothesis for Phase 3 to lock

A hypothesis in Setup that survives Phase 2 validation gets promoted to a "validated" section in the Research phase doc. A hypothesis that gets refuted is overwritten with the actual finding — with a delta callout explaining the change.

## Required frontmatter fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `phase` | int (1-8) | yes | The block number |
| `block_id` | string | yes | One of: setup, research, ideation, creation, implementation, reporting, learning, updating |
| `brand_slug` | string | yes | kebab-case brand identifier (e.g. `chatinc`, `gloss`, `konekt`) |
| `brand_display_name` | string | yes | Human-readable brand name |
| `project_slug` | string | yes | kebab-case, matches folder name |
| `project_display_name` | string | yes | Human-readable |
| `status` | enum | yes | not_started, running, awaiting_review, approved |
| `created_at` | ISO 8601 | yes | When phase emitter first produced this doc |
| `last_updated` | ISO 8601 | yes | Last edit (including per-section regens) |
| `approved_at` | ISO 8601 \| null | yes | Filled when operator hits approve |
| `approved_by` | string \| null | yes | Operator name |
| `confidence_overall` | HIGH \| MEDIUM \| LOW | yes | Worst-case of all sections |
| `human_attention_required` | boolean | yes | True if there are unresolved open questions or LOW-confidence sections |
| `schema_version` | int | yes | This schema's version. Currently 1. |
| `upstream_phases_consumed` | array | yes | List of phase-doc filenames this phase read from |

## Required body sections

### TL;DR
Exactly 3 lines. No more, no less. Pattern: *What we found / What it means / What's next.*

### Sections
At least one. Each section MUST have:
- `### section:[kebab-case-id]` heading
- `**Title:**` bold-label line
- `**Confidence:**` HIGH | MEDIUM | LOW
- `**Source:**` one-line provenance (where the AI got this — review URL, fetched page, synthesized)
- `**Why this matters:**` one sentence explaining the downstream use
- Content block (markdown, freeform)
- `---` separator before next section

The section IDs are well-known per-phase (see each phase-doc-emitter skill for the canonical section list). Use exact IDs so the dashboard can map them.

### Open questions for human
Always present, even if empty (`(none)` if there are no blockers). Each item is a SPECIFIC, ANSWERABLE question. Not "thoughts?" — a real decision.

### Seeds for next phase
Always present. Explicit handoff: what carries into the next phase, mapped to where it lands. The next phase emitter consumes this list to know what to load.

## Rendering rules (for the dashboard)

The dashboard parses this file and renders:

1. **Header strip** — phase number + block name + status pill (color-coded)
2. **TL;DR card** — the 3-line summary in a quote block
3. **Per section** — collapsible card with:
   - Title + confidence pill (green/amber/red)
   - "Why this matters" tooltip
   - Source citation (linked if URL)
   - Content rendered as markdown
   - **[ ✓ Accept ]** **[ ✗ Override ]** tick-row
   - Override note textarea (visible when ✗ ticked)
   - **[ ↻ Change just this section ]** button (copies a focused regen prompt to clipboard; operator pastes into Claude Code)
4. **Open questions** — answerable form fields with text inputs; submissions write back into the file
5. **Approval gate** — big button at bottom. Disabled until every section has a tick OR an override note, and every open question has an answer. When clicked, sets `status: approved`, fills `approved_at` + `approved_by`, and emits a `Seeds for next phase` summary to the next block.

## Hard rules — for phase-doc-emitter skills

1. **No fabrication.** Every section value must trace to a real input (upstream phase doc, fetched URL, user-provided answer). Confidence must reflect reality.
2. **VERBATIM tagging.** Customer-voice content uses `[VERBATIM: "quote" — source, date]`. Source is a fetchable URL.
3. **Confidence honesty.** HIGH = stated directly in source. MEDIUM = synthesized from multiple signals. LOW = best guess.
4. **Open questions are real.** Never pad. If you have 0, write `(none)`. If you have a fake question, kill it.
5. **Seeds are explicit.** Every seed must specify: what data + where it lands in the next phase.
6. **One file per phase.** Never split a phase across multiple docs. The dashboard reads one file per phase.

## What the dashboard does not allow

- Approving with unresolved LOW-confidence sections (unless operator overrides each)
- Moving to phase N+1 if phase N is not `approved`
- Editing the schema or frontmatter directly (those are AI-managed; operator only ticks/overrides/notes)

## Version history

- v1 (2026-05-27): Initial release

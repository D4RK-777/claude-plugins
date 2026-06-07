---
name: phase-doc-research
description: "Emits the Phase 2 Research phase doc — does the actual external research. Triggers on '# Run Phase 2 — Research'. Consumes Phase 1's internal truths + hypotheses. Validates / refutes / replaces hypotheses with real evidence. Mines verbatim customer pain language, fetches competitors, scans category noise, identifies opportunities + gaps, proposes positioning hypothesis. Output: {marketing_root}/{brand_slug}/{project_slug}/2-research.md."
---

# Phase Doc Emitter — Phase 2: Research

## What Research does

Research is the phase where the AI does external work. The operator's Setup gave us internal truths + their guesses. Research validates/refutes/replaces the guesses with real evidence:

- **Customer hypothesis from Setup** → validated by mining real public reviews + community discussions → produces `customer-truth` with verbatim VOC
- **Competitor hunches from Setup** → fetched + analyzed → produces `competitive-truth` with positioning summaries
- **Edge hypothesis from Setup** → validated against actual whitespace → produces `edge-validated` (or `edge-refuted` if the hypothesis doesn't hold)

If Setup hypothesis was right → Research doc shows "validated" with corroborating evidence. If Setup hypothesis was wrong → Research doc shows the actual finding with a "delta callout" explaining the change.

## When to fire

Trigger: `# Run Phase 2 — Research`

## Pre-conditions

- `{marketing_root}/{brand_slug}/{project_slug}/1-setup.md` exists AND `status: approved`
- If not → refuse, tell dashboard "Phase 1 must be approved first"

## Inputs

1. `1-setup.md` (frontmatter + sections — especially the hypothesis sections)
2. **Brand libraries** from `{marketing_root}/{brand_slug}/_libraries/` — `voice.md`, `hard-nos.md`, `audiences.md` are re-read every phase and enforced as rails on every research conclusion
3. Seeds from Phase 1: product_url, brand_hard_nos, customer_hypothesis, competitor_hunches, edge_hypothesis, campaign_channels
4. (Optional) any research drops the operator pasted in the trigger
5. (If `intake.json.inherited_from` is set) inherited campaign's `1-setup.md` and `3-ideation.md` for persona/positioning baseline

## What you do (in order)

1. **Fetch the brand's site fully** — homepage + /about + /pricing + /customers + /case-studies. Extract product reality, real pricing, real customer signals (logos, case studies).
2. **Mine public reviews for VOC** (`apify-pain-research` semantics):
   - G2, Trustpilot, Capterra, Reddit, app stores
   - For each relevant quote, tag as `[VERBATIM: "exact words" — source-url, date]`
   - Aim for 15+ quotes across 4+ sources at HIGH confidence
3. **Fetch competitors** (`library-competitive-intelligence` semantics):
   - Start with Setup's `competitor_hunches`
   - Auto-discover via web search if fewer than 3 hunches OR if hunches turn out not to be real competitors
   - For each: positioning headline, pricing tier, target customer signal, 1-line summary
4. **Category noise scan**:
   - Web search top results for "{category} best 2026", "{category} comparison"
   - Identify dominant claim/mechanism in the category
5. **Validate Phase 1 hypotheses**:
   - Customer hypothesis → does the VOC match the operator's guess? If yes: VALIDATED. If no: state the actual customer + the delta.
   - Competitor hunches → are these the actual competitors? Replace with real list if needed.
   - Edge hypothesis → does the competitive whitespace support this claim? If yes: VALIDATED. If no: state the actual whitespace + propose a different wedge.
6. Compute confidence per section + overall.
7. Emit `{marketing_root}/{brand_slug}/{project_slug}/2-research.md`.

## Required sections (exact IDs)

- `section:customer-truth` — validated customer profile with verbatim VOC. Includes a "Delta from Phase 1 hypothesis" callout (VALIDATED / REFINED / REFUTED).
- `section:pain-language` — verbatim quote bank organized by theme (frustration / desire / objection / proof-required)
- `section:competitive-truth` — per-competitor positioning + pricing + target customer + 1-line summary. Includes "Delta from Phase 1 hunches" callout.
- `section:opportunities-gaps` — synthesized opportunity list with size + risk
- `section:edge-validated` — what actually IS the differentiator (based on real competitive whitespace). Includes "Delta from Phase 1 edge hypothesis".
- `section:category-noise` — dominant message/mechanism in the category; sophistication stage signal
- `section:positioning-hypothesis` — proposed wedge angle for Phase 3 to lock (this is HYPOTHESIS, not the final positioning statement)

## Open questions to surface

- If competitor data was partial (e.g. behind login): ask operator for screenshots or paste-back
- If review mining surfaced contradictory pain signals: ask which segment to prioritize
- If positioning hypothesis conflicts with brand hard NOs: surface the conflict, ask resolution
- If Phase 1 hypotheses were heavily refuted: confirm the operator is OK with the pivot

## Seeds for Phase 3 (Ideation)

- `pain.themes[]` → Phase 3 theme-selector
- `pain.verbatim_quotes[]` → Phase 3 icp-character-builder voice
- `competitive.whitespace_summary` → Phase 3 positioning-engine
- `positioning_hypothesis` → Phase 3 creative-strategy-selector starting frame
- `audience_signals[]` → Phase 3 icp-persona-engine

## Hypothesis-delta convention

For each hypothesis section in Phase 1, this phase's matching truth section must end with a callout:

```
> **Delta from Phase 1 hypothesis:** VALIDATED — the operator's guess matches the evidence.
```

Or:

```
> **Delta from Phase 1 hypothesis:** REFINED — operator said "Z by mid-size SaaS", evidence says "Z is real but the buyer is more often Y in companies sized <50."
```

Or:

```
> **Delta from Phase 1 hypothesis:** REFUTED — operator guessed X; the actual customer is W. Evidence: [VERBATIM quotes]. Operator should review before proceeding.
```

When REFUTED, set `human_attention_required: true` and add an open question asking the operator to confirm the pivot.

## TL;DR template

- What we found: {N} verbatim quotes across {M} sources; {K} competitors scanned. Hypothesis status: {V} validated, {R} refined, {Q} refuted.
- What it means: Real whitespace is {whitespace_summary}. Sophistication stage {stage}.
- What's next: Run Phase 3 Ideation — proposed positioning hypothesis is "{hypothesis}".

## Frontmatter

```yaml
phase: 2
block_id: research
brand_slug: {brand_slug}
brand_display_name: {brand_display_name}
project_slug: {project_slug}
project_display_name: {project_display_name}
status: awaiting_review
confidence_overall: HIGH | MEDIUM | LOW
human_attention_required: true if any refuted hypothesis or contradiction
upstream_phases_consumed: [1-setup]
schema_version: 1
```

## Hard rules

1. NO fabrication. Every verbatim quote needs `[VERBATIM: "quote" — url, date]` with a real, fetchable source.
2. NEVER fabricate competitors. If competitor_hunches don't pan out, do web search + cite the source where you found the real list.
3. Don't write a "positioning conclusion" — it's a HYPOTHESIS for Phase 3 to validate.
4. Don't repeat Phase 1's content — link to its sections instead.
5. Always include the Delta callout for every hypothesis Phase 1 surfaced.
6. End response with: `✓ Phase 2 doc ready: {path}. Open the dashboard to review.`

## Wraps

- `apify-pain-research-SKILL.md` (review mining)
- `library-competitive-intelligence.md` (competitive scan)
- `preflight-research-SKILL.md` (if preflight was run, reuse the JSON to skip redundant fetches)

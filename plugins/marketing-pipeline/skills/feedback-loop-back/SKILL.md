---
name: feedback-loop-back
description: >
  The pipeline's loop-closure skill. Takes structured insights from data-analyst (and findings from campaign-reporter post-mortems) and explicitly pushes them into the source libraries and character profiles so the NEXT campaign starts smarter. Updates library-industry-benchmarks with ChatInc-specific numbers, refines library-campaign-themes and library-creative-strategies based on what actually worked, refreshes library-channel-specs with discovered platform quirks, updates character profiles when assumptions are confirmed or refuted, and logs lessons-learned entries to campaign-state. Every update is traced back to its source data with date and rationale. Outputs feedback-loop-[campaign]-[date].md documenting every change. Trigger on: "close the loop", "feed insights back", "update the libraries with what we learned", "post-mortem follow-through", "what should change for next campaign", or as the automatic last step after campaign-reporter writes a post-mortem.
---

# Feedback Loop-Back
> **Position in pipeline:** Block 8 Updating (closes the loop). Runs AFTER `data-analyst` produces the structured insights JSON and AFTER `campaign-reporter` writes the post-mortem. This is the skill that turns campaign data into next-campaign intelligence. Without it, the pipeline is open-loop and never compounds.

---

## ROLE

You are the pipeline's institutional memory. Your job is to take the insights from a completed (or in-flight, mid-campaign) analysis and **explicitly update the source libraries and profiles** so the next campaign starts with sharper assumptions.

Most marketing pipelines are open-loop: they ship a campaign, write a post-mortem, file it away, and start the next campaign from the same generic assumptions. That's why most teams don't compound. Your job is to close the loop.

You are the difference between "we learned a lot" (open-loop) and "the next campaign assumes X% better baseline CPL because we now have 12 campaigns of evidence to update our benchmarks" (closed-loop, compounding).

---

## WHEN TO INVOKE

Trigger when:
- `data-analyst` has produced a `data-analysis-[campaign]-[date].md` with structured insights JSON
- `campaign-reporter` has written a post-mortem
- A campaign ends and the team is debriefing
- Multiple campaigns have accumulated (3+) and it's time to refresh ChatInc-specific benchmarks
- The user says: "close the loop", "feed insights back", "update the libraries", "what should change for next campaign", "post-mortem follow-through"

**Do NOT** run without an analysis source. Insights without statistical backing become opinions, and opinions corrupt the libraries faster than no update.

---

## INPUTS REQUIRED

1. **`data-analysis-[campaign]-[date].md`** from `data-analyst` (mandatory — contains the structured insights JSON)
2. **Post-mortem report** from `campaign-reporter` (mandatory — contains qualitative findings the JSON might miss)
3. **`campaign-state-[project].md`** — for full campaign context and Decision Log
4. **Existing library files** — to know what we're updating against:
   - `library-industry-benchmarks.md`
   - `library-campaign-themes.md`
   - `library-creative-strategies.md`
   - `library-channel-specs.md`
   - `library-conversion-framework.md`
   - `library-art-direction.md`
5. **Existing `character-profile-[name].md` files** for this campaign

---

## THE LOOP-CLOSE PROCESS

### STEP 1 — INGEST + RECONCILE

Read the structured insights JSON from `data-analyst`. Cross-reference against the post-mortem from `campaign-reporter` for any qualitative findings the JSON missed.

Produce a reconciled "Findings Manifest" — every finding that's a candidate for a library/profile update.

```
FINDINGS MANIFEST
1. [Finding] | Source: [data-analyst Phase X / post-mortem section Y] | Statistical confidence: [HIGH / MED / LOW]
2. [...]
```

Findings with LOW confidence are noted but NOT used to update libraries — they go into the "Watch list" instead (revisit after more campaigns).

### STEP 2 — CATEGORISE EACH FINDING

For each MEDIUM or HIGH confidence finding, determine which library or profile it should update:

| Finding type | Target library / file |
|---|---|
| Benchmark mismatch (our CPL ≠ industry median) | `library-industry-benchmarks.md` |
| Theme over/under-performed | `library-campaign-themes.md` |
| Strategy showed unexpected fit/misfit | `library-creative-strategies.md` |
| Platform mechanic changed (new spec, attribution shift) | `library-channel-specs.md` |
| LP friction pattern revealed | `library-conversion-framework.md` |
| Visual register insight | `library-art-direction.md` |
| Character assumption confirmed/refuted | `character-profile-[name].md` |
| Audience definition learning | Future `audience-architect` defaults (note for next sprint) |
| Forecast model error | `campaign-forecaster` quality multipliers (note for next sprint) |

### STEP 3 — DRAFT UPDATES (don't apply yet)

For each finding, draft the SPECIFIC change:

```
PROPOSED UPDATE
- File: [path]
- Section: [section name or anchor]
- Current text: "[quote the existing text]"
- New text: "[draft the replacement]"
- Reason: [one-sentence why, citing the source finding]
- Confidence: [HIGH / MED]
- Sample size: [N campaigns / N conversions / etc.]
```

### STEP 4 — REVIEW + APPROVE (user confirms before applying)

Present all drafted updates to the user as a single review pass. The user approves, rejects, or modifies each.

**This is a human-in-the-loop gate.** Library updates change future-campaign behavior, so don't apply without explicit approval.

For each drafted update, the user can:
- ✅ Approve → apply as drafted
- 🔄 Modify → user provides correction, then apply
- ❌ Reject → mark as "considered but not applied" in the loop-back doc
- ⏸ Defer → move to Watch list, revisit after more campaigns

### STEP 5 — APPLY APPROVED UPDATES

For each approved update:
- Read the target file
- Apply the edit (using shell + Python heredoc since Edit tool is blocked on the Marketing folder)
- Add a footnote: `<!-- Updated 2026-MM-DD via feedback-loop-back from [campaign-name] — reason: [...] -->`
- Note: never silently overwrite — leave a trail

### STEP 6 — UPDATE CAMPAIGN-STATE WITH LESSONS LEARNED

Append a "Lessons Learned" section to the source `campaign-state-[project].md`:

```markdown
## LESSONS LEARNED (from feedback-loop-back)

### Confirmed assumptions
- [...]

### Refuted assumptions
- [...]

### Library updates applied
- `[library]` / [section]: [from] → [to] (Confidence: [HIGH/MED])
- [...]

### Watch list (not yet enough evidence to update)
- [...]

### Forward-looking changes for next campaign
- [...]

Date: [YYYY-MM-DD] | Source analysis: data-analysis-[campaign]-[date].md
```

### STEP 7 — PRODUCE THE LOOP-BACK DOC

Output `feedback-loop-[campaign]-[date].md` documenting every step:

```markdown
# Feedback Loop-Back: [Campaign Name]
**Closed:** [date] | **Source analysis:** data-analysis-[campaign]-[date].md | **Source post-mortem:** report-postmortem-[campaign].md

## SUMMARY
[2-3 sentences: what was the campaign, what did data say, what changed in the libraries]

## FINDINGS MANIFEST
[Step 1 list with confidence ratings]

## UPDATES APPLIED ✅
For each: file, section, from→to, reason, confidence, sample size.

## UPDATES REJECTED ❌
[List of drafted updates the user chose not to apply, with the user's reasoning]

## DEFERRED — WATCH LIST ⏸
[Findings with LOW confidence or insufficient sample. Re-evaluate after [N] more campaigns.]

## CHARACTER PROFILE UPDATES
[Per character, what changed and why]

## FORWARD-LOOKING NOTES
- For `audience-architect`: [insight to apply next campaign]
- For `campaign-forecaster`: [quality multiplier adjustment]
- For `theme-selector`: [theme that worked better than expected; consider as default for similar persona]
- [...]

## NEXT CAMPAIGN BASELINE (what's different now)
Compared to before this loop-back, the next campaign of similar shape starts with:
- [Updated benchmark]: $X → $Y
- [Updated theme weighting]: [...]
- [...]
```

---

## EXAMPLE LIBRARY UPDATES

### Example 1 — Benchmark refinement

**Before** (in `library-industry-benchmarks.md`):
```
| B2B SaaS | $30 – $120 (lead form) |
```

**After** (post-loop-back, after 8 ChatInc campaigns):
```
| B2B SaaS — Industry median | $30 – $120 (lead form) |
| B2B SaaS — ChatInc actual (8 campaigns, 2025-26) | $45 – $95 (lead form) |
```
*<!-- Updated 2026-05-26 via feedback-loop-back from attribution-campaign-q1 — reason: 8th campaign analysed, ChatInc CPL distribution now stable enough to replace generic range. -->*

### Example 2 — Character profile refinement

**Before** (in `character-profile-sarah.md` Layer 6):
```
3. [Objection 3] — Can I afford it? — Fear: budget is committed | Resolves with: ROI math
```

**After** (post-loop-back, refuted by 38% of bounces at pricing+team-section):
```
3. [Objection 3] — Will my team actually use it? — Fear: another tool sitting unused | Resolves with: usage data from comparable accounts + admin time savings
```
*<!-- Updated 2026-05-26 via feedback-loop-back from attribution-campaign-q1 — reason: LP heatmap shows 38% drop at pricing-PLUS-team-mention-section, suggesting team-adoption fear is load-bearing not budget. Confidence HIGH (N=412 sessions). -->*

### Example 3 — Theme weighting update

**Before** (in `library-campaign-themes.md` Theme × Awareness fit):
```
| Loss Aversion | Solution Aware | ✓ |
```

**After** (post-loop-back, after a Loss Aversion campaign underperformed on Solution-Aware audience):
```
| Loss Aversion | Solution Aware | ✓ (when paired with mechanism — Stage 3+. Plain loss framing underperforms here per ChatInc 2026-Q1 data.) |
```

---

## PROCESS RULES

1. **No library updates without HIGH or MEDIUM confidence.** LOW-confidence findings go to the watch list.

2. **Sample size matters.** A single campaign's outlier doesn't change library defaults. Need 3+ campaigns of consistent signal, OR a single campaign with a very large sample (1000+ conversions) and statistical significance.

3. **Always preserve provenance.** Every library edit gets a footnote citing the source campaign and date. If the update later turns out wrong, you can trace it back and revert.

4. **Human approval is mandatory before applying.** Library updates change future-campaign behaviour. Don't apply without explicit go-ahead. Present drafts, get approval, then edit.

5. **Per-character updates require declared decision style or grid position changes.** Vague "Sarah seemed to behave differently" doesn't update profiles. Specific field-level changes do.

6. **Watch list is a real artifact.** Items that don't yet meet the confidence bar get tracked. Each future campaign can lift them from watch → applied.

7. **Save `feedback-loop-[campaign]-[date].md`** via present_files. Update campaign-state. Update library files. Edit character profiles.

8. **Notify campaign-state Decision Log** that loop-back ran — this is itself a strategic decision (we trusted these findings enough to update the libraries).

---

## DOWNSTREAM IMPACT (what changes after this skill runs)

- **`library-industry-benchmarks.md`** — gradually replaces generic ranges with ChatInc-specific ranges
- **`library-campaign-themes.md`** — fit matrices refined with real outcome evidence
- **`library-creative-strategies.md`** — same as themes
- **`library-channel-specs.md`** — quirks and attribution windows refined
- **`library-conversion-framework.md`** — LP friction patterns added
- **`character-profile-[name].md`** — objection chains, decision styles, conversion triggers refined per real behaviour
- **`campaign-forecaster` quality multipliers** — adjusted via notes in `forward-looking-notes`
- **Future `audience-architect` defaults** — same

After 5-10 loop-backs, the libraries become **ChatInc-specific intelligence** rather than generic frameworks. That's the compounding.

---

## PROCESS RULES (REPEATED FOR EMPHASIS)

**Never silently overwrite.** Every library edit has a `<!-- Updated [date] via feedback-loop-back from [campaign] — reason: [...] -->` footnote.

**Never apply without approval.** Drafts go to the user, user decides, then edits get applied.

**Never update without evidence.** Findings need MEDIUM+ confidence and proper sample size.

---

## THE WATCH LIST PATTERN

When a finding is interesting but not yet evidence-strong, it goes to the watch list:

```
WATCH LIST — `library-campaign-themes.md`

- **2026-05-26** | from campaign "attribution-q1" | Observation: Loss Aversion theme underperformed on Solution-Aware audience by 32% vs forecast | Confidence: MEDIUM (single campaign, N=180 conversions) | Action: Re-test in next Solution-Aware Loss Aversion campaign before updating library compatibility matrix.
```

Watch list lives in a separate file: `library-watch-list.md` (single file across all libraries; date-indexed).

Each future `feedback-loop-back` run checks the watch list for items that now have enough cumulative evidence to graduate to applied updates.

---

> **First principle:** A pipeline without a loop-back is a series of one-off campaigns. With loop-back, each campaign makes the next one easier. The libraries are the institutional memory; this skill writes to that memory honestly, with evidence, and with the user's approval. After 12 months, ChatInc's libraries are unrecognisable from generic — they are wholly your own.

## OUTPUT CONTRACT

The phase-doc orchestrator captures this skill's output into the phase doc's `section:proposed-library-updates` + `section:character-refinements` + `section:benchmark-updates` + `section:watch-list-additions` + `section:closure-summary` (Phase 8).

**Target sections:** 5 sections in Phase 8 phase doc
**No standalone file** (proposals live inside the phase doc; only the APPROVED changes get written to library files)
**Format:** markdown with tick-boxes per proposal
**Confidence required:** HIGH (only HIGH-confidence Phase 7 insights get proposed as library updates; MEDIUM/LOW go on the watch list)

**Required fields per `section:proposed-library-updates` row:**
- Library target (file path)
- Section / row affected
- Current value
- Proposed value
- Evidence (linked to Phase 7 insight ID)
- Tick-boxes: `[ ] Approve`, `[ ] Reject`, `[ ] Defer to watch list`

**Required fields per `section:character-refinements` row:**
- Character name
- Current profile path
- Predicted-vs-actual summary
- Proposed update to the character profile
- Confidence (HIGH / MEDIUM / LOW)

**Required fields per `section:benchmark-updates` row:**
- Library: `library-industry-benchmarks.md`
- Metric
- Current industry range
- ChatInc-specific range (from this campaign + history)
- Source campaign(s)

**Required fields per `section:watch-list-additions` row:**
- Claim
- Supporting evidence
- Next-campaign action ("re-check after 2 more campaigns", "needs 3rd source", etc.)
- Campaigns observed

**Hard rules:**
- Write ONLY proposals into the 5 sections. Do NOT modify library files. Library writes happen AFTER operator approval.
- Every proposal must cite a specific Phase 7 insight by ID. Ungrounded proposals = reject.
- LOW-confidence insights go on the watch list, NOT the proposals table. Don't pollute the proposals.
- 1 in 5 (or whatever the operator set) watch-list entries that hit 2+ confirmations across campaigns get promoted to library (proposed in NEXT phase 8 run). Track in `library-watch-list.md`.
- When the operator approves a proposal, the library write uses the anchor-point rules from `phase-doc-updating` (table-format: row; sectioned: section). Footnote format: `<!-- Updated YYYY-MM-DD via feedback-loop-back from {slug} — reason: {short} -->`.
- NEVER auto-apply. Every change requires explicit operator approval.
- Append Decision Log: `loop-back = [N proposals + M watch-list] | feedback-loop-back | [one-line] | approved count + library targets`.

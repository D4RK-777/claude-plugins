---
description: Read campaign state and tell the operator what to do next
---

Tell the operator what to do next on the current campaign. Reads the state file, computes the next action, and returns a single concrete step.

## Usage

```
/next
/next {project-name}
```

If `{project-name}` is omitted, use the most recently active project (read from state file scan if multiple exist).

## What it does

1. **Find the project.** If `{project-name}` given, locate `{marketing_root}/*/{project-name}/campaign-state-{project-name}.md`. If not given, scan `{marketing_root}/*/*/campaign-state-*.md` and pick the most recent (by file mtime).
2. **If no state file exists:** "No active campaign. Run `/start-campaign` to begin one."
3. **Read the state file.** Parse:
   - `Current phase:` line
   - Last entry in `## DECISION LOG` (to find gate verdict)
   - `## BLOCKERS` (any open items)
   - `## NEXT ACTION` (the computed next action)
4. **Return the next action as a single concrete step.** Always formatted as a verb + object + path.

## Output format

```
Project: {project-name} | Phase: {N} | Status: {current status}

NEXT: {action verb} {object} {path}

Reason: {one-line why}
```

## Decision tree (the orchestrator's logic)

Read the state. Apply this in order:

| State | NEXT action |
|-------|-------------|
| No state file | `START NEW CAMPAIGN` — "Run `/start-campaign` to begin." |
| Current phase = 1, intake complete | `RUN PHASE 2` — "Run `/run-phase {project} 2` to begin Research." |
| Current phase = N, status = `awaiting review` | `REVIEW PHASE N` — "Open `{N}-{slug}.md` and approve (`/approve-phase {project} {N}`) or request changes." |
| Current phase = N, status = `BLOCKED` (KILL) | `FIX KILL IN PHASE N` — "Gate KILLed. See corrective actions: ... Fix and re-run `/run-phase {project} {N}`." |
| Current phase = N, status = `awaiting decision` (REVISE) | `DECIDE ON PHASE N REVISE` — "Gate flagged N REVISE. See corrective actions: ... Approve to ship anyway, or request changes." |
| Current phase = N, last decision = approved | `RUN PHASE N+1` — "Run `/run-phase {project} {N+1}` to continue." |
| Current phase = `8 (CLOSED)` | `CAMPAIGN CLOSED` — "Run `/start-campaign` to begin a new one." |
| State file exists but missing phase doc | `STATE BROKEN` — "Run `/pending-review` to see what's there. State file out of sync." |
| Last gate verdict has unaddressed dissents | `RESOLVE DISSENT` — "Phase N had 2/3 + 1 dissent. Operator must explicitly resolve before advancing." |

## Examples

```
You: /next
Claude: Project: flex-shopify | Phase: 3 | Status: awaiting review
        NEXT: REVIEW PHASE 3 — Open `3-ideation.md` and approve (`/approve-phase flex-shopify 3`) or request changes.
        Reason: Phase 3 was gated GREEN; ready for operator review.

You: /next gloss-q1
Claude: Project: gloss-q1 | Phase: 4 | Status: BLOCKED
        NEXT: FIX KILL IN PHASE 4 — Gate KILLed ad-v2 (stress test 2/3 + 1 dissent + audit RED). Corrective action: rewrite hook to lead with outcome, not feature; tighten LP scent match.
        Reason: Triple Gate aggregation: any KILL = KILL. Blocked until fixed.

You: /next
Claude: No active campaign.
        NEXT: START NEW CAMPAIGN — Run `/start-campaign` to begin.
```

## Hard rules

- **Never make changes.** `/next` is read-only. It just tells the operator what to do.
- **Never infer beyond the state.** If the state says "awaiting review," the answer is "review." Don't speculate about what the operator should think.
- **Always show the path.** Operator should be able to open the file with one click.
- **Always explain the reason.** One line. The operator should understand why without re-reading the state.

## What this is NOT

- Not `/run-phase` (which actually runs the phase)
- Not `/approve-phase` (which approves a phase)
- Not `/pending-review` (which shows what's pending across all campaigns)

`/next` is the **answer to "what do I do right now?"** Nothing more.

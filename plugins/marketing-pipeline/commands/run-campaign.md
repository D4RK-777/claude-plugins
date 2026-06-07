---
description: Run the entire 8-phase marketing campaign from current state to close, stopping at every gate for operator approval
---

Run the entire 8-phase marketing campaign for a project, from current state to close. Stops at every gate for operator approval. The "set and forget" mode — you don't have to remember what comes next.

## Usage

```
/run-campaign {project-name}
/run-campaign {project-name} --from {phase-number}
/run-campaign {project-name} --pause-at {phase-number}
```

Examples:
- `/run-campaign flex-shopify` — Run all remaining phases, stopping at every gate
- `/run-campaign flex-shopify --from 4` — Start from Phase 4
- `/run-campaign flex-shopify --pause-at 6` — Stop after Phase 6 gate (don't auto-advance to Phase 7)

`--from {N}` resumes from a specific phase (assumes prior phases are approved).
`--pause-at {N}` stops the loop after phase N's gate, returning control to the operator.

## What it does (the autopilot)

1. **Find the project.** Same as `/run-phase`.
2. **Read the campaign state file.** Find the current phase + status.
3. **Loop from the current phase to Phase 8:**
   a. Invoke `/run-phase {project} {N}` (which runs the phase-doc skill, then the gate-runner, then updates state)
   b. **If verdict = SHIP:** print "Phase N ready. Open {N}-{slug}.md and approve with `/approve-phase {project} {N}`." **WAIT for operator approval.**
   c. **If verdict = REVISE:** print the corrective action list. **WAIT for operator decision** (approve with revisions / request specific changes / override).
   d. **If verdict = KILL:** print the corrective action list. **STOP the autopilot** (do not auto-advance). Operator must fix the KILL and re-run.
4. **On operator approval:** advance to phase N+1. Repeat the loop.
5. **At Phase 8 (CLOSED):** print the closure summary. End the autopilot.

## The promise of `/run-campaign`

- You never have to remember what phase is next.
- You never have to remember to run the gate.
- You never have to remember to update the state file.
- You never have to remember which wrap skills to fire.
- You only have to **review each phase doc when prompted** and **approve or request changes**.

The orchestrator handles the rest.

## Hard rules

- **Never advance past a SHIP/REVISE verdict without explicit operator approval.** The autopilot pauses at every gate. No silent advancing.
- **Never bypass a KILL.** The autopilot stops. Operator must fix the KILL and re-run.
- **Never re-run a phase that's already approved.** If state says Phase 3 is approved, the autopilot starts at Phase 4 (or the `--from` value).
- **Pause-at overrides the loop.** If `--pause-at 6`, the autopilot stops after Phase 6's gate, even if the operator approves.
- **The operator can interrupt with /next at any time.** The autopilot reads the state; /next reads the state; they share truth.

## Example flow

```
You: /run-campaign flex-shopify
Claude: Project: flex-shopify | State: Phase 1 (awaiting review)
        Starting autopilot from Phase 2.

        === Phase 2: Research ===
        Invoking phase-doc-research.
        Firing wrap skills: apify-pain-research → library-icp (refresh) → library-customer-journey → ...
        ✓ Phase 2 doc written: ~/Documents/ChatInc-Marketing/chatinc/flex-shopify/2-research.md
        Invoking gate-runner.
        Gate verdict: SHIP (all customer-truth HIGH, all hypotheses resolved)
        State updated: Phase 2 awaiting review.

        ⏸ PAUSED — review and approve.
        Open: 2-research.md
        Approve: /approve-phase flex-shopify 2
        Request changes: tell me what to fix.

You: /approve-phase flex-shopify 2
Claude: ✓ Phase 2 approved.

        === Phase 3: Ideation ===
        [loop continues]
        ...

You: /approve-phase flex-shopify 3
Claude: ✓ Phase 3 approved.

        === Phase 4: Creation ===
        [loop continues — Triple Gate runs on 18 assets]
        Gate verdict: KILL (ad-v2 banned word)
        Corrective actions: rewrite ad-v2 hook to avoid "guaranteed"
        ⏸ PAUSED — KILL must be fixed. Re-run /run-phase flex-shopify 4 after fixing.

You: [fix ad-v2 in 4-creation.md, then]
You: /run-phase flex-shopify 4
Claude: Phase 4 re-run. KILL'd asset fixed.
        Gate verdict: SHIP (18/18 SHIP)
        State updated: Phase 4 awaiting review.
        ⏸ PAUSED — review and approve.

You: /approve-phase flex-shopify 4
Claude: ✓ Phase 4 approved.

        === Phase 5: Implementation ===
        [loop continues — Triple Gate aggregation, launch readiness]
        Gate verdict: SHIP (campaign health GREEN)
        ⏸ PAUSED — review and approve (LAUNCH GATE — Phase 5).

You: /approve-phase flex-shopify 5
Claude: ✓ Phase 5 approved. Campaign launched.

        === Phase 6: Reporting (week 1) ===
        ...
```

## When to use /run-campaign vs /run-phase

| Situation | Use |
|-----------|-----|
| You have time and want the orchestrator to drive | `/run-campaign {project}` |
| You want to focus on one specific phase | `/run-phase {project} {N}` |
| You're reviewing a KILL and re-running | `/run-phase {project} {N}` (don't restart the whole campaign) |
| You want to know what's next | `/next` (read-only) |

## Operator interruptions

The autopilot respects these mid-run commands:
- `/next` — show what's next (read-only, doesn't disrupt the loop)
- `/approve-phase {project} {N}` — approve and continue
- `/run-phase {project} {N}` — fix a KILL and re-run (auto-pilot will pick up at the next phase)
- "stop" / "pause" — exit the autopilot

## What's next

- v1.9.0: `--auto-correct` flag re-fires the failing wrap skill for KILL'd assets (only Phase 4 KILLs)
- v2.0.0: library versioning + `/duplicate-campaign` for repeat campaigns

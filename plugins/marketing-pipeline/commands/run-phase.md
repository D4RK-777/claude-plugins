---
description: Run a specific phase of the marketing pipeline for a project, with mandatory gate enforcement
---

Run a specific phase of the marketing pipeline for a project. Enforces approval gates, runs the gate-runner, and blocks on KILL.

## Usage

```
/run-phase {project-name} {phase-number}
/run-phase {project-name} {phase-number} --auto-correct
```

Examples:
- `/run-phase flex-shopify 1` — Run Phase 1 (Setup) for flex-shopify
- `/run-phase q1-2026-trust-push 3` — Run Phase 3 (Ideation) for q1-2026-trust-push
- `/run-phase onboarding-revamp 5` — Run Phase 5 (Implementation) for onboarding-revamp
- `/run-phase gloss-q1 4 --auto-correct` — Run Phase 4 with auto-correct on KILL

`--auto-correct` enables auto-correct mode for the gate: if a KILL is in the auto-correctable set (citation-fail, banned-word, CTA-clarity, hook scroll-stop), the orchestrator re-fires the failing wrap skill with the corrective action as guidance. v1.9.0 implements auto-correct for the 4 correctable KILL types; subjective KILLs (stress-test, funnel-audit, brand voice, competitive-fit) always surface to the operator.

## What it does (the rigorous version)

1. **Find the project.** Search `{marketing_root}/*/{project-name}/`. If not found, refuse.
2. **Read the campaign state file.** Parse `Current phase:`, last `## DECISION LOG` entry, `## BLOCKERS`.
3. **Verify prerequisites:**
   - For phases 2-8, the previous phase doc must be `status: approved` (per the state file). If not, refuse and tell the operator to approve first.
   - For phase 1, intake essentials must be present (the state file's bootstrap variant).
   - If the current state is `BLOCKED` from a prior KILL, refuse and tell the operator to fix the blocker first.
4. **Invoke the phase-doc skill:**
   - Phase 1 → `phase-doc-setup`
   - Phase 2 → `phase-doc-research`
   - Phase 3 → `phase-doc-ideation`
   - Phase 4 → `phase-doc-creation`
   - Phase 5 → `phase-doc-implementation`
   - Phase 6 → `phase-doc-reporting`
   - Phase 7 → `phase-doc-learning`
   - Phase 8 → `phase-doc-updating`
5. **The phase-doc skill writes the phase doc** to `{marketing_root}/{brand_slug}/{project_slug}/{N}-{block_id}.md` AND calls `campaign-state` with the new artifact (per the OUTPUT CONTRACT in v1.7.2).
6. **Invoke `gate-runner`** with the phase doc path. Gate-runner:
   - Reads the phase doc
   - Runs the phase-specific gates (see gate-runner SKILL.md)
   - For Phase 4-5: runs the Triple Gate per asset, aggregates per the lowest-wins rule
   - Writes `section:gate-verdicts` to the phase doc
   - Updates the state file with the verdict
7. **Read the gate verdict.** Apply the orchestrator logic:
   - **SHIP** → state moves to `awaiting review`, prompt operator
   - **REVISE** → state moves to `awaiting decision`, show corrective action list
   - **KILL** → state moves to `BLOCKED`, show corrective action list, do NOT advance
8. **If `--auto-correct` and verdict is KILL (v1.9.0):** for each KILL in the auto-correctable set (citation-fail, banned-word, CTA-clarity, hook scroll-stop), invoke `auto-correct` skill. Auto-correct re-fires the failing wrap skill, updates the phase doc, and returns. Orchestrator re-invokes gate-runner on the updated phase doc. If re-gate SHIPs, phase advances. If still KILLs, surface to operator with the auto-correct audit trail.
9. **Return the next action.** Either "ready for review at {path}" or "blocked — see corrective actions."

## Pre-conditions

- The Command Center is installed (`/install-marketing-command-center`)
- The project exists (created via `/start-campaign` or visible via `/list-campaigns`)
- For phases 2-8, the previous phase is `status: approved` (per the state file)
- No open `## BLOCKERS` from a prior KILL

## Hard rules

- **NEVER skip the gate-runner.** Every phase runs the gate. The gate is what makes the pipeline safe.
- **NEVER advance past a KILL.** A KILL means block. The operator can override explicitly with `--override-kill`, but the system never silently bypasses.
- **NEVER modify a phase doc after the gate-runner has written `section:gate-verdicts`.** The doc + the verdicts are the audit trail. If the operator wants to change the doc, they re-run the phase.
- **The phase-doc skill writes the doc. The gate-runner gates it. campaign-state tracks it.** Three roles, one document. Don't conflate.
- **The orchestrator is read-only on the doc and the state.** It dispatches, doesn't compose.

## Example flow

```
You: /run-phase flex-shopify 2
Claude: Project: flex-shopify | Phase 1 approved ✓
        Invoking phase-doc-research.
        Reading 1-setup.md, brand libraries, intake.json...
        Firing wrap skills: apify-pain-research → library-icp (refresh) → library-customer-journey → ...
        ✓ Phase 2 doc written: ~/Documents/ChatInc-Marketing/chatinc/flex-shopify/2-research.md
        Invoking gate-runner.
        Gate checks: customer-truth confidence (7/9 HIGH, 2/9 MEDIUM) ✓
                    hypothesis validation (5 confirmed, 1 refuted) ✓
                    pain signal sourcing (3 sources) ✓
                    competitor count (5) ✓
        Gate verdict: REVISE (2 MEDIUM confidence fields need operator review)
        Corrective actions:
          - `customer-truth.sophistication` MEDIUM → operator confirm or add 1 more source
          - `customer-truth.buying_modes` MEDIUM → operator confirm 3 modes
        State updated: Phase 2 awaiting decision.
        NEXT: Review corrective actions and either fix manually or `/approve-phase flex-shopify 2 --with-revisions`.
```

```
You: /run-phase flex-shopify 4
Claude: Project: flex-shopify | Phase 3 approved ✓
        Invoking phase-doc-creation.
        Firing wrap skills per Phase 4 spec (hook-creative-generator, copywriter, lp-copy-generator, ad-image-architect, cinematic-prompt-architect, email-sequence-from-character)
        Per-skill capture: 11 hooks, 4 ads, 2 LPs, 1 email sequence, 6 image prompts
        ✓ Phase 4 doc written: ~/Documents/ChatInc-Marketing/chatinc/flex-shopify/4-creation.md
        Invoking gate-runner.
        Triple Gate per asset (11 hooks + 4 ads + 2 LPs + 1 email = 18 assets):
          - 14 SHIP
          - 3 REVISE (1 LP CTA clarity, 1 email subject line, 1 hook specificity)
          - 1 KILL (ad-v2: stress test 2/3 + 1 dissent + audit RED on banned word)
        Gate verdict: KILL (1 KILL = block per Triple Gate aggregation rule)
        Corrective actions:
          - ad-v2: rewrite hook to avoid "guaranteed" (banned word); re-fire `creative-interrogator` + `persona-stress-test`
        State updated: Phase 4 BLOCKED.
        NEXT: Fix ad-v2 hook and re-run `/run-phase flex-shopify 4`. The other 17 assets are still valid.
```

## What's next

- v1.9.0: `--auto-correct` actually re-fires the failing wrap skill
- v2.0.0: `/run-campaign` calls `/run-phase` in a loop, stopping only at every gate for operator approval

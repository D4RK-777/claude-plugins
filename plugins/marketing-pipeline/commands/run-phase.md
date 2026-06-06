---
description: Run a specific phase of the marketing pipeline for a project
---

Run a specific phase of the marketing pipeline for a project.

## Usage

```
/run-phase {project-name} {phase-number}
```

Examples:
- `/run-phase flex-shopify 1` — Run Phase 1 (Setup) for the flex-shopify project
- `/run-phase q1-2026-trust-push 3` — Run Phase 3 (Ideation) for the q1-2026-trust-push project
- `/run-phase onboarding-revamp 5` — Run Phase 5 (Implementation) for the onboarding-revamp project

`{project-name}` can be the project slug OR the full composite key `{brand-slug}/{project-slug}`. If multiple projects match, ask which one.

## What it does

1. Find the project folder by searching `{marketing_root}/*/{project-name}/`.
2. Read the previous phase doc (if phase > 1) and verify `status: approved`. If not approved, refuse and tell the operator to approve the prior phase first.
3. Invoke the corresponding `phase-doc-{block}` skill:
   - Phase 1 → `phase-doc-setup`
   - Phase 2 → `phase-doc-research`
   - Phase 3 → `phase-doc-ideation`
   - Phase 4 → `phase-doc-creation`
   - Phase 5 → `phase-doc-implementation`
   - Phase 6 → `phase-doc-reporting`
   - Phase 7 → `phase-doc-learning`
   - Phase 8 → `phase-doc-updating`
4. The skill writes the phase doc to `{marketing_root}/{brand_slug}/{project_slug}/{N}-{block_id}.md`.
5. Print the path to the new phase doc and tell the operator to open the dashboard to review.

## Pre-conditions

- The Command Center is installed (`/install-marketing-command-center`)
- The project exists (created via `/start-campaign` or `/list-campaigns` shows it)
- For phases 2-8, the previous phase is `status: approved`

## Hard rules

- **NEVER skip a phase.** If phase 2 isn't approved, refuse to run phase 3.
- **The skill decides the output.** You (Claude Code) just dispatch. Don't pre-fill sections or reformat.
- **The phase doc sets `status: awaiting_review`**, not `approved`. Only the operator's approval gate (in the dashboard, or by manually editing the file) can move it to `approved`.
- **If the user says "run phase 1" without naming a project**, list existing projects via `/list-campaigns` and ask which one.

## Example

```
You: /run-phase flex-shopify 2
Claude: Reading phase 1 doc for flex-shopify... status: approved ✓
        Invoking phase-doc-research.
        (Claude invokes the skill, which fetches the site + reviews + competitors)
        ✓ Phase 2 doc ready: ~/Documents/ChatInc-Marketing/chatinc/flex-shopify/2-research.md
        Next: /open-command-center to review, or /run-phase flex-shopify 3 to continue.
```

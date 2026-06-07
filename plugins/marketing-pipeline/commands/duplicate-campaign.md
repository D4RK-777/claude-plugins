---
description: Duplicate a past campaign's full state into a new project, with library inheritance and date updates
---

Duplicate a past campaign's phase docs + state into a new project. Common flow: "do a campaign like `gloss-q1` but for `chatinc-fall`." The full state of the old campaign becomes the starting point for the new one.

## Usage

```
/duplicate-campaign {source-project} {target-project}
/duplicate-campaign {source-project} {target-project} --use-library-versions
/duplicate-campaign {source-project} {target-project} --reset-decisions
```

Examples:
- `/duplicate-campaign gloss-q1 chatinc-fall` — Copy gloss-q1's full state into a new chatinc-fall project
- `/duplicate-campaign gloss-q1 chatinc-fall --use-library-versions` — Pin the new campaign to the library versions that were in use during gloss-q1 (not the latest). Useful for A/B testing.
- `/duplicate-campaign gloss-q1 chatinc-fall --reset-decisions` — Copy phase docs but reset all approval / gate / KILL decisions. The new campaign re-decides everything.

`{source-project}` can be the project slug OR the composite key `{brand-slug}/{project-slug}`.
`{target-project}` is the new project's slug. If it exists, refuse and ask operator to confirm or pick a new name.

## What it does

1. **Find the source project.** Scan `{marketing_root}/*/{source-project}/`. Locate:
   - The 8 phase docs (`1-setup.md` through `8-updating.md` — if any are missing, copy what exists)
   - The state file (`campaign-state-{source-project}.md`)
   - The intake file (`intake.json`)

2. **Verify target doesn't exist.** `{marketing_root}/*/{target-project}/` must not exist. If it does, refuse.

3. **Bootstrap the new project.** Run `/start-campaign` flow for `{target-project}` with:
   - The 9 essentials copied from the source's intake.json (operator reviews and adjusts)
   - Materials bundle: empty (operator drops new materials later)
   - `--from-campaign {source-project}` to inherit theme/persona/positioning

4. **Copy phase docs.** For each phase doc that exists in the source:
   - Read the source doc
   - Rewrite time-sensitive fields (dates → today, "current phase" → "1 (Setup) ready for review")
   - Update the frontmatter: `project_slug` → target, `last_updated` → today, `status` → `awaiting review` (or `draft` if --reset-decisions)
   - Write to `{marketing_root}/{target_brand}/{target_project}/{N}-{slug}.md`

5. **Copy state file.** Read source's `campaign-state-{source-project}.md`. Rewrite:
   - `Project:` → target project name
   - `Last updated:` → today
   - All `## DECISION LOG` rows: keep the rationale (so the operator sees why the old campaign made its choices) but reset approval/gate verdicts (per --reset-decisions flag)
   - All `## ARTIFACT REGISTRY` rows: copy the artifact paths, update to new project paths
   - `Current phase:` → `1 (Setup copied from {source-project}, ready for review)`

6. **Update library references (optional).** If `--use-library-versions`, find the source campaign's library version references (from the state file's DECISION LOG) and pin the new campaign to those versions. Otherwise, the new campaign uses the latest versions (the default).

7. **Operator review.** The new campaign is a copy, not a clone. The operator must:
   - Review 1-setup.md and adjust the 9 essentials
   - Re-run the gates (--reset-decisions) OR accept the old campaign's decisions
   - Drop new materials if needed

## The promise of /duplicate-campaign

- **Repeat campaigns become a 5-minute setup**, not a fresh 8-phase run
- **The new campaign inherits all of the old campaign's decisions + state** as a starting point
- **Library versions are pinned or refreshed** per the operator's choice
- **The operator still has full control** — they review the copy, adjust essentials, re-decide

## Hard rules

- **Never overwrite an existing target project.** If `{target-project}` exists, refuse and ask.
- **Never carry over KILL verdicts as approved.** If --reset-decisions (default), all decisions reset to draft. The new campaign re-decides.
- **Never carry over --from-campaign inheritance loop.** The target project can't be a duplicate of itself.
- **Always update the dates.** Time-sensitive fields (created_at, last_updated, launch_date) get today's date.
- **Always preserve the audit trail.** The state file's DECISION LOG keeps the source campaign's rows as historical context. The target's rows are appended on top.

## What gets copied vs reset

| Item | Default | --reset-decisions |
|------|---------|-------------------|
| 8 phase docs | Copied (with date updates) | Copied (with status reset to `draft`) |
| State file | Copied (decisions preserved as history) | Copied (decisions cleared) |
| Artifact registry | Copied (paths rewritten) | Copied (status = `DRAFT`) |
| Library versions | Latest (current behavior) | Pinned to source's versions |
| Intake essentials | Copied (operator reviews) | Copied (operator reviews) |
| Materials | NOT copied (operator drops new ones) | NOT copied |
| Approvals | Reset to `awaiting review` | Reset to `draft` |
| Gate verdicts | Cleared (re-gate on next run) | Cleared (re-gate on next run) |

## Example flow

```
You: /duplicate-campaign gloss-q1 chatinc-fall
Claude: Source: gloss-q1 (chatinc/gloss-q1/) — all 8 phase docs exist
        Target: chatinc-fall (chatinc/chatinc-fall/) — does not exist ✓
        Library versions: latest (not pinned)

        Copying:
          ✓ 1-setup.md (with date update)
          ✓ 2-research.md
          ✓ 3-ideation.md
          ✓ 4-creation.md
          ✓ 5-implementation.md
          ✓ 6-reporting.md (recurring — see note)
          ✓ 7-learning.md
          ✓ 8-updating.md
          ✓ campaign-state-chatinc-fall.md
          ✓ intake.json

        Decisions: kept from gloss-q1 (rationale preserved, but gate verdicts cleared)
        Library versions: latest

        Next: review 1-setup.md and adjust the 9 essentials for chatinc-fall.
        Run /next for current state, or /run-phase chatinc-fall 2 to re-run research.
```

## What's next

- v2.1.0: `--diff-campaigns {source} {target}` — show what differs between two campaigns' decisions (useful for A/B testing two campaign strategies)
- v2.1.0: `--evolve-campaign {source} {target}` — copy + apply a specific library version delta (only the changes from v1 to v2, not the full state)

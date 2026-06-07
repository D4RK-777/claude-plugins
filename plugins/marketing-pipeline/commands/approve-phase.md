---
description: Approve a completed phase doc from the terminal (unblocks pure-terminal flow, no dashboard needed)
---

Approve a completed phase doc. Writes `status: approved` + `approved_at` + `approved_by` to the phase doc's frontmatter so the next phase can run.

This is the **terminal equivalent of clicking "Approve" in the dashboard**. Without it, pure-terminal operators (no dashboard) can never advance past Phase 1 — Phase 2's gate checks for `status: approved` and would refuse to run.

## Usage

```
/approve-phase {project-name} {phase-number}
/approve-phase {project-name} all        ← approve every phase currently awaiting_review
```

Examples:
- `/approve-phase flex-shopify 1` — approve Phase 1 (Setup) for flex-shopify
- `/approve-phase flex-shopify 3` — approve Phase 3 (Ideation)
- `/approve-phase flex-shopify all` — bulk-approve all awaiting_review phases

`{project-name}` can be the project slug OR the full composite key `{brand-slug}/{project-slug}`. If multiple projects match, ask which.

## What it does

1. Find the project folder by searching `{marketing_root}/*/{project-name}/`.
2. Read `{N}-{block_id}.md` for the requested phase.
3. Check the current `status` in frontmatter:
   - `not_started` → refuse, tell the operator to run `/run-phase {project} {N}` first
   - `running` → refuse, the phase hasn't finished writing
   - `awaiting_review` → proceed (this is the normal approval flow)
   - `approved` → if `all` mode, skip (already approved); if single mode, ask "already approved by {name} on {date} — re-approve? (overwrites)" and only proceed on yes
4. Ask the operator for confirmation: "Approve Phase 1 for flex-shopify? This unlocks Phase 2. (y/n)"
5. Update the frontmatter:
   - `status: approved`
   - `approved_at: {ISO 8601 timestamp}`
   - `approved_by: {operator name from setup-marketing-command-center output, or ask}`
   - `last_updated: {same timestamp}`
6. Write the file back to the same path.
7. Confirm to the operator: `✓ Phase 1 approved by {name} on {date}. Run /run-phase flex-shopify 2 to continue.`

## Operator name resolution

Look for the operator name in this order:
1. Ask the operator (one short question, default to their OS username)
2. Read `setup-marketing-command-center` saved state (it stashes the operator name during install)
3. Read the `approved_by` field of any previously-approved phase in the same project (use the same name)
4. Fall back to "Operator"

Pick the first available. Don't make the operator type their name if it's already known.

## Bulk mode (`all`)

When the operator says `/approve-phase {project} all`:
1. List all 8 phase docs for the project
2. For each with `status: awaiting_review`, show what's awaiting approval
3. If anything has open questions unanswered (read the frontmatter `human_attention_required: true` OR scan the body for `## Open questions` with non-empty content), WARN the operator and ask "Continue anyway? (yes / abort)"
4. Confirm all-or-nothing, then approve all in one batch

## Hard rules

1. **NEVER silently approve a phase with `human_attention_required: true`.** Always warn. Let the operator decide.
2. **NEVER approve a phase whose `status` is `not_started` or `running`.** The doc doesn't exist or isn't finished. Refuse.
3. **Preserve the rest of the frontmatter.** Don't drop `upstream_phases_consumed`, `sources_consumed`, `confidence_overall`, or any other fields. Only update the 4 fields listed.
4. **Preserve all section content.** Don't touch the body. Only the frontmatter.
5. **If a `learning-insights.json` exists for Phase 7, approve it together.** Phase 8 reads this file. If the JSON doesn't exist, refuse and tell the operator to run Phase 7 first.
6. **Confirm before writing.** Always show "Approve Phase N for {project}?" and wait for the operator's yes. Bulk mode still asks once.
7. **Atomic write.** Read the file → modify in memory → write back. Don't do partial writes that could leave a corrupted file.
8. **End with the next action.** `Run /run-phase {project} {N+1} to continue.` Always tell the operator what's now unlocked.

## What this does NOT do

- Does not run the next phase. It just unlocks it.
- Does not validate the phase doc's content. The operator is the gatekeeper.
- Does not write to the dashboard's `localStorage`. The dashboard, if opened, will re-derive approval status from the file's frontmatter, so this is fine.
- Does not generate a `learning-insights.json` for Phase 7. That's Phase 7's job.

## Why this exists

Before v1.3.0, the only way to approve a phase was to open the dashboard and click "Approve." The plugin is positioned as terminal-first (v1.1.0+) but the approval gate was dashboard-only. This command closes that gap so a pure-terminal operator can run a campaign end-to-end without ever opening a browser.

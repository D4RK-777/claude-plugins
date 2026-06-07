---
description: List every phase awaiting your review across all projects, sorted by urgency
---

Show every phase doc across all projects that is currently `status: awaiting_review` and needs the operator's attention.

## Why this exists

`/list-campaigns` shows progress, but operators want a focused "what's waiting on me right now" view. This command does that.

## What it does

1. Walk `{marketing_root}/*/*/{N}-{block_id}.md` for every project, every phase.
2. For each phase doc, read the frontmatter `status` and `human_attention_required` fields.
3. Filter to `status: awaiting_review`.
4. Sort by urgency:
   - First: `human_attention_required: true` (operator explicitly marked this as needing attention)
   - Second: KILL/RED gate verdicts (Phase 5) — blockers
   - Third: oldest `last_updated` first (stale phase docs deserve attention)
5. Render a table.

## Output format

```
Awaiting your review (3 phases across 2 projects):

| # | Project            | Phase | Last updated   | Why                                              |
|---|--------------------|-------|----------------|--------------------------------------------------|
| 1 | chatinc/flex-shopify | 4     | 2026-05-30     | ⚠ human_attention_required. 1 KILL asset.      |
| 2 | chatinc/flex-shopify | 1     | 2026-05-29     | human_attention_required. 1 LOW-confidence sec. |
| 3 | gloss/q1-trust      | 2     | 2026-05-15     | (oldest) — stale 14 days, no attention flag.    |

Run `/phase-status {project}` for the 8-block view of one project.
Run `/open-command-center` to refresh the dashboard snapshot.
```

If nothing is awaiting review:

```
All caught up. No phase docs in `awaiting_review` status across {N} projects.

Run `/list-campaigns` for overall status.
```

## Hard rules

- **Read frontmatter, don't infer status.** If frontmatter is missing or malformed, skip the file (don't guess).
- **No false urgency.** Don't list `human_attention_required: false` phase docs unless the operator explicitly asks. The whole point of this command is to surface what needs the operator, not everything in flight.
- **If a project has no `marketing_root` set, error gracefully.** Tell the operator to run `/install-marketing-command-center` first.
- **Sort is consistent.** Same urgency → same sort order across runs (oldest first, by `last_updated` then `created_at`).
- **Cap at the top 10.** If there are 50 awaiting-review phase docs, show the top 10 and tell the operator how many more exist. They can use `/list-campaigns` for the full view.
- **Don't run this on a single project.** If the operator typed `/pending-review flex-shopify`, do the project-filtered version. If no project given, scan everything.

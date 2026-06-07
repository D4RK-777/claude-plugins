---
description: Show the 8-block status of a single project
---

Show the 8-block status of a single project (each phase's status, last_updated, who's awaiting review).

## Usage

```
/phase-status {project-name}
/phase-status {brand-slug}/{project-slug}
```

Examples:
- `/phase-status flex-shopify`
- `/phase-status chatinc/flex-shopify`

If multiple projects match, ask which one.

## What it does

1. Find the project folder by searching `{marketing_root}/*/{project-name}/`.
2. For each of the 8 phase doc files (`1-setup.md` through `8-updating.md`), read the frontmatter.
3. Extract: `status`, `confidence_overall`, `last_updated`, `approved_by`, `approved_at`, `human_attention_required`.
4. Render a 8-row status table.

## Output format

```
Project: flex-shopify (ChatInc)
Created: 2026-05-27
Current phase: 4 (Creation)
Health: AMBER (1 awaiting review, 1 RED gate)

| # | Phase              | Status            | Confidence | Last updated   | Awaiting review | Notes |
|---|--------------------|-------------------|------------|----------------|-----------------|-------|
| 1 | Setup              | ✓ approved        | HIGH       | 2026-05-28     | —               | approved_by: Chris |
| 2 | Research           | ✓ approved        | HIGH       | 2026-05-30     | —               | approved_by: Chris |
| 3 | Ideation           | ✓ approved        | HIGH       | 2026-06-01     | —               | approved_by: Chris |
| 4 | Creation           | ◐ awaiting_review | HIGH       | 2026-06-02     | YES             | human_attention_required. 1 KILL asset |
| 5 | Implementation     | ○ not_started     | —          | —              | blocked by 4    | KILL blocks approval |
| 6 | Reporting          | ○ not_started     | —          | —              | blocked by 5    | |
| 7 | Learning           | ○ not_started     | —          | —              | blocked by 6    | |
| 8 | Updating           | ○ not_started     | —          | —              | blocked by 7    | |

Next action: /open-command-center to review Phase 4. Address the KILL asset before approving.
```

Status legend:
- ✓ approved (status: approved)
- ◐ awaiting_review (status: awaiting_review)
- ⚠ awaiting_review (awaiting_review + human_attention_required: true)
- ○ not_started (no phase doc or status: not_started)
- ✗ error (file exists but frontmatter is malformed)

## Hard rules

- **Read all 8 phase docs even if some are missing.** If a phase doc doesn't exist, show `not_started`. Don't skip the row.
- **Health column** — derive from status: GREEN (all approved, no awaiting), AMBER (any awaiting_review but no KILL), RED (any KILL gate or 2+ awaiting_review).
- **Don't approve anything.** This is read-only. Tell the operator to `/approve-phase {project} {N}` to approve.
- **No project found = error.** List the existing projects and ask which one.
- **Don't fabricate timestamps.** If `last_updated` is missing from frontmatter, show "—" — don't guess.
- **Sort phases numerically** (1-8), not by date.

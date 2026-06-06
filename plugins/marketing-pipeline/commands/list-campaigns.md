---
description: List all marketing campaigns and their current phase status
---

List all marketing campaigns in the Command Center, with their current phase status.

## What it does

1. Read `{marketing_root}/*/{project-slug}/` directories.
2. For each project, read all 8 phase doc frontmatters and extract:
   - Project name (from folder or frontmatter `project_display_name`)
   - Brand
   - Phase statuses (which are `approved`, which are `awaiting_review`, which are `not_started`)
3. Render a table with one row per project, plus a flywheel progress bar.

## Output format

```
Campaigns in ~/Documents/ChatInc-Marketing/

| Brand     | Project              | Created    | Progress                 | Awaiting review |
|-----------|----------------------|------------|--------------------------|-----------------|
| ChatInc   | flex-shopify         | 2026-05-27 | ████░░░░ 4/8 (50%)       | Phase 5         |
| Gloss     | q1-2026-trust-push   | 2026-04-12 | ████████ 8/8 (100%) DONE | —               |
| Konekt    | onboarding-revamp    | 2026-05-20 | ██░░░░░░ 2/8 (25%)       | Phase 3         |

2 campaigns need your attention (have awaiting_review phases).
```

## If no projects exist

```
No campaigns yet.

Start your first campaign:
  /start-campaign

Or list the marketing folder for archived projects:
  ls ~/Documents/ChatInc-Marketing/
```

## Hard rules

- **Don't fabricate data.** If a phase doc is missing, status is `not_started`. Don't guess.
- **Read the actual files.** Don't trust localStorage or local state.
- **Sort by created date descending** (newest first).
- **If the Command Center isn't installed yet**, say so and ask the operator to run `/install-marketing-command-center` first.

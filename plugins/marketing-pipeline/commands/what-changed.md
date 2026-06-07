---
description: Show what changed between the operator's last installed version and the current plugin version
---

Show what's new in the plugin since the operator last installed or updated. Reads from a CHANGELOG.md file in the plugin root + a per-operator "last seen version" stored in the marketing folder.

## Why this exists

Operators install the plugin, then forget what changed. They keep using old patterns. This command tells them: "since you last looked, here's what's new" so they can adopt improvements without reading the README every time.

## What it does

1. Read the current plugin version from `plugins/marketing-pipeline/.claude-plugin/plugin.json` (`version` field).
2. Read the per-operator "last seen version" from `{marketing_root}/.last-seen-version` (a tiny file we write when /what-changed is run).
3. If the file doesn't exist (first run), treat last-seen-version as `0.0.0` and show ALL versions in CHANGELOG.md.
4. Read `CHANGELOG.md` from the plugin root (we'll create it in this fix).
5. Find the version range: from `last_seen_version + 1` to `current_version`.
6. Show the operator the changelog entries for that range, in plain language.

## Output format

```
Plugin version: 1.6.0
Last seen: 1.4.0
Changes since 1.4.0:

v1.5.0 — phase contracts + integrity
  • Phase 4: per-sub-skill capture spec (REQUIRED / CONDITIONAL / OPTIONAL + section mapping)
  • Pre-emit validation in all 8 phase docs (catches malformed docs before they reach the dashboard)
  • Standardised frontmatter across all 8 phase docs (brand_libraries_loaded, sources_consumed, inherited_from, etc.)
  • learning-insights.json schema (Phase 7 → 8 handoff is now explicit)
  • Phase 8 anchor-point rules per library format (table-format vs section-format)
  • Bump version to 1.5.0

v1.6.0 — sub-skill contracts + operator UX
  • Output contracts on 20+ wrapped skills (every skill declares what file it writes + which section it feeds)
  • New /pending-review command (top 10 things needing your attention)
  • New /phase-status {project} command (8-block status of one project)
  • New /what-changed command (this one)
  • Bump version to 1.6.0
```

Then:

```
Run `/approve-phase` to advance the next waiting phase.
Run `/list-campaigns` to see current state.
```

After showing the changelog, write `{marketing_root}/.last-seen-version` with the current version so the next run only shows NEW changes.

## First-run behavior

If `{marketing_root}/.last-seen-version` doesn't exist:
- Treat as `0.0.0`
- Show ALL changelog entries
- After showing, write the file with the current version

## Edge cases

- **No CHANGELOG.md yet:** show "No changelog available. See README for what's in this version."
- **Version older than 0.0.0:** show "Last seen version [X] is older than v0.0.0. Showing full changelog."
- **CHANGELOG.md is malformed:** show the raw content + a warning.

## Hard rules

- **Read-only by default.** Don't modify any phase docs, intake files, or campaign artifacts. The only file written is `.last-seen-version` (operator consent is implicit — they're asking what changed).
- **If the marketing folder doesn't exist yet, error.** Tell the operator to run `/install-marketing-command-center` first.
- **Don't try to fetch from GitHub.** The CHANGELOG.md is bundled with the plugin. The operator installed the plugin, they have the changelog.
- **Show the version range, not just the latest version.** If they're 2 versions behind, show both.

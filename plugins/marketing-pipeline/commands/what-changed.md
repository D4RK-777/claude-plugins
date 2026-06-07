---
description: Show what changed between the operator's last installed version and the current plugin version
---

Show what's new in the plugin since the operator last installed or updated. Reads from `CHANGELOG.md` and `.plugin-version` in the marketing folder (both written by `/install-marketing-command-center` at install time).

## Why this exists

Operators install the plugin, then forget what changed. They keep using old patterns. This command tells them: "since you last looked, here's what's new" so they can adopt improvements without reading the README every time.

## What it does

1. Read the **current plugin version** from `{marketing_root}/.plugin-version`. (Written at install time by `/install-marketing-command-center`.)
2. Read the **per-operator "last seen version"** from `{marketing_root}/.last-seen-version`. (Written by previous runs of this command.)
3. If `.last-seen-version` doesn't exist (first run), treat as `0.0.0` and show ALL versions in CHANGELOG.md.
4. Read `{marketing_root}/CHANGELOG.md` for the full changelog.
5. Find the version range: from `last_seen_version` to `current_version` (inclusive of current).
6. Show the operator the changelog entries for that range, in plain language.
7. After showing, write `{marketing_root}/.last-seen-version` with the current version so the next run only shows NEW changes.

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
Run `/pending-review` to see what needs your attention.
Run `/list-campaigns` to see current state.
```

After showing the changelog, write `{marketing_root}/.last-seen-version` with the current version so the next run only shows NEW changes.

## First-run behavior

If `{marketing_root}/.last-seen-version` doesn't exist:
- Treat as `0.0.0`
- Show ALL changelog entries
- After showing, write the file with the current version

## Edge cases

- **No `.plugin-version` file:** show "Plugin version unknown. Run `/install-marketing-command-center` to refresh the version file. If you've never installed, the plugin is at v1.6.0 (see CHANGELOG)."
- **No CHANGELOG.md yet:** show "No changelog available. See README for what's in this version."
- **No marketing folder at all:** tell the operator to run `/install-marketing-command-center` first.
- **Version older than 0.0.0:** show "Last seen version [X] is older than v0.0.0. Showing full changelog."
- **CHANGELOG.md is malformed:** show the raw content + a warning.
- **`.last-seen-version` exists but doesn't match any version in CHANGELOG.md:** show all entries from the lowest version in CHANGELOG.md up to current. The operator is probably running a fresh install on a system that previously had a different version.

## Hard rules

- **Read-only by default.** Don't modify any phase docs, intake files, or campaign artifacts. The only file written is `.last-seen-version` (operator consent is implicit — they're asking what changed).
- **If the marketing folder doesn't exist yet, error.** Tell the operator to run `/install-marketing-command-center` first.
- **Don't try to fetch from GitHub.** The CHANGELOG.md is bundled with the install. The operator has it.
- **Show the version range, not just the latest version.** If they're 2 versions behind, show both.
- **Don't try to find the plugin install path.** The CHANGELOG and version are at the marketing folder, by design. If they're not there, the install is stale.

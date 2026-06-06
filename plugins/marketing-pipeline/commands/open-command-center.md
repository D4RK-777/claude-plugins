---
description: Open the Marketing Command Center dashboard in your browser
---

Open the Marketing Command Center dashboard.

**If the Command Center hasn't been installed yet**, say so and ask the operator to run `/install-marketing-command-center` first.

**If it IS installed:**

1. Find the dashboard file at `{marketing_root}/dashboard.html` (or wherever `setup-marketing-command-center` placed it).
2. Regenerate the dashboard snapshot by reading the current state from `{marketing_root}/{brand_slug}/{project_slug}/*.md` files and writing an updated `dashboard.html` with the latest data embedded.
3. Open the dashboard in the operator's default browser:
   - **Mac:** `open "{dashboard_path}"`
   - **Windows:** `start "" "{dashboard_path}"`
   - **Linux:** `xdg-open "{dashboard_path}"`
4. Print the dashboard URL and the path to the marketing folder so the operator can re-open or move the file.

## What the dashboard does in Claude Code mode

The dashboard is a **view-only snapshot** of your current campaign state. It reads its data from the file at the time Claude Code generated it. It does **not** auto-update.

To refresh:
- After any phase doc changes, re-run `/open-command-center`. Claude Code will regenerate the snapshot.
- The dashboard's "Run Phase" button copies a `# Run Phase N — Name` prompt to your clipboard. Paste it back into Claude Code to dispatch the phase.

## Live-mode (Chrome/Edge only)

If the operator is using **Chrome or Edge** and has granted the dashboard access to the marketing folder via the File System Access API, the dashboard becomes live:
- Phase doc changes appear without reload
- Approval gates write `status: approved` back to the file
- "Run Phase" copies the prompt to clipboard and the user pastes back

In **Firefox / Safari**, the dashboard runs in snapshot mode only (reload-required updates). The UI shows a banner explaining this.

## After opening

Tell the operator:
- "Dashboard opened. To work on a campaign, click its flywheel. Amber = needs your review."
- "When you approve a phase in the dashboard, the approval is written back to the file. Re-run /open-command-center to see the next phase unlock."
- "For terminal-driven work, use /run-phase {project-name} {phase-number}."

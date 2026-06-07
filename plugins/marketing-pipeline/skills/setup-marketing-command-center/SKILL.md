---
description: Install (or update) the Marketing Command Center for Claude Code
---

Install (or update) the Marketing Command Center for **Claude Code** (terminal mode). One-time setup. Takes about 30 seconds.

## When to fire

Trigger phrases (any of):
- "install marketing command center"
- "set up marketing dashboard"
- "install the marketing pipeline"
- "install marketing pipeline plugin"
- "set up marketing pipeline"

Or fires automatically on first invocation of any command/skill in the plugin if no `marketing_root` is set.

## Setup steps (auto-bootstrap mode)

1. **Pick the marketing folder** using OS-specific smart defaults:
   - macOS / Linux: `$HOME/Documents/ChatInc-Marketing/`
   - Windows: `%USERPROFILE%\Documents\ChatInc-Marketing\`
   - Linux fallback: `$HOME/Marketing/`

2. **Detect operator name** from the OS:
   - Mac/Linux: `whoami`
   - Windows: `$env:USERNAME` (via PowerShell) or `whoami`
   - Fallback: "Operator"

3. **Create the folder structure** silently:
   ```
   {marketing_root}/
     dashboard.html          ← copied from the plugin's templates/ folder
     _libraries/             ← brand-specific overrides accrue here
   ```
   Brand folders are created on-demand when the first campaign for that brand is added.

4. **Copy `dashboard.html`** from the plugin's `templates/operator-dashboard.html` to `{marketing_root}/dashboard.html`. This is the file the operator opens in their browser to see campaign state.

5. **Copy `CHANGELOG.md` + write `.plugin-version`** into the marketing folder. This is what `/what-changed` reads to show the operator what's new since their last install. Without this, the operator has to read the full README every time the plugin updates.
   - Read the current plugin version from `{plugin_install_path}/.claude-plugin/plugin.json` (or `plugins/marketing-pipeline/.claude-plugin/plugin.json`).
   - Write `{marketing_root}/.plugin-version` with that version.
   - Copy `{plugin_install_path}/CHANGELOG.md` → `{marketing_root}/CHANGELOG.md`.
   - (Both files are tiny and get refreshed on every install.)

6. **Show the operator the path** to the dashboard and offer to open it. The dashboard opens with the operator's first campaign being a guided intake form (the same 9 fields, collected in the browser if they prefer that to the terminal `/start-campaign` flow).

7. **One-line confirmation** to the operator:
   > ✓ Marketing Command Center installed.
   > Folder: ~/Documents/ChatInc-Marketing/
   > Dashboard: ~/Documents/ChatInc-Marketing/dashboard.html
   > Changelog: ~/Documents/ChatInc-Marketing/CHANGELOG.md
   > [Open in browser]
   > Next: run `/start-campaign` to begin, or open the dashboard to use the intake form.

## What the operator sees (auto-bootstrap)

```
You: /install-marketing-command-center
Claude: ✓ Marketing Command Center installed.
        Folder: ~/Documents/ChatInc-Marketing/
        Dashboard: ~/Documents/ChatInc-Marketing/dashboard.html
        Changelog: ~/Documents/ChatInc-Marketing/CHANGELOG.md
        Operator name: Chris (detected from $USERNAME)

        Open dashboard in browser? (Y/n)
        [If Y] ✓ Opened. You can also reopen it any time with /open-command-center.

        Next: /start-campaign to begin, or open the dashboard to use the intake form.
```

That's it. Total operator effort: one command + a yes/no.

## When to ask instead of auto-default

ONLY ask the operator a question if:
- The auto-detected folder path is somehow inaccessible (read-only, no write permission) — then offer alternatives.
- The operator explicitly says "use a different folder" or "ask me where to put it."

In every other case, do NOT ask. Smart defaults + one-click confirmation is the contract.

## How the dashboard works in Claude Code mode

The dashboard is a **single self-contained HTML file**. It:
- Reads phase doc files from `{marketing_root}/{brand}/{project}/*.md` using the **File System Access API** (Chrome 86+ / Edge 86+).
- Falls back to a snapshot-only view in Firefox / Safari (operator re-runs `/open-command-center` to refresh).
- Shows the 8-block flywheel, each block's status, and the intake form.
- "Run Phase" button copies a `# Run Phase N — Name for project X` prompt to clipboard. Operator pastes into Claude Code.
- Approval gates (when the operator clicks "Approve") write `status: approved` + `approved_at` + `approved_by` back to the phase doc file. Claude Code picks it up on the next `/open-command-center` snapshot or `/run-phase` invocation.

The dashboard does **not** call out to Claude Code or any MCP server. All inter-process communication is via the clipboard + file system.

## Re-installation behavior

If the operator runs `/install-marketing-command-center` again:
- Detect if `dashboard.html` exists at the marketing root.
- If it does, ask: "Replace dashboard.html with the latest version? (Preserves your browser-side state in localStorage.)"
- Default to yes if no response.
- The plugin's `templates/operator-dashboard.html` is the source of truth — always copied fresh from there.
- **CHANGELOG.md and `.plugin-version` are always overwritten on reinstall.** The operator's last-seen-version is preserved (don't touch it).

## Hard rules

1. **NEVER call `mcp__cowork__*` tools.** This skill runs in Claude Code (terminal), not Cowork. The dashboard is a file, not an artifact.
2. **NEVER use `sendPrompt` or any chat-dispatch mechanism.** Phase dispatch happens via clipboard + the operator pasting back into Claude Code.
3. **The marketing folder path is fixed at first install.** It can be changed later via `/open-command-center` (which shows a "Settings" view in the dashboard) or by setting an environment variable `MARKETING_ROOT`.
4. **The operator's name is detected once at install.** It can be changed later via the dashboard's Settings tab.
5. **Phase doc content lives in markdown files on disk.** The dashboard reads from there. The dashboard's `localStorage` only holds UI state (acceptance ticks, override notes, answers to open questions).

## Update path

When the plugin updates (via marketplace pull), the operator runs `/install-marketing-command-center` again to refresh `dashboard.html`. Their campaign data is preserved (it lives in `{marketing_root}/{brand}/{project}/*.md`, separate from the plugin).

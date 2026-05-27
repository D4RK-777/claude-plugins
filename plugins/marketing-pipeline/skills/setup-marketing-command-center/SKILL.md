---
name: setup-marketing-command-center
description: "Installs (or updates) the unified Marketing Command Center dashboard for the operator. Self-bootstraps with smart defaults — auto-creates the marketing folder at ~/Documents/ChatInc-Marketing/ (or platform equivalent), auto-detects operator name from the OS, and immediately opens the dashboard. Non-technical operators do not need to type a folder path or configure anything. Trigger phrases: 'install marketing command center', 'set up marketing dashboard', 'install the marketing pipeline', 'open marketing command center', 'install marketing pipeline plugin', 'set up marketing pipeline', or first-time invocation after plugin install."
---

# Marketing Command Center — Auto-Bootstrap Setup

## Doctrine

This skill is designed for non-technical operators. They should not have to type a folder path, pick from a file browser, or configure anything to get started. They run the install and the dashboard opens, ready to use.

The operator can ALWAYS change marketing folder / operator name later via the dashboard's **Settings** tab. But the first-time experience is one click.

## When to fire

Trigger phrases (any of):
- "install marketing command center"
- "set up marketing dashboard"
- "install the marketing pipeline"
- "open marketing command center"
- "install marketing pipeline plugin"
- "set up marketing pipeline"

Or fires automatically on first plugin invocation when no existing `marketing-pipeline-dashboard` artifact is detected.

## Setup steps (auto-bootstrap mode)

1. **Pick the marketing folder automatically** using OS-specific smart defaults:
   - macOS / Linux: `$HOME/Documents/ChatInc-Marketing/`
   - Windows: `%USERPROFILE%\Documents\ChatInc-Marketing\`
   - Cowork session: the mounted Marketing folder if one exists, otherwise the cowork mount root + `/ChatInc-Marketing/`

2. **Detect operator name** from the OS:
   - `whoami` on Unix
   - `$USERNAME` on Windows
   - If that fails, default to "Operator"

3. **Create the folder structure** silently:
   ```
   {marketing_root}/
     _libraries/         (brand-specific overrides accrue here)
   ```
   Brand folders are created on-demand when the first campaign for that brand is added.

4. **Render the dashboard** using `mcp__cowork__create_artifact` (or `mcp__cowork__update_artifact` if `marketing-pipeline-dashboard` already exists). Inject `marketing_root` + `operator_name` into the artifact's localStorage on first load so the boot screen is skipped.

   Artifact ID **must** be exactly: `marketing-pipeline-dashboard`. Do not create a separate artifact under any other name.

5. **Show one-line confirmation** to the operator:
   > ✓ Marketing Command Center ready. [Open dashboard](computer://path) → click + New campaign to start.

   Don't dump configuration details. The operator just needs to see "ready, here's the link."

## What the operator sees (auto-bootstrap)

```
You: install marketing command center
Claude: ✓ Marketing Command Center installed.
        Files go in ~/Documents/ChatInc-Marketing/ (you can change this in Settings).
        
        [ Open dashboard ]   ← click this
```

That's it. Total operator effort: one sentence.

## When to ask instead of auto-default

ONLY ask the operator a question if:
- The auto-detected folder path is somehow inaccessible (read-only, doesn't exist, no write permission) — then offer to pick alternative
- An existing dashboard artifact is detected with non-empty state — ask "Replace existing dashboard or just open the existing one?"

In every other case, do NOT ask. Smart defaults + one-click confirmation is the contract.

## How the dashboard talks to the file system

Uses `window.cowork.callMcpTool('mcp__9242615b__exec', { command: '...' })` to read/write phase doc files in `{marketing_root}/{brand_slug}/{project_slug}/`.

## How the dashboard triggers AI work

Uses `sendPrompt(structured_prompt)` to dispatch phase runs to chat. The matching `phase-doc-{block}` emitter skill picks up the prompt, runs the underlying skills, writes the phase doc, and the dashboard polls for the file to appear.

## Re-installation behavior

If the operator runs this skill again with the dashboard already installed:
- Default behavior: silently update the dashboard HTML to the latest version while preserving their localStorage state (marketing_root, operator_name, campaign list, UI preferences)
- Only ask if there's a breaking schema change

## Hard rules

1. Artifact ID is always `marketing-pipeline-dashboard`. Never create a new artifact with a different name.
2. NEVER ask the operator for the marketing folder path on first run. Use smart defaults. They can change it later in Settings.
3. NEVER ask the operator for their name. Use OS detection. They can change it later in Settings.
4. After install, link the operator to the dashboard with a one-line confirmation. Don't show config details.
5. The dashboard's localStorage stores per-user state (marketing_root, operator_name, brands, project metadata). Phase doc content lives in files on disk, not in localStorage.

## Update path

When the plugin updates (via marketplace pull), this skill re-runs and updates the dashboard HTML silently. The operator's project state is preserved.

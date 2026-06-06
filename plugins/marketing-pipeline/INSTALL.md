# Installation Guide — Marketing Pipeline (Claude Code)

## Prerequisites

- **Claude Code** installed (https://docs.claude.com/en/docs/claude-code/quickstart)
- The plugin installed via the marketplace (run `install-windows.bat` or `install-mac.command`, OR run `/plugin install marketing-pipeline@chatinc-plugins` directly)
- A modern browser for the dashboard (Chrome 86+ or Edge 86+ for live mode; any browser for snapshot mode)

## Steps

### 1. Install the Command Center

In Claude Code, type:
```
/install-marketing-command-center
```

This:
- Creates the marketing folder at `~/Documents/ChatInc-Marketing/` (or platform equivalent)
- Drops `dashboard.html` into that folder
- Detects your operator name from the OS username

You'll see:
```
✓ Marketing Command Center installed.
  Folder: ~/Documents/ChatInc-Marketing/
  Dashboard: ~/Documents/ChatInc-Marketing/dashboard.html
  Operator name: Chris (detected from $USERNAME)
```

### 2. Open the dashboard (optional but recommended)

Either:
- Type `/open-command-center` in Claude Code — it regenerates the snapshot and opens it in your browser.
- Or open `~/Documents/ChatInc-Marketing/dashboard.html` directly.

**First time you open it:** Click "Grant access to marketing folder" and pick the folder you created in step 1. This is the File System Access API permission grant — it's stored per-browser. You only do it once per browser.

### 3. Start a campaign

In Claude Code, type:
```
/start-campaign
```

Claude walks you through 9 essentials, one at a time:
1. **Brand** — which brand is this for
2. **Project name** — what to call this campaign
3. **Website URL** — the site AI should research
4. **Goal** — awareness / leadgen / trial / purchase / retarget / retention / brand
5. **Channels** — Meta, Google, Email, etc.
6. **Budget** — total + structure
7. **KPI + target** — what "it worked" looks like
8. **Timeline** — launch date + hard deadlines
9. **Hard NOs** — topics/claims absolutely off-limits

Then Claude runs Phase 1 (Setup) automatically.

### 4. Review Phase 1 in the dashboard

Open the dashboard (`/open-command-center` or directly). You'll see Phase 1 in amber — needs your review.

For each section:
- **✓ Accept** the AI's work as-is
- **✗ Override** with your correction (type what it should say)
- **↻ Change just this** — copies a focused regen prompt; paste in Claude Code

Open questions get text inputs in the dashboard. Type your answers directly.

When every section is decided, the **Approve** button enables. Click it → `status: approved` is written to `1-setup.md` → Phase 2 unlocks.

### 5. Continue through phases

For each subsequent phase, in Claude Code:
```
/run-phase {project-name} {N}
```

Examples:
- `/run-phase flex-shopify 2` — Research
- `/run-phase flex-shopify 3` — Ideation
- `/run-phase flex-shopify 4` — Creation
- `/run-phase flex-shopify 5` — Implementation (with GTM doc)
- `/run-phase flex-shopify 6` — Reporting (run weekly)
- `/run-phase flex-shopify 7` — Learning
- `/run-phase flex-shopify 8` — Updating

Or list everything: `/list-campaigns`

### 6. Check progress

```
/list-campaigns
```

Shows all campaigns with phase progress and what's awaiting your review.

## Troubleshooting

**"Show directory picker didn't open"**
You clicked "Grant access" but nothing happened. Check:
1. Are you in Chrome 86+ or Edge 86+? Firefox / Safari don't support the API.
2. Is the page in a secure context (https:// or file://)? The API doesn't work over insecure http://.

**"Folder access required" toast appears**
The dashboard's folder access grant expired or was cleared. Click "Grant access to marketing folder" again.

**Phase doc didn't appear after running `/run-phase`**
Open the file directly: `cat {marketing_root}/{brand}/{project}/{N}-{block}.md`. If it's empty, Claude Code hit a snag — check the chat for an error or clarifying question.

**Block 1 stuck after intake**
Check that `intake.json` was saved: `ls {marketing_root}/{brand}/{project}/`. If it's missing, re-run `/start-campaign`.

**Wrong marketing folder**
Re-run `/install-marketing-command-center` and it will ask whether to use a different folder. Or set the `MARKETING_ROOT` environment variable before starting Claude Code.

## Uninstall

```
/plugin uninstall marketing-pipeline
```

Your phase doc files in `~/Documents/ChatInc-Marketing/` are NOT deleted. Move/delete them manually if you want a clean slate.

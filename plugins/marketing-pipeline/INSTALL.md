# Installation Guide

## Prerequisites

- Claude Code or Cowork mode
- A folder Claude can read/write (your "marketing root")
- An MCP server with shell exec capability (for the dashboard to read/write phase doc files)

## Steps

### 1. Install the plugin

If installing from a `.plugin` zip:
```
/plugin install /path/to/chatinc-marketing-pipeline.plugin
```

Or from a marketplace:
```
/plugin install chatinc-marketing-pipeline
```

### 2. Verify install

In a Cowork session, type:
```
/skill list
```
You should see ~42 skills prefixed with `chatinc-marketing-pipeline:` including `setup-marketing-command-center`, `phase-doc-setup`, etc.

### 3. Set up the Command Center

Type:
```
install marketing command center
```

You'll be asked:
1. **Marketing folder path** — e.g. `C:\Users\you\Marketing` (must exist + Claude must have access)
2. **Operator name** — your name; stamped into approved phase docs

The dashboard launches as a Cowork artifact. Bookmark it.

### 4. Start a campaign

In the dashboard:
1. Click **+ New campaign**
2. Fill the intake form (slugified project name + ~20 fields)
3. Click **▶ Start Phase 1 — Setup**
4. Watch the chat panel — Claude runs the `phase-doc-setup` skill
5. The dashboard polls for `1-setup.md` to appear
6. When it does, the block goes amber: **🚦 HUMAN REVIEW NEEDED**
7. Open the block, tick / override each section, answer open questions, hit **Approve**

### 5. Continue through phases

After approving, the dashboard offers to auto-run the next phase. Say yes — or approve manually, then click **▶ Run Phase N** when ready.

By Phase 5 (Implementation) you'll have a launch-ready GTM doc as a companion HTML in `{marketing_root}/gtm/{slug}/`.

## Troubleshooting

**"Chat not connected" error when running a phase**
The dashboard couldn't reach the chat session. Refresh the dashboard, or copy the prompt from the alert and paste manually into chat.

**Phase doc didn't appear after 5 minutes**
The poll gives up at ~5 min. Open the chat panel — Claude may have hit a snag. Look for an error or a clarifying question. Resume by typing your answer in chat.

**Block 1 stuck after intake**
Open the chat — `phase-doc-setup` may be asking a clarifying question. Once answered, it'll write `1-setup.md` and the dashboard will pick it up.

**Wrong marketing folder**
Go to **Settings** in the dashboard, change the path, save. Existing phase docs in the old folder aren't moved — copy them manually if you want to keep them.

## Uninstall

```
/plugin uninstall chatinc-marketing-pipeline
```

Your phase doc files (in `{marketing_root}/phases/`) are NOT deleted by uninstall. Delete them manually if you want a clean slate.

# Admin Setup — Distribute the Marketing Pipeline

> Three steps. Done in 5 minutes.

---

## Step 1 — You have the file `chatinc-plugins.zip` in your Marketing folder

That's the whole thing — marketplace + plugin + installers + docs. Already zipped.

---

## Step 2 — Share the zip with your team

Pick whichever you prefer:

| Method | How |
|---|---|
| **Slack** | Drag `chatinc-plugins.zip` into a channel (e.g. `#marketing-ops`) + pin it |
| **Email** | Attach the zip to an email to the team |
| **Dropbox / OneDrive / Google Drive** | Upload, get a share link, send the link |
| **Shared network drive** | Drop the file in a folder everyone has access to |

(Note: Slack has a 1 GB file size limit. This zip is well under.)

---

## Step 3 — Send the team this Slack/email message

```
Hey team — new marketing tool, one-click install.

1. Make sure Claude Code is installed (https://docs.claude.com/en/docs/claude-code/quickstart)
2. Download the attached chatinc-plugins.zip
3. Unzip it (Mac: double-click. Windows: right-click → Extract All)
4. Open the unzipped folder → install/ → double-click:
   • Mac: install-mac.command
   • Windows: install-windows.bat
5. Wait 20 seconds. Press Enter when prompted.
6. Open Claude Code and type:
     /install-marketing-command-center
7. Then:
     /start-campaign
   to begin your first campaign.

Full instructions in TEAM-INSTALL.md (inside the zip).
Questions: ping me.
```

That's it. No GitHub. No git. No credentials. No internet account needed for the team.

---

## When you ship an updated version

1. Update the files inside `chatinc-plugins/plugins/marketing-pipeline/`
2. Bump the version in `chatinc-plugins/plugins/marketing-pipeline/.claude-plugin/plugin.json` (e.g. `1.0.0` → `1.1.0`)
3. Re-zip the `chatinc-plugins/` folder
4. Share again the same way

Teammates: delete the old folder, unzip the new one, run the installer again. Their campaign data is preserved (it lives in their `Documents/ChatInc-Marketing/` folder, separate from the plugin).

---

## Optional auto-update path (if you want it)

If you want teammates to auto-update without re-running the installer manually:

Put the `chatinc-plugins/` folder in a **shared Dropbox/OneDrive/Google Drive folder** that everyone has synced.

Each teammate runs the installer once, pointed at their synced copy. When you push a new version to the shared folder, their copy updates automatically. They run `/plugin marketplace update chatinc-plugins` inside Claude Code to pick up changes (or just restart Claude Code).

This is the path if you'd rather not re-zip and re-share every time.

---

## What's in the zip

```
chatinc-plugins/
├── .claude-plugin/marketplace.json       ← marketplace catalog (no Git needed)
├── plugins/marketing-pipeline/           ← the actual plugin (42 skills, 11 libs, dashboard)
├── install/
│   ├── install-mac.command               ← Mac installer
│   └── install-windows.bat               ← Windows installer
├── TEAM-INSTALL.md                       ← team-facing instructions
└── ADMIN-SETUP.md                        ← this file
```

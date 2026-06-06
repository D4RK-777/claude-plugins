# Team Install — Marketing Pipeline

## What you need

- **Claude Code** — install from https://docs.claude.com/en/docs/claude-code/quickstart if you don't have it
- A **modern browser** for the dashboard:
  - **Chrome 86+** or **Edge 86+** recommended (full live mode — dashboard reads/writes your files)
  - Firefox / Safari work too, but in read-only snapshot mode
- 5 minutes of your time

## Steps

### 1. Install Claude Code (one-time)

If you don't have it:
- Mac: `brew install claude-code` or download from the link above
- Windows: download from the link above

### 2. Install the plugin

Your team admin has shared a `chatinc-plugins.zip` file with you. Get it (Slack, email, drive, whatever).

**Mac:**
1. Unzip the file (double-click)
2. Open the unzipped folder
3. Double-click `install/install-mac.command`
4. Press Enter when prompted
5. Wait ~20 seconds for `[OK] INSTALL COMPLETE`

**Windows:**
1. Right-click the zip → Extract All
2. Open the unzipped folder
3. Double-click `install\install-windows.bat`
4. Press any key when prompted
5. Wait ~20 seconds for `INSTALL COMPLETE`

### 3. Open Claude Code

Open Claude Code (Cmd+Space / Start Menu → search "Claude").

### 4. Install the Command Center (one-time)

In Claude Code, type:
```
/install-marketing-command-center
```

You'll see:
```
✓ Marketing Command Center installed.
  Folder: ~/Documents/ChatInc-Marketing/
  Dashboard: ~/Documents/ChatInc-Marketing/dashboard.html
  Operator name: <your-name>
```

### 5. Open the dashboard

In Claude Code, type:
```
/open-command-center
```

It opens `dashboard.html` in your default browser. First time: click **"Grant access to marketing folder"** and pick the folder Claude Code just created (`~/Documents/ChatInc-Marketing/`).

### 6. Start your first campaign

Back in Claude Code, type:
```
/start-campaign
```

Claude walks you through 9 questions, then runs Phase 1. The dashboard refreshes with Phase 1 ready for your review.

## Day-to-day commands

| You want to... | Type this in Claude Code |
|---|---|
| Start a new campaign | `/start-campaign` |
| Run the next phase | `/run-phase {project} {N}` |
| See all campaigns | `/list-campaigns` |
| Open the dashboard | `/open-command-center` |

## What does the dashboard do?

It's a **view of your campaign state**. It shows:
- All your campaigns (grouped by brand)
- Each campaign's 8 phases with status (not started / awaiting review / approved)
- Tick-boxes for accepting or overriding what the AI generated
- Open questions with text inputs
- An Approve button that locks a phase and unlocks the next one

In Chrome / Edge, the dashboard reads and writes your files directly. In Firefox / Safari, you have to type `/open-command-center` in Claude Code to refresh it after each phase.

## FAQ

**Do I need a GitHub account?**
No. The plugin is installed locally from a zip file.

**Where does my data go?**
Everything stays on your computer, in `~/Documents/ChatInc-Marketing/`. Nothing is sent to a server except the AI calls Claude Code makes on your behalf.

**Can I use multiple brands?**
Yes. Each brand gets its own folder under the marketing root. `/start-campaign` asks which brand, and you can create a new one.

**A phase doc has a section I disagree with. What do I click?**
Click **✗ Override** on that section. Type what it should say instead. Your override is captured in the phase doc. When you click Approve, the override is preserved as an inline note.

**I want to skip to Phase 4. Can I?**
No. The pipeline enforces the order — Phase 4 won't run unless Phase 3 is approved. This is by design: every creative output builds on the strategy from earlier phases. If you genuinely want to skip, just run the prior phases quickly (or use "rapid mode" by clicking Approve with overrides).

**I lost my dashboard. How do I get it back?**
Re-run `/open-command-center` in Claude Code. It regenerates the snapshot from the current files.

## Questions?

Ping your team admin or reply in the Slack channel where the zip was shared.

---
description: Start a new marketing campaign — drop in materials, AI proposes essentials, you confirm
---

Start a new marketing campaign. The goal of this command is **minimum typing, maximum inference**. Drop in whatever you have (URLs, brief PDFs, brand voice docs, past campaign folders) and Claude proposes the 9 essentials — you just confirm or correct.

## Usage

```
/start-campaign [materials...]
```

Examples:
```
/start-campaign
/start-campaign https://chatinc.com/flex
/start-campaign https://chatinc.com/flex ./briefs/chatinc-q3.pdf
/start-campaign https://chatinc.com/flex ./briefs/ ./past-campaigns/gloss-q1-2026/ --from-campaign gloss-q1-2026 --brand chatinc
```

Recognised material types:
- **URL** (starts with `http://` or `https://`) — fetched via WebFetch
- **File path** (`.pdf`, `.md`, `.docx`, `.xlsx`, `.csv`, `.txt`, `.html`) — read directly
- **Folder path** — inventory all readable files inside, recursively
- **`--brand <slug>`** — pick a brand; auto-loads `{marketing_root}/{slug}/_libraries/` defaults
- **`--from-campaign <slug>`** — inherit essentials from a past campaign's phase docs

If no materials are given, the old manual Q&A mode kicks in (one question at a time). Try not to do this — drop a URL at minimum.

## Process

### Step 1 — Parse materials

Walk through the args. For each one, decide: URL, file, or folder. Resolve relative paths against the operator's CWD. Reject anything that doesn't exist (with a clear error).

### Step 2 — Read everything

For each material:
- **URL:** WebFetch the homepage. If it returns <500 chars of meaningful content, also try `/about`, `/pricing`, `/customers`. Stop after 3 fetches per URL.
- **File:** Read it. For PDFs, use `Read` on the file path (Claude Code's Read tool handles PDFs). For .docx, .xlsx, .csv — same.
- **Folder:** Glob for `**/*.{md,txt,pdf,html,csv}` (skip binary images, fonts, etc). Read each one. Cap at 30 files per folder — if a folder has more, ask which to focus on.

Also auto-load:
- `{marketing_root}/{brand}/_libraries/voice.md` (if exists)
- `{marketing_root}/{brand}/_libraries/hard-nos.md` (if exists)
- `{marketing_root}/{brand}/_libraries/audiences.md` (if exists)
- `{marketing_root}/{brand}/_libraries/campaign-history.md` (if exists)
- `{marketing_root}/{brand}/_libraries/positioning.md` (if exists)

If `--from-campaign` was given, also read:
- `{marketing_root}/{any-brand}/{campaign}/1-setup.md` — campaign context, brand intent
- `{marketing_root}/{any-brand}/{campaign}/3-ideation.md` — persona, theme, positioning
- `{marketing_root}/{any-brand}/{campaign}/2-research.md` — VOC, competitors (if you want to inherit the audience)

### Step 3 — Propose the 9 essentials

Synthesise everything you read into a single proposal. For each of the 9 essentials, show:

- The proposed value
- The source you got it from (URL, file path + page/section, brand library, past campaign)
- Your confidence (HIGH / MEDIUM / LOW)

Use this format:

```
I read 1 URL, 2 files, 1 folder. Brand libraries loaded for "chatinc".
Here's what I'm proposing for the 9 essentials:

Brand
  ChatInc                                             [HIGH]   (from brief.pdf p.1)
  [change]

Project name
  flex-shopify-launch                                 [HIGH]   (from URL slug: chatinc.com/flex)
  [change]

URL to research
  https://chatinc.com/flex                            [HIGH]   (your arg)
  [change]

Goal
  leadgen                                             [MEDIUM] (from brief.pdf p.2: "drive trial signups for sales")
  [change]  options: awareness / leadgen / trial / purchase / retarget / retention / brand

Channels
  Meta, Google Ads, Email                              [HIGH]   (from brief.pdf p.3)
  [change]

Budget
  $25k total / $5k test, $15k scale, $5k sustain      [HIGH]   (from brief.pdf p.4)
  [change]

KPI + target
  CPL $80, range $60-$140                             [HIGH]   (from brief.pdf p.4)
  [change]

Timeline
  Launch Sept 12, hard end Dec 1, 12-week run         [HIGH]   (from brief.pdf p.4)
  [change]

Hard NOs
  • No FDA claims                                     [HIGH]   (from brief.pdf p.5)
  • No competitor names                                [HIGH]   (from brief.pdf p.5)
  • Inheriting from chatinc/_libraries/hard-nos.md:   [HIGH]
    - No unsubstantiated performance claims
    - No "AI replacement" framing
  [edit list]

Inheriting from chatinc/_libraries/voice.md          (3-5 personality adjectives + voice rules)
  (saved separately, will be used as Phase 1 input)

Inheriting from gloss-q1-2026/3-ideation.md
  Theme: "Trust without theatre"
  Persona: Sarah (ops director at <50 SaaS, sophistication stage 4)
  Positioning: "The attribution tool your CFO actually trusts"
  (saved separately, will be used as Phase 1 input)

Reply `looks good` to proceed, or correct anything that's wrong.
```

This is the operator's only real work: one confirmation.

### Step 4 — Confirm + save

If operator says `looks good` (or paste any affirmation):
- Save `{marketing_root}/{brand_slug}/{project_slug}/intake.json` with all 9 essentials.
- Save `{marketing_root}/{brand_slug}/{project_slug}/_materials/` with copies of all dropped files (so phase-doc-setup can re-read them later).
- Run `phase-doc-setup` (via `/run-phase {project} 1` or directly invoke the skill).
- Tell the operator the next action.

If operator corrects anything, save the corrected version. Don't argue — just save what they said.

### Step 5 — Trigger Phase 1

Invoke `phase-doc-setup` directly (NOT `/run-phase` — the operator hasn't approved Phase 0 yet, and `/run-phase` checks the prior phase's approval). The skill reads intake.json + the _materials/ folder + the brand libraries + (if applicable) the inherited campaign's phase docs, and produces `1-setup.md`.

After Phase 1 lands, tell the operator:
- `✓ Phase 1 doc ready: {path}`
- "Open the dashboard (`/open-command-center`) to review, or `/run-phase {project} 2` to continue."

## Hard rules

1. **Never ask 9 questions in a row.** If you can't infer an essential, mark it LOW confidence and surface it as "needs your input" in the proposal — but only for the 2-3 that genuinely need it (usually: goal, hard NOs).
2. **Always read the materials first, then propose.** Don't ask "what's your URL?" if they already pasted it.
3. **Brand libraries are sacred.** Whatever's in `{brand}/_libraries/` is the brand's official voice/hard-NOs. Use them as the baseline, never override them unless the operator explicitly says "ignore the library for this campaign."
4. **Inheritance is a copy, not a link.** When inheriting from a past campaign, copy the persona/positioning/voice into the new campaign's intake. The old campaign shouldn't change.
5. **Don't duplicate operator work.** If they uploaded a brief.pdf, don't ask "what's the budget?" — the brief has the budget.
6. **If materials contradict each other**, surface the conflict and ask which to trust. Don't pick silently.
7. **If a folder has 30+ files**, ask which to focus on. Don't read them all.

## What lives in intake.json

```json
{
  "brand_name": "ChatInc",
  "brand_slug": "chatinc",
  "project_name": "flex-shopify-launch",
  "project_slug": "flex-shopify-launch",
  "product_url": "https://chatinc.com/flex",
  "campaign_goal": "leadgen",
  "campaign_channels": "Meta, Google Ads, Email",
  "campaign_budget": "$25k total / $5k test, $15k scale, $5k sustain",
  "campaign_kpi": "CPL $80, range $60-$140",
  "campaign_timeline": "Launch Sept 12, hard end Dec 1, 12-week run",
  "brand_hard_nos": "No FDA claims; no competitor names; no unsubstantiated performance claims; no AI-replacement framing",
  "composite_key": "chatinc/flex-shopify-launch",
  "materials": [
    { "type": "url", "path": "https://chatinc.com/flex", "fetched_at": "..." },
    { "type": "file", "path": "./briefs/chatinc-q3.pdf", "size_bytes": 245000, "summary": "..." },
    { "type": "folder", "path": "./past-campaigns/gloss-q1-2026/", "files_count": 12, "key_files": ["3-ideation.md", "..."] }
  ],
  "inherited_from": "gloss-q1-2026",
  "inherited_artifacts": {
    "theme": "Trust without theatre",
    "persona": "Sarah (ops director at <50 SaaS, sophistication stage 4)",
    "positioning": "The attribution tool your CFO actually trusts"
  },
  "brand_libraries_loaded": ["voice.md", "hard-nos.md", "audiences.md"],
  "proposal_confidence": {
    "campaign_goal": "MEDIUM",
    "campaign_channels": "HIGH",
    "campaign_budget": "HIGH",
    "campaign_kpi": "HIGH",
    "campaign_timeline": "HIGH",
    "brand_hard_nos": "HIGH"
  }
}
```

## What lives in `_materials/`

A copy of every file the operator passed in, plus an `index.md` summarising what each one is and what Claude extracted from it. So Phase 1 (and later phases) can re-read without re-fetching.

## What the operator sees (full happy-path)

```
You: /start-campaign https://chatinc.com/flex ./briefs/chatinc-q3.pdf --from-campaign gloss-q1-2026 --brand chatinc

Claude: Reading… (1 URL, 1 PDF, 1 inherited campaign, 3 brand library files)
        [brief progress as it reads]

        I read 1 URL, 1 PDF, 1 inherited campaign, 3 brand library files.
        Here's what I'm proposing for the 9 essentials:

        Brand
          ChatInc                                        [HIGH]   brief.pdf p.1
        Project name
          flex-shopify-launch                            [HIGH]   URL slug
        URL
          https://chatinc.com/flex                       [HIGH]   your arg
        Goal
          leadgen                                        [MEDIUM] brief.pdf p.2
        Channels
          Meta, Google Ads, Email                        [HIGH]   brief.pdf p.3
        Budget
          $25k total / $5k test, $15k scale, $5k sustain [HIGH]   brief.pdf p.4
        KPI + target
          CPL $80, range $60-$140                        [HIGH]   brief.pdf p.4
        Timeline
          Launch Sept 12, hard end Dec 1                 [HIGH]   brief.pdf p.4
        Hard NOs
          (4 items)                                      [HIGH]   brief.pdf p.5 + library

        Inheriting from gloss-q1-2026 (theme + persona + positioning)
        Auto-loaded chatinc/_libraries/{voice,hard-nos,audiences}.md

        Reply `looks good` to proceed, or correct anything wrong.

You: looks good

Claude: ✓ intake.json saved
        ✓ 1 file copied to _materials/
        Running phase-doc-setup…

        ✓ Phase 1 doc ready: …/flex-shopify-launch/1-setup.md
        Next: /open-command-center to review, or /run-phase flex-shopify 2.
```

Operator's total typing: 1 URL, 1 file path, 2 flags, 2 words ("looks good").

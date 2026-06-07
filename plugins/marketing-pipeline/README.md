# Marketing Pipeline

Brand-agnostic, closed-loop marketing pipeline for **Claude Code** (terminal). One dashboard. Eight phases. One review pattern. Multi-brand — every project is scoped to a brand.

## The flywheel

```
1. Setup → 2. Research → 3. Ideation → 4. Creation → 5. Implementation
       ↑                                                          ↓
8. Updating ← 7. Learning ← 6. Reporting ←─────────────────────────┘
```

**Setup** captures internal truths (product, brand intent, campaign context) plus optional hypotheses. **Research** does the external work — validates hypotheses, mines VOC, scans competitors. Setup never asks for verbatim quotes or competitive positioning — those require research and live in Phase 2.

## How it works in Claude Code

The plugin is **terminal-first**. You drive it from Claude Code with slash commands:

| Command | What it does |
|---|---|
| `/install-marketing-command-center` | One-time setup. Creates the marketing folder + drops the dashboard. |
| `/start-campaign` | Walks you through the 9 strategic essentials in chat. Saves intake.json, then runs Phase 1. |
| `/run-phase {project} {N}` | Runs phase N for a project (1-8). |
| `/list-campaigns` | Shows all campaigns + their phase progress. |
| `/open-command-center` | Regenerates the dashboard.html snapshot + opens it in your browser. |

The **dashboard** is a self-contained HTML file that lives at `{marketing_root}/dashboard.html`. It uses the File System Access API (Chrome 86+ / Edge 86+) to read and write your phase docs directly. In Firefox / Safari it runs in read-only snapshot mode.

When you click "Run Phase" or "Approve" in the dashboard, it **copies a prompt to your clipboard** — you paste it into Claude Code, which invokes the phase-doc skill and writes the next phase doc. The dashboard then refreshes.

## What's in the plugin

- **42 skills** — full pipeline (8 phase-doc-emitters + setup-marketing-command-center + 33 underlying pipeline skills)
- **11 libraries** — art direction, campaign themes, creative strategies, channel specs, conversion framework, design foundations, hook structures, industry benchmarks, paid acquisition playbooks, competitive intelligence, creative types
- **1 dashboard template** — Marketing Command Center (HTML, works in any browser; live mode in Chrome/Edge)
- **1 phase doc schema** — universal contract every phase doc obeys

## Installation

1. `/plugin install marketing-pipeline@chatinc-plugins`
2. `/install-marketing-command-center` — creates the folder + drops the dashboard
3. `/start-campaign` — begin your first campaign

## Folder structure

```
{marketing_root}/
├── dashboard.html                  ← the dashboard (open in any browser)
├── _libraries/                     ← brand-specific library overrides
├── {brand_slug}/
│   ├── {project_slug}/
│   │   ├── intake.json
│   │   ├── 1-setup.md
│   │   ├── 2-research.md
│   │   ├── 3-ideation.md
│   │   ├── 4-creation.md
│   │   ├── 5-implementation.md
│   │   ├── 6-reporting.md
│   │   ├── 7-learning.md
│   │   ├── 8-updating.md
│   │   ├── campaign-state.md
│   │   └── go-to-market.html       (companion GTM doc, from Phase 5)
│   └── {another_project_slug}/
│       └── ...
├── {another_brand_slug}/
│   └── ...
```

## How a campaign flows

1. **`/start-campaign <materials...>`** — Drop in a URL, a brief PDF, a brand voice doc, a past campaign folder. Claude reads them, auto-loads the brand's library files (`_libraries/voice.md`, `hard-nos.md`, `audiences.md`), and **proposes the 9 essentials in one block**. You confirm or correct — that's it. One confirmation replaces 9 manual questions.

   Examples:
   ```
   /start-campaign https://chatinc.com/flex
   /start-campaign https://chatinc.com/flex ./briefs/chatinc-q3.pdf
   /start-campaign https://chatinc.com/flex ./briefs/ ./past-campaigns/gloss-q1-2026/ --from-campaign gloss-q1-2026 --brand chatinc
   ```

2. **Phase 1 — Setup** (auto-runs after intake) — Claude reads the materials bundle first, then fetches the URL only for gaps. Fills every section with HIGH/MEDIUM/LOW confidence + source citation. Review in the dashboard.

3. **`/run-phase {project} 2`** — Research. Claude validates Setup's hypotheses with real VOC + competitor scans. Mines verbatim customer pain language. You review, override what needs changing, approve.
4. **`/run-phase {project} 3`** — Ideation. Theme + ICP + character + creative strategy + positioning all locked in one doc.
5. **`/run-phase {project} 4`** — Creation. Hooks + LP copy + email sequence + ad image prompts + cinematic prompts + design system, channel-scoped by your declared channels.
6. **`/run-phase {project} 5`** — Implementation. Triple gate (interrogator + stress-test + funnel-audit), forecast, audiences, GTM doc.
7. **`/run-phase {project} 6`** — Reporting. Rolling weekly comparison vs forecast. Scale/watch/kill triggers.
8. **`/run-phase {project} 7`** — Learning. Cohorts, attribution, character validation.
9. **`/run-phase {project} 8`** — Updating. Library update proposals with tick-box approvals → next campaign starts smarter.

Each phase produces ONE doc. Each doc has tick-box approval gates. Operator never sees skill names.

## Materials-first intake

The intake assumes you have **materials** to give it, not just an answer to every question. Sources of truth, ranked by authority:

1. `intake.json` (operator's explicit decisions — never override)
2. Brand libraries (`{brand}/_libraries/*.md` — brand official position)
3. Operator's uploaded materials (briefs, docs, past campaign data, voice files)
4. URL scrape (last resort, lower confidence than the operator's own docs)

Drop a URL, a brief PDF, a brand voice doc, a past campaign folder — Claude extracts the 9 essentials. The dashboard's drag-and-drop form does the same thing in the browser; the "Copy /start-campaign command" button bridges to Claude Code.

## Hard rules baked in

1. **No fabrication.** Every value traces to a real source.
2. **Setup ≠ Research.** Setup captures internal truths. Research validates hypotheses with external evidence.
3. **VERBATIM tagging** on every customer-voice quote (only in Phase 2+).
4. **Confidence honesty** — HIGH only when stated directly in source.
5. **No auto-approval.** Only the dashboard's approval gate can lock a phase.
6. **Library updates require explicit approval** — Phase 8 proposes, never auto-applies.

## Multi-brand notes

Each brand gets its own folder under `{marketing_root}/`. Brand-specific library overrides live at `{marketing_root}/{brand}/_libraries/`. When you create a new campaign, the intake's first field is a brand picker — choose existing or "+ New brand". The dashboard groups projects by brand.

## Browser support

- **Chrome 86+ / Edge 86+** — Full live mode. Dashboard reads/writes files directly via File System Access API.
- **Firefox / Safari** — Snapshot mode. Re-run `/open-command-center` in Claude Code to refresh.
- **No browser** — Use the terminal commands only (`/start-campaign`, `/run-phase`, `/list-campaigns`). The dashboard is optional in this mode.

## Authors

Chris Vlok · chris@chatinc.com

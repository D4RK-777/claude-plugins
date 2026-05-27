# Marketing Pipeline

Brand-agnostic, closed-loop marketing pipeline operated through a single dashboard. Eight phases. Eight phase docs. One review pattern. Multi-brand — every project is scoped to a brand.

## The flywheel

```
1. Setup → 2. Research → 3. Ideation → 4. Creation → 5. Implementation
       ↑                                                          ↓
8. Updating ← 7. Learning ← 6. Reporting ←─────────────────────────┘
```

**Setup** captures internal truths only (product, brand intent, campaign context) plus optional hypotheses. **Research** does the external work — validates hypotheses, mines VOC, scans competitors. Setup never asks for verbatim quotes or competitive positioning — those require research and live in Phase 2.

## What's in the plugin

- **42 skills** — full pipeline (8 phase-doc-emitters + setup-marketing-command-center + 33 underlying pipeline skills)
- **11 libraries** — art direction, campaign themes, creative strategies, channel specs, conversion framework, design foundations, hook structures, industry benchmarks, paid acquisition playbooks, competitive intelligence, creative types
- **1 dashboard template** — Marketing Command Center (Cowork artifact)
- **1 phase doc schema** — universal contract every phase doc obeys

## Installation

1. `/plugin install marketing-pipeline.plugin`
2. Type `install marketing command center`
3. Pick your marketing folder (quick-pick suggestions + file browser)
4. Give your operator name
5. Click + New campaign

## Folder structure

```
{marketing_root}/
├── {brand_slug}/
│   ├── _libraries/          (brand-specific library overrides)
│   ├── {project_slug}/
│   │   ├── intake.json
│   │   ├── 1-setup.md       ← internal truths + hypotheses
│   │   ├── 2-research.md    ← validated truths from external research
│   │   ├── 3-ideation.md    ← strategic spine
│   │   ├── 4-creation.md    ← full creative package
│   │   ├── 5-implementation.md ← gates + forecast + GTM
│   │   ├── 6-reporting.md   ← rolling weekly performance
│   │   ├── 7-learning.md    ← cohorts + attribution + character validation
│   │   ├── 8-updating.md    ← library updates proposed
│   │   ├── campaign-state.md
│   │   └── go-to-market.html  (companion GTM doc)
│   └── {another_project_slug}/
│       └── ...
├── {another_brand_slug}/
│   └── ...
```

## How a campaign flows

1. **Setup** — Pick a brand, name the campaign, fill internal truths (product, brand intent, budget, KPI, channels). Optionally add hypotheses (who you think buys, who you think competes, what you think your edge is).
2. **Review the Setup doc** — Internal truths are confidence:HIGH; hypotheses are flagged "Phase 2 will validate" at confidence:LOW.
3. **Research** — AI fetches site + reviews + competitors. Validates/refutes/refines your hypotheses with a delta callout per section. Mines verbatim VOC.
4. **Review the Research doc** — Look for REFUTED hypotheses; confirm pivots if any.
5. **Ideation** — Theme + ICP + character + creative strategy + positioning locked.
6. **Creation** — Hooks + LP + emails + ads + visuals + design system.
7. **Implementation** — Triple gate (interrogator + stress-test + funnel-audit), forecast, audiences, GTM doc.
8. **Reporting** — Rolling weekly comparison vs forecast. Scale/watch/kill triggers.
9. **Learning** — Cohorts, attribution, character validation.
10. **Updating** — Library update proposals with tick-box approvals → next campaign starts smarter.

Each phase produces ONE doc. Each doc has tick-box approval gates. Operator never sees skill names.

## Hard rules baked in

1. **No fabrication.** Every value traces to a real source.
2. **Setup ≠ Research.** Setup captures internal truths. Research validates hypotheses with external evidence.
3. **VERBATIM tagging** on every customer-voice quote (only in Phase 2+).
4. **Confidence honesty** — HIGH only when stated directly in source.
5. **No auto-approval.** Only the dashboard's approval gate can lock a phase.
6. **Library updates require explicit approval** — Phase 8 proposes, never auto-applies.

## Multi-brand notes

Each brand gets its own folder under `{marketing_root}/`. Brand-specific library overrides live at `{marketing_root}/{brand}/_libraries/`. When you create a new campaign, the intake's first field is a brand picker — choose existing or "+ New brand". The dashboard groups projects by brand.

## Authors

Chris Vlok · chris@chatinc.com

# Marketing Pipeline — Changelog

All notable changes to the `marketing-pipeline` plugin are documented here. Read with `/what-changed` in Claude Code.

---

## v1.8.0 — Orchestrator + Gate Runner (the babysitter layer)

**Released:** 2026-06-08

### Highlights
- **The system now drives itself.** New orchestrator commands (`/next`, `/run-phase`, `/run-campaign`) read the campaign state file and decide what to do next. The operator's only job is to review each phase doc and approve — they never have to remember what comes next, which skills to fire, or whether the gate ran.
- **Mechanical gate enforcement.** New `gate-runner` skill runs the Triple Gate on every phase mechanically — lowest-wins, any KILL = KILL, 3/3 different = KILL, dissents logged. KILL'd assets BLOCK the phase from advancing. REVISE surfaces a corrective action list for operator decision.
- **State file is the API.** New `## NEXT ACTION` section in the state file (computed mechanically from state) drives the orchestrator. New `## GATE-RUNNER WRITES` contract defines exactly what gate-runner writes back to the state.

### What's new
- `skills/gate-runner/SKILL.md` — new skill. Per-phase gate definitions (1-8), Triple Gate aggregation rule (binding, never override), per-asset verdict table format, corrective action list format. Reads phase doc → runs gates → writes `section:gate-verdicts` → updates state → returns SHIP/REVISE/KILL.
- `commands/next.md` — new. "What should I do right now?" Reads state, computes next action, returns one concrete step with path + reason. Read-only.
- `commands/run-phase.md` — rewritten. Now: verifies prior phase approved → invokes phase-doc skill → invokes gate-runner → updates state → blocks on KILL. `--auto-correct` flag (v1.9.0 stub).
- `commands/run-campaign.md` — new. The autopilot. Loops through all 8 phases, stopping at every gate for operator approval. `--from {N}` and `--pause-at {N}` flags.
- `skills/campaign-state/SKILL.md` — new `## NEXT ACTION` section (decision tree: no state / awaiting review / BLOCKED / CLOSED / etc.) + new `## GATE-RUNNER WRITES` section (5 mechanical state updates when gate-runner fires).
- `scripts/structural-test.mjs` — new category #16 (6 checks): gate-runner has Triple Gate rule + per-phase gates; /next has decision tree; /run-phase enforces gate-runner + KILL blocking; /run-campaign has loop with mandatory pauses; campaign-state has NEXT ACTION + GATE-RUNNER WRITES. 139 checks total.
- Bump version to 1.8.0 (plugin.json + marketplace.json).

### What this enables
- Operator workflow: `You: /run-campaign {project}` → orchestrator drives every phase → pauses at every gate for your review → you approve or fix → loop continues → campaign CLOSED.
- No remembering. No "what phase is next?" The state file is the truth; the orchestrator reads it.
- Quality bar: every asset that survives a phase is gated. KILL'd assets block. REVISE surfaces. Dissents flagged.

### What's next
- v1.9.0: research lineage (every creative asset cites research IDs) + auto-correct mode (re-fire failing wrap skill for KILL'd assets)
- v2.0.0: library versioning + cross-campaign memory + `/duplicate-campaign`

### Migration notes
- No breaking changes. Existing phase docs, state files, and approvals are unchanged.
- v1.8.0 is the recommended upgrade from v1.7.2.

---

## v1.7.2 — campaign-state.md auto-update (mandatory final step of every phase)

**Released:** 2026-06-08

### Highlights
- **The state file is now guaranteed to be current.** Every one of the 8 phase-doc skills (`phase-doc-setup` through `phase-doc-updating`) now ends with a **mandatory** call to `campaign-state` — the call is the FINAL step of emission, not an option, not a SHOULD. This closes the "stale state file" failure mode where operators can't answer "where are we on [campaign]" in under 5 minutes.
- **Explicit OUTPUT CONTRACT on `campaign-state`.** The state skill now defines the universal call API: every phase-doc sends `phase_doc` + `decisions` (phase-specific) + `health` (GREEN/AMBER/RED), and the state file mechanically updates ARTIFACT REGISTRY + DECISION LOG + HEALTH SUMMARY + CHANGE LOG + Current phase. No more "the state file might be out of date because phase 5 forgot to call."
- **New structural test category #15** verifies every phase-doc has the mandatory call section. 130 checks total now.

### What's new
- `phase-doc-{setup,research,ideation,creation,implementation,reporting,learning,updating}/SKILL.md` — new `## Update campaign-state (mandatory final step)` section in each. Each defines the phase-specific `decisions` payload (intake essentials / customer truth / theme+strategy / creative assets / gate verdicts / KPI dashboard / validated insights / library updates) and a mechanical health assessment rule (compute from confidence + open questions, not opinion).
- `phase-doc-updating/SKILL.md` — also marks the campaign CLOSED on emission (final state, not ongoing).
- `campaign-state/SKILL.md` — new `## OUTPUT CONTRACT (for phase-doc callers)` section. Defines the universal call shape + the state-file side-effect sequence (5 mechanical updates). No ambiguity about what gets written.
- `scripts/structural-test.mjs` — new category #15: "campaign-state call in every phase-doc" — verifies the section header + the universal intro line + the side-effect list are all present in every phase-doc SKILL.md.
- Bump version to 1.7.2 (plugin.json + marketplace.json).

### Migration notes
- No breaking changes. The state file's expected format is unchanged. The mandatory calls just ensure it gets updated.
- v1.7.2 is the recommended upgrade from v1.7.1.

---

## v1.7.1 — seed-list consistency fixes

**Released:** 2026-05-27

### Highlights
- **7 wording/seed-list consistency fixes** found during the v1.7.0 walk-through. The data flow was always working — these tighten the EXPLICIT contracts so an agent reading a phase doc knows exactly what it produces and where the next phase reads from.
- **New structural test category #14: "Seed-list consistency."** Catches future typos like `positioningstatement` (no underscore) before they ship.

### What's new
- `phase-doc-setup/SKILL.md` — Seeds-for-Phase-2 now explicitly says what each seed IS and WHERE in 1-setup.md it lives. Plus a clarification that the items are Phase 1's HYPOTHESES, not Phase 2's outputs.
- `phase-doc-research/SKILL.md` — `audience_signals` clarified as living INSIDE `section:customer-truth`, not a separate field.
- `phase-doc-ideation/SKILL.md` — `positioningstatement` typo fixed to `positioning_statement` (snake_case). Added explicit Awareness × Sophistication grid seed (it was implicit in the handoff).
- `phase-doc-creation/SKILL.md` — added `section:email-sequence` to Phase 5 seeds (was implicit). Added `cinematic-prompts`, `ad-image-prompts`, `seo-briefs` to seeds with explicit notes on which Phase 5 consumer reads them.
- `phase-doc-implementation/SKILL.md` — Pre-emit validation #9 fixed the "5 required sections" wording (it's 5 always + 1 conditional = 6 max).
- `phase-doc-reporting/SKILL.md` — `creative_fatigue_signals` and `audience_saturation` clarified as living INSIDE `section:scale-watch-kill`, not separate fields.
- `scripts/structural-test.mjs` — new check #14 catches typos like `positioningstatement` and stale seed patterns. 122 checks total now.
- Bump version to 1.7.1.

### Migration notes
- No breaking changes. The data flow was already correct; the contracts are just clearer now.
- v1.7.1 is the recommended upgrade from v1.7.0.

---

## v1.7.0 — Triple Gate aggregation rule

**Released:** 2026-05-27

### Highlights
- **The Triple Gate aggregation rule is now explicit and binding.** Previously the rule was undefined ("majority vote" was mentioned but not specified — what happens with 3/3 different verdicts? With KILL? With a 2/3 + 1 dissent?).
- New `## Triple Gate aggregation rule (binding)` section in `phase-doc-implementation/SKILL.md` with the full truth table.
- New `section:gate-aggregation` required in Phase 5 phase docs — shows the per-asset aggregation trace (3 verdicts + which rule was applied + any dissent flag).
- New Pre-emit validation check #16 specifically validates the aggregation rule was applied.

### What's new
- `phase-doc-implementation/SKILL.md` — new "Triple Gate aggregation rule" section with:
  - Full truth table (interrogator × stress-test × funnel-audit → final verdict)
  - Rule priority: any KILL → KILL; 3/3 different → KILL; lowest wins; dissents logged but don't override
  - 3/3 stress-test verdict aggregation: same → that verdict; 2/3 + 1 dissent → majority with dissent flagged; 3/3 different → KILL
  - Per-asset output format with worked examples
- `phase-doc-implementation/SKILL.md` — new required section `section:gate-aggregation`
- `phase-doc-implementation/SKILL.md` — new Pre-emit validation check #16
- `scripts/structural-test.mjs` — new check verifies phase-doc-implementation has the aggregation rule documented
- Bump version to 1.7.0

### Migration notes
- No breaking changes. The new `section:gate-aggregation` is required going forward, but the old "majority vote" pattern would have been ambiguous in 3/3-different cases anyway.
- Operators running Phase 5 from a previous version may need to re-run Phase 5 to get the new aggregation section in their output.

---

## v1.6.2 — structural test + skill bug fixes

**Released:** 2026-05-27

### Highlights
- **New `scripts/structural-test.mjs`** — Node.js test that validates every skill, command, and contract in the plugin. Catches stale references, missing frontmatter, broken paths, inconsistent schemas. Run from the plugin root with `node scripts/structural-test.mjs`. Exits 0 on pass, 1 on failure.
- **`setup-marketing-command-center` frontmatter fixed** — was missing the `name:` field (Claude Code plugins require it).
- **`phase-doc-setup` Pre-conditions section added** — was the only phase-doc missing this section.

### What's new
- `scripts/structural-test.mjs` — 112 checks across 12 categories: plugin manifest, CHANGELOG, skill frontmatter, command frontmatter, phase-doc structure, Wraps cross-reference, output contracts, frontmatter schemas, command path discovery, install behavior, dashboard surfaces, archived skills.
- `scripts/README.md` — explains how to run the test.
- `setup-marketing-command-center/SKILL.md` — frontmatter now has `name: setup-marketing-command-center`.
- `phase-doc-setup/SKILL.md` — new `## Pre-conditions` section (intake.json exists, slug is kebab-case, _materials/ exists if materials were passed, inherited_from campaign exists if set).
- Bump version to 1.6.2.

### Migration notes
- No breaking changes. Pure bug fixes + new test infrastructure.
- The structural test is now part of the plugin. Operators can run it after any update to verify the install is intact.

### How to use the test
```bash
cd chatinc-plugins/
node scripts/structural-test.mjs
# Should output: "All structural checks passed."
```

---

## v1.6.1 — v1.6.0 gap fixes

**Released:** 2026-05-27

### Highlights
- **README updated** to list the 3 v1.6.0 commands (`/pending-review`, `/phase-status`, `/what-changed`) — operators who read the README now know they exist.
- **Dashboard surfaces the terminal commands** in a dedicated "Terminal commands" section on the Settings page.
- **`/install-marketing-command-center` now copies `CHANGELOG.md` + writes `.plugin-version`** into the marketing folder. This is what `/what-changed` reads to show what's new since the last install. No more hunting the plugin install path.
- **`/what-changed` reads from the marketing folder** (`.plugin-version`, `.last-seen-version`, `CHANGELOG.md`) instead of trying to find the plugin's install path.

### What's new
- `plugins/marketing-pipeline/README.md` — command table now has 9 rows (was 6).
- `plugins/marketing-pipeline/templates/operator-dashboard.html` — Settings view has a "Terminal commands (Claude Code)" section listing all 9 commands.
- `plugins/marketing-pipeline/skills/setup-marketing-command-center/SKILL.md` — install process now copies CHANGELOG.md + writes `.plugin-version` to the marketing folder.
- `plugins/marketing-pipeline/commands/what-changed.md` — reads from marketing folder, with graceful fallbacks for missing files.
- Bump version to 1.6.1.

### Migration notes
- No breaking changes.
- Operators who already installed v1.6.0: run `/install-marketing-command-center` to refresh the marketing folder with CHANGELOG.md + .plugin-version. Existing campaign data is preserved.
- `/what-changed` will then work for subsequent runs.

---

## v1.6.0 — sub-skill contracts + operator UX

**Released:** 2026-05-27

### Highlights
- **Sub-skill output contracts.** Every wrapped skill now declares its output contract — which file it writes, which `section:` it feeds, what fields it must include, what hard rules it follows. The phase-doc orchestrator no longer has to guess where each sub-skill's output goes.
- **Three new terminal commands.** `/pending-review`, `/phase-status`, `/what-changed` give operators terminal-side visibility without opening the dashboard.

### What's new
- Output contracts on: theme-selector, icp-persona-engine, icp-character-builder, creative-strategy-selector, positioning-engine, design-system-architect, hook-creative-generator, creative-expert, paid-ads-expert, lp-copy-generator, email-sequence-from-character, ad-image-architect, cinematic-prompt-architect, copywriter, master-wordsmith, expert-communicator, caption-expert, seo-content-engine, apify-pain-research, creative-interrogator, persona-stress-test, funnel-audit, campaign-forecaster, audience-architect, retargeting-cascade, gtm-document-builder, retention-engine, campaign-reporter, data-analyst, feedback-loop-back (20+ skills total).
- New `commands/pending-review.md` — shows top 10 awaiting_review phases across all projects, sorted by urgency.
- New `commands/phase-status.md` — shows 8-block status of one project (Setup → Research → ... → Updating).
- New `commands/what-changed.md` + this `CHANGELOG.md` — operator runs `/what-changed` to see what's new since their last install.
- Bump version to 1.6.0.

### Migration notes
- No breaking changes. The output contracts are documentation; existing skills already followed these patterns informally.
- The new commands are additive. Existing commands (`/start-campaign`, `/run-phase`, `/approve-phase`, `/list-campaigns`, `/open-command-center`) work unchanged.
- `CHANGELOG.md` is a new file at the plugin root. The `/what-changed` command reads it.

---

## v1.5.0 — phase contracts + integrity

**Released:** 2026-05-27

### Highlights
- **Phase 4 per-sub-skill capture spec.** The "What you do" section is now a table with REQUIRED / CONDITIONAL / OPTIONAL labels, fixed destination sections, and a dependency graph. No agent can skip step 1 (design tokens) or step 3 (creative concept) without violating the spec.
- **Pre-emit validation in all 8 phase docs.** Every phase doc now has a "Pre-emit validation" section with 6-8 common checks + 2-5 phase-specific checks. Agents must run them all before writing the file. Catches malformed phase docs before they reach the dashboard.
- **Standardised frontmatter across all 8 phase docs.** `brand_libraries_loaded`, `sources_consumed`, `inherited_from`, `created_at`, `last_updated`, `approved_at`, `approved_by` are now always present. Dashboards, operators, and downstream phases can rely on a uniform contract.
- **`learning-insights.json` schema.** Phase 7's output to Phase 8 now has an explicit JSON contract. `insights[]`, `character_refinements[]`, `watch_list_entries[]` — each with required fields. No more "parse whatever JSON."
- **Phase 8 anchor-point rules per library format.** Table-format libraries (4): append footnote to row. Section-format libraries (7): append footnote to section. Footnote format: `<!-- Updated YYYY-MM-DD via feedback-loop-back from {slug} — reason: {short} -->`. Audit trail is consistent.

### What's new
- Phase 4 "What you do" rewritten as a per-skill capture spec table.
- All 8 phase docs have a "Pre-emit validation" section.
- All 8 phase docs use the canonical frontmatter template.
- `phase-doc-learning/SKILL.md` documents the `learning-insights.json` schema.
- `phase-doc-updating/SKILL.md` documents the anchor-point rules per library format.
- Bump version to 1.5.0.

---

## v1.4.0 — materials path fix + apify-pain-research skill + archive legacy skills

**Released:** 2026-05-27

### Highlights
- **Bug fix:** `intake.json.materials[].path` now correctly records the `_materials/...` path (where files are saved), not the operator's original path. Phase 1 was reading the wrong path.
- **New skill:** `apify-pain-research` — review mining + VOC across G2/Trustpilot/Reddit/app stores. WebSearch-based stub today, Apify-ready (swappable to real Apify API when `APIFY_API_TOKEN` is configured).
- **Archived legacy skills:** `preflight-research` + `brand-project-setup` moved to `skills/archive/` with deprecation banners. They were the pre-flywheel entry points, superseded by `/start-campaign` + `phase-doc-setup`.
- **Bump version to 1.4.0.**

### What's new
- `/start-campaign` now records the in-project path (`_materials/...`) as the primary `path` in `intake.json.materials[]`, with the operator's original path preserved in `original_path` for traceability.
- `phase-doc-setup` reads from `{project_root}/{path}` (single prefix, not double).
- New `skills/apify-pain-research/SKILL.md` — full WebSearch process + VERBATIM format + sources ranked + Apify swap path documented.
- `skills/preflight-research/` and `skills/brand-project-setup/` moved to `skills/archive/`. Deprecation banners added.
- `phase-doc-research` Wraps updated to remove the now-archived `preflight-research` reference.

---

## v1.3.0 — pipeline integration fixes from end-to-end simulation

**Released:** 2026-05-27

### Highlights
- **Terminal approval flow.** `/approve-phase {project} {N}` writes `status: approved` to the phase doc's frontmatter. Pure-terminal operators can now run a full campaign without ever opening the dashboard.
- **Retention engine wired into Phase 6.** The LTV side of the acquisition × LTV equation is no longer neglected. `section:retention-pulse` is mandatory every week, with explicit hard-rule that week-1 logs zero baseline values.
- **Brand libraries propagate to all 8 phases.** Earlier, only Phase 1 read `{brand}/_libraries/`. Now every phase re-reads the libraries and enforces the voice + hard NOs as rails.
- **v1.2.0 inheritance actually works.** `phase-doc-ideation` now reads `intake.json.inherited_artifacts` directly, so theme/persona/positioning from a past campaign actually carry into the new one.
- **Cleaned up dead references.** `media-buying-tactics` (skill didn't exist) removed from Phase 5 Wraps. `creative-expert` (existed but orphaned) wired into Phase 4 between hooks and image/copy execution. `brand-project-setup` + `preflight-research` removed from Phase 1 Wraps (legacy).
- **Bump version to 1.3.0.**

### What's new
- New `commands/approve-phase.md` — terminal approval flow.
- `phase-doc-reporting` now wraps `retention-engine` (LTV pulse) and has the `section:retention-pulse` section.
- All 6 other phase docs (research, ideation, creation, implementation, learning, updating) have brand-library re-load in their Inputs.
- `phase-doc-ideation` reads `intake.json.inherited_artifacts`.
- `phase-doc-creation` now has 12 wrapped skills (added `creative-expert` between hooks and image/copy).
- `phase-doc-implementation` Wraps cleaned up (removed `media-buying-tactics`).
- Bump version to 1.3.0.

---

## v1.2.0 — materials-first intake

**Released:** 2026-05-27

### Highlights
- **The intake stopped being a 9-question form.** `/start-campaign` now accepts materials as arguments: URLs, files, folders, plus `--brand` and `--from-campaign` flags. AI reads the materials, auto-loads the brand's libraries, optionally inherits from past campaigns, and proposes the 9 essentials in one block. Operator confirms with `looks good` — 1 confirmation replaces 9 questions.
- **Sources of truth, ranked:** `intake.json` > brand libraries > operator's brief > URL scrape. Operator's materials win over the AI's URL fetch.
- **Campaign inheritance from past campaigns.** `--from-campaign {slug}` carries theme, persona, and positioning from a past campaign's phase docs into the new one's intake.
- **Dashboard drag-and-drop workflow.** The dashboard's intake form stages uploaded files to `{project}/_materials/` on disk so Claude Code can re-read them later. New "Copy /start-campaign command" button bridges the browser drag-drop to the terminal flow.
- **Bump version to 1.2.0.**

### What's new
- `/start-campaign` accepts materials as args: `/start-campaign <url> <file1> <folder1> --brand <slug> --from-campaign <slug>`.
- `/start-campaign` auto-loads brand libraries from `{brand}/_libraries/` (voice.md, hard-nos.md, audiences.md, etc.).
- `/start-campaign` writes uploaded materials to `{project}/_materials/` with an `index.md`.
- `phase-doc-setup` updated to consume the materials bundle BEFORE fetching URLs.
- Dashboard's drag-drop form now stages files to disk; new "📋 Copy /start-campaign command" button bridges to terminal.

---

## v1.1.0 — Claude Code dispatch layer + pipeline cleanup

**Released:** 2026-05-27

### Highlights
- **The plugin is no longer Cowork-bound.** v1.0.0 was a Cowork-shaped product shipped in a Claude Code wrapper — its dashboard depended on `mcp__cowork__*` MCPs that don't exist in Claude Code. v1.1.0 fixes the entire dispatch layer for Claude Code terminal mode.
- **5 commands work in pure terminal.** `/start-campaign`, `/run-phase`, `/approve-phase` (added v1.3.0), `/list-campaigns`, `/open-command-center`. No dashboard required for a full campaign.
- **Dashboard works in Chrome/Edge.** File System Access API for live mode. `navigator.clipboard.writeText()` for "Run Phase" dispatch. Firefox/Safari get a "use Chrome" banner.
- **The orphan 3-phase pipeline was archived.** `campaign-pipeline-orchestrator` moved to `skills/archive/` with a deprecation banner. The 8-block flywheel is the only pipeline.
- **Bump version to 1.1.0.**

### What's new
- `commands/start-campaign.md` rewritten (was 9 lines saying "open dashboard"; now 200+ lines doing the actual intake).
- `commands/open-command-center.md` rewritten to regenerate + open the dashboard.
- `commands/run-phase.md` NEW.
- `commands/list-campaigns.md` NEW.
- `skills/setup-marketing-command-center/SKILL.md` rewritten to drop the `mcp__cowork__create_artifact` dependency.
- `skills/campaign-pipeline-orchestrator/SKILL.md` moved to `skills/archive/`.
- `templates/operator-dashboard.html` I/O layer rewritten to use File System Access API. `mcp__cowork__*` calls removed. `sendPrompt()` replaced with clipboard copy.
- 4 skills updated for stale cross-references to the orchestrator.
- All 4 user-facing docs (README, INSTALL, ADMIN-SETUP, TEAM-INSTALL) rewritten.
- Bump version to 1.1.0.

---

## v1.0.0 — initial release

**Released:** 2026-05-27

The original `chatinc-plugins.zip` with the 8-block flywheel, dashboard, and 42 underlying skills. Worked in Cowork (artifact + chat panel) but had no working Claude Code path — the dashboard's "click Run Phase" button was hard-wired to `sendPrompt()` which didn't exist outside Cowork. This is what the v1.1.0 → v1.6.0 series fixed.

Known issues at v1.0.0 (now resolved in later versions):
- Wizard never connected to anything in Claude Code (no MCPs, no `sendPrompt`).
- Two pipelines co-existed (8-block + 3-phase) with conflicting vocabulary.
- Approval gate was dashboard-only; terminal operators couldn't advance.
- 9-question manual intake; no materials ingestion.
- Brand libraries existed but only Phase 1 read them.
- learning-insights.json format undefined (Phase 7 → 8 was ad-hoc).
- Frontmatter schemas inconsistent across phases.

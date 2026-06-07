---
name: campaign-state
description: >
  Closes the cumulative campaign state gap. Creates and maintains a single living dashboard file (`campaign-state-[project].md`) that aggregates every artifact in a campaign — brand brief, personas, characters, hooks, ads, LPs, stress test reports, audit reports — with version dates, ship/revise status, and the live decision queue. Run at the START of any new campaign (to bootstrap the file) and AFTER each pipeline phase completes (to update status). Trigger on: "campaign state", "what's the status", "show campaign progress", "where are we on [project]", "update the state file", "campaign dashboard", "what's pending", "show me what's been built and what's left", or as the automatic last step of every pipeline phase.
---

# Campaign State
> **Position in pipeline:** RUNS THROUGHOUT. Bootstrap at campaign start, update after every phase completes. This is the campaign's live state-of-the-world — the single file a stakeholder can open to know what's done, what's pending, and what's blocked.

---

## ROLE

You are a campaign operations coordinator. You don't produce creative or strategy — you produce **visibility**. Your job is to maintain a single file per campaign that aggregates everything else into a readable status: what artifacts exist, what's been audited and stress-tested, what's currently shipping, what's blocked, and what decisions are pending.

The other skills produce documents. This skill makes those documents legible together.

---

## WHEN TO INVOKE

Trigger when:
- A new campaign starts → bootstrap `campaign-state-[project].md` from the Brand Brief
- Any pipeline skill completes → update the state file with what changed
- The user asks "where are we on [campaign]" → read the state file, summarise
- Decisions are pending → log them in the state file's decision queue
- An artifact is shipped or revised → update its status

**Do NOT** run this skill before a Brand Brief exists. There's no campaign to track.

---

## INPUTS REQUIRED

For bootstrap: `brand-brief-[project].md`

For updates: the artifact that just completed (campaign-persona, character-profile, lp-copy, stress-test-report, creative-audit-report, etc.) plus the existing `campaign-state-[project].md`.

---

## OUTPUT CONTRACT (for phase-doc callers)

Every phase-doc skill MUST call `campaign-state` at the end of its emission with this exact API. The state file is the only single-source-of-truth that spans all 8 phases — without this call, the state file goes stale.

**The call payload (universal — every phase-doc sends the same shape):**

```yaml
# The just-emitted phase doc (for the artifact registry)
phase_doc: { project_root }/{N}-{phase-slug}.md

# Strategic decisions made this phase (content varies by phase — see per-phase contract)
decisions:
  # Phase 1 example
  intake_essentials: { brand, project, product_url, goal, channels, budget, kpi, timeline, hard_nos }
  brand_inference_methodology: [...]
  hypothesis_sources: [...]
  # Phase 2 example
  customer_truth: { pain, desire, sophistication, awareness_level, buying_modes }
  competitive_landscape_summary: "..."
  phase1_hypotheses_confirmed: [...]
  phase1_hypotheses_refuted: [...]
  pain_evidence_sources: [...]
  # ... (see per-phase contracts in each phase-doc SKILL.md)

# A health assessment for the phase (mechanical — compute from confidence + open questions)
health: GREEN | AMBER | RED
health_rationale: "one-line reason for the color"
```

**The state file side-effect (mandatory, every call):**

1. **`## ARTIFACT REGISTRY`** — append a new row to the matching Block (1 through 8) with the phase doc path, status DRAFT, version v1, and last-updated date.
2. **`## DECISION LOG`** — append a new row at the top: `phase {N} {phase-slug} = [{one-line summary of decisions}] | phase-doc-{slug} | [{rationale}] | [{sources cited + brand/library references + methodology}]`.
3. **`## HEALTH SUMMARY`** — recompute the relevant dimension from the call's `health` field + the per-phase metrics (e.g. `research_integrity` from Phase 2, `gate_integrity` from Phase 5, `campaign_performance` from Phase 6, `learning_integrity` from Phase 7, `library_health` from Phase 8).
4. **`## CHANGE LOG`** — append: `[{date}] — phase {N} {phase-slug} complete — {one-line what shipped}`.
5. **`Current phase:`** — update to `{N} ({Phase name} complete, awaiting review)` (Phase 8 closes the campaign: `Current phase: 8 (CLOSED on {date})`).

**Bootstrap variant (called from `start-campaign`, not a phase-doc):**
- No `phase_doc` (no artifact yet)
- `decisions.bootstrap = true` + the brand brief + intake essentials
- `health` is GREEN if all 9 essentials captured, AMBER if any pending

**Per-phase contracts:** each phase-doc skill's "Update campaign-state" section defines exactly which `decisions` fields to send. The state skill reads those, doesn't infer them.

**The rule that makes this binding:** every phase-doc skill's "What you do" section ends with the campaign-state call as the final step. Pre-emit validation in each phase-doc skill verifies the call was made. The structural test verifies every phase-doc has the call. The state file is always current because the call is the last thing that happens.

---

## NEXT ACTION (computed by state, drives the orchestrator)

The state file is the orchestrator's only API. It reads the state and computes what's next. Add this section to the state file template (after the template, before PROCESS RULES):

```markdown
## NEXT ACTION
*Computed mechanically from the state. The orchestrator reads this to know what to do.*

| State observation | Next action |
|-------------------|-------------|
| No state file exists | **Bootstrap.** Tell operator: "Run `/start-campaign` to begin." |
| State exists, current phase is `1 (Setup)`, intake complete | **Run Phase 2.** Invoke `phase-doc-research`. |
| State exists, current phase is `N`, status `awaiting review` | **Prompt operator.** "Phase N ready. Review `{N}-{slug}.md` and approve, or request changes." |
| State exists, current phase is `N`, status `blocked` (KILL in gate) | **Show corrective action list.** Tell operator what failed. Do NOT advance. |
| State exists, current phase is `N`, status `awaiting decision` (REVISE in gate) | **Show corrective action list.** Operator decides ship anyway / fix first. |
| State exists, current phase is `N` approved, next is `N+1` | **Run Phase N+1.** Invoke the next phase-doc skill. |
| State exists, current phase is `8 (CLOSED)` | **Campaign closed.** Tell operator: "Run `/start-campaign` to begin a new one." |
| State exists, current phase missing a phase doc (gap) | **Alert operator.** State is broken. Run `/pending-review` to see what's there. |
| Last gate verdict in state has unaddressed dissents | **Surface dissents.** Operator must explicitly resolve before advancing. |
```

**The orchestrator (`/next`, `/run-phase`, `/run-campaign`) reads this section + the gate-runner's last verdict to decide what to do.** The state file is the brain; the orchestrator is the hands.

**Computing the next action is mechanical:**
1. Read `Current phase:` line
2. Read last entry in `## DECISION LOG` to find gate verdict
3. Read `## BLOCKERS` to find blocking items
4. Look up the matching row in the NEXT ACTION table
5. Return the action

No inference, no opinion. The state IS the answer.

---

## GATE-RUNNER WRITES (state-side contract)

When `gate-runner` runs, it updates the state file with:

1. **Append a row to `## DECISION LOG`** (the gate verdict):
   ```
   | {date} | gate-runner phase {N} = [{N} SHIP / M REVISE / K KILL] | gate-runner | [{one-line reason}] | [{verdicts table summary}] |
   ```

2. **Append a row to `## CHANGE LOG`**:
   ```
   - {date} — gate-runner phase {N} = {verdict} — {one-line what was gated}
   ```

3. **Update `Current phase:`** based on verdict:
   - SHIP → `Current phase: {N} (awaiting review)`
   - REVISE → `Current phase: {N} (awaiting decision — see corrective action list)`
   - KILL → `Current phase: {N} (BLOCKED — see corrective action list)`

4. **Append a row to `## BLOCKERS`** (if KILL or REVISE):
   ```
   | {date} | Phase {N} gate = {verdict} | Phase {N} advancement | {date} | open | {corrective action} |
   ```

5. **Update `## HEALTH SUMMARY`** with the gate verdict's effect on the relevant dimension (e.g. `gate_integrity` for Phase 5, `creative_quality` for Phase 4).

6. **Update `## NEXT ACTION`** with the new computed action.

The orchestrator reads the state file after gate-runner writes and acts on the NEXT ACTION.

---

## THE STATE FILE TEMPLATE

```markdown
# Campaign State: [Project Name]
**Created:** [date] | **Last updated:** [date] | **Phase:** [active phase] | **Health:** [GREEN / AMBER / RED]

---

## CAMPAIGN SNAPSHOT
- **Product / offer:** [from Brand Brief — one sentence]
- **Primary ICP:** [from Brand Brief — one sentence]
- **Campaign goal:** [from Brand Brief CAMPAIGN CONTEXT]
- **Primary KPI + target:** [from Brand Brief]
- **Budget:** [from Brand Brief]
- **Timeline / launch date:** [from Brand Brief]
- **Current phase:** [Intake / Research / Persona / Character / Creative / Gate / LP / Deploy / Live / Optimisation]

---

## ARTIFACT REGISTRY

### Block 1 — Setup (intake)
| Artifact | File | Status | Version | Last updated | Notes |
|----------|------|--------|---------|--------------|-------|
| Brand Brief | brand-brief-[project].md | [DRAFT / FINAL] | v[X] | [date] | RESEARCH_CONFIDENCE: [HIGH/MEDIUM/LOW] |

### Block 2 — Research
| Artifact | File | Status | Version | Last updated | Notes |
|----------|------|--------|---------|--------------|-------|
| VOC research | [file] | [...] | v[X] | [date] | [source breakdown] |
| Competitor scan | [file] | [...] | v[X] | [date] | Sophistication stage declared: [...] |

### Block 3 — Ideation (persona) Strategy
| Artifact | File | Status | Version | Last updated | Notes |
|----------|------|--------|---------|--------------|-------|
| Persona [name 1] | campaign-persona-[name1].md | [...] | v[X] | [date] | Grid: [Awareness × Sophistication] |
| Persona [name 2] | campaign-persona-[name2].md | [...] | v[X] | [date] | Grid: [...] |

### Block 3 — Ideation (character) Layer
| Character | File | Persona source | Status | Stress-tested? | Notes |
|-----------|------|----------------|--------|----------------|-------|
| [Sarah] | character-profile-sarah.md | [Persona 1] | [...] | [yes/no] | Decision style: [...] |
| [Marcus] | character-profile-marcus.md | [Persona 2] | [...] | [yes/no] | Decision style: [...] |

### Block 4 — Creation
| Asset | File | Version | Status | Source persona/character | Hook angle | Notes |
|-------|------|---------|--------|--------------------------|------------|-------|
| Ad v1 | ad-v1.md | v[X] | [DRAFT / GATE / SHIPPED / KILLED] | [character name] | [angle] | [...] |

### Block 5 — Implementation gate results
| Asset | Creative-interrogator | Persona-stress-test | Overall verdict | Date |
|-------|----------------------|---------------------|-----------------|------|
| Ad v1 | [GREEN / AMBER / RED / KILL] | [3/3 ✓ / 2/3 ✓ / divergent / 3/3 ✗] | [SHIP / REVISE / KILL] | [date] |

### Block 4 — Creation (LP + funnel)
| Asset | File | Scent match | LP audit score | Status | Notes |
|-------|------|-------------|----------------|--------|-------|
| LP v1 | lp-copy-v1.md | [MATCH / DRIFT / BROKEN] | [X/25] | [...] | [...] |

### Block 6 — Reporting (live performance, post-launch)
| Metric | Target | Current | Status | Trend |
|--------|--------|---------|--------|-------|
| CPL | $X | $Y | [GREEN / AMBER / RED] | [↑/↓/→] |
| ROAS | X.X | Y.Y | [...] | [...] |
| CTR | X% | Y% | [...] | [...] |
| LP CVR | X% | Y% | [...] | [...] |

---

## DECISION QUEUE
*Decisions currently pending. Each has an owner and a deadline.*

| # | Decision | Context | Owner | Deadline | Status |
|---|----------|---------|-------|----------|--------|
| 1 | [decision needed] | [why it matters] | [name] | [date] | [pending / decided] |

---

## BLOCKERS
*Anything stopping a phase from progressing.*

| # | Blocker | Affects | Reported | Status | Resolution |
|---|---------|---------|----------|--------|------------|
| 1 | [...] | [phase / asset] | [date] | [open / resolved] | [what unblocks it] |

---

## DECISION LOG
*Every strategic decision made on this campaign, with rationale and source. Newest first. This is the defensibility layer — "why did we pick X" months later gets answered here.*

| # | Date | Decision | Source skill | Rationale (one line) | Defensible against | Linked artifact |
|---|------|----------|--------------|----------------------|--------------------|-----------------|
| 1 | [date] | Theme = [name] | theme-selector | [...] | persona × sophistication × brand permission × channel | theme-declaration-[campaign].md |
| 2 | [date] | Creative strategy = [name] | creative-strategy-selector | [...] | theme × decision style × awareness × strategy fit | creative-strategy-declaration-[campaign].md |
| 3 | [date] | Audience architecture v1 | audience-architect | [...] | persona × budget × channel benchmarks | audience-architecture-[campaign].md |
| 4 | [date] | Design system = [name] | design-system-architect | [...] | brand × theme × strategy × buyer aesthetic | design-system-selection-[campaign].md |
| 5 | [date] | Pre-launch forecast | campaign-forecaster | Likely CPL $[X] | benchmarks + historical data + setup | forecast-[campaign]-v1.md |
| 6 | [date] | [next decision] | [...] | [...] | [...] | [...] |

**Decision log rule:** Every skill that makes a significant choice (theme, strategy, audience, design, forecast, budget shift, kill/scale decision) appends one row here. The audit trail makes every campaign defensible without reconstructing reasoning from memory.

---

## CHANGE LOG
*Every meaningful update or event, newest first. This is operational — what happened, not why.*

- **[date]** — [what changed, who/what triggered it]
- **[date]** — [...]
- **[date]** — Campaign state file bootstrapped from Brand Brief v1

---

## HEALTH SUMMARY
*One sentence per dimension. Updated with each state refresh.*

- **Research integrity:** [HIGH / MEDIUM / LOW — based on RESEARCH_CONFIDENCE + verbatim citation rate across creative]
- **Gate pass rate:** [X / Y assets have passed both gates] — [GREEN if >70%, AMBER if 40-70%, RED if <40%]
- **Scent match health:** [average LP scent match score across LPs in this campaign]
- **Pipeline velocity:** [days from intake to first shipped asset — GREEN <14, AMBER 14-30, RED >30]
- **Spend / signal ratio:** [if live — cost per validated learning. GREEN if compounding, AMBER if flat, RED if degrading]

---

## NEXT ACTIONS
*Top 3 things to do next, prioritised.*

1. [Action — owner — by when]
2. [Action — owner — by when]
3. [Action — owner — by when]
```

---

## PROCESS RULES

1. **Bootstrap from Brand Brief.** When creating the state file, copy the campaign snapshot fields directly from the brief. Don't re-derive them.

2. **Update on every artifact change.** Every other skill in the pipeline should call campaign-state at the end of its run with the new artifact + status. If a skill forgets, the campaign-state skill self-detects drift by scanning the project folder for files newer than the state file.

3. **Status values are strict.** Use only: DRAFT, GATE (awaiting interrogator/stress-test), SHIPPED, KILLED, REVISING. No custom statuses.

4. **Health is a fact, not an opinion.** Compute it from the registry, don't subjectively assess it. Define the rules once; apply them consistently.

5. **The decision queue is the real product.** A clean registry with three urgent unresolved decisions is more useful than a complete-looking dashboard with no calls to action. Surface decisions aggressively.

6. **One state file per campaign, not per project.** A project may run multiple campaigns over time. Each campaign gets its own state file. Archive old state files when campaigns end.

7. **Read-write contract.** Other skills MUST be able to read this file as input (to know where they are in the pipeline). This skill MUST be able to read other skills' outputs (to know what changed). Filename pattern is fixed: `campaign-state-[project].md`.

8. **Save with present_files.** Show the user the file. The dashboard only works if it gets opened.

---

## DOWNSTREAM SKILL INTEGRATION

Every other pipeline skill should:
- **Read** `campaign-state-[project].md` at start of run, to know current phase + open decisions
- **Notify** campaign-state at end of run, with the new artifact path + status

The state file is the campaign's single source of truth about its own progress. Skills consult it; this skill maintains it.

---

> **First principle:** A pipeline without state is a pile of disconnected files. The state file is what makes the pile a campaign. Without it, no stakeholder can answer "where are we" in under 5 minutes.

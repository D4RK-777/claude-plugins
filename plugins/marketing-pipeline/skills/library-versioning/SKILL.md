---
name: library-versioning
description: >
  The library versioning + cross-campaign memory system. Defines the format for versioned library entries (each tagged with source campaign + date + confidence), the operations for reading the latest version (used by phase-doc-setup) and writing a new version (used by phase-doc-updating), and the rules for when a new version is warranted vs when an update is cosmetic. Called by phase-doc-setup (read) and phase-doc-updating (write). Foundation of v2.0.0 cross-campaign memory.
---

# Library Versioning
> **Position in pipeline:** Foundation. Every library has versions. New campaigns read the latest; old campaigns stay auditable. Each version is the result of a specific campaign's learning, source-tracked + confidence-rated.

---

## ROLE

You are the library versioning system. You define how library entries evolve over time. A library entry is a piece of reusable marketing knowledge — a persona profile, a customer journey stage, a hook structure, a creative strategy, a channel spec, a benchmark. Today they're static markdown files. v2.0.0 makes them versioned, source-tracked, and confidence-rated.

You enable:
- **Cross-campaign memory:** a campaign's learning compounds into a library version, which the next campaign can use as a starting point.
- **Auditability:** every version knows where it came from (source campaign) and how confident we are in it.
- **Compounding:** the more campaigns, the richer the libraries.

---

## THE VERSION FORMAT

Every library entry (a single concept: a persona, a journey stage, a hook structure) gets a version. The version is recorded in the entry's heading AND in the file's `## VERSION LOG` at the bottom.

### Entry format (in the library file)

```markdown
## {Entry name} (v{N})
> *Source: {campaign-name} | Date: {YYYY-MM-DD} | Confidence: {HIGH | MEDIUM | LOW}*
> *Deprecates: {vN-1 entry name} | {reason for new version}*

{Entry content — the actual reusable knowledge}

---
```

### VERSION LOG format (at the bottom of the library file)

```markdown
## VERSION LOG

| Entry | v1 source | v1 date | v1 confidence | v2 source | v2 date | v2 confidence | v2 change |
|-------|-----------|---------|---------------|-----------|---------|---------------|-----------|
| Hook: "FOMO countdown" | gloss-q1 | 2026-03-15 | HIGH | chatinc-fall | 2026-09-20 | HIGH | Tightened time window + added credibility proof |
| Persona: "CTO-Mary" | gloss-q1 | 2026-03-15 | MEDIUM | chatinc-fall | 2026-09-20 | HIGH | Validated by 3 live interviews |
```

The VERSION LOG is the file's source of truth. The "current" version of each entry is the latest row in the log.

### Deprecation banner (on old versions)

```markdown
## {Entry name} (v{N}) [DEPRECATED — see v{N+1}]
> *Source: {campaign-name} | Date: {YYYY-MM-DD} | Confidence: {confidence}*
> *Replaced by v{N+1} on {date}. Kept for audit trail.*

{Original entry content}

---
```

Old versions are NEVER deleted. They're marked `[DEPRECATED — see v{N+1}]` and kept for the audit trail. The state file's DECISION LOG records when a version was created and why.

---

## WHEN A NEW VERSION IS WARRANTED

A new version is created when:
- **A campaign's Phase 7 (Learning) produced a validated insight** that contradicts or extends an existing library entry
- **A campaign's Phase 8 (Updating) proposes an update** to a library entry
- **Operator manually requests** a library update outside the campaign flow

A new version is NOT created when:
- The content is cosmetic (typo fix, formatting)
- The content is a clarification that doesn't change the substance
- The new finding is single-source and low confidence (defer to next campaign for validation)

For cosmetic fixes, edit in place. For substantive changes, create v{N+1}.

**Rule of thumb:** if the change would affect a creative decision, it's a new version. If it doesn't, edit in place.

---

## OPERATIONS

### Operation 1: READ latest version (used by phase-doc-setup)

`phase-doc-setup` calls `library-versioning` at the start to load the latest version of every relevant library entry. The call is mechanical:

```yaml
load_libraries:
  library: {library filename, e.g. "library-icp"}
  entries: [list of entry names to load, or "all" for everything]
  version: "latest"  # always "latest" unless operator requests a specific version
  source: "campaign"  # the campaign doing the load (for the state file's audit row)
```

The library-versioning skill returns:
- The current (latest) version of each requested entry
- The VERSION LOG row for each (so the campaign knows the lineage)
- The source campaign + date + confidence for each (so the campaign can rate-trust)

The campaign's state file gets a row in DECISION LOG: `library-load = [library name, N entries loaded, latest versions] | library-versioning | [...] | [sources + confidences]`.

### Operation 2: WRITE new version (used by phase-doc-updating)

`phase-doc-updating` calls `library-versioning` to propose a new version. The call:

```yaml
propose_version:
  library: {library filename}
  entry: {entry name}
  new_content: {the proposed new entry content}
  rationale: {why this update — sourced from Phase 7 learning}
  source_campaign: {the campaign that produced the new finding}
  confidence: {HIGH | MEDIUM | LOW}
  deprecates_v: {the version being replaced, e.g. v1}
```

The library-versioning skill:
- Verifies the new content passes the gate (format-correct, no banned language, source-tracked)
- Writes the new version to the top of the file (with full v{N+1} format)
- Marks the old version with `[DEPRECATED — see v{N+1}]` + deprecation banner
- Adds a row to the VERSION LOG
- Adds a row to the state file's DECISION LOG: `library-update = [library, entry, v1 → v2] | library-versioning | [rationale] | [source campaign + confidence]`

### Operation 3: ROLLBACK (operator only)

If a library version is found to be wrong (e.g. the campaign that produced it failed), the operator can roll back:

```yaml
rollback:
  library: {library filename}
  entry: {entry name}
  from_v: {current version, e.g. v2}
  to_v: {target version, e.g. v1}
  reason: {why the rollback — must be from a real campaign failure, not a preference}
```

Rollback is logged in the state file's DECISION LOG with operator's name. The rolled-back version is marked `[ROLLBACK — reverted on {date}]` but kept in the file. The audit trail is never broken.

---

## PROPAGATION RULES

**When a new campaign starts (Phase 1):**
- phase-doc-setup auto-loads the latest version of every relevant library
- The state file's bootstrap variant records which library versions were loaded
- The campaign's Phase 2 (Research), Phase 3 (Ideation), Phase 4 (Creation) all reference these library versions

**When a campaign updates libraries (Phase 8):**
- phase-doc-updating proposes new versions
- The proposals appear in `## LIBRARY UPDATES PROPOSED` in 8-updating.md
- Operator approves / rejects / defers each
- On approval, library-versioning writes the new version
- The state file's DECISION LOG records: which library, which entry, vN → vN+1, source campaign, confidence

**The compounding loop:**
1. Campaign 1 uses libraries at v1.
2. Campaign 1's Phase 7 produces insights.
3. Campaign 1's Phase 8 updates libraries to v2.
4. Campaign 2 starts. Phase 1 auto-loads v2.
5. Campaign 2 produces more insights. Phase 8 updates libraries to v3.
6. ... etc.

The libraries compound. Each campaign makes the next one better.

---

## LIBRARY-SPECIFIC RULES

Each library has its own format requirements. The library-versioning skill is the format-agnostic layer; each library skill has its own content-specific rules.

| Library | Version unit | New version when |
|---------|--------------|------------------|
| `library-icp` | Per persona profile | New persona OR persona updated with validated behavior |
| `library-campaign-themes` | Per theme | Theme updated OR new theme added |
| `library-customer-journey` | Per stage | Stage's emotion/intent refined OR new stage added |
| `library-creative-strategies` | Per strategy | Strategy's mechanism refined OR new strategy added |
| `library-hook-structures` | Per hook pattern | Pattern's structure refined OR new pattern added |
| `library-channel-specs` | Per channel | Specs updated (algorithm change, format change) OR new channel added |
| `library-design-foundations` | Per design rule | Rule refined (color palette expanded, typography rule changed) |
| `library-art-direction` | Per direction | Direction's mood/style refined |
| `library-conversion-framework` | Per principle | Principle's mechanism refined |
| `library-competitive-intelligence` | Per competitor | Competitor added OR positioning updated |
| `library-creative-types` | Per type | Type's structure refined |
| `library-industry-benchmarks` | Per metric | Metric value updated with new data |
| `library-paid-acquisition-playbooks` | Per playbook | Playbook's tactic sequence updated |

The library-versioning skill enforces the format; the per-library skill (e.g. library-icp) enforces the content.

---

## PROCESS RULES

1. **Never delete an old version.** Deprecate, don't delete. The audit trail is sacred.
2. **Always tag the source campaign.** A version without a source = an orphan version = invalid.
3. **Always rate confidence.** HIGH (validated across campaigns or multi-source within one) / MEDIUM (single-source with corroboration) / LOW (single-source, single-claim, needs validation).
4. **Always update VERSION LOG.** The log is the file's index. New version → new log row → state file's DECISION LOG row.
5. **Edit in place for cosmetic fixes; new version for substantive changes.** Be honest about which is which.
6. **Rollback is operator-only.** The orchestrator never auto-rolls-back. The system proposes, the operator decides.

---

## DOWNSTREAM INTEGRATION

- **Phase 1 (Setup):** calls `library-versioning.load_libraries` to read latest versions into the campaign
- **Phase 8 (Updating):** calls `library-versioning.propose_version` to write new versions
- **State file:** `## LIBRARY VERSION LOG` section tracks which versions are in use across all campaigns
- **Dashboard:** shows the library version timeline (v1 → v2 → v3 ...) so the operator can see how the libraries are evolving

---

> **First principle:** A library without versions is a snapshot. A library with versions is memory. v2.0.0 turns every library into cross-campaign memory — the system gets smarter with every campaign.

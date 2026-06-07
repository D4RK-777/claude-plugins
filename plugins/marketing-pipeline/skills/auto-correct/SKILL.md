---
name: auto-correct
description: >
  Self-healing layer for the 8-phase marketing pipeline. Called by the orchestrator when a KILL verdict is in the auto-correctable set (citation-fail, banned-word, CTA-clarity, hook scroll-stop). Re-fires the failing wrap skill with the corrective action as guidance, updates the phase doc with the revised asset, and re-invokes gate-runner. If the re-gate SHIPs, the phase advances. If still KILLs, surface to operator. Do NOT invoke manually — only the orchestrator calls this.
---

# Auto-Correct
> **Position in pipeline:** Called by the orchestrator AFTER gate-runner produces a KILL, BEFORE the operator is prompted. The system's self-healing layer.

---

## ROLE

You are the auto-correct loop. You take a KILL'd asset, identify which wrap skill produced it, re-fire that skill with the corrective action as a new instruction, capture the revised asset, update the phase doc, and return. The orchestrator then re-runs the gate on the updated phase doc.

You are mechanical. You don't make creative decisions. You apply the corrective action to the asset and let the wrap skill re-do the work.

---

## WHEN TO INVOKE

The orchestrator calls you when:
- `--auto-correct` flag is set on `/run-phase` or `/run-campaign`
- Gate-runner produced a KILL verdict
- The KILL is in the auto-correctable set (see gate-runner SKILL.md "AUTO-CORRECT" section)

You do NOT fire on:
- Subjective KILLs (stress-test, funnel-audit, brand voice, competitive-fit) — those go to the operator
- Phase 5 (Implementation) KILLs — always operator
- Re-correct attempts > 2 per asset — that goes to the operator

---

## INPUTS REQUIRED

For every call:
- The phase doc path
- The asset_id of the failing asset
- The corrective_action (from the gate-runner verdict)
- The original wrap skill name (e.g. `copywriter`, `hook-creative-generator`, `lp-copy-generator`)
- The current attempt number (1 or 2; >2 → refuse and surface to operator)

---

## PROCESS

### Step 1: Verify auto-correct is allowed

- Check the attempt number. If > 2, refuse and return: `{status: 'refused', reason: 'max attempts exceeded', surface_to: 'operator'}`
- Check the KILL type is in the correctable set. If not, refuse and return: `{status: 'refused', reason: 'KILL type not auto-correctable', surface_to: 'operator'}`

### Step 2: Re-fire the wrap skill

Invoke the named wrap skill with:
- The original asset (so the skill knows what to revise)
- The corrective_action as a new instruction (so the skill knows what to fix)
- The phase doc context (so the skill knows the campaign state)
- The research findings index from 2-research.md (for citation corrections)
- The brand.hard_nos from 1-setup.md (for banned-word corrections)

**Example invocation (banned-word KILL on ad-v2):**
```
Invoke copywriter with:
  original_asset: {the ad-v2 copy}
  corrective_action: "Remove banned words: 'guaranteed', 'best-in-class', 'effortless'. Replace with concrete, specific, brand-voice-aligned alternatives. Keep the hook and CTA structure intact."
  brand_hard_nos: [the list from 1-setup.md]
  campaign_context: {the campaign state, target audience, channel}
```

**Example invocation (citation-fail KILL on hook-1):**
```
Invoke hook-creative-generator with:
  original_asset: {the hook-1 text}
  corrective_action: "Add research citations. Cite ≥2 RT-IDs from 2-research.md's RESEARCH FINDINGS INDEX, with a source-finding line per RT-ID explaining the choice. Per-asset-type minimum: 1+ Pain + 1+ Desire for hooks."
  research_findings: {the full RT-ID table from 2-research.md}
```

### Step 3: Capture the revised asset

The wrap skill returns a revised asset. You:
- Compare to the original (what changed?)
- Verify the corrective action was actually applied (sanity check: if the wrap skill just produced the same output, that's a fail)
- Tag the revised asset with metadata:
  ```
  REVISED via auto-correct at {ISO timestamp}
  Original: {KILL reason from gate verdict}
  Revised: {what changed}
  Wrap skill: {name}
  Attempt: {N of 2}
  ```

### Step 4: Update the phase doc

- Find the original asset block in the phase doc
- Replace the failing asset content with the revised asset
- Add the auto-correct metadata to the asset block
- Update the `## RESEARCH CITATIONS` table (if it was a citation correction)
- Update `section:gate-verdicts`: mark the asset as `auto_corrected: ✓` and clear the KILL (will be re-gated)

### Step 5: Return

Return to the orchestrator:
```json
{
  "status": "corrected",
  "asset_id": "{asset_id}",
  "wrap_skill": "{name}",
  "attempts_used": "{N of 2}",
  "changes_summary": "{one-line what changed}",
  "next_action": "re-invoke gate-runner on updated phase doc"
}
```

If the wrap skill just produced the same output (sanity check failed):
```json
{
  "status": "failed",
  "reason": "wrap skill produced identical output; corrective action not applied",
  "surface_to": "operator"
}
```

---

## OUTPUT

After a successful auto-correct:
- The phase doc has the revised asset (replacing the original)
- The `section:gate-verdicts` table has the asset marked `auto_corrected: ✓`
- The `## RESEARCH CITATIONS` table is updated (if applicable)
- The state file is updated by the orchestrator after re-gate: a new `## DECISION LOG` row reads "auto-correct applied to {asset_id} — {KILL} → {corrective action} → re-gate verdict: {SHIP / still KILL}"

The state file's audit trail is the source of truth. The state shows: original KILL, corrective action, revised asset, re-gate verdict.

---

## PROCESS RULES

1. **Never modify the corrective action.** It's the gate's verdict; you apply it as-is.
2. **Never modify research IDs or brand constraints.** You can ask the wrap skill to re-cite, but you don't change the RT-IDs themselves.
3. **Always verify the wrap skill actually applied the correction.** If it just re-emitted the same content, fail the auto-correct.
4. **Always preserve the original asset in audit trail.** Add a "REVISED via auto-correct" metadata block; don't delete the original.
5. **Max 2 attempts per asset.** After 2, surface to operator.
6. **Auto-correct is a fail-closed loop.** If anything is ambiguous, refuse and surface to operator. Don't guess.

---

## DOWNSTREAM INTEGRATION

The orchestrator calls you in this loop:
```
/run-phase {project} {N} --auto-correct
  → phase-doc-{N} writes the phase doc
  → gate-runner fires, produces KILL(s)
  → orchestrator: for each KILL in auto-correctable set, call auto-correct
  → auto-correct: re-fires wrap skill, updates phase doc, returns
  → orchestrator: re-invoke gate-runner on updated phase doc
  → if re-gate SHIP: phase advances (auto-corrected KILLs count as SHIPs)
  → if re-gate still KILL: surface to operator with full audit trail
```

The operator's experience:
```
You: /run-phase flex-shopify 4 --auto-correct
Claude: Phase 4 ran. Gate produced 1 KILL on ad-v2 (banned word "guaranteed").
        Auto-correctable. Re-firing copywriter with "remove banned words" instruction.
        ✓ Revised ad-v2. Re-gate: SHIP.
        Auto-corrected 1/1. Phase 4 ready for review.
        (You review and approve, no manual fix needed.)
```

vs. without auto-correct:
```
You: /run-phase flex-shopify 4
Claude: Phase 4 ran. Gate produced 1 KILL on ad-v2 (banned word "guaranteed").
        BLOCKED. Fix manually: edit 4-creation.md to remove "guaranteed" from ad-v2.
        Re-run /run-phase flex-shopify 4 to re-gate.
```

---

> **First principle:** A system that can fix itself is a system that scales. The operator shouldn't have to manually patch every KILL. Auto-correct handles the mechanical ones; the operator handles the creative ones. The two together = 80% of KILLs resolved without operator intervention.

---
name: design-system-architect
description: >
  Indexes available design systems, picks the right one per project (or composes a new system from components across multiple existing systems), and exposes the chosen system's tokens/components/principles to downstream creative skills. Built as a framework that auto-scans `C:\Users\chris\Designs` and `C:\Users\chris\open-design-d4rk` on first run when those folders are mounted in a Cowork session — until then operates from user-described systems or a default professional baseline. Consumes library-design-foundations as the floor. Outputs design-system-selection-[campaign].md + a system registry that persists at design-system-registry.md. Trigger on: "pick a design system", "what design system", "design language for this", "design tokens", "components", "Figma library", "compose a design system", "design direction", "visual identity for this campaign", or any decision moment where a coherent design vocabulary needs to be locked.
---

# Design System Architect
> **Position in pipeline:** Phase 6 (Design) — runs alongside lp-copy-generator + ad-image-architect. Locks the visual vocabulary so every visual asset in the campaign feels like the same brand from the same campaign from the same project.

---

## ROLE

You are the project's design system curator. Three jobs:

1. **Indexing** — know what design systems are available (in user's local folders, in connected Figma libraries, in described systems, or as fallback baselines). Maintain a registry.
2. **Selecting** — for a given campaign, pick the right system based on brand, theme, creative strategy, channel, and target buyer.
3. **Composing** — when no single system fits, intelligently combine components from multiple systems into a coherent new direction for this campaign.

You do not produce designs. You produce the design **constraints** that designers, generators (ad-image-architect, cinematic-prompt-architect), and copy skills (lp-copy-generator) work within. Constraints are what make work coherent across many assets.

---

## WHEN TO INVOKE

Trigger when:
- A new campaign needs visual direction and design vocabulary isn't yet locked
- A user mentions Canva, Figma, design tokens, components, design system, visual identity
- An existing campaign is producing visually inconsistent work and you suspect no system is declared
- A design system in Chris's folders has been updated and the registry needs a re-index

**Do NOT** run if a `design-system-selection-[campaign].md` already exists for this campaign AND the brand context hasn't changed.

---

## INPUTS REQUIRED

1. **Brand Brief** — for BRAND TRUTH (visual identity declared during intake)
2. **Theme Declaration + Creative Strategy Declaration** — heavily influence design register (a Pattern Interrupter strategy needs a different visual system than a Trust + Authenticity strategy)
3. **Persona / Character** — for aesthetic alignment with what the buyer recognizes as "for them"
4. **library-design-foundations.md** — the foundations floor
5. **library-channel-specs.md** — for the specs visual outputs must satisfy
6. **(Auto-detected if available)** local design system folders at:
   - `C:\Users\chris\Designs` — primary user assets folder
   - `C:\Users\chris\open-design-d4rk` — secondary library
7. **(Optional)** connected Figma libraries if MCP available

---

## THE REGISTRY (PERSISTENT FILE)

This skill maintains a single persistent file: `design-system-registry.md` in the Marketing folder. It is the index of every design system available to any project.

```markdown
# Design System Registry
**Last indexed:** [date]

## SYSTEMS AVAILABLE

### System: [Name]
- **Source location:** [local folder / Figma URL / Canva account / described inline]
- **Origin:** [first-party (chris-built) / third-party (open source) / hybrid]
- **Aesthetic register:** [editorial / brutalist / corporate / playful / luxury / modern-minimal / etc.]
- **Best for themes:** [list of theme names this system serves well]
- **Best for strategies:** [list of creative strategies this system serves well]
- **Brand permission notes:** [which brand archetypes can use this system credibly]
- **Component coverage:** [buttons / typography / forms / cards / layouts / illustrations / icons / etc. — what exists, what doesn't]
- **Tokens:** [core type / colour / spacing tokens — if documented]
- **Notes / gotchas:** [anything to watch out for]

### System: [Name]
[...]
```

The registry is the canonical answer to "what design vocabulary can we draw from."

---

## THE SCAN PROCESS (FIRST-RUN AND PERIODIC)

When Chris mounts `C:\Users\chris\Designs` or `C:\Users\chris\open-design-d4rk` in a Cowork session, this skill auto-runs the scan:

```
SCAN PROCEDURE:

1. List top-level directories — each is a candidate system or asset bundle
2. For each candidate:
   - Read any README, .md, .txt files for system description
   - Inventory file types (PSD, AI, SVG, PNG, JPG, FIG, .css, .scss, .tokens.json)
   - Look for design token files (tokens.json, design-tokens.json, *.tokens.*, palette files)
   - Look for component manifests (components.json, library.json)
   - Look for typography files / font files (.ttf, .otf, .woff)
   - Identify aesthetic register from visual sampling (read 5-10 image files visually if image MCP available)
3. For each system, produce a registry entry per the template above
4. Save the registry to design-system-registry.md
5. Flag systems that need more documentation (missing README, no token file, no aesthetic descriptor)
```

If the folders are not mounted, the skill prompts the user to either:
- Mount them in a future Cowork session (so the auto-scan can run)
- Describe what's in them inline (a quick paragraph per system)
- Operate on the default fallback registry (a baseline of 3-5 well-known professional design systems)

---

## THE DEFAULT FALLBACK REGISTRY

Until Chris's folders are scanned, the skill operates from this baseline of widely-known design systems that work well for marketing:

```markdown
## DEFAULT BASELINE (used until user systems are indexed)

### System: Geist (Vercel)
- Source: Open source (vercel.com/design)
- Register: Modern minimal, tech-forward, restrained
- Best for themes: Authority, Novelty, Contrarian
- Best for strategies: Trust + Authenticity, Curiosity + Cognitive
- Brand permission: Strong fit for B2B SaaS, dev tools, technical brands
- Tokens: Type (Geist Sans, Geist Mono), neutral greyscale palette, 8pt spacing grid
- Notes: Pairs well with high-contrast photography or no photography at all

### System: shadcn/ui
- Source: Open source (ui.shadcn.com)
- Register: Modern, accessible, slightly editorial
- Best for themes: Authority, Belonging, Transformation
- Best for strategies: Trust + Authenticity, Narrative + Format
- Brand permission: B2B SaaS, prosumer tools, modern web
- Tokens: Built on Tailwind tokens, Radix primitives
- Notes: Component-rich, fast to compose into marketing pages

### System: Tailwind UI
- Source: Commercial (tailwindui.com)
- Register: Polished SaaS-default
- Best for themes: Authority, Social Proof
- Best for strategies: Trust + Authenticity
- Brand permission: Standard SaaS — risk of "every other startup" if used unmodified
- Notes: Use as starting point + override with brand to differentiate

### System: Editorial Modern (custom baseline)
- Source: Inline definition (this skill)
- Register: Magazine-style, type-led, generous whitespace
- Best for themes: Status, Identity, Belonging, Authority
- Best for strategies: Trust + Authenticity, Narrative + Format
- Brand permission: Premium, design-forward brands
- Tokens: Serif headlines (Tiempos / Mercury / Caslon analog), sans body (Inter / Söhne), generous 12pt grid
- Notes: Best for premium B2B and lifestyle/luxury DTC

### System: Brutalist Minimal (custom baseline)
- Source: Inline definition (this skill)
- Register: Raw, type-aggressive, low-polish-on-purpose
- Best for themes: Contrarian, Novelty, Identity (subculture)
- Best for strategies: Visual Pattern Interrupter, Narrative + Format
- Brand permission: Brands with creative authority — risk of cringe if forced
- Tokens: System default fonts, high-contrast (black/white), tight or aggressive spacing
- Notes: Powerful when used decisively; weak when used decoratively
```

---

## THE SELECTION PROCESS (PER CAMPAIGN)

### STEP 1 — DECLARE INPUTS

```
CAMPAIGN: [name]
THEME (from theme-declaration): [...]
CREATIVE STRATEGY (from creative-strategy-declaration): [...]
PERSONA AESTHETIC SIGNALS (from persona): [...]
CHARACTER IDENTITY MARKERS (from character-profile): [...]
BRAND VISUAL TRUTH (from Brand Brief): [...]
PRIMARY CHANNEL: [...]
```

### STEP 2 — SHORTLIST FROM REGISTRY

Filter the registry by:
- Systems whose "Best for themes" includes the declared theme
- Systems whose "Best for strategies" includes the declared creative strategy
- Systems whose "Brand permission" matches the brand archetype
- Systems with adequate component coverage for the campaign's required assets

Result: 1-4 candidate systems.

### STEP 3 — DECIDE: PICK ONE OR COMPOSE

**Pick one** if a single system covers >80% of the campaign's visual needs.

**Compose from multiple** if:
- The theme + strategy combo isn't perfectly served by any single system
- The brand has a distinctive aesthetic that requires drawing from multiple sources
- Specific components (e.g., a particular illustration style or a particular type pairing) live in different systems

When composing, declare the *spine* system (the primary, providing tokens + grid + most components) and the *donor* systems (providing specific accents or components).

### STEP 4 — WRITE THE SELECTION

```
SELECTED DESIGN SYSTEM:
- Mode: [SINGLE-SYSTEM / COMPOSED]
- Spine system: [name]
- Donor systems (if composed): [list with what each provides]
- Rationale: [2-3 sentences]

DESIGN TOKENS FOR THIS CAMPAIGN:
- Type stack: [headline font / body font / mono font if needed]
- Type scale: [H1 size / H2 size / body size / caption — derived from spine system + library-design-foundations]
- Colour palette: [primary / action / neutral family / status — declared as hex values or design system token references]
- Spacing scale: [4pt or 8pt grid from spine system]
- Grid system: [12-col / 8-col / custom]
- Component vocabulary: [buttons / cards / forms / etc. — which version from which system]

AESTHETIC DECLARATION (used by ad-image-architect + cinematic-prompt-architect):
- Photography register: [editorial / documentary / product-isolated / lifestyle / brutalist / phone-shot]
- Illustration register: [if used — flat vector / hand-drawn / 3D / mixed]
- Motion register: [if applicable — restrained / energetic / glitchy / cinematic]
- Overall mood (3-5 adjectives): [...]

CONSTRAINTS (HARD):
- Hard NO visual choices (from Brand Brief): [...]
- Maximum colours per asset: [N — typically 3-5]
- Hard NO fonts: [list any forbidden families]

REFERENCE SHOTS / EXAMPLES:
[If reference images exist in user's folders or are mounted, list paths. ad-image-architect and cinematic-prompt-architect use these as visual conditioning.]
```

### STEP 5 — LOG TO CAMPAIGN STATE

Append to `campaign-state-[project].md` Decision Log:

```
- **[date]** — DECISION: Design system = [name(s)]. Mode: [single / composed]. Rationale: [one line]. Spine: [system]. See: design-system-selection-[campaign].md
```

---

## OUTPUT FORMAT — design-system-selection-[campaign].md

```markdown
# Design System Selection: [Campaign Name]
**Selected:** [date] | **Mode:** [SINGLE / COMPOSED] | **Status:** LOCKED

## SPINE SYSTEM
[Name + registry entry summary]

## DONOR SYSTEMS (if composed)
| Donor | Contributes |
|-------|-------------|
| [...] | [...] |

## DESIGN TOKENS (this campaign's vocabulary)
- Type: [...]
- Type scale: [...]
- Colour palette: [...]
- Spacing scale: [...]
- Grid: [...]
- Components: [...]

## AESTHETIC DECLARATION
- Photography register: [...]
- Illustration register: [...]
- Motion register: [...]
- Mood: [...]

## CONSTRAINTS
- Hard NOs (visual): [...]
- Max colours per asset: [...]
- Hard NO fonts: [...]

## REFERENCE / EXAMPLE PATHS
[paths from user folders if available]

## RATIONALE
[2-3 sentences — why this system / composition for this theme × strategy × persona × brand]

## DOWNSTREAM CONTRACT
Every visual-producing skill MUST:
- Open by reading this file
- Use ONLY the declared tokens (type, colour, spacing, components)
- Honour the aesthetic register declaration
- Cite this file in their own output
- Flag any deviation rather than silently choosing differently
```

---

## PROCESS RULES

1. **Index before you select.** If the registry isn't current, scan first. Selection from a stale registry produces wrong choices.

2. **Default to single-system when possible.** Composed systems require discipline. Single-system selections produce more coherent work faster.

3. **Compose only with a declared spine.** A composition without a clear spine becomes a mess. Always name the system that's providing tokens + grid + majority of components.

4. **Pull aesthetic register from theme + strategy + brand, not from preference.** "I like this look" is not selection logic.

5. **Treat library-design-foundations as the floor.** Any system selected must satisfy the 8 foundations. Systems that violate accessibility, hierarchy, or type rules fail regardless of how trendy they are.

6. **Save the registry once, update on each scan.** The registry is the persistent knowledge. The per-campaign selection file is the working artifact.

7. **Flag missing documentation aggressively.** A design system without a clear aesthetic register or component coverage is a liability. Flag in the registry so users can fill the gap.

8. **Save selection as `design-system-selection-[campaign].md`** via present_files. Append entry to campaign-state Decision Log. Pass to ad-image-architect, cinematic-prompt-architect, lp-copy-generator.

---

## DOWNSTREAM SKILL INTEGRATION

The selection file feeds:
- **ad-image-architect** — uses tokens, aesthetic register, and reference paths to compose image-generation prompts
- **cinematic-prompt-architect** — uses register + mood + reference paths for video prompts
- **lp-copy-generator** — uses design tokens for LP structure decisions; visual register affects copy register
- **campaign-reporter** — uses system + tokens for branded report templates
- **creative-interrogator** — Phase 6 (Art Direction) audits against the declared system + library-design-foundations

---

## CANVA + FIGMA INTEGRATION NOTES

Future-state integration points:

**Canva:**
- When Canva MCP is connected, the registry can index user's Canva brand kits and template categories.
- Selection can recommend specific Canva template categories that match the declared aesthetic.
- ad-image-architect can output Canva-template-ready briefs (specific template type + variable fills).

**Figma:**
- When Figma MCP is connected, the registry can index Figma libraries with component coverage.
- Selection can recommend specific Figma libraries + variants.
- Component manifests can be auto-pulled into the registry entry.
- ad-image-architect and lp-copy-generator can output Figma frame specs directly.

---

> **First principle:** A design system isn't a style sheet. It is a constraint set that makes coherent work possible at scale. Pick one. Defend the choice. Honour it across every asset. Pipelines that select design vocabulary deliberately produce campaigns that compound visually — buyers see one asset and recognise the brand on the next.

## OUTPUT CONTRACT

The phase-doc orchestrator captures this skill's output into the phase doc's `section:design-system` (Phase 4) AND saves the full selection file to disk for downstream visual skills to read.

**Target section:** `section:design-system`
**Saved file:** `{project_root}/design-system-selection-{project_slug}.md`
**Format:** markdown with YAML frontmatter
**Confidence required:** HIGH (every visual downstream depends on locked tokens)

**Required fields in the section content:**
- Selected system name (or composition with named spine)
- Design tokens (type scale, color palette, spacing scale, grid, components) — all the orchestrator needs
- Aesthetic register (photography, illustration, motion, mood)
- Constraints (hard NOs, max colors per asset, banned fonts)
- Reference paths
- Rationale (2-3 sentences)

**Required frontmatter on the saved file:**
- `system_name`, `mode` (SINGLE or COMPOSED), `status` (LOCKED), `confidence`, `last_updated`

**Hard rules:**
- Write ONLY into `section:design-system` (phase doc) and `design-system-selection-{project_slug}.md` (selection file). Do NOT touch hook, copy, or visual prompt sections.
- This is the FIRST step in Phase 4. Steps 6 (ad-image-architect) and 7 (cinematic-prompt-architect) literally cannot run without locked tokens. Do NOT skip.
- Treat `library-design-foundations` as the floor. Any system that violates accessibility, hierarchy, or type rules fails regardless of trendiness.
- Append Decision Log: `design system = [name] | design-system-architect | [one-line] | brand × theme × strategy × persona`.

# Marketing Pipeline — Structural Validation Test

Runs every check the manual audit found. Catches:
- Stale skill references (Wraps pointing to non-existent skills)
- Missing YAML frontmatter on skills or commands
- Phase docs missing required sections (When to fire, Inputs, What you do, etc.)
- Frontmatter schemas inconsistent across phase docs
- Output contracts pointing to non-existent `section:` IDs
- v1.6.x command path-discovery broken
- CHANGELOG.md missing or stale

Run from the plugin root:

```bash
node scripts/structural-test.mjs
```

Exits 0 on pass, 1 on any failure. Output is a human-readable report.

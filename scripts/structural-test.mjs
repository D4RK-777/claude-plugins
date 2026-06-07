#!/usr/bin/env node
// Marketing Pipeline — Structural Validation Test
// Catches issues the manual audit found. Run from the plugin root.

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';

const ROOT = process.cwd();
const PLUGIN = join(ROOT, 'plugins', 'marketing-pipeline');
const SKILLS_DIR = join(PLUGIN, 'skills');
const COMMANDS_DIR = join(PLUGIN, 'commands');
const TEMPLATES_DIR = join(PLUGIN, 'templates');
const ARCHIVE_DIR = join(SKILLS_DIR, 'archive');
const CHANGELOG = join(ROOT, 'CHANGELOG.md');
const PLUGIN_JSON = join(PLUGIN, '.claude-plugin', 'plugin.json');
const MARKETPLACE_JSON = join(ROOT, '.claude-plugin', 'marketplace.json');

let pass = 0, fail = 0, warn = 0;
const issues = [];

function ok(msg)   { pass++; console.log(`  \u2713 ${msg}`); }
function bad(msg)  { fail++; issues.push(msg); console.log(`  \u2717 ${msg}`); }
function note(msg) { warn++; console.log(`  \u2026 ${msg}`); }

function listSubdirs(dir, exclude = []) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(name => {
      const full = join(dir, name);
      if (!statSync(full).isDirectory()) return false;
      if (name.startsWith('.')) return false;
      if (exclude.includes(name)) return false;
      return true;
    });
}

function readFile(p) {
  if (!existsSync(p)) return null;
  // Normalize CRLF to LF so regex matches work regardless of git autocrlf
  return readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
}

function extractFrontmatter(content) {
  // Try JSON first (plugin.json + marketplace.json)
  const trimmed = content.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return null;
    }
  }
  // Try YAML (--- frontmatter)
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const fm = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let inList = false;
  for (const line of lines) {
    if (line.match(/^[\s-]+-\s/)) {
      if (currentKey && inList) {
        const v = line.replace(/^[\s-]+-\s/, '').trim();
        if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
        fm[currentKey].push(v);
      }
    } else {
      const kv = line.match(/^([\w_-]+):\s*(.*)$/);
      if (kv) {
        currentKey = kv[1];
        let v = kv[2].trim();
        if (v === '[]') v = [];
        else if (v === 'null' || v === '~') v = null;
        else if (v === 'true') v = true;
        else if (v === 'false') v = false;
        else if (!isNaN(parseFloat(v)) && v.match(/^-?\d+(\.\d+)?$/)) v = parseFloat(v);
        else v = v.replace(/^["']|["']$/g, '');
        fm[currentKey] = v;
        inList = (v === []);
      }
    }
  }
  return fm;
}

function extractWraps(content) {
  const m = content.match(/## Wraps\n+([\s\S]*?)(?=\n## |\n$)/);
  if (!m) return [];
  const lines = m[1].split('\n');
  return lines
    .filter(l => l.match(/^[\s-]+/))
    .map(l => l.replace(/^[\s-]+/, '').trim())
    .filter(l => l && !l.startsWith('~'))
    .map(l => l.replace(/\(.*\)$/, '').trim().replace(/\.md$/, '').replace(/-SKILL\.md$/, ''))
    .filter(l => l.match(/^[a-z][a-z0-9-]+$/));
}

function extractOutputContract(content) {
  const m = content.match(/## OUTPUT CONTRACT\n+([\s\S]*?)(?=\n## |\n$)/);
  if (!m) return null;
  return m[1];
}

function extractTargetSection(contract) {
  if (!contract) return null;
  // Standard singular: "**Target section:** `section:xxx`"
  const m1 = contract.match(/\*\*Target section:\*\*\s*`?(section:[a-z0-9-]+)`?/);
  if (m1) return m1[1];
  // Plural: "**Target sections:** ..." — check specific tokens FIRST to avoid the [A-Z_]+ greedy match
  const m2 = contract.match(/\*\*Target sections:\*\*\s*(NONE OWNED|INLINE EDITS|MULTI)/i);
  if (m2) {
    return m2[1].toUpperCase().replace(/\s+/g, '_');
  }
  // Plural: "**Target sections:** `section:xxx`, `section:yyy`" — multi-target
  const m2b = contract.match(/\*\*Target sections:\*\*\s*((?:`section:[a-z0-9-]+`(?:\s*,\s*)?)+)/i);
  if (m2b) return m2b[1].trim();
  // Plural: "**Target sections:** N sections in Phase N phase doc" — broad contract
  const m2c = contract.match(/\*\*Target sections:\*\*\s*(\d+\s+sections?\s+in\s+Phase\s+\d+)/i);
  if (m2c) return m2c[1].trim();
  // Also accept: "writes to `section:xxx`"
  const m3 = contract.match(/writes?\s+(?:only\s+)?(?:to\s+)?`?(section:[a-z0-9-]+)`?/i);
  if (m3) return m3[1];
  return null;
}

console.log('\n=== Marketing Pipeline Structural Validation ===\n');

// ---------- 1. Plugin manifest checks ----------
console.log('1. Plugin manifest');
if (!existsSync(PLUGIN_JSON)) bad('plugin.json missing'); else {
  const fm = extractFrontmatter(readFile(PLUGIN_JSON));
  if (!fm.name) bad('plugin.json missing name'); else ok(`plugin.json: name=${fm.name}`);
  if (!fm.version) bad('plugin.json missing version'); else ok(`plugin.json: version=${fm.version}`);
}
if (!existsSync(MARKETPLACE_JSON)) bad('marketplace.json missing'); else {
  const fm = extractFrontmatter(readFile(MARKETPLACE_JSON));
  if (!fm.plugins || !Array.isArray(fm.plugins)) bad('marketplace.json missing plugins array'); else ok(`marketplace.json: ${fm.plugins.length} plugin(s)`);
}

// ---------- 2. CHANGELOG checks ----------
console.log('\n2. CHANGELOG.md');
if (!existsSync(CHANGELOG)) bad('CHANGELOG.md missing at plugin root'); else {
  const content = readFile(CHANGELOG);
  const versionMatches = content.match(/##\s*v(\d+\.\d+\.\d+)/g) || [];
  ok(`CHANGELOG.md exists with ${versionMatches.length} version entries`);
  const pluginVer = extractFrontmatter(readFile(PLUGIN_JSON))?.version;
  const changelogHas = versionMatches.some(m => m.includes(pluginVer));
  if (pluginVer && !changelogHas) bad(`CHANGELOG.md missing entry for current version v${pluginVer}`);
  else if (pluginVer) ok(`CHANGELOG.md has entry for v${pluginVer}`);
}

// ---------- 3. Skill YAML frontmatter ----------
console.log('\n3. Skill YAML frontmatter');
const skillDirs = listSubdirs(SKILLS_DIR, ['archive']);
const allSkillNames = new Set();
for (const dir of skillDirs) {
  const path = join(SKILLS_DIR, dir, 'SKILL.md');
  const content = readFile(path);
  if (!content) { bad(`${dir}/SKILL.md missing`); continue; }
  const fm = extractFrontmatter(content);
  if (!fm) { bad(`${dir}/SKILL.md missing YAML frontmatter`); continue; }
  if (!fm.name) { bad(`${dir}/SKILL.md frontmatter missing 'name'`); continue; }
  if (fm.name !== dir) bad(`${dir}/SKILL.md name='${fm.name}' mismatches directory`);
  if (!fm.description) { bad(`${dir}/SKILL.md frontmatter missing 'description'`); continue; }
  ok(`${dir}/SKILL.md: name=${fm.name}`);
  allSkillNames.add(fm.name);
}
note(`${skillDirs.length} active skills in skills/ (archive excluded)`);

// ---------- 4. Command YAML frontmatter ----------
console.log('\n4. Command YAML frontmatter');
const commandFiles = existsSync(COMMANDS_DIR) ? readdirSync(COMMANDS_DIR).filter(f => f.endsWith('.md')) : [];
for (const f of commandFiles) {
  const path = join(COMMANDS_DIR, f);
  const content = readFile(path);
  if (!content) { bad(`${f} missing`); continue; }
  const fm = extractFrontmatter(content);
  if (!fm) { bad(`${f} missing YAML frontmatter`); continue; }
  if (!fm.description) { bad(`${f} frontmatter missing 'description'`); continue; }
  ok(`${f}: description present`);
}

// ---------- 5. Phase doc structural checks ----------
console.log('\n5. Phase doc structure (8 phases)');
const phaseDocNames = ['setup', 'research', 'ideation', 'creation', 'implementation', 'reporting', 'learning', 'updating'];
const requiredSections = ['When to fire', 'Pre-conditions', 'Inputs', 'Required sections', 'Hard rules', 'Frontmatter', 'Pre-emit validation', 'Wraps'];
for (const block of phaseDocNames) {
  const path = join(SKILLS_DIR, `phase-doc-${block}`, 'SKILL.md');
  const content = readFile(path);
  if (!content) { bad(`phase-doc-${block}/SKILL.md missing`); continue; }
  for (const section of requiredSections) {
    if (!content.includes(`## ${section}`)) {
      bad(`phase-doc-${block} missing section: ## ${section}`);
    }
  }
  ok(`phase-doc-${block} has all 8 required sections`);
}

// ---------- 6. Wraps cross-reference ----------
console.log('\n6. Wraps cross-reference (Wraps must point to real skills)');
for (const block of phaseDocNames) {
  const path = join(SKILLS_DIR, `phase-doc-${block}`, 'SKILL.md');
  const content = readFile(path);
  if (!content) continue;
  const wraps = extractWraps(content);
  for (const w of wraps) {
    if (allSkillNames.has(w)) continue;
    if (w.startsWith('library-')) continue;
    if (w === 'WebSearch' || w === 'WebFetch' || w === 'Bash' || w === 'Read' || w === 'Write' || w === 'Glob' || w === 'Grep' || w === 'AskUserQuestion' || w === 'Task' || w === 'WebSearch tool' || w === 'WebFetch tool') continue;
    if (w.endsWith(' tool')) continue;
    if (w.includes('snapshot') || w.includes('semantic') || w.includes('protocol') || w.includes('semantics')) continue;
    bad(`phase-doc-${block} Wraps references non-existent skill: "${w}"`);
  }
  if (wraps.length > 0) ok(`phase-doc-${block} Wraps: ${wraps.length} ref(s) (${wraps.filter(w => allSkillNames.has(w)).length} valid)`);
}

// ---------- 7. Output contract target sections ----------
console.log('\n7. Output contracts on wrapped skills (target section: section:ID or INLINE/NONE)');
const wrappedSkills = [
  'theme-selector', 'icp-persona-engine', 'icp-character-builder', 'creative-strategy-selector', 'positioning-engine',
  'design-system-architect', 'hook-creative-generator', 'creative-expert', 'paid-ads-expert',
  'lp-copy-generator', 'email-sequence-from-character', 'ad-image-architect', 'cinematic-prompt-architect',
  'copywriter', 'master-wordsmith', 'expert-communicator', 'caption-expert', 'seo-content-engine', 'apify-pain-research',
  'creative-interrogator', 'persona-stress-test', 'funnel-audit',
  'campaign-forecaster', 'audience-architect', 'retargeting-cascade', 'gtm-document-builder', 'retention-engine',
  'campaign-reporter', 'data-analyst', 'feedback-loop-back',
];
for (const skill of wrappedSkills) {
  const path = join(SKILLS_DIR, skill, 'SKILL.md');
  const content = readFile(path);
  if (!content) { note(`wrapped skill ${skill} not in skills/`); continue; }
  const contract = extractOutputContract(content);
  if (!contract) { bad(`wrapped skill ${skill} has NO OUTPUT CONTRACT`); continue; }
  const target = extractTargetSection(contract);
  if (!target) { bad(`wrapped skill ${skill} contract missing "**Target section:**" or "**Target sections:** INLINE EDITS / NONE OWNED"`); continue; }
  ok(`${skill} → ${target}`);
}

// ---------- 8. Frontmatter schema consistency across phase docs ----------
console.log('\n8. Phase doc frontmatter schema (canonical v1.5.0)');
const requiredFrontmatter = ['phase', 'block_id', 'brand_slug', 'brand_display_name', 'project_slug', 'project_display_name', 'status', 'confidence_overall', 'human_attention_required', 'schema_version', 'upstream_phases_consumed', 'brand_libraries_loaded', 'sources_consumed', 'created_at', 'last_updated', 'approved_at', 'approved_by'];
for (const block of phaseDocNames) {
  const path = join(SKILLS_DIR, `phase-doc-${block}`, 'SKILL.md');
  const content = readFile(path);
  if (!content) continue;
  const fmMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
  if (!fmMatch) { bad(`phase-doc-${block} has no YAML frontmatter example`); continue; }
  const example = fmMatch[1];
  for (const field of requiredFrontmatter) {
    if (!example.match(new RegExp(`^${field}:`, 'm'))) {
      bad(`phase-doc-${block} frontmatter example missing: ${field}`);
    }
  }
  ok(`phase-doc-${block} frontmatter example has all ${requiredFrontmatter.length} canonical fields`);
}

// ---------- 9. v1.6.x command path discovery ----------
console.log('\n9. /what-changed path discovery');
const wcPath = join(COMMANDS_DIR, 'what-changed.md');
const wcContent = readFile(wcPath);
if (!wcContent) bad('/what-changed command missing');
else {
  if (!wcContent.includes('{marketing_root}/.plugin-version')) bad('/what-changed does not read from {marketing_root}/.plugin-version');
  else ok('/what-changed reads from {marketing_root}/.plugin-version');
  if (!wcContent.includes('{marketing_root}/CHANGELOG.md')) bad('/what-changed does not read from {marketing_root}/CHANGELOG.md');
  else ok('/what-changed reads from {marketing_root}/CHANGELOG.md');
  if (!wcContent.includes('{marketing_root}/.last-seen-version')) bad('/what-changed does not write .last-seen-version');
  else ok('/what-changed writes {marketing_root}/.last-seen-version');
  // Only flag ACTIVE use of "plugin install path" — not a hard rule against it
  const activePluginInstallRefs = wcContent.split('\n').filter(line => {
    if (!line.includes('plugin install path') && !line.includes('plugin install location')) return false;
    // Skip lines that are explicitly prohibitive (Don't, Never, No, Do not — also after **bold** markers)
    return !/^\s*[\*\-]?\s*(\*\*)?(Don't|Never|No|Do not)\b/i.test(line);
  });
  if (activePluginInstallRefs.length > 0) {
    bad(`/what-changed actively references plugin install path (line: "${activePluginInstallRefs[0].trim().substring(0, 80)}")`);
  } else {
    ok('/what-changed does not actively reference plugin install path');
  }
}

console.log('\n10. /install-marketing-command-center writes CHANGELOG + version');
const smccPath = join(SKILLS_DIR, 'setup-marketing-command-center', 'SKILL.md');
const smccContent = readFile(smccPath);
if (!smccContent) bad('setup-marketing-command-center missing');
else {
  if (!smccContent.includes('CHANGELOG.md')) bad('setup-marketing-command-center does not write CHANGELOG.md to marketing folder');
  else ok('setup-marketing-command-center writes CHANGELOG.md to marketing folder');
  if (!smccContent.includes('.plugin-version')) bad('setup-marketing-command-center does not write .plugin-version to marketing folder');
  else ok('setup-marketing-command-center writes .plugin-version to marketing folder');
}

// ---------- 11. Dashboard has Terminal commands section ----------
console.log('\n11. Dashboard surfaces terminal commands');
const dashPath = join(TEMPLATES_DIR, 'operator-dashboard.html');
const dashContent = readFile(dashPath);
if (!dashContent) bad('operator-dashboard.html missing');
else {
  if (!dashContent.includes('Terminal commands') && !dashContent.includes('terminal commands')) {
    bad('Dashboard does not surface terminal commands anywhere');
  } else {
    ok('Dashboard has a Terminal commands section');
  }
  const expectedCmds = ['/pending-review', '/phase-status', '/what-changed'];
  for (const cmd of expectedCmds) {
    if (!dashContent.includes(cmd)) bad(`Dashboard does not mention ${cmd}`);
    else ok(`Dashboard mentions ${cmd}`);
  }
}

// ---------- 12. Archived skills ----------
console.log('\n12. Archived skills have deprecation banners');
if (!existsSync(ARCHIVE_DIR)) {
  note('No archive/ directory');
} else {
  const archived = readdirSync(ARCHIVE_DIR).filter(n => statSync(join(ARCHIVE_DIR, n)).isDirectory());
  for (const a of archived) {
    const path = join(ARCHIVE_DIR, a, 'SKILL.md');
    const content = readFile(path);
    if (!content) { bad(`archived ${a}/SKILL.md missing`); continue; }
    if (!content.includes('DEPRECATED')) bad(`archived ${a} missing DEPRECATED banner`);
    else ok(`archived ${a} has DEPRECATED banner`);
  }
}

// ---------- 13. Triple Gate aggregation rule (v1.7.0) ----------
console.log('\n13. Triple Gate aggregation rule (v1.7.0)');
const implPath = join(SKILLS_DIR, 'phase-doc-implementation', 'SKILL.md');
const implContent = readFile(implPath);
if (!implContent) bad('phase-doc-implementation/SKILL.md missing');
else {
  if (!implContent.includes('## Triple Gate aggregation rule')) {
    bad('phase-doc-implementation missing "## Triple Gate aggregation rule" section');
  } else {
    ok('phase-doc-implementation has "## Triple Gate aggregation rule" section');
  }
  // Verify the rule defines all 3 critical cases
  const requiredCases = [
    { pattern: /3\/3\s+DIFFERENT.*KILL/i, name: '3/3 different → KILL' },
    { pattern: /2\/3.*dissent|dissent.*flag/i, name: '2/3 + dissent flag' },
    { pattern: /any KILL.*KILL|any.*KILL.*\u2192.*KILL/i, name: 'any KILL → KILL' },
    { pattern: /lowest.*wins/i, name: 'lowest-wins fallback' },
  ];
  for (const c of requiredCases) {
    if (!c.pattern.test(implContent)) bad(`aggregation rule missing case: ${c.name}`);
    else ok(`aggregation rule covers: ${c.name}`);
  }
  // Verify the required section:gate-aggregation is added
  if (!implContent.includes('section:gate-aggregation')) {
    bad('phase-doc-implementation does not require section:gate-aggregation');
  } else {
    ok('phase-doc-implementation requires section:gate-aggregation');
  }
  // Verify pre-emit validation #16 mentions the aggregation rule
  if (!implContent.match(/16\.\s*.*aggregation rule/)) {
    bad('pre-emit validation does not include aggregation rule check #16');
  } else {
    ok('pre-emit validation includes aggregation rule check #16');
  }
}

// ---------- 14. Seed-list consistency (v1.7.1) ----------
console.log('\n14. Seed-list consistency (v1.7.1) — every Seeds-for-next-phase block must say WHAT it produces and WHERE');
// Common typo / consistency issues found in v1.7.0 walk-through
const typoPatterns = [
  { name: 'positioningstatement (no underscore, typo)', pattern: /\bpositioningstatement\b/, severity: 'HIGH' },
  { name: 'pain.themes (Phase 1 says it produces this — false, Phase 2 does)', pattern: /pain\.themes/, file: 'phase-doc-setup', severity: 'MEDIUM' },
  { name: 'audience_signals[] (Phase 2 says it produces this — false, lives in section:customer-truth)', pattern: /\baudience_signals\b/, file: 'phase-doc-research', severity: 'MEDIUM' },
];
for (const t of typoPatterns) {
  // Default: scan all phase docs
  const filesToScan = t.file
    ? [join(SKILLS_DIR, t.file, 'SKILL.md')]
    : phaseDocNames.map(b => join(SKILLS_DIR, `phase-doc-${b}`, 'SKILL.md'));
  let found = false;
  for (const f of filesToScan) {
    const c = readFile(f);
    if (c && t.pattern.test(c)) {
      const where = basename(dirname(f));
      if (t.severity === 'HIGH') {
        bad(`typo "${t.name}" found in phase-doc-${where}/SKILL.md`);
      } else {
        bad(`stale seed "${t.name}" found in phase-doc-${where}/SKILL.md — reword to point at the actual section that produces it`);
      }
      found = true;
    }
  }
  if (!found) ok(`no "${t.name}" typos found`);
}

// ---------- 15. campaign-state call in every phase-doc (v1.7.2) ----------
console.log('\n15. campaign-state call in every phase-doc (v1.7.2) — mandatory final step of every phase emission');
for (const b of phaseDocNames) {
  const f = join(SKILLS_DIR, `phase-doc-${b}`, 'SKILL.md');
  const c = readFile(f);
  if (!c) {
    bad(`phase-doc-${b}/SKILL.md not found`);
    continue;
  }
  if (!c.match(/## Update campaign-state \(mandatory final step/)) {
    bad(`phase-doc-${b}/SKILL.md missing "## Update campaign-state (mandatory final step)" section`);
  } else if (!c.match(/At the end of every phase-doc emission, call `?campaign-state`?/)) {
    bad(`phase-doc-${b}/SKILL.md "Update campaign-state" section missing the universal call intro line`);
  } else if (!c.match(/`?campaign-state`? then:/)) {
    bad(`phase-doc-${b}/SKILL.md "Update campaign-state" section missing the state-side-effect list`);
  } else {
    ok(`phase-doc-${b}/SKILL.md has mandatory campaign-state call`);
  }
}

// ---------- 16. Orchestrator + gate-runner components (v1.8.0) ----------
console.log('\n16. Orchestrator + gate-runner components (v1.8.0) — commands + skill exist with the right contracts');

// gate-runner skill must exist with phase-specific gates + Triple Gate aggregation rule
const gateRunnerPath = join(SKILLS_DIR, 'gate-runner', 'SKILL.md');
const gateRunnerContent = readFile(gateRunnerPath);
if (!gateRunnerContent) {
  bad('gate-runner/SKILL.md not found');
} else {
  if (!gateRunnerContent.match(/Triple Gate aggregation rule/i)) {
    bad('gate-runner/SKILL.md missing "Triple Gate aggregation rule" section');
  } else if (!gateRunnerContent.match(/any KILL.*KILL.*overrides|Any gate = KILL/)) {
    bad('gate-runner/SKILL.md missing the "any KILL = KILL" rule explicitly');
  } else if (!gateRunnerContent.match(/3\/3 different.*KILL|3\/3 different verdicts/)) {
    bad('gate-runner/SKILL.md missing the "3/3 different = KILL" rule');
  } else if (!gateRunnerContent.match(/lowest wins|lowest-wins|worst case is the verdict/)) {
    bad('gate-runner/SKILL.md missing the "lowest wins" rule');
  } else if (!gateRunnerContent.match(/## PHASE-SPECIFIC GATES|### Phase 1.*Setup|Phase 1 — Setup/)) {
    bad('gate-runner/SKILL.md missing per-phase gate definitions');
  } else {
    ok('gate-runner/SKILL.md has Triple Gate rule + per-phase gates');
  }
}

// /next command must exist with the decision tree
const nextCmdPath = join(COMMANDS_DIR, 'next.md');
const nextCmdContent = readFile(nextCmdPath);
if (!nextCmdContent) {
  bad('commands/next.md not found');
} else {
  if (!nextCmdContent.match(/Decision tree/)) {
    bad('commands/next.md missing "Decision tree" section');
  } else if (!nextCmdContent.match(/No state file|START NEW CAMPAIGN/)) {
    bad('commands/next.md missing the "no state file" branch in the decision tree');
  } else if (!nextCmdContent.match(/BLOCKED|FIX KILL/)) {
    bad('commands/next.md missing the "KILL/BLOCKED" branch in the decision tree');
  } else if (!nextCmdContent.match(/CLOSED|CAMPAIGN CLOSED/)) {
    bad('commands/next.md missing the "campaign closed" branch in the decision tree');
  } else {
    ok('commands/next.md has the orchestrator decision tree');
  }
}

// /run-phase command must enforce gate-runner invocation + KILL blocking
const runPhaseCmdPath = join(COMMANDS_DIR, 'run-phase.md');
const runPhaseCmdContent = readFile(runPhaseCmdPath);
if (!runPhaseCmdContent) {
  bad('commands/run-phase.md not found');
} else {
  if (!runPhaseCmdContent.match(/gate-runner/)) {
    bad('commands/run-phase.md does not reference gate-runner');
  } else if (!runPhaseCmdContent.match(/NEVER advance past a KILL|never advance past a KILL/)) {
    bad('commands/run-phase.md missing the "never advance past a KILL" hard rule');
  } else if (!runPhaseCmdContent.match(/NEVER skip the gate-runner|never skip the gate/)) {
    bad('commands/run-phase.md missing the "never skip the gate" hard rule');
  } else {
    ok('commands/run-phase.md enforces gate-runner + KILL blocking');
  }
}

// /run-campaign command must loop + pause at every gate
const runCampaignCmdPath = join(COMMANDS_DIR, 'run-campaign.md');
const runCampaignCmdContent = readFile(runCampaignCmdPath);
if (!runCampaignCmdContent) {
  bad('commands/run-campaign.md not found');
} else {
  if (!runCampaignCmdContent.match(/Loop from the current phase|loop from/i)) {
    bad('commands/run-campaign.md missing the loop logic');
  } else if (!runCampaignCmdContent.match(/PAUSED|WAIT for operator/)) {
    bad('commands/run-campaign.md missing the "pause at every gate" logic');
  } else if (!runCampaignCmdContent.match(/Never bypass a KILL|NEVER bypass a KILL/)) {
    bad('commands/run-campaign.md missing the "never bypass KILL" rule');
  } else {
    ok('commands/run-campaign.md has the autopilot loop with mandatory pauses');
  }
}

// campaign-state skill must define NEXT ACTION + GATE-RUNNER WRITES
const campaignStateContent = readFile(join(SKILLS_DIR, 'campaign-state', 'SKILL.md'));
if (!campaignStateContent.match(/## NEXT ACTION|NEXT ACTION \(computed/)) {
  bad('campaign-state/SKILL.md missing "## NEXT ACTION" section');
} else {
  ok('campaign-state/SKILL.md has NEXT ACTION section');
}
if (!campaignStateContent.match(/## GATE-RUNNER WRITES|GATE-RUNNER WRITES/)) {
  bad('campaign-state/SKILL.md missing "## GATE-RUNNER WRITES" section');
} else {
  ok('campaign-state/SKILL.md has GATE-RUNNER WRITES section');
}

// ---------- 17. Research lineage + auto-correct (v1.9.0) ----------
console.log('\n17. Research lineage + auto-correct (v1.9.0) — citations + self-healing');

// phase-doc-research must define RT-ID format
const phaseDocResearchContent = readFile(join(SKILLS_DIR, 'phase-doc-research', 'SKILL.md'));
if (!phaseDocResearchContent.match(/Research Findings Index|RT-\d{3}|RT-ID/)) {
  bad('phase-doc-research/SKILL.md missing Research Findings Index / RT-ID format');
} else {
  ok('phase-doc-research/SKILL.md has Research Findings Index with RT-IDs');
}

// phase-doc-creation must require citations per asset
const phaseDocCreationContent = readFile(join(SKILLS_DIR, 'phase-doc-creation', 'SKILL.md'));
if (!phaseDocCreationContent.match(/Research Citations.*mandatory|Cites:.*RT-\d{3}/)) {
  bad('phase-doc-creation/SKILL.md missing Research Citations / per-asset Cites field');
} else if (!phaseDocCreationContent.match(/Minimum 2 citations|cite-fail/)) {
  bad('phase-doc-creation/SKILL.md missing the "min 2 citations" rule');
} else {
  ok('phase-doc-creation/SKILL.md requires research citations per asset');
}

// gate-runner must check citations + have AUTO-CORRECT section
const gateRunnerV190Content = readFile(join(SKILLS_DIR, 'gate-runner', 'SKILL.md'));
if (!gateRunnerV190Content.match(/Citation KILL rule|cite-fail/)) {
  bad('gate-runner/SKILL.md missing Citation KILL rule');
} else {
  ok('gate-runner/SKILL.md has Citation KILL rule');
}
if (!gateRunnerV190Content.match(/## AUTO-CORRECT|AUTO-CORRECT \(v1\.9\.0\)/)) {
  bad('gate-runner/SKILL.md missing AUTO-CORRECT section');
} else {
  ok('gate-runner/SKILL.md has AUTO-CORRECT section');
}

// auto-correct skill must exist with the right process
const autoCorrectContent = readFile(join(SKILLS_DIR, 'auto-correct', 'SKILL.md'));
if (!autoCorrectContent) {
  bad('auto-correct/SKILL.md not found');
} else if (!autoCorrectContent.match(/Max 2 attempts|attempts_used/)) {
  bad('auto-correct/SKILL.md missing the max-attempts rule');
} else if (!autoCorrectContent.match(/correctable set|citation-fail|banned-word/)) {
  bad('auto-correct/SKILL.md missing the correctable-KILL set');
} else if (!autoCorrectContent.match(/Re-fire the wrap skill|re-fires the wrap skill/)) {
  bad('auto-correct/SKILL.md missing the re-fire wrap skill process');
} else {
  ok('auto-correct/SKILL.md has full self-healing process');
}

// /run-phase must wire --auto-correct (not the v1.8.0 stub)
const runPhaseContent = readFile(join(COMMANDS_DIR, 'run-phase.md'));
if (runPhaseContent.match(/v1\.8\.0 stub/)) {
  bad('commands/run-phase.md still has the v1.8.0 auto-correct stub — must be updated to v1.9.0 behavior');
} else if (!runPhaseContent.match(/--auto-correct.*v1\.9\.0|auto-correct.*skill/i)) {
  bad('commands/run-phase.md does not document the v1.9.0 --auto-correct wiring');
} else {
  ok('commands/run-phase.md wires --auto-correct via auto-correct skill');
}

// ---------- 18. Library versioning + /duplicate-campaign (v2.0.0) ----------
console.log('\n18. Library versioning + /duplicate-campaign (v2.0.0) — cross-campaign memory + repeat campaigns');

// library-versioning skill must exist with version format
const libVerContent = readFile(join(SKILLS_DIR, 'library-versioning', 'SKILL.md'));
if (!libVerContent) {
  bad('library-versioning/SKILL.md not found');
} else if (!libVerContent.match(/## VERSION LOG|VERSION LOG format/)) {
  bad('library-versioning/SKILL.md missing VERSION LOG format');
} else if (!libVerContent.match(/propose_version|load_libraries/)) {
  bad('library-versioning/SKILL.md missing the read/write operations');
} else if (!libVerContent.match(/Never delete an old version|deprecate, don.t delete/)) {
  bad('library-versioning/SKILL.md missing the "deprecate, don\'t delete" rule');
} else {
  ok('library-versioning/SKILL.md has version format + read/write + deprecation rules');
}

// phase-doc-setup must auto-load latest library versions
const phaseDocSetupContent = readFile(join(SKILLS_DIR, 'phase-doc-setup', 'SKILL.md'));
if (!phaseDocSetupContent.match(/Library version auto-load|library-versioning\.load_libraries|load the LATEST version/)) {
  bad('phase-doc-setup/SKILL.md missing library version auto-load (v2.0.0)');
} else {
  ok('phase-doc-setup/SKILL.md auto-loads latest library versions');
}

// phase-doc-updating must write new versions (not just footnotes)
const phaseDocUpdatingContent = readFile(join(SKILLS_DIR, 'phase-doc-updating', 'SKILL.md'));
if (!phaseDocUpdatingContent.match(/library-versioning\.propose_version|propose_version/)) {
  bad('phase-doc-updating/SKILL.md missing library-versioning.propose_version call');
} else if (!phaseDocUpdatingContent.match(/v2\.0\.0.*version|new version, not a footnote/)) {
  bad('phase-doc-updating/SKILL.md missing the "new version, not a footnote" rule');
} else {
  ok('phase-doc-updating/SKILL.md writes new library versions via library-versioning');
}

// /duplicate-campaign command must exist
const dupCampaignContent = readFile(join(COMMANDS_DIR, 'duplicate-campaign.md'));
if (!dupCampaignContent) {
  bad('commands/duplicate-campaign.md not found');
} else if (!dupCampaignContent.match(/--from-campaign|--use-library-versions|--reset-decisions/)) {
  bad('commands/duplicate-campaign.md missing flags');
} else if (!dupCampaignContent.match(/Never overwrite|NEVER overwrite/)) {
  bad('commands/duplicate-campaign.md missing the "never overwrite" rule');
} else if (!dupCampaignContent.match(/8 phase docs|phase docs.*copied/)) {
  bad('commands/duplicate-campaign.md missing the copy-process');
} else {
  ok('commands/duplicate-campaign.md has full copy process with flags');
}

// ---------- Summary ----------
console.log('\n=== Summary ===');
console.log(`  \u2713 Passed:   ${pass}`);
console.log(`  \u2717 Failed:  ${fail}`);
console.log(`  \u2026 Warnings: ${warn}`);

if (fail > 0) {
  console.log('\n=== Issues ===');
  for (const i of issues) console.log(`  - ${i}`);
  process.exit(1);
}

console.log('\nAll structural checks passed.');
process.exit(0);

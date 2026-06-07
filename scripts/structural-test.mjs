#!/usr/bin/env node
// Marketing Pipeline — Structural Validation Test
// Catches issues the manual audit found. Run from the plugin root.

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, basename } from 'path';

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

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, 'docs/features/REGISTRY.md');

function fail(msg) {
  console.error(`✗ check-registry: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(REGISTRY_PATH)) {
  fail(`registry file missing at ${REGISTRY_PATH}`);
}

const content = fs.readFileSync(REGISTRY_PATH, 'utf8');

const protectedMatch = content.match(/## Protected\s+([\s\S]*?)\n## /);
if (!protectedMatch) {
  fail('could not locate "## Protected" section');
}
const protectedSection = protectedMatch[1];

const implMatch = content.match(/## Protected Implementations\s+([\s\S]*?)\n## /);
if (!implMatch) {
  fail('could not locate "## Protected Implementations" section');
}
const implSection = implMatch[1];

const pathRegex = /`([^`]+\.(?:spec|test)\.tsx?)`/g;
const e2ePaths = [];
let m;
while ((m = pathRegex.exec(protectedSection)) !== null) {
  e2ePaths.push(m[1]);
}

if (e2ePaths.length === 0) {
  fail('no E2E paths found in Protected section');
}

const missingE2E = e2ePaths.filter((p) => !fs.existsSync(path.join(ROOT, p)));
if (missingE2E.length > 0) {
  console.error('✗ check-registry: Protected E2E files are missing:');
  for (const p of missingE2E) console.error(`    ${p}`);
  process.exit(1);
}

function parseTableRows(sectionText) {
  const lines = sectionText.split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.trim().startsWith('|')) continue;
    const parts = line.split('|').map((p) => p.trim()).filter(Boolean);
    if (
      parts.length >= 2 &&
      !parts[0].includes('---') &&
      !parts[0].toLowerCase().includes('feature')
    ) {
      rows.push(parts);
    }
  }
  return rows;
}

const protectedRows = parseTableRows(protectedSection);
const protectedFeatures = protectedRows.map((r) => r[0]);
const implRows = parseTableRows(implSection);
const implFeatures = implRows.map((r) => r[0]);

const missingImplRows = protectedFeatures.filter((f) => !implFeatures.includes(f));
if (missingImplRows.length > 0) {
  fail(`Protected features missing rows in Protected Implementations: ${missingImplRows.join(', ')}`);
}

let verifiedSourceCount = 0;

for (const row of implRows) {
  const featureName = row[0];
  const sourceFilesCol = row[1] || '';
  const migrationCol = row[2] || '';
  const rowText = row.join(' | ');

  if (rowText.includes('NEEDS CONFIRMATION')) continue;

  const files = sourceFilesCol
    .split(/,+/)
    .map((s) => s.trim().replace(/^`|`$/g, ''))
    .filter(Boolean);

  for (const file of files) {
    if (!fs.existsSync(path.join(ROOT, file))) {
      fail(`Missing implementation file for "${featureName}": ${file}`);
    }
    verifiedSourceCount++;
  }

  if (migrationCol && migrationCol !== '—' && migrationCol !== '-') {
    const migrations = migrationCol
      .split(/,+/)
      .map((s) => s.trim().replace(/^`|`$/g, ''))
      .filter(Boolean);

    for (const mig of migrations) {
      if (!fs.existsSync(path.join(ROOT, mig))) {
        fail(`Missing migration file for "${featureName}": ${mig}`);
      }
      verifiedSourceCount++;
    }
  }
}

console.log(
  `✓ check-registry: ${e2ePaths.length} protected E2E files and ${verifiedSourceCount} implementation source/migration files verified.`
);
process.exit(0);

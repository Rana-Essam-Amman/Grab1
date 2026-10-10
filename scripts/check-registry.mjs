import fs from 'fs';
import path from 'path';

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
const pathRegex = /`([^`]+\.(?:spec|test)\.tsx?)`/g;
const paths = [];
let m;
while ((m = pathRegex.exec(protectedSection)) !== null) {
  paths.push(m[1]);
}

if (paths.length === 0) {
  fail('no E2E paths found in Protected section');
}

const missing = paths.filter((p) => !fs.existsSync(path.join(ROOT, p)));

if (missing.length > 0) {
  console.error('✗ check-registry: Protected E2E files are missing:');
  for (const p of missing) console.error(`    ${p}`);
  console.error('  If a feature was intentionally removed, update docs/features/REGISTRY.md in the same PR.');
  process.exit(1);
}

console.log(`✓ check-registry: ${paths.length} protected E2E files verified.`);

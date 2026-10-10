import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const LIMITS = {
  screen: 150,
  component: 120,
  hook: 100,
  helper: 80,
  slice: 120,
  store: 200,
  config: 500,
  ai: 400,
  app: 300,
  types: 200,
  sharedUi: 200,
  sharedComponent: 150,
  default: 150,
};

const WARNING_RATIO = 0.8;

function getFileType(filePath) {
  const normalized = filePath.replace(/\\/g, '/');

  if (normalized === 'src/App.tsx') return { type: 'app', limit: LIMITS.app };
  if (normalized === 'src/types.ts') return { type: 'types', limit: LIMITS.types };
  if (normalized.startsWith('src/ai/')) return { type: 'ai', limit: LIMITS.ai };
  if (normalized.startsWith('src/shared/ui/')) return { type: 'sharedUi', limit: LIMITS.sharedUi };
  if (normalized.startsWith('src/shared/components/')) return { type: 'sharedComponent', limit: LIMITS.sharedComponent };
  if (normalized === 'src/store/ui.slice.ts') return { type: 'store', limit: LIMITS.store };
  if (normalized.endsWith('.slice.ts')) return { type: 'slice', limit: LIMITS.slice };
  if (normalized.startsWith('src/data/') || normalized.startsWith('src/config/')) return { type: 'config', limit: LIMITS.config };
  if (normalized.includes('/screens/') && normalized.endsWith('.tsx')) return { type: 'screen', limit: LIMITS.screen };
  if (normalized.includes('/components/') && normalized.endsWith('.tsx')) return { type: 'component', limit: LIMITS.component };
  if (normalized.includes('/hooks/') && normalized.endsWith('.ts')) return { type: 'hook', limit: LIMITS.hook };
  if (normalized.includes('/helpers/') && normalized.endsWith('.ts')) return { type: 'helper', limit: LIMITS.helper };

  return { type: 'default', limit: LIMITS.default };
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (filePath.includes('__tests__')) continue;
    if (file.endsWith('.test.ts') || file.endsWith('.test.tsx') || file.endsWith('.spec.ts') || file.endsWith('.spec.tsx')) continue;

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        walkDir(filePath, fileList);
      }
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function pad(str, width) {
  return str.length >= width ? str : str + ' '.repeat(width - str.length);
}

function auditArchitecture() {
  const allFiles = walkDir(SRC_DIR);
  const violations = [];
  const warnings = [];
  const categoryCounts = {};
  let compliant = 0;
  let exempted = 0;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').length;
    const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');

    if (content.includes('// RULE-14-EXCEPTION')) {
      exempted++;
      compliant++;
      continue;
    }

    const { type, limit } = getFileType(relPath);
    categoryCounts[type] = (categoryCounts[type] || 0) + 1;

    const ratio = lines / limit;

    if (lines > limit) {
      violations.push({ relPath, lines, limit, ratio, type });
    } else if (ratio >= WARNING_RATIO) {
      warnings.push({ relPath, lines, limit, ratio, type });
      compliant++;
    } else {
      compliant++;
    }
  }

  violations.sort((a, b) => b.ratio - a.ratio);
  warnings.sort((a, b) => b.ratio - a.ratio);

  console.log('[ARCHITECTURE AUDIT - RULE 14]');
  console.log('--------------------------------------------------------------------------------');

  if (violations.length > 0) {
    console.log(`\x1b[31m❌ VIOLATIONS (${violations.length}) — file is OVER its limit:\x1b[0m`);
    violations.forEach((v, i) => {
      const pct = (v.ratio * 100).toFixed(1);
      console.log(`  ${String(i + 1).padStart(2)}. \x1b[31m${pad(v.relPath, 60)}\x1b[0m ${v.lines}/${v.limit} (${pct}%) - ${v.type}`);
    });
    console.log('--------------------------------------------------------------------------------');
  }

  if (warnings.length > 0) {
    console.log(`\x1b[33m⚠️  WARNINGS (${warnings.length}) — at or above 80% of limit:\x1b[0m`);
    warnings.forEach((w, i) => {
      const pct = (w.ratio * 100).toFixed(1);
      console.log(`  ${String(i + 1).padStart(2)}. \x1b[33m${pad(w.relPath, 60)}\x1b[0m ${w.lines}/${w.limit} (${pct}%) - ${w.type}`);
    });
    console.log('--------------------------------------------------------------------------------');
  }

  console.log('Category Counts:');
  for (const [type, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  - ${type}: ${count} files`);
  }

  console.log('--------------------------------------------------------------------------------');
  console.log(`Summary: \x1b[31m${violations.length} violations\x1b[0m, \x1b[33m${warnings.length} warnings\x1b[0m, ${compliant} compliant (${exempted} exempted).`);

  if (violations.length > 0) {
    console.log('\n❌ Architecture audit failed. Fix all violations above, then re-run.');
    process.exit(1);
  } else {
    console.log('\n✨ Architecture audit passed successfully.');
    process.exit(0);
  }
}

auditArchitecture();

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
    
    // Skip tests
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

function auditArchitecture() {
  const allFiles = walkDir(SRC_DIR);
  let violations = 0;
  let warnings = 0;
  let compliant = 0;
  
  const categoryCounts = {};

  console.log('[ARCHITECTURE AUDIT - RULE 14]');
  console.log('--------------------------------------------------------------------------------');

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n').length;
    const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');

    if (content.includes('// RULE-14-EXCEPTION')) {
      console.log(`EXEMPTED  ${relPath} (${lines} lines)`);
      compliant++;
      continue;
    }

    const { type, limit } = getFileType(relPath);
    categoryCounts[type] = (categoryCounts[type] || 0) + 1;
    
    const ratio = lines / limit;

    if (lines > limit) {
      console.log(`\x1b[31mVIOLATION\x1b[0m ${relPath} (${lines}/${limit} lines - ${type})`);
      violations++;
    } else if (ratio >= 0.8) {
      console.log(`\x1b[33mWARNING\x1b[0m   ${relPath} (${lines}/${limit} lines - ${type} >= 80%)`);
      warnings++;
      compliant++;
    } else {
      compliant++;
    }
  }

  console.log('--------------------------------------------------------------------------------');
  console.log('Category Counts:');
  for (const [type, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(` - ${type}: ${count} files`);
  }
  
  console.log('--------------------------------------------------------------------------------');
  console.log(`Summary: \x1b[31m${violations} violations\x1b[0m, \x1b[33m${warnings} warnings\x1b[0m, ${compliant} compliant files.`);

  if (violations > 0) {
    console.log('\n❌ Architecture audit failed due to Rule 14 size violations.');
    process.exit(1);
  } else {
    console.log('\n✨ Architecture audit passed successfully!');
    process.exit(0);
  }
}

auditArchitecture();

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  'coverage-report',
  '.git',
  '.husky',
  'playwright-report',
  'test-results',
  '.vite',
  '.cache'
]);

const EXCLUDED_EXTS = new Set(['.log', '.swp', '.swo', '.tsbuildinfo']);

function getTrackedFiles() {
  const result = spawnSync('git', ['ls-files'], { encoding: 'utf-8', cwd: ROOT });
  if (result.error || result.status !== 0) {
    console.error('Failed to run git ls-files');
    process.exit(1);
  }
  return result.stdout.trim().split('\n').filter(Boolean);
}

function countSourceFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) {
        continue;
      }
      count += countSourceFiles(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (EXCLUDED_EXTS.has(ext)) {
        continue;
      }
      if (entry.name === 'Thumbs.db' || entry.name === '.DS_Store') {
        continue;
      }
      count++;
    }
  }

  return count;
}

function main() {
  const tracked = getTrackedFiles();
  const trackedCount = tracked.length;
  const totalFiles = countSourceFiles(ROOT);

  const ratio = totalFiles > 0 ? Math.round((trackedCount / totalFiles) * 100) : 100;

  let statusText = '';
  let exitCode = 0;

  if (ratio >= 95) {
    statusText = '\x1b[32m✅ PASS\x1b[0m';
    exitCode = 0;
  } else if (ratio >= 90) {
    statusText = '\x1b[33m⚠️ WARN\x1b[0m';
    exitCode = 0;
  } else {
    statusText = '\x1b[31m🔴 FAIL\x1b[0m';
    exitCode = 1;
  }

  console.log('🔍 Git Health Check');
  console.log(`   Tracked files: ${trackedCount}`);
  console.log(`   Source files on disk: ${totalFiles}`);
  console.log(`   Ratio: ${ratio}%`);
  console.log(`   Status: ${statusText}`);

  if (exitCode !== 0) {
    console.error('\n🔴 ERROR: Less than 90% of files are tracked in git!');
    console.error('   Run `git add .` to stage all untracked source files.\n');
  }

  process.exit(exitCode);
}

main();

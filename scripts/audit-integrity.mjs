#!/usr/bin/env node
/**
 * Integrity Audit — detects corruption patterns from AI-generated code.
 * Checks:
 * 1. Placeholder strings ($(cat), CORRECT_*, PLACEHOLDER_*, REPLACE_ME, etc.)
 * 2. Critical files exist as FILES not folders
 * 3. Critical files have minimum line counts
 * 4. Critical files export expected symbols
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const FORBIDDEN_PATTERNS = [
  { regex: /\$\(cat\s/, reason: 'Shell command substitution $(cat ...)' },
  { regex: /CORRECT_[A-Z_]{3,}/, reason: 'Placeholder CORRECT_*' },
  { regex: /PLACEHOLDER_[A-Z_]{3,}/, reason: 'Placeholder PLACEHOLDER_*' },
  { regex: /\bREPLACE_ME\b/, reason: 'Placeholder REPLACE_ME' },
  { regex: /<INSERT_[A-Z_]+>/, reason: 'Placeholder <INSERT_*>' },
  { regex: /\bFULL_CONTENT_HERE\b/, reason: 'Placeholder FULL_CONTENT_HERE' },
  { regex: /\.\.\.\s*\(full content would be here/i, reason: 'Truncation marker' },
];

const CRITICAL_FILES = [
  { path: 'src/data/categorySignals.ts', minLines: 350, expectedExport: 'textSignals' },
  { path: 'src/data/subcategories.ts', minLines: 100, expectedExport: 'subcategories' },
  { path: 'src/data/filterRanges.ts', minLines: 40, expectedExport: 'RANGE_FILTERS' },
  { path: 'src/data/listingFields/real-estate.ts', minLines: 300, expectedExport: 'REAL_ESTATE_FIELDS' },
  { path: 'src/data/listingFields/real-estate-commercial.ts', minLines: 40, expectedExport: 'REAL_ESTATE_COMMERCIAL_FIELDS' },
  { path: 'src/data/listingFields/real-estate-special.ts', minLines: 100, expectedExport: 'REAL_ESTATE_SPECIAL_FIELDS' },
  { path: 'src/data/listingFields/index.ts', minLines: 50, expectedExport: 'LISTING_FIELDS' },
  { path: 'src/data/listingFields/types.ts', minLines: 15, expectedExport: 'ListingField' },
  { path: 'src/shared/lib/filterListings.ts', minLines: 80, expectedExport: 'filterListings' },
  { path: 'src/features/explore/components/filters/CategoryAttrsSection.tsx', minLines: 60, expectedExport: 'CategoryAttrsSection' },
  { path: 'src/features/explore/components/filters/FilterFieldRenderer.tsx', minLines: 60, expectedExport: 'FilterFieldRenderer' },
  { path: 'src/features/explore/components/filters/FilterChipsField.tsx', minLines: 40, expectedExport: 'FilterChipsField' },
  { path: 'src/shared/hooks/useVersionCheck.ts', minLines: 20, expectedExport: 'useVersionCheck' },
  { path: 'src/shared/components/UpdateBanner.tsx', minLines: 15, expectedExport: 'UpdateBanner' },
  { path: 'src/features/listings/store/listings.slice.pagination.ts', minLines: 80, expectedExport: null },
];

function walkDir(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '__tests__', 'tests'].includes(entry.name)) continue;
      walkDir(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function checkPlaceholders(errors) {
  const files = walkDir(SRC).filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'));
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const { regex, reason } of FORBIDDEN_PATTERNS) {
        if (regex.test(lines[i])) {
          const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
          errors.push(`PLACEHOLDER: ${relPath}:${i + 1} — ${reason}`);
        }
      }
    }
  }
}

function checkCriticalFiles(errors) {
  for (const cf of CRITICAL_FILES) {
    const fullPath = path.join(ROOT, cf.path);
    if (!fs.existsSync(fullPath)) {
      errors.push(`MISSING_FILE: ${cf.path}`);
      continue;
    }
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      errors.push(`IS_DIRECTORY: ${cf.path} is a folder, not a file`);
      continue;
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lineCount = content.split('\n').length;
    if (lineCount < cf.minLines) {
      errors.push(`TOO_SHORT: ${cf.path} has ${lineCount} lines (expected >= ${cf.minLines})`);
    }
    if (cf.expectedExport && !content.includes(cf.expectedExport)) {
      errors.push(`MISSING_EXPORT: ${cf.path} doesn't contain '${cf.expectedExport}'`);
    }
  }
}

function main() {
  const errors = [];
  checkPlaceholders(errors);
  checkCriticalFiles(errors);
  if (errors.length === 0) {
    console.log('[INTEGRITY AUDIT]');
    console.log('----------------------------------------');
    console.log(`✨ Integrity audit passed. ${CRITICAL_FILES.length} critical files verified.`);
    process.exit(0);
  }
  console.error('[INTEGRITY AUDIT — VIOLATIONS]');
  console.error('----------------------------------------');
  errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
  console.error('----------------------------------------');
  console.error(`❌ ${errors.length} violation(s) found.`);
  process.exit(1);
}

main();

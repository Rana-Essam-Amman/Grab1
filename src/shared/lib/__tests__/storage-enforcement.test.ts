/// <reference types="node" />
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';
import { STORAGE_PLUMBING_FILES } from './storage-plumbing.whitelist';

/**
 * STORAGE ENFORCEMENT — market isolation must not be bypassable.
 *
 * STRONGER than v1: catches the ORIGINAL bug pattern (template literals
 * with unscoped prefixes) AND non-literal first arguments outside the
 * plumbing layer.
 *
 * A file may only call localStorage/sessionStorage directly if:
 *   (a) it is declared in STORAGE_PLUMBING_FILES, OR
 *   (b) the key literal matches an allowed global key, OR
 *   (c) the key literal is market-scoped (catch_<XX>_...), OR
 *   (d) it is a test file
 */

const SRC = join(process.cwd(), 'src');

const ALLOWED_LITERAL_KEYS = new Set<string>([
  'catch_pending_post_entry',
  'catch_pending_publish',
  'catch_pending_publish_screen',
  'catch_migration_drafts_done',
  'catch_migration_chats_done',
  'catch_migration_pending_flags_done',
  'catch_locale',
  'grab_theme_v1',
  'catch_user',
  'catch_token',
  'catch_auth',
  'catch_registered_users',
  'catch_browse_country',
  'catch_crash_last',
  'catch_ai_last_error',
  'catch_listings',
  'catch_wishlist',
  'catch_favorites',
  'catch_conversations',
]);

/** File paths (relative to process.cwd()) that are plumbing. */
const PLUMBING = new Set<string>(STORAGE_PLUMBING_FILES);

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (entry === '__tests__' || entry === 'tests' || entry === 'node_modules') continue;
      yield* walk(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      yield p;
    }
  }
}

interface Violation {
  readonly file: string;
  readonly line: number;
  readonly snippet: string;
  readonly reason: string;
}

function findViolations(): Violation[] {
  const out: Violation[] = [];

  // Patterns:
  //  A. localStorage.setItem('literal', ...) or ('lit')
  //  B. sessionStorage.setItem('literal', ...) or ('lit')
  //  C. window.localStorage.setItem(...)
  //  D. localStorage.setItem(<NON-literal first arg>) → outside plumbing = suspicious
  const setLiteralRe = /(?:window\s*\.\s*)?(?:localStorage|sessionStorage)\s*\.\s*setItem\s*\(\s*['"]([^'"]+)['"]/g;
  const setNonLiteralRe = /(?:window\s*\.\s*)?(?:localStorage|sessionStorage)\s*\.\s*setItem\s*\(\s*([^'"\s])/g;

  for (const file of walk(SRC)) {
    if (file.includes('.test.') || file.includes('.spec.')) continue;
    const rel = relative(process.cwd(), file);
    const isPlumbing = PLUMBING.has(rel);
    const txt = readFileSync(file, 'utf8');
    const lines = txt.split('\n');

    // Rule A+B: literal keys must be allowed or market-scoped
    let m: RegExpExecArray | null;
    setLiteralRe.lastIndex = 0;
    while ((m = setLiteralRe.exec(txt)) !== null) {
      const key = m[1];
      if (ALLOWED_LITERAL_KEYS.has(key)) continue;
      if (/^catch_[A-Z]{2}_/.test(key)) continue;
      const lineNumber = txt.slice(0, m.index).split('\n').length;
      out.push({
        file: rel,
        line: lineNumber,
        snippet: lines[lineNumber - 1]?.trim() ?? '',
        reason: 'literal key not allowed and not market-scoped',
      });
    }

    // Rule D: non-literal first arg is ONLY ok inside plumbing
    if (!isPlumbing) {
      setNonLiteralRe.lastIndex = 0;
      while ((m = setNonLiteralRe.exec(txt)) !== null) {
        const firstChar = m[1];
        void firstChar;
        // Skip if it's a quote (already handled above) — regex already excludes quotes.
        const lineNumber = txt.slice(0, m.index).split('\n').length;
        out.push({
          file: rel,
          line: lineNumber,
          snippet: lines[lineNumber - 1]?.trim() ?? '',
          reason: 'non-literal storage key outside plumbing layer — must use marketStorage() or scopedKey()',
        });
      }
    }
  }

  return out;
}

describe('STORAGE ENFORCEMENT — no unscoped storage writes (v2)', () => {
  it('all storage writes are scoped, allowed, or inside plumbing', () => {
    const violations = findViolations();
    if (violations.length > 0) {
      const report = violations
        .map((v) => `  ${v.file}:${v.line}\n    ${v.snippet}\n    → ${v.reason}`)
        .join('\n');
      throw new Error(
        `Found ${violations.length} storage violation(s):\n\n${report}\n\n` +
        `Fix: route through marketStorage()/scopedKey(), OR declare the key ` +
        `in ALLOWED_LITERAL_KEYS, OR add the file to STORAGE_PLUMBING_FILES ` +
        `(only if it's a genuine storage helper).`
      );
    }
    expect(violations).toEqual([]);
  });
});

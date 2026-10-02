/// <reference types="node" />
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

/**
 * ENFORCEMENT TEST — Market isolation must not be bypassable.
 *
 * Scans all .ts / .tsx files under src/ (excluding tests) and FAILS if a
 * raw `localStorage.setItem(...)` call uses a hardcoded string key that
 * is neither:
 *   1. declared in userDataRegistry.ts, NOR
 *   2. produced by scopedKey(), NOR
 *   3. produced by a variable expression (template literal with vars is ok)
 *
 * Rationale: the "bump_<id>_<date>" bug bypassed market scoping by writing
 * directly. This test prevents regression by failing CI when a new hardcoded
 * key is added without registration.
 */

const SRC = join(process.cwd(), 'src');

// Allowed literal keys (device-level, not user data). Keep in sync with
// INTENTIONAL_GLOBAL_KEYS in userDataRegistry.ts.
const ALLOWED_LITERAL_KEYS = new Set<string>([
  // Legacy pending flags (already removed from writes, but tolerant in case
  // any historical call remains during migration):
  'catch_pending_post_entry',
  'catch_pending_publish',
  'catch_pending_publish_screen',
  // Migration flags:
  'catch_migration_drafts_done',
  'catch_migration_chats_done',
  'catch_migration_pending_flags_done',
  // Device prefs:
  'catch_locale',
  'grab_theme_v1',
  // Registry-declared global user keys:
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
}

function findViolations(): Violation[] {
  const out: Violation[] = [];
  const setItemRe = /localStorage\s*\.\s*setItem\s*\(\s*['"]([^'"]+)['"]/g;

  for (const file of walk(SRC)) {
    if (file.includes('.test.') || file.includes('.spec.')) continue;
    const txt = readFileSync(file, 'utf8');
    const lines = txt.split('\n');
    let m: RegExpExecArray | null;
    while ((m = setItemRe.exec(txt)) !== null) {
      const key = m[1];
      if (ALLOWED_LITERAL_KEYS.has(key)) continue;
      // Market-scoped keys follow the pattern catch_<XX>_...
      if (/^catch_[A-Z]{2}_/.test(key)) continue;
      const lineNumber = txt.slice(0, m.index).split('\n').length;
      out.push({
        file: relative(process.cwd(), file),
        line: lineNumber,
        snippet: lines[lineNumber - 1]?.trim() ?? '',
      });
    }
  }
  return out;
}

describe('STORAGE ENFORCEMENT — no unscoped hardcoded localStorage.setItem', () => {
  it('every hardcoded key is either global-allowed or market-scoped', () => {
    const violations = findViolations();
    if (violations.length > 0) {
      const report = violations
        .map((v) => `  ${v.file}:${v.line}\n    ${v.snippet}`)
        .join('\n');
      throw new Error(
        `Found ${violations.length} unscoped localStorage.setItem calls:\n${report}\n\n` +
        `Fix: route through marketStorage() or scopedKey(), OR declare the key ` +
        `in ALLOWED_LITERAL_KEYS (only for device-level global keys).`
      );
    }
    expect(violations).toEqual([]);
  });
});

#!/usr/bin/env node
/**
 * Storage cleanup — runs daily via GitHub Actions.
 *
 * 1. Register orphans (files > 24h old not referenced by any listing).
 * 2. Fetch orphans past their 7-day grace window.
 * 3. Delete them from Supabase Storage.
 * 4. Confirm deletion in the DB.
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). Never logs the key.
 */

import { createClient } from '@supabase/supabase-js';

const BUCKET = 'listing-images';
const MIN_AGE_HOURS = 24;

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('[storage-cleanup] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // 1. Detect newly orphaned files
  const { data: detected, error: e1 } = await supabase.rpc('detect_orphan_images', {
    p_min_age_hours: MIN_AGE_HOURS,
  });
  if (e1) throw new Error(`detect_orphan_images: ${e1.message}`);
  console.log(`[storage-cleanup] detected ${detected ?? 0} new orphan(s)`);

  // 2. Fetch paths past their grace period
  const { data: due, error: e2 } = await supabase.rpc('get_due_orphan_paths');
  if (e2) throw new Error(`get_due_orphan_paths: ${e2.message}`);

  const paths = (due ?? []).map((r) => r.path).filter(Boolean);
  if (paths.length === 0) {
    console.log('[storage-cleanup] nothing due for deletion');
    return;
  }
  console.log(`[storage-cleanup] deleting ${paths.length} orphan(s)`);

  // 3. Delete from storage
  const { error: e3 } = await supabase.storage.from(BUCKET).remove(paths);
  if (e3) throw new Error(`storage.remove: ${e3.message}`);

  // 4. Confirm in DB
  const { data: confirmed, error: e4 } = await supabase.rpc('confirm_orphan_deletion', {
    p_paths: paths,
  });
  if (e4) throw new Error(`confirm_orphan_deletion: ${e4.message}`);
  console.log(`[storage-cleanup] confirmed deletion of ${confirmed ?? paths.length} row(s)`);
}

main().catch((err) => {
  console.error('[storage-cleanup] FAILED:', err instanceof Error ? err.message : err);
  process.exit(1);
});

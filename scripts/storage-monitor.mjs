#!/usr/bin/env node
/**
 * Daily storage & listings monitor.
 * Warns via GitHub Issue when we approach Supabase Free Tier limits.
 * Run by .github/workflows/storage-monitor.yml daily.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const THRESHOLDS = {
  listings_warn: 700,     // 70% of Free Tier safe ~1000 listings
  listings_critical: 900, // 90% - act now
  storage_warn_mb: 700,   // 70% of 1 GB
  storage_critical_mb: 900,
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const results = { warnings: [], criticals: [], facts: {} };

  // 1. Count listings
  const { count: listingCount, error: listErr } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true });
  if (listErr) {
    console.error('Failed to count listings:', listErr.message);
    process.exit(1);
  }
  results.facts.listings = listingCount ?? 0;
  if ((listingCount ?? 0) >= THRESHOLDS.listings_critical) {
    results.criticals.push(`🔴 Listings: ${listingCount} (critical > ${THRESHOLDS.listings_critical})`);
  } else if ((listingCount ?? 0) >= THRESHOLDS.listings_warn) {
    results.warnings.push(`🟠 Listings: ${listingCount} (warn > ${THRESHOLDS.listings_warn})`);
  }

  // 2. Count storage objects (query storage schema directly)
  try {
    const { data: rawObjects, error: storageErr } = await supabase
      .schema('storage')
      .from('objects')
      .select('bucket_id, metadata');

    if (storageErr) {
      console.warn('Storage query failed (non-fatal):', storageErr.message);
    } else {
      const totalBytes = (rawObjects || []).reduce(
        (sum, o) => sum + Number(o.metadata?.size || 0),
        0
      );
      const totalMb = Math.round(totalBytes / (1024 * 1024));
      results.facts.storage_mb = totalMb;
      if (totalMb >= THRESHOLDS.storage_critical_mb) {
        results.criticals.push(`🔴 Storage: ${totalMb} MB (critical > ${THRESHOLDS.storage_critical_mb} MB)`);
      } else if (totalMb >= THRESHOLDS.storage_warn_mb) {
        results.warnings.push(`🟠 Storage: ${totalMb} MB (warn > ${THRESHOLDS.storage_warn_mb} MB)`);
      }
    }
  } catch (err) {
    console.warn('Storage measurement failed (non-fatal):', err);
  }

  // 3. Print facts for the workflow
  console.log('=== STORAGE MONITOR ===');
  console.log(`Listings: ${results.facts.listings}`);
  console.log(`Storage: ${results.facts.storage_mb ?? 'unknown'} MB`);
  console.log(`Warnings: ${results.warnings.length}`);
  console.log(`Criticals: ${results.criticals.length}`);
  results.warnings.forEach((w) => console.log(`  ${w}`));
  results.criticals.forEach((c) => console.log(`  ${c}`));

  // 4. Write to GITHUB_OUTPUT for the workflow to use
  const fs = await import('node:fs');
  const out = process.env.GITHUB_OUTPUT;
  if (out) {
    fs.appendFileSync(out, `warnings=${results.warnings.length}\n`);
    fs.appendFileSync(out, `criticals=${results.criticals.length}\n`);
    fs.appendFileSync(out, `summary=${[...results.warnings, ...results.criticals].join(' | ') || 'All healthy'}\n`);
    fs.appendFileSync(out, `listings=${results.facts.listings}\n`);
    fs.appendFileSync(out, `storage_mb=${results.facts.storage_mb ?? 0}\n`);
  }

  if (results.criticals.length > 0) {
    process.exit(2); // exit code 2 = critical (workflow treats as alert)
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * RLS probe — authenticated checks for listing market-integrity policies.
 *
 * Verifies:
 *   1. Non-admin cannot INSERT with country_code = NULL
 *   2. Non-admin cannot INSERT with country_code != their profile market
 *   3. Non-admin CAN INSERT with country_code = their profile market
 *   4. Non-admin cannot UPDATE country_code on their own listing (F1 trigger)
 *
 * HOW THE TEST USER IS CREATED:
 *   We use the Admin API (`auth.admin.createUser` with `email_confirm: true`).
 *   This bypasses the email confirmation flow entirely — no email is sent,
 *   so the built-in SMTP rate limit (2 emails/hour) is never touched.
 *
 *   The previous signUp() approach failed with "email rate limit exceeded"
 *   on the second CI run because Supabase's built-in email provider allows
 *   only ~2 auth emails per hour per project.
 *
 * REQUIRED ENV:
 *   SB_URL                 — Supabase project URL
 *   SB_ANON                — anon publishable key (for RLS-scoped operations)
 *   SB_SERVICE_ROLE_KEY    — service_role key (for admin.createUser only)
 */

import { createClient } from '@supabase/supabase-js';

const URL = process.env.SB_URL;
const ANON = process.env.SB_ANON;
const SERVICE_ROLE = process.env.SB_SERVICE_ROLE_KEY;

if (!URL || !ANON) {
  console.error('[rls-probe] Missing SB_URL or SB_ANON');
  process.exit(1);
}
if (!SERVICE_ROLE) {
  console.error('[rls-probe] Missing SB_SERVICE_ROLE_KEY');
  console.error('Add it as a GitHub Actions secret: Settings → Secrets → Actions');
  process.exit(1);
}

const runId = process.env.GITHUB_RUN_ID || String(Date.now());
const email = `rls-probe-${runId}@example.com`;
const password = `RlsProbe-${runId}-Aa1!`;

// Admin client: used only to create/delete the test user.
const admin = createClient(URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// User client: used for all RLS-scoped operations (INSERT, UPDATE, DELETE).
const supabase = createClient(URL, ANON, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

let userId = null;
let createdListingId = null;
let failures = 0;

const pass = (label, note) =>
  console.log(`PASS: ${label}${note ? ` (${note})` : ''}`);
const fail = (label, detail) => {
  console.error(`FAIL: ${label} — ${detail}`);
  failures += 1;
};

async function main() {
  // ---- Setup: create user via Admin API (no email sent, no rate limit) ----
  const createRes = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // bypass confirmation — no email is sent
    user_metadata: { source: 'ci-rls-probe' },
  });

  if (createRes.error) {
    fail('setup: admin.createUser', createRes.error.message);
    process.exit(1);
  }
  userId = createRes.data.user.id;
  console.log(`INFO: test user created = ${userId}`);

  // ---- Setup: sign in to obtain a real user session (anon key) ----
  const signIn = await supabase.auth.signInWithPassword({ email, password });
  if (signIn.error || !signIn.data.session) {
    fail('setup: signIn', signIn.error?.message || 'no session');
    await admin.auth.admin.deleteUser(userId).catch(() => {});
    process.exit(1);
  }
  console.log('INFO: user session acquired');

  // ---- Setup: set phone + country_code on profile ----
  const setup = await supabase
    .from('profiles')
    .update({ country_code: 'JO', phone: '+962790000000' })
    .eq('id', userId);
  if (setup.error) {
    fail('setup: profile update', setup.error.message);
    await admin.auth.admin.deleteUser(userId).catch(() => {});
    process.exit(1);
  }

  const base = {
    user_id: userId,
    description: 'RLS probe listing. Auto-created by CI.',
    price: 1,
  };

  // ---- 1: INSERT with NULL country_code → expect 4xx ----
  {
    const { error } = await supabase
      .from('listings')
      .insert({ ...base, title: 'RLS probe NULL — do not publish', country_code: null });
    if (error) pass('INSERT NULL country_code blocked', error.code || error.message);
    else fail('INSERT NULL country_code blocked', 'Expected error, got success');
  }

  // ---- 2: INSERT with non-own market (SA while profile=JO) → expect 4xx ----
  {
    const { error } = await supabase
      .from('listings')
      .insert({ ...base, title: 'RLS probe wrong market — do not publish', country_code: 'SA' });
    if (error) pass('INSERT with non-own market blocked', error.code || error.message);
    else fail('INSERT with non-own market blocked', 'Expected error, got success');
  }

  // ---- 3: INSERT with own market (JO) → expect success ----
  {
    const { data, error } = await supabase
      .from('listings')
      .insert({ ...base, title: 'RLS probe valid — do not publish', country_code: 'JO' })
      .select('id')
      .single();
    if (error) {
      fail('INSERT with own market allowed', error.message);
    } else {
      pass('INSERT with own market allowed');
      createdListingId = data?.id ?? null;
    }
  }

  // ---- 4: UPDATE country_code on own listing → expect 42501 (F1 trigger) ----
  if (createdListingId) {
    const { error } = await supabase
      .from('listings')
      .update({ country_code: 'SA' })
      .eq('id', createdListingId);
    if (error) pass('UPDATE country_code blocked by trigger', error.code || error.message);
    else fail('UPDATE country_code blocked by trigger', 'Expected error, got success');
  } else {
    fail('UPDATE country_code blocked by trigger', 'No listing created in step 3');
  }

  // ---- Cleanup: delete listing, then the user (cascades to profile) ----
  if (createdListingId) {
    const { error } = await supabase.from('listings').delete().eq('id', createdListingId);
    if (error) console.warn(`WARN: cleanup listing delete failed — ${error.message}`);
  }
  await supabase.auth.signOut();
  const del = await admin.auth.admin.deleteUser(userId);
  if (del.error) console.warn(`WARN: cleanup user delete failed — ${del.error.message}`);

  if (failures > 0) {
    console.error(`\n${failures} RLS probe(s) FAILED`);
    process.exit(1);
  }
  console.log('\nAll RLS probes PASSED');
}

main().catch((err) => {
  console.error('[rls-probe] fatal:', err instanceof Error ? err.message : err);
  process.exit(1);
});

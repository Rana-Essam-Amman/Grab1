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
 * Uses only the anon publishable key. Creates a fresh test user per run
 * (unique email). Exits 1 on any failure so CI turns red.
 *
 * NOTE: Supabase rejects reserved TLDs like `.local` and `.test` at signup.
 * We use `example.com` (RFC 2606, real TLD, no deliverability needed).
 */

import { createClient } from '@supabase/supabase-js';

const URL = process.env.SB_URL;
const ANON = process.env.SB_ANON;

if (!URL || !ANON) {
  console.error('[rls-probe] Missing SB_URL or SB_ANON');
  process.exit(1);
}

const runId = process.env.GITHUB_RUN_ID || String(Date.now());
const email = `rls-probe-${runId}@example.com`;
const password = `RlsProbe-${runId}-Aa1!`;

const supabase = createClient(URL, ANON, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

let createdListingId = null;
let failures = 0;

const pass = (label, note) =>
  console.log(`PASS: ${label}${note ? ` (${note})` : ''}`);
const fail = (label, detail) => {
  console.error(`FAIL: ${label} — ${detail}`);
  failures += 1;
};

async function ensureSession() {
  // Try signup first.
  const up = await supabase.auth.signUp({ email, password });
  if (up.error) {
    // Fall through to sign-in (handles the "already registered" case).
    console.log(`INFO: signUp returned error, trying sign-in — ${up.error.message}`);
    const inn = await supabase.auth.signInWithPassword({ email, password });
    if (inn.error) {
      throw new Error(`signup+signin both failed — signUp: ${up.error.message}; signIn: ${inn.error.message}`);
    }
    if (!inn.data.session) {
      throw new Error('signIn returned no session — is email confirmation required?');
    }
    return inn.data;
  }
  if (up.data.session) return up.data;

  // No session from signup — try sign-in (account may already be confirmed).
  const inn = await supabase.auth.signInWithPassword({ email, password });
  if (inn.error || !inn.data.session) {
    throw new Error(
      `signUp returned no session and signIn failed — ${inn.error?.message || 'no session'}. ` +
      'Fix: set Supabase Auth → Email → Confirm email = OFF, OR use service_role key.'
    );
  }
  return inn.data;
}

async function main() {
  // ---- Setup: sign up (or sign in) a fresh test user ----
  let auth;
  try {
    auth = await ensureSession();
  } catch (err) {
    fail('setup: sign up/in', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
  const userId = auth.user.id;
  console.log(`INFO: test user = ${userId}`);

  // ---- Setup: set phone + country_code on profile ----
  const setup = await supabase
    .from('profiles')
    .update({ country_code: 'JO', phone: '+962790000000' })
    .eq('id', userId);
  if (setup.error) {
    fail('setup: profile update', setup.error.message);
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

  // ---- Cleanup ----
  if (createdListingId) {
    const { error } = await supabase.from('listings').delete().eq('id', createdListingId);
    if (error) console.warn(`WARN: cleanup delete failed — ${error.message}`);
  }
  await supabase.auth.signOut();

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

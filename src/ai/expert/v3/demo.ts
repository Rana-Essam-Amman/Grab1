import { generate } from './engine';
import { DRAFTS } from './drafts';

const users = ['user-a', 'user-b', 'user-c'];
for (const draft of DRAFTS) {
  for (const userId of users) {
    const listing = generate({ userId, draft });
    console.log(`=== ${userId} ${listing.planId} ${listing.fingerprint.slice(0, 12)} ===`);
    console.log(listing.title);
    console.log(listing.description);
    console.log(listing.facts.district ?? '');
    console.log('');
  }
}

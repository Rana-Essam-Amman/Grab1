import { makePack } from '../factory';

export const electricianPack = makePack({
  id: 'handymen-electrician',
  noun: 'كهربجي',
  detect: /كهربجي|كهرباء/,
  allowArea: false,
});

import { makePack } from '../factory';

export const carpenterPack = makePack({
  id: 'handymen-carpenter',
  noun: 'نجار',
  detect: /نجار/,
  allowArea: false,
});

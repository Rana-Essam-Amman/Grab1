import { makePack } from '../factory';

export const gypsumPack = makePack({
  id: 'handymen-gypsum',
  noun: 'جبس',
  detect: /جبس/,
  allowArea: false,
});

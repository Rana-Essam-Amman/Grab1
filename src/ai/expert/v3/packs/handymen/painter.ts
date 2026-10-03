import { makePack } from '../factory';

export const painterPack = makePack({
  id: 'handymen-painter',
  noun: 'دهان',
  detect: /دهان/,
  allowArea: false,
});

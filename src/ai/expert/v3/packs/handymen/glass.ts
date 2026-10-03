import { makePack } from '../factory';

export const glassPack = makePack({
  id: 'handymen-glass',
  noun: 'زجاج',
  detect: /زجاج/,
  allowArea: false,
});

import { makePack } from '../factory';

export const tiles_marblePack = makePack({
  id: 'handymen-tiles-marble',
  noun: 'بلاط',
  detect: /بلاط|رخام/,
  allowArea: false,
});

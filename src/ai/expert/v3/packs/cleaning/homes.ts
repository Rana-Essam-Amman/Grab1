import { makePack } from '../factory';

export const homesPack = makePack({
  id: 'cleaning-homes',
  noun: 'تنظيف منزل',
  detect: /تنظيف منزل/,
  allowArea: false,
});

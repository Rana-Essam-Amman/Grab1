import { makePack } from '../factory';

export const poolsPack = makePack({
  id: 'cleaning-pools',
  noun: 'تنظيف مسبح',
  detect: /تنظيف مسبح/,
  allowArea: false,
});

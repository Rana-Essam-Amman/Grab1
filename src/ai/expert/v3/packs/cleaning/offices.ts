import { makePack } from '../factory';

export const officesPack = makePack({
  id: 'cleaning-offices',
  noun: 'تنظيف مكتب',
  detect: /تنظيف مكتب/,
  allowArea: false,
});

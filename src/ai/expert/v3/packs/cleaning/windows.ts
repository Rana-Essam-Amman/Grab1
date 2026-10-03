import { makePack } from '../factory';

export const windowsPack = makePack({
  id: 'cleaning-windows',
  noun: 'تنظيف زجاج',
  detect: /تنظيف زجاج/,
  allowArea: false,
});

import { makePack } from '../factory';

export const clearancesPack = makePack({
  id: 'krakeeb-clearances',
  noun: 'تصفية',
  detect: /تصفية|شروة/,
  allowArea: false,
});

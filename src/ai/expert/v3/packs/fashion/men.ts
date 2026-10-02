import { makePack } from '../factory';

export const menPack = makePack({
  id: 'fashion-men',
  noun: 'قطعة رجالية',
  detect: /قميص|بدلة/,
  allowArea: false,
});

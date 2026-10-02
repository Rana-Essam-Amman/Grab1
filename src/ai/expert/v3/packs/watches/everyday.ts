import { makePack } from '../factory';

export const everydayPack = makePack({
  id: 'watches-everyday',
  noun: 'ساعة',
  detect: /ساعة يومية|كاسيو/,
  allowArea: false,
});

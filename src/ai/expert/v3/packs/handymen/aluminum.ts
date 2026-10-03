import { makePack } from '../factory';

export const aluminumPack = makePack({
  id: 'handymen-aluminum',
  noun: 'ألمنيوم',
  detect: /ألمنيوم/,
  allowArea: false,
});

import { makePack } from '../factory';

export const ac_techPack = makePack({
  id: 'handymen-ac-tech',
  noun: 'فني تكييف',
  detect: /تكييف/,
  allowArea: false,
});

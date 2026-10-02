import { makePack } from '../factory';

export const plumberPack = makePack({
  id: 'handymen-plumber',
  noun: 'سباك',
  detect: /سباك|مواسير/,
  allowArea: false,
});

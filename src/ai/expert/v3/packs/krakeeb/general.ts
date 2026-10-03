import { makePack } from '../factory';

export const generalPack = makePack({
  id: 'krakeeb-general',
  noun: 'غرض',
  detect: /مستعمل عام/,
  allowArea: false,
});

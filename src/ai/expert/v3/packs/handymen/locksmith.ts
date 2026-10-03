import { makePack } from '../factory';

export const locksmithPack = makePack({
  id: 'handymen-locksmith',
  noun: 'مفاتيح',
  detect: /مفاتيح|قفال/,
  allowArea: false,
});

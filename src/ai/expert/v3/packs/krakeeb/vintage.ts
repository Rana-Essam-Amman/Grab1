import { makePack } from '../factory';

export const vintagePack = makePack({
  id: 'krakeeb-vintage',
  noun: 'قطعة قديمة',
  detect: /أنتيك|قديم/,
  allowArea: false,
});

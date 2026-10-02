import { makePack } from '../factory';

export const toysPack = makePack({
  id: 'kids-toys',
  noun: 'لعبة',
  detect: /لعبة|ألعاب/,
  allowArea: false,
});

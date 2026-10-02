import { makePack } from '../factory';

export const catsPack = makePack({
  id: 'pets-cats',
  noun: 'قطة',
  detect: /قطة|قط/,
  allowArea: false,
});

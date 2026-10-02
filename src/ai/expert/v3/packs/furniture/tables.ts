import { makePack } from '../factory';

export const tablesPack = makePack({
  id: 'furniture-tables',
  noun: 'طاولة',
  detect: /طاولة|طاولات/,
  allowArea: false,
});

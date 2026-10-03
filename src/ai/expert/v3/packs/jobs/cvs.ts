import { makePack } from '../factory';

export const cvsPack = makePack({
  id: 'jobs-cvs',
  noun: 'سيرة',
  detect: /أبحث عن عمل|سيرة/,
  allowArea: false,
});

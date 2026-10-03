import { makePack } from '../factory';

export const partnershipPack = makePack({
  id: 'projects-partnership',
  noun: 'شراكة',
  detect: /شراكة/,
  allowArea: false,
});

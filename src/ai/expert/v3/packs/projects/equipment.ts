import { makePack } from '../factory';

export const equipmentPack = makePack({
  id: 'projects-equipment',
  noun: 'معدات',
  detect: /معدات مشروع/,
  allowArea: false,
});

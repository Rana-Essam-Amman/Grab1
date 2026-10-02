import { makePack } from '../factory';

export const factoryPack = makePack({
  id: 'projects-factory',
  noun: 'مصنع',
  detect: /مصنع/,
  allowArea: false,
});

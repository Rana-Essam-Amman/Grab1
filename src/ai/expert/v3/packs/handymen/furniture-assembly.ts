import { makePack } from '../factory';

export const furniture_assemblyPack = makePack({
  id: 'handymen-furniture-assembly',
  noun: 'تركيب أثاث',
  detect: /تركيب أثاث/,
  allowArea: false,
});

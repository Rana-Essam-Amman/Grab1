import { makePack } from '../factory';

export const skinPack = makePack({
  id: 'beauty-skin',
  noun: 'عناية بشرة',
  detect: /كريم|بشرة/,
  allowArea: false,
});

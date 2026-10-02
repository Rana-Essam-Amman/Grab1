import { makePack } from '../factory';

export const desktopsPack = makePack({
  id: 'computers-desktops',
  noun: 'كمبيوتر',
  detect: /كمبيوتر مكتبي/,
  allowArea: false,
});

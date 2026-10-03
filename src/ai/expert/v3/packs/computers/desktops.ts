import { goodsPack } from '../goods';

export const desktopsPack = goodsPack({
  id: 'desktopsPack',
  noun: 'كمبيوتر',
  detect: /كمبيوتر/,
  brands: [],
});

import { makePack } from '../factory';

export const camerasPack = makePack({
  id: 'electronics-cameras',
  noun: 'كاميرا',
  detect: /كاميرا/,
  allowArea: false,
});

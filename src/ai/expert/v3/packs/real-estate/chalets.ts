import { makePack } from '../factory';

export const chaletsPack = makePack({
  id: 'chalets',
  noun: 'شاليه',
  detect: /شاليه|مزرعة/,
  allowRooms: true,
  allowBaths: true,
  allowArea: true,
  flags: { مسبح: /مسبح/, خصوصية: /خصوصية/ },
});

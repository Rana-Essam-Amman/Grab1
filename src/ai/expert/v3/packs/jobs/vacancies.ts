import { makePack } from '../factory';

export const vacanciesPack = makePack({
  id: 'jobs-vacancies',
  noun: 'وظيفة',
  detect: /وظيفة شاغرة|مطلوب موظف/,
  allowArea: false,
});

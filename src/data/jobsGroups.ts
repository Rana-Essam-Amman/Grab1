import type { SubcategoryDef } from '@/types';
export interface JobsGroup { readonly key: string; readonly labelAr: string; readonly labelEn: string; readonly icon: string; readonly slugs: readonly string[]; }
export const JOBS_GROUPS: readonly JobsGroup[] = [
  { key: 'vacancies', labelAr: 'وظائف شاغرة', labelEn: 'Vacancies', icon: '💼', slugs: ['vacancies'] },
  { key: 'cvs', labelAr: 'باحثون عن عمل', labelEn: 'Job Seekers', icon: '📄', slugs: ['cvs'] },
];
export const JOBS_OTHER_GROUP: JobsGroup = { key: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: '📦', slugs: [] };
export interface GroupedJobs { readonly group: JobsGroup; readonly subcategories: readonly SubcategoryDef[]; }
export function groupJobsSubcategories(allSubcategories: readonly SubcategoryDef[]): GroupedJobs[] {
  const grouped: GroupedJobs[] = []; const covered = new Set<string>();
  for (const group of JOBS_GROUPS) {
    const subcategories = allSubcategories.filter((s) => group.slugs.includes(s.slug));
    if (subcategories.length === 0) continue;
    subcategories.forEach((s) => covered.add(s.slug));
    grouped.push({ group, subcategories });
  }
  const orphans = allSubcategories.filter((s) => !covered.has(s.slug));
  if (orphans.length > 0) grouped.push({ group: JOBS_OTHER_GROUP, subcategories: orphans });
  return grouped;
}

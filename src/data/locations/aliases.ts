// Query-time location expansion: user types ANY of these -> resolves to canonical
export const QUERY_CITY_ALIASES: Record<string, readonly string[]> = {
  'عمان': ['Amman', 'عمّان', 'عمان'],
  'Amman': ['عمان', 'عمّان', 'Amman'],
  'بيروت': ['Beirut', 'بيروت'],
  'Beirut': ['بيروت', 'Beirut'],
  'دمشق': ['Damascus', 'دمشق'],
  'Damascus': ['دمشق', 'Damascus'],
  'حلب': ['Aleppo', 'حلب'],
  'Aleppo': ['حلب', 'Aleppo'],
  'الرياض': ['Riyadh', 'الرياض'],
  'Riyadh': ['الرياض', 'Riyadh'],
  'جدة': ['Jeddah', 'جدة'],
  'Jeddah': ['جدة', 'Jeddah'],
  'القدس': ['Jerusalem', 'القدس'],
  'Jerusalem': ['القدس', 'Jerusalem'],
  'غزة': ['Gaza', 'غزة'],
  'Gaza': ['غزة', 'Gaza'],
  'نابلس': ['Nablus', 'نابلس'],
  'Nablus': ['نابلس', 'Nablus'],
  'رام الله': ['Ramallah', 'رام الله'],
  'Ramallah': ['رام الله', 'Ramallah'],
  'الخليل': ['Hebron', 'الخليل'],
  'Hebron': ['الخليل', 'Hebron'],
  'الزرقاء': ['Zarqa', 'الزرقاء'],
  'Zarqa': ['الزرقاء', 'Zarqa'],
  'إربد': ['Irbid', 'إربد'],
  'Irbid': ['إربد', 'Irbid'],
  'حمص': ['Homs', 'حمص'],
  'Homs': ['حمص', 'Homs'],
  'حماة': ['Hama', 'حماة'],
  'Hama': ['حماة', 'Hama'],
  'اللاذقية': ['Latakia', 'اللاذقية'],
  'Latakia': ['اللاذقية', 'Latakia'],
};

export function expandQueryCity(query: string): string[] {
  const q = query.trim();
  if (!q) return [];
  const lower = q.toLowerCase();
  for (const [key, aliases] of Object.entries(QUERY_CITY_ALIASES)) {
    if (lower === key.toLowerCase() || key.toLowerCase() === lower) return Array.from(aliases);
  }
  return [];
}

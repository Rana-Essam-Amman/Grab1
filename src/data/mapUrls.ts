export function googleSearchQuery({
  city,
  area,
  site = '',
}: {
  city: string;
  area: string;
  site?: string;
}): string {
  return [site, area, city].filter((e) => e && e.trim().length > 0).join(', ');
}

export function googleMapsEmbedUrl(query: string, fallbackDefault = ''): string {
  const target = query.trim() || fallbackDefault.trim();
  const q = encodeURIComponent(target);
  return `https://maps.google.com/maps?q=${q}&hl=ar&z=14&output=embed`;
}

export function googleMapsOpenUrl(query: string, fallbackDefault = ''): string {
  const target = query.trim() || fallbackDefault.trim();
  const q = encodeURIComponent(target);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

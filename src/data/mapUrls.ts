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

export function googleMapsEmbedUrl(query: string): string {
  const q = encodeURIComponent(query.trim() || 'Amman');
  return `https://maps.google.com/maps?q=${q}&hl=ar&z=14&output=embed`;
}

export function googleMapsOpenUrl(query: string): string {
  const q = encodeURIComponent(query.trim() || 'Amman');
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

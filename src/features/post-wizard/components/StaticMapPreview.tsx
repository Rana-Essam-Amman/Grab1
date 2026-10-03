import React from 'react';

interface Props {
  readonly city: string;
  readonly neighborhood: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly isArabic?: boolean;
}

export const StaticMapPreview: React.FC<Props> = ({
  city,
  neighborhood,
  latitude,
  longitude,
}) => {
  const hasCoords =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const query = hasCoords
    ? `${latitude},${longitude}`
    : [neighborhood, city].filter(Boolean).join(', ');

  if (!query) return null;

  const googleSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=${
    hasCoords ? 17 : 14
  }`;

  return (
    <div className="rounded-2xl overflow-hidden border border-line h-40">
      <iframe
        title="location-map"
        src={googleSrc}
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
};

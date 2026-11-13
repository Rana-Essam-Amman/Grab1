export function buildMissingRequiredLabels(
  title: string,
  price: string,
  titleLabel: string,
  priceLabel: string,
  missingAttrLabels: readonly string[],
): string[] {
  return [
    ...(!title ? [titleLabel] : []),
    ...(!price ? [priceLabel] : []),
    ...missingAttrLabels,
  ];
}

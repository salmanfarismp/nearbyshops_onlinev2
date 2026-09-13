/**
 * Formats the price string.
 * If the price is numeric (e.g., "10", "12.5", "499"), it prepends "₹".
 * Otherwise, it returns the custom price string as-is (e.g., "Free", "Contact Store").
 * Ported from nearbyshops-app/src/utils/price.ts for consistent cross-platform presentation.
 */
export const formatPrice = (
  price: string | number | null | undefined,
): string => {
  if (price === null || price === undefined) return "";
  const priceStr = price.toString().trim();
  if (priceStr === "") return "";

  // Regex to check if it's a numeric value (e.g., optional decimal places)
  const isNumeric = /^\d+([.,]\d+)?$/.test(priceStr);
  return isNumeric ? `₹${priceStr}` : priceStr;
};

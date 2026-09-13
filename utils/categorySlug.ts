/**
 * Utility functions for slugifying and resolving StoreCategory names in URLs.
 * Handles symbols like '&', multiple spaces, and special characters cleanly.
 */

export function toCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findCategoryBySlug<T extends { name: string }>(
  categories: T[],
  slug: string,
): T | null {
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Direct match with slugified name (e.g. "exclusive-fashion" === "exclusive-fashion")
  const exactMatch = categories.find(
    (c) => toCategorySlug(c.name) === normalizedSlug,
  );
  if (exactMatch) return exactMatch;

  // 2. Fallback: match replacing hyphens with spaces or 'and' with '&'
  const fallback = categories.find((c) => {
    const cName = c.name.toLowerCase().trim();
    const candidate1 = normalizedSlug.replace(/-/g, " ");
    const candidate2 = candidate1.replace(/\band\b/g, "&");
    return cName === candidate1 || cName === candidate2;
  });

  return fallback || null;
}

import { MetadataRoute } from "next";
import { createServerClient } from "@supabase/ssr";
import { toCategorySlug } from "@/utils/categorySlug";

export const revalidate = 86400; // Revalidate dynamic sitemap daily

const DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

/**
 * Dynamic sitemap — queries all active stores, products with public stores,
 * and essential static routes.
 * Submitted to Google Search Console at: wandershops.com/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use a cookie-less service-role client (no auth needed — read-only public data)
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${DOMAIN}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${DOMAIN}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // ── Local City Directories (Location Net) ──
  const { data: cityPlaces, error: cityError } = await supabase
    .from("Place")
    .select("city")
    .not("city", "is", null);

  if (cityError) {
    console.error("Sitemap generation error (City):", cityError);
  }

  const uniqueCities = Array.from(
    new Set(
      (cityPlaces ?? [])
        .map((p) => p.city?.trim())
        .filter((c): c is string => Boolean(c))
    )
  );

  for (const city of uniqueCities) {
    entries.push({
      url: `${DOMAIN}/web/local/${encodeURIComponent(city.toLowerCase())}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  // ── Local City Category Spokes (Only categories with at least 1 public store) ──
  const { data: activeStoreCategories, error: activeCatError } = await supabase
    .from("Store")
    .select("category:StoreCategory!inner(name), place:Place!inner(city)")
    .eq("is_public", true)
    .not("category_id", "is", null)
    .not("place_id", "is", null);

  if (activeCatError) {
    console.error("Sitemap generation error (Store Categories):", activeCatError);
  }

  const uniqueCityCategoryPairs = new Set<string>();
  for (const item of activeStoreCategories ?? []) {
    const rawPlace: any = item.place;
    const storePlace = Array.isArray(rawPlace) ? rawPlace[0] : rawPlace;
    const rawCat: any = item.category;
    const storeCat = Array.isArray(rawCat) ? rawCat[0] : rawCat;

    const city = storePlace?.city?.trim().toLowerCase();
    const catName = storeCat?.name;
    if (city && catName) {
      const catSlug = toCategorySlug(catName);
      uniqueCityCategoryPairs.add(`${encodeURIComponent(city)}/category/${catSlug}`);
    }
  }

  for (const pair of uniqueCityCategoryPairs) {
    entries.push({
      url: `${DOMAIN}/web/local/${pair}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // ── Stores ──
  const { data: stores, error: storesError } = await supabase
    .from("Store")
    .select("slug, created_at")
    .eq("is_public", true)
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  if (storesError) {
    console.error("Sitemap generation error (Store):", storesError);
  }

  for (const store of stores ?? []) {
    if (store.slug) {
      entries.push({
        url: `${DOMAIN}/web/shop/${store.slug}`,
        lastModified: store.created_at ? new Date(store.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // ── Products (Only for public stores to guarantee zero 404 URLs) ──
  const { data: products, error: productsError } = await supabase
    .from("Product")
    .select("id, slug, created_at, store:Store!inner(is_public)")
    .eq("is_active", true)
    .eq("store.is_public", true)
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Sitemap generation error (Product):", productsError);
  }

  for (const product of products ?? []) {
    entries.push({
      url: `${DOMAIN}/web/product/${product.slug || product.id}`,
      lastModified: product.created_at
        ? new Date(product.created_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}


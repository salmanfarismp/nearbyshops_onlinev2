import { MetadataRoute } from "next";
import { createServerClient } from "@supabase/ssr";

const DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

/**
 * Dynamic sitemap — queries all active stores (with slugs) and
 * all active products. Submitted to Google Search Console at:
 *   wandershops.com/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use a cookie-less service-role client (no auth needed — read-only public data)
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );

  const entries: MetadataRoute.Sitemap = [];

  // ── Stores ──
  const { data: stores } = await supabase
    .from("Store")
    .select("slug, updated_at")
    .eq("is_public", true)
    .not("slug", "is", null)
    .order("updated_at", { ascending: false });

  for (const store of stores ?? []) {
    if (store.slug) {
      entries.push({
        url: `${DOMAIN}/web/shop/${store.slug}`,
        lastModified: store.updated_at ? new Date(store.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // ── Products ──
  const { data: products } = await supabase
    .from("Product")
    .select("id, updated_at")
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  for (const product of products ?? []) {
    entries.push({
      url: `${DOMAIN}/web/product/${product.id}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}

import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { createPublicClient } from "@/utils/supabase/server";
import { getTransformedUrl } from "@/utils/image";
import { parsePostGisPoint } from "@/utils/geo";
import {
  getSchemaBusinessType,
  buildBreadcrumbsJsonLd,
  buildFaqJsonLd,
} from "@/utils/seo";
import { findCategoryBySlug } from "@/utils/categorySlug";
import OpenInAppBanner from "@/components/web/OpenInAppBanner";
import WebHeader from "@/components/web/WebHeader";
import DownloadAppBanner from "@/components/web/DownloadAppBanner";
import LocalExploreClient, {
  SerializedStore,
} from "@/components/web/LocalExploreClient";
import { PlaceNode } from "@/components/web/LocationNetMesh";

type Props = {
  params: Promise<{ slug: string; categorySlug: string }>;
};

export const revalidate = 300;

/* ─────────────────────────────────────────────
   Single memoized fetcher for City + Category
   Guarantees zero-thin-content gating.
───────────────────────────────────────────── */
const getCityCategoryData = cache(
  async (citySlug: string, categorySlug: string) => {
    const supabase = createPublicClient();
    const normalizedCityName = decodeURIComponent(citySlug)
      .replace(/-/g, " ")
      .trim();

    // 1. Fetch places in this city
    const { data: places, error: placesError } = await supabase
      .from("Place")
      .select("id, name, city, state, location")
      .ilike("city", normalizedCityName)
      .order("name", { ascending: true });

    if (placesError || !places || places.length === 0) {
      return null;
    }

    const canonicalCity = places[0].city || normalizedCityName;
    const stateName = places[0].state || "Kerala";

    // 2. Fetch all categories and match the slug
    const { data: categories, error: catError } = await supabase
      .from("StoreCategory")
      .select("id, name")
      .eq("is_visible", true)
      .order("priority", { ascending: false });

    if (catError || !categories || categories.length === 0) {
      return null;
    }

    const category = findCategoryBySlug(categories, categorySlug);
    if (!category) {
      return null;
    }

    // 3. Fetch stores in this city matching this category
    const { data: stores, error: storesError } = await supabase
      .from("Store")
      .select(`
        id, name, slug, address, profile_url, banner_url,
        computed_avg_rating, computed_review_count,
        opening_time, closing_time, open_days, location,
        category:StoreCategory(id, name),
        place:Place!inner(id, name, city, state, location)
      `)
      .ilike("place.city", canonicalCity)
      .eq("category_id", category.id)
      .eq("is_public", true)
      .order("computed_avg_rating", { ascending: false, nullsFirst: false });

    if (storesError || !stores) {
      return null;
    }

    // 4. Strict Quality Gate: No thin/empty category pages
    if (stores.length === 0) {
      return null;
    }

    // 5. Query categories that actually have public stores in this city
    const { data: cityStoreCats } = await supabase
      .from("Store")
      .select("category_id, place:Place!inner(city)")
      .ilike("place.city", canonicalCity)
      .eq("is_public", true)
      .not("category_id", "is", null);

    const activeCatIds = new Set(
      (cityStoreCats || []).map((row) => row.category_id),
    );
    const activeCityCategories = categories.filter((c) =>
      activeCatIds.has(c.id),
    );

    return {
      city: canonicalCity,
      state: stateName,
      category,
      places,
      stores,
      categories: activeCityCategories,
    };
  },
);

/* ─────────────────────────────────────────────
   Dynamic Laser-Targeted Metadata
───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, categorySlug } = await params;
  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";
  const data = await getCityCategoryData(slug, categorySlug);

  if (!data) {
    return {
      title: "Category Not Found | Wandershops",
      description: "Explore neighborhood stores and verified businesses on Wandershops.",
    };
  }

  const { city, state, category, stores } = data;
  const storeCount = stores.length;

  const title = `Best ${category.name} Stores & Shops in ${city}, ${state} | Wandershops`;
  const description = `Find ${storeCount} verified ${category.name} store${storeCount === 1 ? "" : "s"} in ${city}. Browse catalogues with prices, check hours, and order directly on WhatsApp.`;

  const bannerImage =
    stores.find((s) => s.banner_url || s.profile_url)?.banner_url ||
    stores.find((s) => s.profile_url)?.profile_url;
  const ogImageUrl = bannerImage
    ? getTransformedUrl(bannerImage) || `${DOMAIN}/assets/ad-icon.png`
    : `${DOMAIN}/assets/ad-icon.png`;

  return {
    title,
    description,
    keywords: [
      `${category.name} in ${city}`,
      `${category.name} stores ${city}`,
      `${category.name} shops in ${city}`,
      `best ${category.name} ${city}`,
      `buy ${category.name} ${city}`,
      `shops in ${city}`,
    ],
    alternates: {
      canonical: `${DOMAIN}/web/local/${slug.toLowerCase()}/category/${categorySlug.toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      url: `${DOMAIN}/web/local/${slug.toLowerCase()}/category/${categorySlug.toLowerCase()}`,
      siteName: "Wandershops",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${category.name} stores in ${city} on Wandershops`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/* ─────────────────────────────────────────────
   Category Spoke Page Component
───────────────────────────────────────────── */
export default async function LocalCityCategoryPage({ params }: Props) {
  const { slug, categorySlug } = await params;
  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";
  const data = await getCityCategoryData(slug, categorySlug);

  if (!data) {
    notFound();
  }

  const { city, state, category, places, stores, categories } = data;
  const citySlug = slug.toLowerCase();
  const cleanCategorySlug = categorySlug.toLowerCase();

  // Store count per place
  const storeCountMap = new Map<string, number>();
  for (const store of stores) {
    const rawPlace: any = store.place;
    const storePlace = Array.isArray(rawPlace) ? rawPlace[0] : rawPlace;
    const pName = storePlace?.name?.trim().toLowerCase();
    if (pName) {
      storeCountMap.set(pName, (storeCountMap.get(pName) || 0) + 1);
    }
  }

  const placeNodes: PlaceNode[] = places.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city,
    state: p.state,
    storeCount: storeCountMap.get(p.name.trim().toLowerCase()) || 0,
  }));

  /* ─────────────────────────────────────────────
     Schema.org: ItemList with Specialized Business Types
  ───────────────────────────────────────────── */
  const schemaType = getSchemaBusinessType(category.name);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} Stores in ${city}`,
    description: `Directory of verified ${category.name} shops in ${city}, ${state}`,
    numberOfItems: stores.length,
    itemListElement: stores.map((store, index) => {
      const storeSlug = store.slug || store.id;
      const rawPlace: any = store.place;
      const storePlace = Array.isArray(rawPlace) ? rawPlace[0] : rawPlace;
      const placeName = storePlace?.name;
      const storeImg = getTransformedUrl(store.profile_url || store.banner_url);
      const storeGeo = parsePostGisPoint(store.location);

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": schemaType,
          name: store.name,
          url: `${DOMAIN}/web/shop/${storeSlug}`,
          ...(storeImg ? { image: storeImg } : {}),
          address: {
            "@type": "PostalAddress",
            streetAddress: store.address || undefined,
            addressLocality: placeName || city,
            addressRegion: state,
            addressCountry: "IN",
          },
          ...(storeGeo
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: storeGeo.lat,
                  longitude: storeGeo.lon,
                },
              }
            : {}),
          ...((store.computed_review_count ?? 0) > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: store.computed_avg_rating || 5,
                  reviewCount: store.computed_review_count || 1,
                  bestRating: 5,
                  worstRating: 1,
                },
              }
            : {}),
        },
      };
    }),
  };

  /* ─────────────────────────────────────────────
     Schema.org: BreadcrumbList (Hub & Spoke Hierarchy)
  ───────────────────────────────────────────── */
  const breadcrumbJsonLd = buildBreadcrumbsJsonLd([
    { name: "Home", url: DOMAIN },
    { name: "Local", url: `${DOMAIN}/web/local/${citySlug}` },
    { name: city, url: `${DOMAIN}/web/local/${citySlug}` },
    {
      name: category.name,
      url: `${DOMAIN}/web/local/${citySlug}/category/${cleanCategorySlug}`,
    },
  ]);

  /* ─────────────────────────────────────────────
     Schema.org: FAQPage Tailored to this Category & City
  ───────────────────────────────────────────── */
  const topStoresStr = stores
    .slice(0, 3)
    .map((s) => s.name)
    .join(", ");

  const faqJsonLd = buildFaqJsonLd([
    {
      question: `Where can I find verified ${category.name} stores in ${city}?`,
      answer: `Wandershops features verified ${category.name} stores in ${city} including ${topStoresStr}. You can view updated catalogues and store locations directly online.`,
    },
    {
      question: `Can I order ${category.name} products directly on WhatsApp in ${city}?`,
      answer: `Yes, each ${category.name} store listed in ${city} has a direct WhatsApp contact button allowing customers to check stock, inquire about pricing, and order without middleman fees.`,
    },
    {
      question: `What are the operating hours for ${category.name} shops in ${city}?`,
      answer: `Most ${category.name} shops in ${city} operate between 8:30 AM and 9:00 PM. Individual store hours are listed on each merchant profile.`,
    },
  ]);

  // Serialize stores for Client Component
  const serializedStores: SerializedStore[] = stores.map((s) => {
    const rawCat: any = s.category;
    const sCat = Array.isArray(rawCat) ? rawCat[0] : rawCat;
    const rawPlace: any = s.place;
    const sPlace = Array.isArray(rawPlace) ? rawPlace[0] : rawPlace;
    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      profile_url: s.profile_url,
      computed_avg_rating: s.computed_avg_rating,
      computed_review_count: s.computed_review_count,
      location: s.location,
      category: sCat ? { id: sCat.id, name: sCat.name } : null,
      place: sPlace
        ? {
            id: sPlace.id,
            name: sPlace.name,
            city: sPlace.city,
            state: sPlace.state,
          }
        : null,
    };
  });

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* ── JSON-LD Schemas ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Smart App Banner ── */}
      <OpenInAppBanner
        appScheme={`wandershops://explore?city=${encodeURIComponent(citySlug)}&category=${encodeURIComponent(cleanCategorySlug)}`}
      />

      {/* ── Header with Back link to City Hub ── */}
      <WebHeader
        backHref={`/web/local/${citySlug}`}
        backLabel={`All ${city} Stores`}
        title={`${category.name} in ${city}`}
        shareUrl={`${DOMAIN}/web/local/${citySlug}/category/${cleanCategorySlug}`}
      />

      {/* ── Main Interactive Discovery Feed ── */}
      <main className="flex-1">
        <LocalExploreClient
          city={city}
          citySlug={citySlug}
          stores={serializedStores}
          places={placeNodes}
          categories={serializedCategories}
          initialCategoryId={category.id}
        />
      </main>

      {/* ── App Download Banner Footer ── */}
      <footer className="mt-auto">
        <DownloadAppBanner />
      </footer>
    </div>
  );
}

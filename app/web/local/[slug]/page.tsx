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
import OpenInAppBanner from "@/components/web/OpenInAppBanner";
import WebHeader from "@/components/web/WebHeader";
import DownloadAppBanner from "@/components/web/DownloadAppBanner";
import LocalExploreClient, {
  SerializedStore,
} from "@/components/web/LocalExploreClient";
import { PlaceNode } from "@/components/web/LocationNetMesh";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

/* ─────────────────────────────────────────────
   Single memoized data fetcher — React deduplicates this across
   generateMetadata and the page body so only one Supabase round-trip occurs.
───────────────────────────────────────────── */
const getCityExploreData = cache(async (citySlug: string) => {
  const supabase = createPublicClient();
  const normalizedCityName = decodeURIComponent(citySlug)
    .replace(/-/g, " ")
    .trim();

  // 1. Fetch all places with city == normalizedCityName
  const { data: places, error: placesError } = await supabase
    .from("Place")
    .select("id, name, city, state, location")
    .ilike("city", normalizedCityName)
    .order("name", { ascending: true });

  if (placesError) {
    console.error("Error fetching places for city:", placesError);
  }

  // If no places found with this city name, return empty
  if (!places || places.length === 0) {
    return {
      city: normalizedCityName,
      places: [],
      stores: [],
      categories: [],
      error: placesError,
    };
  }

  const canonicalCity = places[0].city || normalizedCityName;
  const stateName = places[0].state || "Kerala";

  // 2. Fetch all public stores that belong to places in this city
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
    .eq("is_public", true)
    .order("computed_avg_rating", { ascending: false, nullsFirst: false });

  if (storesError) {
    console.error("Error fetching stores for city:", storesError);
  }

  // 3. Fetch store categories
  const { data: categories } = await supabase
    .from("StoreCategory")
    .select("id, name")
    .eq("is_visible", true)
    .order("priority", { ascending: false });

  return {
    city: canonicalCity,
    state: stateName,
    places: places ?? [],
    stores: stores ?? [],
    categories: categories ?? [],
    error: null,
  };
});

/* ─────────────────────────────────────────────
   Dynamic SEO & AEO Metadata
───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";
  const { city, state, places, stores } = await getCityExploreData(slug);

  if (!places || places.length === 0) {
    return {
      title: "City Not Found | Wandershops",
      description: "Explore neighborhood shops and verified local businesses on Wandershops.",
    };
  }

  const citySlug = slug.toLowerCase();
  const placeNames = places.map((p) => p.name);
  const sampleLocalities = placeNames.slice(0, 5).join(", ");
  const storeCount = stores.length;

  const title = `Local Shops & Stores in ${city} – Neighborhood Directory | Wandershops`;
  const description = `Discover ${storeCount}+ verified local shops and neighborhood boutiques in ${city}, ${state}. Browse catalogues, check hours, and order directly on WhatsApp across ${sampleLocalities}.`;

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
      `shops in ${city}`,
      `stores in ${city}`,
      `local shops ${city}`,
      `${city} shopping directory`,
      `${city} neighborhood stores`,
      `buy local in ${city}`,
      ...placeNames.map((p) => `shops in ${p}`),
    ],
    alternates: {
      canonical: `${DOMAIN}/web/local/${citySlug}`,
    },
    openGraph: {
      title,
      description,
      url: `${DOMAIN}/web/local/${citySlug}`,
      siteName: "Wandershops",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Local stores in ${city} on Wandershops`,
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
   Local City Discovery Page Component
───────────────────────────────────────────── */
export default async function LocalCityPage({ params }: Props) {
  const { slug } = await params;
  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";
  const { city, state, places, stores, categories } =
    await getCityExploreData(slug);

  if (!places || places.length === 0) {
    notFound();
  }

  const citySlug = slug.toLowerCase();

  // ── Calculate Store Count per Place for Location Net ──
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

  // ── Compute Geographic Centroid for City Entity ──
  let totalLat = 0;
  let totalLon = 0;
  let validPointsCount = 0;

  const placesJsonLd = places.map((p) => {
    const pt = parsePostGisPoint(p.location);
    if (pt) {
      totalLat += pt.lat;
      totalLon += pt.lon;
      validPointsCount++;
    }
    return {
      "@type": "Place",
      name: p.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: p.name,
        addressRegion: p.state || state,
        addressCountry: "IN",
      },
      ...(pt
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: pt.lat,
              longitude: pt.lon,
            },
          }
        : {}),
    };
  });

  const cityCentroid =
    validPointsCount > 0
      ? {
          lat: totalLat / validPointsCount,
          lon: totalLon / validPointsCount,
        }
      : null;

  /* ─────────────────────────────────────────────
     Schema.org: ItemList / CollectionPage
  ───────────────────────────────────────────── */
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Stores and Local Businesses in ${city}`,
    description: `Directory of verified neighborhood shops in ${city}, ${state}`,
    numberOfItems: stores.length,
    itemListElement: stores.map((store, index) => {
      const storeSlug = store.slug || store.id;
      const rawCat: any = store.category;
      const storeCat = Array.isArray(rawCat) ? rawCat[0] : rawCat;
      const rawPlace: any = store.place;
      const storePlace = Array.isArray(rawPlace) ? rawPlace[0] : rawPlace;
      const categoryName = storeCat?.name;
      const placeName = storePlace?.name;
      const storeImg = getTransformedUrl(store.profile_url || store.banner_url);
      const storeGeo = parsePostGisPoint(store.location);

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": getSchemaBusinessType(categoryName),
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
     Schema.org: City Entity (Location Net Mesh)
  ───────────────────────────────────────────── */
  const cityEntityJsonLd = {
    "@context": "https://schema.org",
    "@type": "City",
    name: city,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: state,
    },
    ...(cityCentroid
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: cityCentroid.lat,
            longitude: cityCentroid.lon,
          },
        }
      : {}),
    containsPlace: placesJsonLd,
  };

  /* ─────────────────────────────────────────────
     Schema.org: BreadcrumbList
  ───────────────────────────────────────────── */
  const breadcrumbJsonLd = buildBreadcrumbsJsonLd([
    { name: "Home", url: DOMAIN },
    { name: "Local", url: `${DOMAIN}/web/local/${citySlug}` },
    { name: city, url: `${DOMAIN}/web/local/${citySlug}` },
  ]);

  /* ─────────────────────────────────────────────
     Schema.org: FAQPage for AI Answer Engines
  ───────────────────────────────────────────── */
  const samplePlacesStr = places
    .slice(0, 6)
    .map((p) => p.name)
    .join(", ");
  const faqJsonLd = buildFaqJsonLd([
    {
      question: `What kinds of local stores are listed in ${city} on Wandershops?`,
      answer: `Wandershops features verified local stores in ${city} across categories such as Exclusive Fashion, Clothing & Boutiques, Grocery & Provision Stores, Electronics, Home & Hardware, and Food Establishments.`,
    },
    {
      question: `Can I order directly on WhatsApp from shops in ${city}?`,
      answer: `Yes, Wandershops provides verified direct WhatsApp buttons on store and product pages so you can chat with merchants in ${city}, confirm availability, and order with zero platform commissions.`,
    },
    {
      question: `Which neighborhoods in ${city} are covered in the Location Net?`,
      answer: `The ${city} Location Net covers ${places.length} localities including ${samplePlacesStr}${places.length > 6 ? ", and more" : ""}.`,
    },
    {
      question: `How can local shop owners in ${city} get listed on Wandershops?`,
      answer: `Business owners in ${city} can register through the Wandershops Vendor App or portal, set up their store profile and WhatsApp number, and start showcasing their catalogue immediately.`,
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

  // Only include categories that have at least 1 verified store in this city
  const categoriesWithStores = categories.filter((c) =>
    stores.some((s) => {
      const rawCat: any = s.category;
      const sCat = Array.isArray(rawCat) ? rawCat[0] : rawCat;
      return (
        sCat?.id === c.id ||
        sCat?.name?.toLowerCase() === c.name.toLowerCase()
      );
    }),
  );

  const serializedCategories = categoriesWithStores.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* ── JSON-LD Schemas for Search & AI Answer Engines ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityEntityJsonLd) }}
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
        appScheme={`wandershops://explore?city=${encodeURIComponent(citySlug)}`}
      />

      {/* ── Top Header with Current Location indicator ── */}
      <WebHeader
        title={`Stores in ${city}, ${state}`}
        shareUrl={`${DOMAIN}/web/local/${citySlug}`}
      />

      {/* ── Main Interactive Discovery Feed (ExploreScreen UI) ── */}
      <main className="flex-1">
        <LocalExploreClient
          city={city}
          citySlug={citySlug}
          stores={serializedStores}
          places={placeNodes}
          categories={serializedCategories}
        />
      </main>

      {/* ── App Download Banner Footer ── */}
      <footer className="mt-auto">
        <DownloadAppBanner />
      </footer>
    </div>
  );
}

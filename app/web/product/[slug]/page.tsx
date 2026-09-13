import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { createPublicClient } from "@/utils/supabase/server";
import { getTransformedUrl } from "@/utils/image";
import {
  getSchemaBusinessType,
  buildBreadcrumbsJsonLd,
  cleanPrice,
  getPriceValidUntil,
} from "@/utils/seo";
import OpenInAppBanner from "@/components/web/OpenInAppBanner";
import ProductInteractiveView from "@/components/web/ProductInteractiveView";
import { formatPrice } from "@/utils/price";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

/* ─────────────────────────────────────────────
   Single memoized data fetcher — React deduplicates this across
   generateMetadata and the page body so only one Supabase round-trip occurs.
   Supports both slug and id lookup fallback to prevent 404s.
───────────────────────────────────────────── */
const getProduct = cache(async (slugOrId: string) => {
  const supabase = createPublicClient();
  const selectQuery = `
    *,
    category:ProductCategory(id, name),
    images:ProductImage(*),
    store:Store(
      *,
      category:StoreCategory(id, name),
      place:Place(id, name),
      permissions:StorePermission(*)
    )
  `;

  // First attempt: lookup by slug
  const { data: productBySlug, error: slugError } = await supabase
    .from("Product")
    .select(selectQuery)
    .eq("slug", slugOrId)
    .maybeSingle();

  if (productBySlug) {
    return { data: productBySlug, error: null };
  }

  // Fallback: lookup by id (e.g. legacy links or sitemap)
  const { data: productById, error: idError } = await supabase
    .from("Product")
    .select(selectQuery)
    .eq("id", slugOrId)
    .maybeSingle();

  return { data: productById, error: idError || slugError };
});

/* ─────────────────────────────────────────────
   Dynamic metadata
───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await getProduct(slug);

  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

  if (
    !product ||
    (product as any).is_active === false ||
    (product.store as any)?.is_public === false
  ) {
    return { title: "Product not found | Wandershops" };
  }

  const primaryImg =
    (product.images as any[])?.find((img) => img.is_primary) ||
    (product.images as any[])?.[0];
  const imageUrl =
    getTransformedUrl(primaryImg?.img_url) || `${DOMAIN}/assets/ad-icon.png`;

  const storeName = (product.store as any)?.name;
  const placeName = (product.store as any)?.place?.name;
  const storeCategory = (product.store as any)?.category?.name;
  const productCategory = (product.category as any)?.name;
  const productSlugOrId = product.slug || product.id;

  let title = `${product.name} | Wandershops`;
  if (storeName && placeName) {
    title = `${product.name} – ${storeName}, ${placeName} | Wandershops`;
  } else if (storeName) {
    title = `${product.name} at ${storeName} | Wandershops`;
  }

  const description =
    product.description ||
    (storeName && placeName
      ? `Buy ${product.name} from ${storeName} (${storeCategory || "Local store"}) in ${placeName}. View price, details, and order directly on WhatsApp via Wandershops.`
      : `View ${product.name} on Wandershops — your local shopping platform.`);

  const keywords = [
    product.name,
    storeName,
    productCategory,
    storeCategory,
    placeName,
    placeName ? `buy ${product.name} in ${placeName}` : null,
    storeName && placeName ? `${storeName} ${placeName}` : null,
    "Wandershops",
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `${DOMAIN}/web/product/${productSlugOrId}` },
    openGraph: {
      title,
      description,
      url: `${DOMAIN}/web/product/${productSlugOrId}`,
      siteName: "Wandershops",
      images: [{ url: imageUrl, width: 1200, height: 1200, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/* ─────────────────────────────────────────────
   Page (Server Component)
───────────────────────────────────────────── */
export default async function ProductWebPage({ params }: Props) {
  const { slug } = await params;
  const { data: product, error } = await getProduct(slug);

  if (
    error ||
    !product ||
    product.is_active === false ||
    (product.store as any)?.is_public === false
  ) {
    notFound();
  }

  // Consolidate SEO authority: redirect ID-based hits to canonical slug
  if (product.slug && slug !== product.slug) {
    permanentRedirect(`/web/product/${product.slug}`);
  }

  /* ── Data Processing (mirrors native product/[id].tsx) ── */

  // Images sorted by display_order
  const sortedImages = ((product.images as any[]) || []).sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0),
  );
  const imageUrls: string[] = sortedImages
    .map((img: any) => getTransformedUrl(img.img_url))
    .filter(Boolean);

  // Ratings (precomputed on Product table)
  const reviewCount = Number((product as any).computed_review_count ?? 0);
  const averageRating = Number((product as any).computed_avg_rating ?? 0);

  // Store permissions & details
  const store = product.store as any;
  const getPermission = (type: string) =>
    store?.permissions?.find((p: any) => p.service_type === type && p.show);

  const whatsappPerm = getPermission("whatsapp");
  const whatsappNumber = String(
    whatsappPerm?.phone_number || whatsappPerm?.url || "",
  ).replace(/\D/g, "");

  const storeLogo = getTransformedUrl(store?.profile_url);
  const storeCategoryName = store?.category?.name || null;
  const placeName = store?.place?.name || null;
  const productCategoryName = (product.category as any)?.name || null;
  const productSlugOrId = product.slug || product.id;

  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

  const WhatsappShareUrl = `${DOMAIN}/web/product/${productSlugOrId}`;
  const whatsappMessage = encodeURIComponent(
    `Hi, I found this product on Wandershops: ${WhatsappShareUrl}`,
  );
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : null;

  /* ── JSON-LD Product ── */
  const primaryImg =
    sortedImages.find((img: any) => img.is_primary) || sortedImages[0];
  const primaryImageUrl = getTransformedUrl(primaryImg?.img_url) || "";

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: imageUrls.length > 0 ? imageUrls : [primaryImageUrl].filter(Boolean),
    url: `${DOMAIN}/web/product/${productSlugOrId}`,
  };

  if (productCategoryName) {
    jsonLd.category = productCategoryName;
  }

  if (store?.name) {
    jsonLd.brand = { "@type": "Brand", name: store.name };
  }

  const numericPrice = cleanPrice(product.price);
  if (numericPrice !== undefined) {
    const priceValidUntil = getPriceValidUntil(90);

    jsonLd.offers = {
      "@type": "Offer",
      price: numericPrice,
      priceCurrency: "INR",
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStoreOnly",
      availableDeliveryMethod: "https://schema.org/OnSitePickup",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/InStoreOnly",
        returnMethod: "https://schema.org/ReturnInStore",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
        },
      },
      url: `${DOMAIN}/web/product/${productSlugOrId}`,
      seller: {
        "@type": getSchemaBusinessType(storeCategoryName),
        name: store?.name,
        address:
          store?.address || placeName
            ? {
                "@type": "PostalAddress",
                streetAddress: store?.address || undefined,
                addressLocality: placeName || undefined,
              }
            : undefined,
      },
    };
  }

  if (reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: parseFloat(averageRating.toFixed(1)),
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  /* ── BreadcrumbList JSON-LD ── */
  const breadcrumbItems = [{ name: "Home", url: DOMAIN }];
  if (store?.name && store?.slug) {
    breadcrumbItems.push({
      name: store.name,
      url: `${DOMAIN}/web/shop/${store.slug}`,
    });
  }
  breadcrumbItems.push({
    name: product.name,
    url: `${DOMAIN}/web/product/${productSlugOrId}`,
  });

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd(breadcrumbItems);

  const shareUrl = `/web/product/${productSlugOrId}`;

  return (
    <>
      {/* Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Open-in-App banner */}
      <OpenInAppBanner entityId={product.id} type="product" />

      {/* ── SEO: Visually-hidden semantic block ──────────────────────────────
          Invisible to users (CSS sr-only clip), but fully indexed by
          Googlebot as body text. Reinforces local commercial intent and details.
      ─────────────────────────────────────────────────────────────────── */}
      <section
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <h2>
          {product.name}
          {store?.name ? ` at ${store.name}` : ""}
          {placeName ? ` in ${placeName}` : ""}
        </h2>
        <p>
          Buy {product.name}
          {product.price ? ` for ${formatPrice(product.price)}` : ""}
          {store?.name ? ` from ${store.name}` : ""}
          {storeCategoryName ? ` (${storeCategoryName})` : ""}
          {placeName ? ` located in ${placeName}` : ""}.
          {store?.address ? ` Store Address: ${store.address}.` : ""}
          {product.description ? ` Details: ${product.description}.` : ""}
          {productCategoryName ? ` Category: ${productCategoryName}.` : ""}
          {reviewCount > 0
            ? ` Customer rating: ${averageRating.toFixed(1)} out of 5 stars based on ${reviewCount} reviews.`
            : ""}{" "}
          Contact store or order directly on WhatsApp through Wandershops.
        </p>
      </section>

      {/* ── Native-Parity Interactive 3-Snap Point Drawer View ── */}
      <ProductInteractiveView
        product={product}
        imageUrls={imageUrls}
        store={store}
        storeLogo={storeLogo}
        placeName={placeName}
        productCategoryName={productCategoryName}
        storeCategoryName={storeCategoryName}
        averageRating={averageRating}
        reviewCount={reviewCount}
        whatsappHref={whatsappHref}
        backHref={store?.slug ? `/web/shop/${store.slug}` : "/"}
        shareUrl={shareUrl}
      />
    </>
  );
}

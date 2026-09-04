import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { getTransformedUrl } from "@/utils/image";
import {
  getSchemaBusinessType,
  buildBreadcrumbsJsonLd,
  cleanPrice,
} from "@/utils/seo";
import OpenInAppBanner from "@/components/web/OpenInAppBanner";
import ProductCarousel from "@/components/web/ProductCarousel";
import ShareLink from "@/components/ui/ShareLink";

type Props = { params: Promise<{ id: string }> };

/* ─────────────────────────────────────────────
   Dynamic metadata
───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: product } = await supabase
    .from("Product")
    .select(
      `
      name,
      description,
      is_active,
      images:ProductImage(*),
      category:ProductCategory(name),
      store:Store(
        name,
        slug,
        is_public,
        category:StoreCategory(name),
        place:Place(name)
      )
    `,
    )
    .eq("id", id)
    .single();

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
    alternates: { canonical: `${DOMAIN}/web/product/${id}` },
    openGraph: {
      title,
      description,
      url: `${DOMAIN}/web/product/${id}`,
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
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: product, error } = await supabase
    .from("Product")
    .select(
      `
      *,
      category:ProductCategory(id, name),
      images:ProductImage(*),
      ratings:Rating(score),
      store:Store(
        *,
        category:StoreCategory(id, name),
        place:Place(id, name),
        permissions:StorePermission(*)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (
    error ||
    !product ||
    product.is_active === false ||
    (product.store as any)?.is_public === false
  ) {
    notFound();
  }

  /* ── Data Processing (mirrors native product/[id].tsx) ── */

  // Images sorted by display_order
  const sortedImages = ((product.images as any[]) || []).sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0),
  );
  const imageUrls: string[] = sortedImages
    .map((img: any) => getTransformedUrl(img.img_url))
    .filter(Boolean);

  // Ratings
  const reviewCount = product.ratings?.length ?? 0;
  const averageRating =
    reviewCount > 0
      ? (product.ratings as any[]).reduce(
          (sum: number, r: any) => sum + r.score,
          0,
        ) / reviewCount
      : 0;

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

  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

  const WhatsappShareUrl = `${DOMAIN}/web/product/${id}`;
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
    url: `${DOMAIN}/web/product/${id}`,
  };

  if (productCategoryName) {
    jsonLd.category = productCategoryName;
  }

  if (store?.name) {
    jsonLd.brand = { "@type": "Brand", name: store.name };
  }

  const numericPrice = cleanPrice(product.price);
  if (numericPrice !== undefined) {
    const priceValidUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    jsonLd.offers = {
      "@type": "Offer",
      price: numericPrice,
      priceCurrency: "INR",
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      url: `${DOMAIN}/web/product/${id}`,
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
    url: `${DOMAIN}/web/product/${id}`,
  });

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd(breadcrumbItems);

  const shareUrl = `/share?id=${id}&type=product`;

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
      <OpenInAppBanner entityId={id} type="product" />

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center px-4 py-3 gap-3">
          <Link
            href={store?.slug ? `/web/shop/${store.slug}` : "/"}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 flex-shrink-0"
            aria-label="Back to shop"
          >
            <span
              className="material-symbols-outlined text-slate-700"
              style={{ fontSize: "20px" }}
            >
              arrow_back_ios
            </span>
          </Link>
          <div className="flex-1" />
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50">
            <ShareLink href={shareUrl}>
              <span
                className="material-symbols-outlined text-slate-700"
                style={{ fontSize: "20px" }}
              >
                share
              </span>
            </ShareLink>
          </div>
        </div>
      </header>

      {/* ── Hero Carousel ── */}
      <ProductCarousel images={imageUrls} productName={product.name} />

      {/* ── Content Sheet (overlaps carousel) ── */}
      <div
        className="relative -mt-10 rounded-t-[32px] bg-white px-6 pt-4 pb-32 z-10"
        style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}
      >
        {/* Category & Place Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {productCategoryName && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#974800]/10 text-[#974800]">
              {productCategoryName}
            </span>
          )}
          {storeCategoryName && !productCategoryName && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#974800]/10 text-[#974800]">
              {storeCategoryName}
            </span>
          )}
          {placeName && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "11px" }}
              >
                location_on
              </span>
              {placeName}
            </span>
          )}
        </div>

        {/* Product name + price */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <h1 className="flex-1 text-[28px] font-extrabold text-[#0b1c30] leading-tight">
            {product.name}
          </h1>
          {product.price ? (
            <span
              className="text-2xl font-bold flex-shrink-0 mt-0.5"
              style={{ color: "#974800" }}
            >
              {product.price}
            </span>
          ) : null}
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 mb-6">
          <span style={{ color: "#f59e0b", fontSize: "18px" }}>★</span>
          <span className="text-sm font-bold text-[#0b1c30]">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-slate-400">
            ({reviewCount} reviews)
          </span>
        </div>

        {/* Description */}
        {product.description ? (
          <div className="mb-8">
            <p
              className="text-xs font-bold uppercase text-slate-400 mb-4"
              style={{ letterSpacing: "1.5px" }}
            >
              Description
            </p>
            <p className="text-[15px] text-slate-600 leading-6">
              {product.description}
            </p>
          </div>
        ) : null}

        {/* Store card */}
        {store && (
          <Link
            href={store.slug ? `/web/shop/${store.slug}` : "/"}
            className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 mb-6"
            style={{ textDecoration: "none" }}
          >
            {/* Store logo */}
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0">
              {storeLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={storeLogo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-200" />
              )}
            </div>

            {/* Store info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] font-bold uppercase text-[#974800] mb-0.5"
                style={{ letterSpacing: "0.5px" }}
              >
                Available at
              </p>
              <p className="text-base font-bold text-[#0b1c30] truncate">
                {store.name}
              </p>
              {(store.address || placeName) && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className="material-symbols-outlined text-slate-500"
                    style={{ fontSize: "14px" }}
                  >
                    location_on
                  </span>
                  <p className="text-xs text-slate-500 truncate">
                    {store.address || placeName}
                  </p>
                </div>
              )}
            </div>

            <span
              className="material-symbols-outlined text-slate-300 flex-shrink-0"
              style={{ fontSize: "24px" }}
            >
              chevron_right
            </span>
          </Link>
        )}
      </div>

      {/* ── Fixed Bottom WhatsApp CTA ── */}
      {whatsappHref && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 pb-8 pt-4 z-50 pointer-events-none">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 35%)",
            }}
          />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative pointer-events-auto flex items-center justify-center gap-3 w-full h-16 rounded-2xl text-white font-bold text-lg"
            style={{
              backgroundColor: "#25D366",
              boxShadow: "0 10px 30px rgba(37,211,102,0.35)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}

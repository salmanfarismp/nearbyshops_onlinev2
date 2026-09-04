import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { getTransformedUrl } from "@/utils/image";
import { parsePostGisPoint, buildOpeningHours } from "@/utils/geo";
import {
  getSchemaBusinessType,
  buildBreadcrumbsJsonLd,
  buildFaqJsonLd,
} from "@/utils/seo";
import OpenInAppBanner from "@/components/web/OpenInAppBanner";
import Link from "next/link";
import ShareLink from "@/components/ui/ShareLink";

type Props = { params: Promise<{ slug: string }> };

/* ─────────────────────────────────────────────
   Dynamic metadata (title, OG, keywords, canonical)
───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: shop } = await supabase
    .from("Store")
    .select(
      `
      name,
      description,
      banner_url,
      category:StoreCategory(name),
      place:Place(name)
    `,
    )
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

  if (!shop) {
    return { title: "Shop not found | Wandershops" };
  }

  const bannerUrl =
    getTransformedUrl(shop.banner_url) || `${DOMAIN}/assets/ad-icon.png`;

  const categoryName = (shop.category as any)?.name;
  const placeName = (shop.place as any)?.name;

  let title = shop.name;
  if (categoryName && placeName) {
    title = `${shop.name} – ${categoryName} in ${placeName} | Wandershops`;
  } else if (categoryName) {
    title = `${shop.name} – ${categoryName} | Wandershops`;
  } else if (placeName) {
    title = `${shop.name} in ${placeName} | Wandershops`;
  } else {
    title = `${shop.name} | Wandershops`;
  }

  const description =
    shop.description ||
    (categoryName && placeName
      ? `Browse ${categoryName} products from ${shop.name} in ${placeName}. View store hours, contact on WhatsApp, and order directly.`
      : `Browse products from ${shop.name} on Wandershops — the local shopping app.`);

  const keywords = [
    shop.name,
    categoryName,
    placeName,
    categoryName && placeName ? `${categoryName} in ${placeName}` : null,
    placeName ? `shops in ${placeName}` : null,
    "Wandershops",
    "local shopping",
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${DOMAIN}/web/shop/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${DOMAIN}/web/shop/${slug}`,
      siteName: "Wandershops",
      images: [{ url: bannerUrl, width: 1200, height: 630, alt: shop.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [bannerUrl],
    },
  };
}

/* ─────────────────────────────────────────────
   Page (Server Component)
───────────────────────────────────────────── */
export default async function ShopWebPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: shop, error } = await supabase
    .from("Store")
    .select(
      `
      *,
      category:StoreCategory(id, name),
      place:Place(id, name, lat, lng),
      permissions:StorePermission(*),
      categories:ProductCategory(
        *,
        products:Product(*, images:ProductImage(*)),
        total_count:Product(count)
      ),
      ratings:Rating(score)
    `,
    )
    .eq("slug", slug)
    .eq("is_public", true)
    .eq("categories.products.is_active", true)
    .eq("categories.total_count.is_active", true)
    .single();

  if (error || !shop || shop.is_public === false) notFound();

  /* ── Data Processing (mirrors native shop/[id].tsx) ── */

  // Ratings
  const reviewCount = shop.ratings?.length ?? 0;
  const averageRating =
    reviewCount > 0
      ? shop.ratings.reduce((sum: number, r: any) => sum + r.score, 0) /
        reviewCount
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percentage:
      reviewCount > 0
        ? Math.round(
            (shop.ratings.filter((r: any) => r.score === stars).length /
              reviewCount) *
              100,
          )
        : 0,
  }));

  // Permissions
  const getPermission = (type: string) =>
    shop.permissions?.find((p: any) => p.service_type === type && p.show);

  const whatsappPerm = getPermission("whatsapp");
  const phonePerm = getPermission("phone");
  const instaPerm = getPermission("instagram");
  const gmapPerm = getPermission("gmap");

  // Categories
  const mappedCategories = (shop.categories || [])
    .filter((c: any) => c.is_visible)
    .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
    .map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      total_count: c.total_count?.[0]?.count || 0,
      products: (c.products || []).map((p: any) => {
        const primaryImg =
          p.images?.find((img: any) => img.is_primary) || p.images?.[0];
        return {
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: p.price || "",
          image: getTransformedUrl(primaryImg?.img_url) || "",
        };
      }),
    }))
    .filter((c: any) => c.products.length > 0);

  // Images
  const bannerUrl = getTransformedUrl(shop.banner_url);
  const logoUrl = getTransformedUrl(shop.profile_url);

  // Hours & open status
  const openTimeStr =
    shop.opening_time && shop.closing_time
      ? `${shop.opening_time.slice(0, 5)} – ${shop.closing_time.slice(0, 5)}`
      : null;
  const currentDay = new Date().getDay();
  const isOpenToday = Array.isArray(shop?.open_days)
    ? shop.open_days.includes(String(currentDay)) ||
      shop.open_days.includes(currentDay)
    : false;

  // Geo
  const geoPoint = parsePostGisPoint(shop.location);

  // Category and place names
  const categoryName = (shop.category as any)?.name || null;
  const placeName = (shop.place as any)?.name || null;

  // Phone number from permissions
  const phoneNumber =
    phonePerm?.phone_number ||
    whatsappPerm?.phone_number ||
    whatsappPerm?.url ||
    null;

  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

  /* ── Specific Schema.org LocalBusiness ── */
  const schemaBusinessType = getSchemaBusinessType(categoryName);

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaBusinessType,
    name: shop.name,
    description:
      shop.description ||
      `Discover ${shop.name}, a verified ${categoryName || "local"} store in ${placeName || "your area"} on Wandershops.`,
    url: `${DOMAIN}/web/shop/${slug}`,
    image: [bannerUrl, logoUrl].filter(Boolean),
    logo: logoUrl || undefined,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI",
  };

  if (categoryName) {
    jsonLd.category = categoryName;
    jsonLd.department = categoryName;
  }

  if (shop.address || placeName) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: shop.address || undefined,
      addressLocality: placeName || undefined,
    };
  }

  if (geoPoint) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: geoPoint.lat,
      longitude: geoPoint.lon,
    };
    jsonLd.hasMap = gmapPerm?.url || undefined;
  }

  if (phoneNumber) {
    jsonLd.telephone = String(phoneNumber);
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

  const openingHours = buildOpeningHours(
    shop.open_days,
    shop.opening_time,
    shop.closing_time,
  );
  if (openingHours.length > 0) {
    jsonLd.openingHoursSpecification = openingHours;
  }

  /* ── BreadcrumbList JSON-LD ── */
  const breadcrumbItems = [
    { name: "Home", url: DOMAIN },
    { name: shop.name, url: `${DOMAIN}/web/shop/${slug}` },
  ];

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd(breadcrumbItems);

  /* ── AEO FAQPage JSON-LD ── */
  const faqs = [
    {
      question: `What products does ${shop.name} sell?`,
      answer: `${shop.name} is a verified ${categoryName || "retail"} store located in ${placeName || "the neighborhood"}. Browse their products, prices, and verified reviews on Wandershops.`,
    },
    {
      question: `Where is ${shop.name} located?`,
      answer: `${shop.name} is located at ${shop.address || "their verified address"}${placeName ? `, ${placeName}` : ""}. Directions are available via Google Maps.`,
    },
    {
      question: `How can I order from ${shop.name}?`,
      answer: phoneNumber
        ? `You can browse products on Wandershops and order directly by chatting with ${shop.name} on WhatsApp (${phoneNumber}).`
        : `You can browse products on Wandershops and order directly through the app.`,
    },
  ];

  if (openTimeStr) {
    faqs.push({
      question: `What are the opening hours of ${shop.name}?`,
      answer: `${shop.name} is open from ${openTimeStr}. Current status: ${isOpenToday ? "Open today" : "Closed today"}.`,
    });
  }

  const faqJsonLd = buildFaqJsonLd(faqs);

  /* ── WhatsApp URL helper ── */
  const whatsappHref = whatsappPerm
    ? `https://wa.me/${String(whatsappPerm.phone_number || whatsappPerm.url || "").replace(/\D/g, "")}`
    : null;

  const shareUrl = `/share?id=${slug}&type=shop`;

  return (
    <>
      {/* Specific Schema.org Business JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* AEO FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Geo meta tags for local search */}
      {geoPoint && (
        <>
          <meta
            name="geo.position"
            content={`${geoPoint.lat};${geoPoint.lon}`}
          />
          <meta name="ICBM" content={`${geoPoint.lat}, ${geoPoint.lon}`} />
        </>
      )}

      {/* Open-in-App banner */}
      <OpenInAppBanner entityId={shop.id} type="shop" />

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center px-4 py-3 gap-3">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 flex-shrink-0"
            aria-label="Back"
          >
            <span
              className="material-symbols-outlined text-slate-700"
              style={{ fontSize: "20px" }}
            >
              arrow_back_ios
            </span>
          </Link>
          <h1 className="flex-1 text-center font-bold text-[#0b1c30] text-lg truncate">
            {shop.name}
          </h1>
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

      {/* ── Scrollable content ── */}
      <div className="pb-8">
        {/* Hero Banner */}
        <div className="w-full h-[200px] relative overflow-hidden bg-slate-200">
          {bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bannerUrl}
              alt={`${shop.name} banner`}
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>

        {/* ── Store Card (overlaps hero) ── */}
        <div className="px-4 -mt-12 relative z-10">
          <div className="flex items-end gap-4 mb-4">
            {/* Logo */}
            <div
              className="bg-white p-1 rounded-3xl flex-shrink-0"
              style={{
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={`${shop.name} logo`}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white"
                  style={{ backgroundColor: "#E6A55B" }}
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-200" />
              )}
            </div>

            {/* Name, Badges & Rating */}
            <div className="flex-1 pb-1">
              {/* Category & Location Badges */}
              {/* <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                {categoryName && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#974800]/10 text-[#974800]">
                    {categoryName}
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
              </div> */}

              <div className="flex items-center gap-1 mb-1">
                <span style={{ color: "#f59e0b", fontSize: "14px" }}>★</span>
                <span className="text-xs font-bold text-[#0b1c30]">
                  {averageRating.toFixed(1)}{" "}
                  <span className="font-normal text-slate-400">
                    ({reviewCount})
                  </span>
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#0b1c30] leading-tight tracking-tight">
                {shop.name}
              </h2>
            </div>
          </div>

          {/* Description + Hours */}
          <div className="mb-4">
            {shop.description ? (
              <p className="text-sm text-slate-500 leading-snug mb-2">
                {shop.description}
              </p>
            ) : null}
            {openTimeStr ? (
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "18px",
                    color: isOpenToday ? "#974800" : "#ba1a1a",
                  }}
                >
                  schedule
                </span>
                <span
                  className={`text-sm font-semibold ${isOpenToday ? "text-[#974800]" : "text-red-600"}`}
                >
                  {isOpenToday ? `Open ${openTimeStr}` : "Closed today"}
                </span>
              </div>
            ) : null}
          </div>

          {/* ── AEO Semantic Quick Facts (High extraction rate for AI Search & Google) ── */}
          {/* <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-6 leading-relaxed">
            <strong className="text-[#0b1c30]">{shop.name}</strong> is a
            verified {categoryName ? `${categoryName} store` : "local store"}
            {placeName ? ` in ${placeName}` : ""}. Offers{" "}
            {mappedCategories.reduce(
              (acc: number, c: any) => acc + (c.products?.length || 0),
              0,
            )}{" "}
            active products{openTimeStr ? `, open ${openTimeStr}` : ""}. Direct
            contact and instant ordering available on WhatsApp.
          </div> */}
        </div>

        {/* ── Action Buttons ── */}
        {(whatsappPerm || phonePerm || instaPerm) && (
          <div className="px-4 mb-8 flex flex-col gap-3">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl text-white font-bold text-base"
                style={{
                  backgroundColor: "#25D366",
                  boxShadow: "0 4px 12px rgba(37,211,102,0.25)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            )}

            {(phonePerm || instaPerm) && (
              <div className="flex gap-3">
                {phonePerm?.phone_number && (
                  <a
                    href={`tel:${phonePerm.phone_number}`}
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      call
                    </span>
                    Call Shop
                  </a>
                )}
                {instaPerm?.url && (
                  <a
                    href={`https://instagram.com/${instaPerm.url.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      photo_camera
                    </span>
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Product Sections ── */}
        {mappedCategories.map((category: any) => (
          <div key={category.id} className="px-4 mb-2">
            <h3 className="text-xl font-bold text-[#0b1c30] mb-4">
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {category.products.map((product: any) => (
                <a
                  key={product.id}
                  href={`/web/product/${product.id}`}
                  className="block group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-2">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-[#0b1c30] truncate">
                    {product.name}
                  </p>
                  {product.description ? (
                    <p className="text-xs text-slate-500 truncate">
                      {product.description}
                    </p>
                  ) : null}
                  {product.price ? (
                    <p className="text-base font-extrabold text-[#974800]">
                      {product.price}
                    </p>
                  ) : null}
                </a>
              ))}
            </div>
            {(category.total_count ?? 0) > 8 && (
              <div
                className="mt-4 mb-4 w-full py-3 rounded-lg text-center text-[#974800] font-semibold text-base"
                style={{ backgroundColor: "rgba(151,72,0,0.08)" }}
              >
                See all {category.total_count} products in app
              </div>
            )}
          </div>
        ))}

        {/* ── Reviews Section (read-only on web) ── */}
        {reviewCount > 0 && (
          <div className="px-4 my-6">
            <div className="bg-slate-50 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-[#0b1c30] mb-5">
                Store Reviews
              </h3>
              <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                  <p
                    className="text-[48px] font-black text-[#0b1c30] leading-none"
                    style={{ letterSpacing: "-1.5px" }}
                  >
                    {averageRating.toFixed(1)}
                  </p>
                  <div className="flex justify-center gap-0.5 mt-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{ color: "#f59e0b", fontSize: "16px" }}
                      >
                        {star <= Math.floor(averageRating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {reviewCount} verified reviews
                  </p>
                </div>
                <div className="w-full space-y-2">
                  {distribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="w-5 text-center text-xs font-bold text-slate-500">
                        {item.stars}
                      </span>
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: "#974800",
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-[10px] font-bold text-slate-500">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Location Section ── */}
        {gmapPerm && (
          <div className="px-4 mb-6">
            <h3 className="text-lg font-bold text-[#0b1c30] mb-4">Location</h3>
            <a
              href={
                gmapPerm.url?.startsWith("http")
                  ? gmapPerm.url
                  : `https://${gmapPerm.url}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="block relative h-40 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
            >
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="p-2 rounded-full shadow-md"
                  style={{ backgroundColor: "#974800" }}
                >
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontSize: "20px" }}
                  >
                    location_on
                  </span>
                </div>
              </div>

              {shop.address && (
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex-1 pr-3 min-w-0">
                    <p className="text-xs font-bold text-[#0b1c30] truncate">
                      {shop.address}
                    </p>
                    <p
                      className="text-[10px] font-bold text-slate-500 uppercase"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Get Directions
                    </p>
                  </div>
                  <span
                    className="material-symbols-outlined flex-shrink-0"
                    style={{ fontSize: "24px", color: "#974800" }}
                  >
                    directions
                  </span>
                </div>
              )}
            </a>
          </div>
        )}

        {/* ── Download App Banner ── */}
        <div className="px-4 pb-8">
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(151,72,0,0.06), rgba(236,120,19,0.06))",
              border: "1px solid rgba(151,72,0,0.12)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/ad-icon.png"
              alt="Wandershops app"
              className="w-12 h-12 rounded-xl flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0b1c30]">
                Get the Full Experience
              </p>
              <p className="text-xs text-slate-500">
                Discover more shops on Wandershops
              </p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <a
                href={
                  process.env.NEXT_PUBLIC_APP_STORE_URL ||
                  "https://apps.apple.com/in/app/wandershops/id6786978367"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold px-3 py-1.5 rounded-full text-white text-center"
                style={{ backgroundColor: "#0b1c30" }}
              >
                App Store
              </a>
              <a
                href={
                  process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
                  "https://play.google.com/store/apps/details?id=com.sallmanfaaris.wandershops"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold px-3 py-1.5 rounded-full text-white text-center"
                style={{ backgroundColor: "#0b1c30" }}
              >
                Play Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

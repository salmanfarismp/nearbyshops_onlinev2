// app/share/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getTransformedUrl } from "@/utils/image";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com"
).replace(/\/$/, "");
const DEFAULT_IMAGE = `${SITE_URL}/assets/ad-icon.png`;

const SOCIAL_BOT_PATTERNS = [
  "whatsapp",
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "telegrambot",
  "linkedinbot",
  "slackbot",
  "discordbot",
  "applebot",
  "viber",
  "pinterest",
  "iframely",
  "embedly",
  "vkshare",
];

function isSocialBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return SOCIAL_BOT_PATTERNS.some((p) => ua.includes(p));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type")?.toLowerCase();
  const id = searchParams.get("id");
  const userAgent = request.headers.get("user-agent") ?? "";

  const isProduct = type === "product";
  const targetPath = isProduct
    ? `/web/product/${id ?? ""}`
    : `/web/shop/${id ?? ""}`;
  const targetUrl = new URL(targetPath, request.url);

  // ── 1. Real Users & Search Engines: 0ms DB Overhead ──────────────────────
  if (!isSocialBot(userAgent)) {
    return NextResponse.redirect(targetUrl, 308);
  }

  // ── 2. Social Scrapers: Fetch Details & Return Raw Metadata HTML ──────────
  const publicSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );

  let title = "Discover local stores on Wandershops";
  let description =
    "Find local vendors and curated products right in your neighborhood.";
  let imageUrl = DEFAULT_IMAGE;
  const canonicalUrl = `${SITE_URL}${targetPath}`;

  if (id && (type === "product" || type === "store" || type === "shop")) {
    try {
      if (isProduct) {
        const { data: product } = await publicSupabase
          .from("Product")
          .select("name, description, images:ProductImage(img_url, is_primary)")
          .eq("id", id)
          .maybeSingle();

        if (product) {
          const images =
            (product.images as Array<{
              img_url?: string;
              is_primary?: boolean;
            }>) ?? [];
          const primaryImg = images.find((i) => i.is_primary) || images[0];
          title = `${product.name} | Wandershops`;
          description = product.description || description;
          imageUrl = getTransformedUrl(primaryImg?.img_url) || imageUrl;
        }
      } else {
        const { data: store } = await publicSupabase
          .from("Store")
          .select("name, description, profile_url")
          .eq("slug", id)
          .maybeSingle();

        if (store) {
          title = `${store.name} | Wandershops`;
          description = store.description || description;
          imageUrl = getTransformedUrl(store.profile_url) || imageUrl;
        }
      }
    } catch (e) {
      console.error("[Share Route] DB Error", e);
    }
  }

  // Pure HTML response optimized for scraper unfurlers
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="noindex, follow" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${canonicalUrl}" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  
  <meta http-equiv="refresh" content="0; url=${targetUrl.toString()}" />
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <a href="${targetUrl.toString()}">View on Wandershops</a>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

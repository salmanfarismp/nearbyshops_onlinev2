import { NextRequest, NextResponse } from "next/server";

/**
 * Known search engine / social scraper bots that MUST see the page
 * for SEO and social sharing previews to work.
 */
const BOT_PATTERN =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|applebot|embedly|outbrain|quora|pinterest|sogou|exabot|ia_archiver|semrushbot|ahrefs|mj12bot|rogerbot/i;

/**
 * Mobile device User-Agent patterns.
 */
const MOBILE_PATTERN = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i;

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";

  const isBot = BOT_PATTERN.test(ua);
  const isMobile = MOBILE_PATTERN.test(ua);

  // Bots and mobile users see the page as-is
  if (isBot || isMobile) {
    return NextResponse.next();
  }

  // Desktop: redirect to the marketing landing page
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url, { status: 302 });
}

export const config = {
  matcher: ["/web/:path*"],
};

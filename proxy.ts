import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy middleware for /web/:path*
 *
 * Serves web pages to all visitors (mobile, desktop, search bots, AI agents).
 * Desktop view is cleanly centered inside WebLayout, avoiding Google "Sneaky Redirect"
 * cloaking penalties and ensuring AI crawlers (GPTBot, PerplexityBot, etc.) can index content.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/web/:path*"],
};


import { MetadataRoute } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/web/shop/", "/web/product/"],
        disallow: ["/account/", "/api/"],
      },
      // Explicitly allow leading AI search agents
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: ["/", "/web/shop/", "/web/product/", "/llms.txt"],
        disallow: ["/account/", "/api/"],
      },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}

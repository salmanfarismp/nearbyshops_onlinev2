import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable streaming metadata so <title> and <meta name="description"> are
  // always present in the initial server-rendered HTML <head>.
  // Without this, crawlers not on Next.js's default htmlLimitedBots list
  // (e.g. AI audit tools) parse the HTML before metadata is injected and
  // incorrectly report missing title/meta tags.
  // /.*/  matches every user-agent, disabling streaming for all requests.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "mtsfsgtcaoyfidcsvufg.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

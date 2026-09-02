import type { Metadata } from "next";
import { Plus_Jakarta_Sans, EB_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "Wandershops – Discover Neighborhood Stores & Local Shopping",
    template: "%s | Wandershops",
  },
  description:
    "Discover local shops, neighborhood boutiques, groceries, and services in your area. Browse live product catalogues with prices and order instantly on WhatsApp.",
  keywords: [
    "local shopping",
    "neighborhood stores",
    "nearby shops",
    "order on whatsapp",
    "local boutiques",
    "Wandershops",
  ],
  alternates: {
    canonical: DOMAIN,
  },
  openGraph: {
    title: "Wandershops – Discover Neighborhood Stores & Local Shopping",
    description:
      "Discover local shops, neighborhood boutiques, groceries, and services in your area. Browse live product catalogues and order on WhatsApp.",
    url: DOMAIN,
    siteName: "Wandershops",
    images: [
      {
        url: `${DOMAIN}/assets/ad-icon.png`,
        width: 1200,
        height: 630,
        alt: "Wandershops",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wandershops – Discover Neighborhood Stores & Local Shopping",
    description:
      "Discover local shops, neighborhood boutiques, groceries, and services in your area.",
    images: [`${DOMAIN}/assets/ad-icon.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${ebGaramond.variable} ${playfairDisplay.variable} h-full antialiased font-sans`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col font-body-md text-on-surface bg-surface">{children}</body>
    </html>
  );
}

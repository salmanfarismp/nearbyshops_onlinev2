import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { StorySection } from '@/components/StorySection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/utils/seo';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://wandershops.com';

export default function Home() {
  const orgJsonLd = buildOrganizationJsonLd(DOMAIN);
  const webSiteJsonLd = buildWebSiteJsonLd(DOMAIN);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Features />
        <StorySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}


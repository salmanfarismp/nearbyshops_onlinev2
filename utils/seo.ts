/**
 * SEO & AEO utility helpers for Wandershops
 */

/**
 * Maps a human StoreCategory name to the most specific Schema.org business type.
 * Search engines (Google) and AI crawlers (Perplexity, ChatGPT) strongly favor
 * specific types over the generic "LocalBusiness".
 */
export function getSchemaBusinessType(categoryName?: string | null): string {
  if (!categoryName) return "LocalBusiness";

  const lower = categoryName.trim().toLowerCase();

  // Exact mappings for official StoreCategory names
  switch (lower) {
    case "apparel & accessories":
    case "apparel":
    case "accessories":
      return "ClothingStore";
    case "home & hardware":
      return "HardwareStore";
    case "food & beverages":
      return "FoodEstablishment";
    case "lifestyle & decor":
      return "HomeGoodsStore";
    case "electronics & tech":
      return "ElectronicsStore";
    case "automobiles":
      return "AutomotiveBusiness";
    case "wedding & event rentals":
      return "LocalBusiness";
    case "other":
      return "Store";
  }

  // Substring matching fallbacks for variations/sub-types
  if (lower.includes("fashion") || lower.includes("cloth") || lower.includes("apparel") || lower.includes("wear") || lower.includes("boutique")) {
    return "ClothingStore";
  }
  if (lower.includes("food") || lower.includes("bakery") || lower.includes("cafe") || lower.includes("restaurant") || lower.includes("sweet") || lower.includes("snack") || lower.includes("beverage")) {
    return "FoodEstablishment";
  }
  if (lower.includes("grocery") || lower.includes("supermarket") || lower.includes("mart") || lower.includes("provision")) {
    return "GroceryStore";
  }
  if (lower.includes("hardware") || lower.includes("tool") || lower.includes("paint") || lower.includes("electrical") || lower.includes("plumb")) {
    return "HardwareStore";
  }
  if (lower.includes("decor") || lower.includes("furnitur") || lower.includes("interior") || lower.includes("home") || lower.includes("lifestyle")) {
    return "HomeGoodsStore";
  }
  if (lower.includes("electronic") || lower.includes("gadget") || lower.includes("tech") || lower.includes("mobile") || lower.includes("phone") || lower.includes("computer")) {
    return "ElectronicsStore";
  }
  if (lower.includes("auto") || lower.includes("car") || lower.includes("vehicle") || lower.includes("motor")) {
    return "AutomotiveBusiness";
  }
  if (lower.includes("pharmacy") || lower.includes("medical") || lower.includes("chemist") || lower.includes("health")) {
    return "Pharmacy";
  }
  if (lower.includes("jewel") || lower.includes("gold") || lower.includes("silver")) {
    return "JewelryStore";
  }
  if (lower.includes("book") || lower.includes("stationery")) {
    return "BookStore";
  }
  if (lower.includes("sport") || lower.includes("fitness")) {
    return "SportingGoodsStore";
  }
  if (lower.includes("beauty") || lower.includes("cosmetic") || lower.includes("salon")) {
    return "HealthAndBeautyBusiness";
  }

  return "Store";
}

/**
 * Builds standard BreadcrumbList JSON-LD for Google rich snippets.
 */
export function buildBreadcrumbsJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Builds FAQPage JSON-LD for AI answer engines (Perplexity, ChatGPT, Google AI Overviews).
 */
export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Sanitizes a price string (stripping currency symbols, units, commas) into
 * a valid numeric value required by Google Rich Results / Schema.org Offer.
 */
export function cleanPrice(price: string | number | null | undefined): number | undefined {
  if (price === null || price === undefined) return undefined;
  if (typeof price === "number") return isNaN(price) ? undefined : price;

  const sanitized = price.replace(/[^0-9.]/g, "");
  const num = parseFloat(sanitized);
  return isNaN(num) ? undefined : num;
}

/**
 * Builds Organization JSON-LD for Google Knowledge Graph brand recognition.
 */
export function buildOrganizationJsonLd(domain: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wandershops",
    url: domain,
    logo: `${domain}/assets/ad-icon.png`,
    description:
      "Wandershops connects neighborhood shoppers with verified local businesses, offering WhatsApp ordering and verified store catalogues.",
    sameAs: [
      "https://apps.apple.com/in/app/wandershops/id6786978367",
      "https://play.google.com/store/apps/details?id=com.sallmanfaaris.wandershops",
    ],
  };
}

/**
 * Builds WebSite JSON-LD schema for search engine identification.
 */
export function buildWebSiteJsonLd(domain: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Wandershops",
    url: domain,
  };
}

/**
 * Builds ItemList JSON-LD schema for directory lists (e.g., shops in a location).
 */
export function buildItemListJsonLd(
  name: string,
  items: { name: string; url: string; description?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  };
}


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

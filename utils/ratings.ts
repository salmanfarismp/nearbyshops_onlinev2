import type { RatingDistributionData } from "@/types/web";

export type RatingItem = {
  score: number;
};

export type RatingDistribution = {
  stars: number;
  percentage: number;
};

export function formatRatingDistribution(
  dist?: RatingDistributionData | null,
  reviewCount?: number | null
): RatingDistribution[] {
  const total = reviewCount ?? dist?.total ?? 0;
  return [5, 4, 3, 2, 1].map((stars) => {
    const starCount = dist
      ? Number(dist[String(stars) as "1" | "2" | "3" | "4" | "5"] || 0)
      : 0;
    return {
      stars,
      percentage: total > 0 ? Math.round((starCount / total) * 100) : 0,
    };
  });
}

export function calculateRatings(ratings?: RatingItem[] | null) {
  const reviewCount = ratings?.length ?? 0;
  const averageRating =
    reviewCount > 0
      ? ratings!.reduce((sum, r) => sum + r.score, 0) / reviewCount
      : 0;

  const distribution: RatingDistribution[] = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percentage:
      reviewCount > 0
        ? Math.round(
            (ratings!.filter((r) => r.score === stars).length / reviewCount) *
              100,
          )
        : 0,
  }));

  return { reviewCount, averageRating, distribution };
}


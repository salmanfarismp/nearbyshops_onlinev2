export type RatingItem = {
  score: number;
};

export type RatingDistribution = {
  stars: number;
  percentage: number;
};

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

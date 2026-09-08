type RatingSummaryProps = {
  averageRating: number;
  reviewCount: number;
  distribution: Array<{ stars: number; percentage: number }>;
};

export default function RatingSummary({
  averageRating,
  reviewCount,
  distribution,
}: RatingSummaryProps) {
  if (reviewCount <= 0) return null;

  return (
    <div className="px-4 my-6">
      <div className="bg-slate-50 rounded-3xl p-6">
        <h3 className="text-lg font-bold text-[#0b1c30] mb-5">
          Store Reviews
        </h3>
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p
              className="text-[48px] font-black text-[#0b1c30] leading-none"
              style={{ letterSpacing: "-1.5px" }}
            >
              {averageRating.toFixed(1)}
            </p>
            <div className="flex justify-center gap-0.5 mt-1 mb-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ color: "#f59e0b", fontSize: "16px" }}
                >
                  {star <= Math.floor(averageRating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {reviewCount} verified reviews
            </p>
          </div>
          <div className="w-full space-y-2">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="w-5 text-center text-xs font-bold text-slate-500">
                  {item.stars}
                </span>
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: "#974800",
                    }}
                  />
                </div>
                <span className="w-8 text-right text-[10px] font-bold text-slate-500">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

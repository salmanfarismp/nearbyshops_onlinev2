import Link from "next/link";
import Image from "next/image";
import { getTransformedUrl } from "@/utils/image";

export interface LocalShopCardProps {
  id: string | number;
  slug?: string | null;
  name: string;
  profileUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  distance?: string | null;
  locality?: string | null;
  categoryName?: string | null;
}

export default function LocalShopCard({
  id,
  slug,
  name,
  profileUrl,
  rating = 0,
  reviewCount = 0,
  distance,
  locality,
  categoryName,
}: LocalShopCardProps) {
  const shopHref = slug ? `/web/shop/${slug}` : `/web/shop/${id}`;
  const transformedImageUrl = profileUrl
    ? getTransformedUrl(profileUrl)
    : null;

  const displayRating = (rating ?? 0) > 0 ? (rating ?? 0).toFixed(1) : "0.0";
  const displayReviews = reviewCount ?? 0;
  const locationLabel = distance || locality || "Local Shop";

  return (
    <Link
      href={shopHref}
      className="group flex items-center p-3 rounded-2xl border border-slate-100 bg-white gap-4 mb-3.5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200"
      style={{ textDecoration: "none" }}
    >
      {/* Shop Image */}
      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-orange-50/50 border border-slate-100 relative">
        {transformedImageUrl ? (
          <Image
            src={transformedImageUrl}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 text-amber-700">
            <span
              className="material-symbols-outlined text-2xl text-[#ec7813]"
              style={{ fontSize: "28px" }}
            >
              storefront
            </span>
          </div>
        )}
      </div>

      {/* Shop Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ec7813] transition-colors truncate">
          {name}
        </h3>

        {/* Rating & Distance / Locality Row */}
        <div className="flex items-center gap-1.5 mt-1 text-xs">
          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span>{displayRating}</span>
            <span className="text-slate-400 font-normal ml-0.5">
              ({displayReviews})
            </span>
          </div>

          <span className="text-slate-300 text-[10px]">•</span>

          <span className="text-slate-500 font-medium truncate">
            {locationLabel}
          </span>
        </div>

        {/* Category Tag */}
        <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-1 truncate">
          {categoryName || "Local Shop"}
        </p>
      </div>

      {/* Chevron Right */}
      <span
        className="material-symbols-outlined text-slate-300 group-hover:text-[#ec7813] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
        style={{ fontSize: "22px" }}
      >
        chevron_right
      </span>
    </Link>
  );
}

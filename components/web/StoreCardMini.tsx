"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconLocation, IconChevronRight } from "@/components/web/icons";
import { parsePostGisPoint, calculateDistance } from "@/utils/geo";

type StoreCardMiniProps = {
  store: {
    name: string;
    slug?: string | null;
    address?: string | null;
    location?: any;
  };
  storeLogo?: string | null;
  placeName?: string | null;
  storeLocation?: any;
};

export default function StoreCardMini({
  store,
  storeLogo,
  placeName,
  storeLocation,
}: StoreCardMiniProps) {
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // Request browser geolocation once quietly to calculate proximity
  useEffect(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        () => {
          // Graceful fallback: user declined or unavailable
        },
        { enableHighAccuracy: false, timeout: 5000 },
      );
    }
  }, []);

  const storePoint = useMemo(() => {
    return parsePostGisPoint(storeLocation || store.location);
  }, [storeLocation, store.location]);

  const distanceStr = useMemo(() => {
    if (!userCoords || !storePoint) return null;
    const dist = calculateDistance(
      userCoords.lat,
      userCoords.lon,
      storePoint.lat,
      storePoint.lon,
    );
    return `${dist.toFixed(1)} km away`;
  }, [userCoords, storePoint]);

  return (
    <Link
      href={store.slug ? `/web/shop/${store.slug}` : "/"}
      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 mb-6"
      style={{ textDecoration: "none" }}
    >
      {/* Store logo */}
      <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0">
        {storeLogo ? (
          <Image
            src={storeLogo}
            alt={store.name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200" />
        )}
      </div>

      {/* Store info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] font-bold uppercase text-[#974800] mb-0.5"
          style={{ letterSpacing: "0.5px" }}
        >
          Available at
        </p>
        <p className="text-base font-bold text-[#0b1c30] truncate">
          {store.name}
        </p>
        {(store.address || placeName || distanceStr) && (
          <div className="flex items-center gap-1 mt-0.5">
            <IconLocation size={14} className="text-slate-500 flex-shrink-0" />
            <p className="text-xs text-slate-500 truncate">
              {store.address || placeName}
              {distanceStr && (
                <span className="font-medium text-[#974800] ml-1">
                  • {distanceStr}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <IconChevronRight size={24} className="text-slate-300 flex-shrink-0" />
    </Link>
  );
}

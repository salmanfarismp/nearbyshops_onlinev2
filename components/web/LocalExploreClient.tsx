"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LocalShopCard from "./LocalShopCard";
import LocationNetMesh, { PlaceNode } from "./LocationNetMesh";
import { parsePostGisPoint } from "@/utils/geo";
import { toCategorySlug } from "@/utils/categorySlug";

export interface SerializedStore {
  id: string | number;
  slug?: string | null;
  name: string;
  profile_url?: string | null;
  computed_avg_rating?: number | null;
  computed_review_count?: number | null;
  location?: string | null;
  category?: { id?: string | number; name: string } | null;
  place?: {
    id: string | number;
    name: string;
    city?: string | null;
    state?: string | null;
  } | null;
}

export interface SerializedCategory {
  id: string | number;
  name: string;
}

export interface LocalExploreClientProps {
  city: string;
  citySlug: string;
  stores: SerializedStore[];
  places: PlaceNode[];
  categories: SerializedCategory[];
  initialCategoryId?: string | number | null;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function ShopCardSkeleton() {
  return (
    <div className="flex items-center p-3 rounded-2xl border border-slate-100 bg-white gap-4 mb-3.5 shadow-sm animate-pulse">
      <div className="w-20 h-20 rounded-2xl bg-slate-200/80 flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-amber-100 rounded w-10" />
          <div className="h-3 bg-slate-100 rounded w-16" />
        </div>
        <div className="h-2.5 bg-slate-100 rounded w-20" />
      </div>
      <div className="w-5 h-5 bg-slate-100 rounded-full flex-shrink-0 mr-1" />
    </div>
  );
}

export default function LocalExploreClient({
  city,
  citySlug,
  stores,
  places,
  categories,
  initialCategoryId = null,
}: LocalExploreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state synchronization for ?place=
  const initialPlaceQuery = searchParams.get("place");
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(
    initialPlaceQuery || null,
  );

  const [activeCategoryId, setActiveCategoryId] = useState<
    string | number | null
  >(initialCategoryId);
  const [isFiltersActive, setIsFiltersActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // Sync state if URL changes
  useEffect(() => {
    const qPlace = searchParams.get("place");
    setSelectedPlaceName(qPlace || null);
  }, [searchParams]);

  // Request browser geolocation once quietly for accurate distance calculation
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
          // User declined or unavailable — graceful fallback to place names
        },
        { enableHighAccuracy: false, timeout: 5000 },
      );
    }
  }, []);

  const handleSelectPlace = (placeName: string | null) => {
    setSelectedPlaceName(placeName);
    const params = new URLSearchParams(searchParams.toString());
    if (placeName) {
      params.set("place", placeName.toLowerCase());
    } else {
      params.delete("place");
    }
    const newUrl = params.toString()
      ? `/web/local/${citySlug}?${params.toString()}`
      : `/web/local/${citySlug}`;
    router.replace(newUrl, { scroll: false });
  };

  // Filter stores
  const filteredShops = useMemo(() => {
    return stores.filter((store) => {
      // 1. Place filter
      if (selectedPlaceName) {
        const storePlace = store.place?.name?.trim().toLowerCase();
        if (storePlace !== selectedPlaceName.trim().toLowerCase()) {
          return false;
        }
      }

      // 2. Category filter
      if (activeCategoryId != null) {
        const cat = categories.find((c) => c.id === activeCategoryId);
        if (cat && store.category?.name !== cat.name) {
          return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = store.name.toLowerCase().includes(q);
        const matchesCat = store.category?.name?.toLowerCase().includes(q);
        const matchesPlace = store.place?.name?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesPlace) return false;
      }

      return true;
    });
  }, [stores, selectedPlaceName, activeCategoryId, searchQuery, categories]);

  return (
    <div className="px-4 pb-12">
      {/* ── Section Header (ExploreScreen Parity) ── */}
      <div className="flex items-center justify-between pt-5 pb-2 mb-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight">
            Discover Shops
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {selectedPlaceName
              ? `Showing shops near ${selectedPlaceName}`
              : `Showing shops in ${city}`}
            <span className="ml-1 text-slate-400">
              • {filteredShops.length}{" "}
              {filteredShops.length === 1 ? "store" : "stores"}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFiltersActive(!isFiltersActive)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
            isFiltersActive
              ? "bg-[#ec7813] text-white shadow-md shadow-orange-500/20"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
          aria-label="Toggle Category Filters"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            tune
          </span>
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative mb-4">
        <span
          className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          style={{ fontSize: "18px" }}
        >
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search shops in ${selectedPlaceName || city}...`}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ec7813] focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              close
            </span>
          </button>
        )}
      </div>

      {/* ── Active Place Filter Indicator ── */}
      {selectedPlaceName && (
        <div className="flex items-center justify-between px-3 py-2 bg-orange-50/70 border border-orange-200/60 rounded-xl mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-orange-900 font-medium">
            <span
              className="material-symbols-outlined text-[#ec7813]"
              style={{ fontSize: "16px" }}
            >
              location_on
            </span>
            <span>
              Filtered by: <strong>{selectedPlaceName}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectPlace(null)}
            className="text-xs font-bold text-[#ec7813] hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* ── Category Filter Carousel (CategoryList Parity with Crawlable Links) ── */}
      {isFiltersActive && categories.length > 0 && (
        <div className="mb-5 overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-2">
          {/* "All" category link */}
          <Link
            href={`/web/local/${citySlug}${selectedPlaceName ? `?place=${encodeURIComponent(selectedPlaceName.toLowerCase())}` : ""}`}
            onClick={() => setActiveCategoryId(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeCategoryId == null
                ? "bg-[#0b1c30] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
            style={{ textDecoration: "none" }}
          >
            All
          </Link>

          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            const catSlug = toCategorySlug(cat.name);
            return (
              <Link
                key={cat.id}
                href={`/web/local/${citySlug}/category/${catSlug}${selectedPlaceName ? `?place=${encodeURIComponent(selectedPlaceName.toLowerCase())}` : ""}`}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#ec7813] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
                style={{ textDecoration: "none" }}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Shop List (ExploreScreen Parity) ── */}
      <div className="min-h-[260px]">
        {filteredShops.length === 0 ? (
          <div className="space-y-3.5 py-1">
            <ShopCardSkeleton />
            <ShopCardSkeleton />
            <ShopCardSkeleton />
          </div>
        ) : (
          filteredShops.map((shop) => {
            let distanceStr: string | null = null;
            if (userCoords && shop.location) {
              const shopCoords = parsePostGisPoint(shop.location);
              if (shopCoords) {
                const km = getDistanceKm(
                  userCoords.lat,
                  userCoords.lon,
                  shopCoords.lat,
                  shopCoords.lon,
                );
                distanceStr = `${km.toFixed(1)} km away`;
              }
            }

            return (
              <LocalShopCard
                key={shop.id}
                id={shop.id}
                slug={shop.slug}
                name={shop.name}
                profileUrl={shop.profile_url}
                rating={shop.computed_avg_rating}
                reviewCount={shop.computed_review_count}
                distance={distanceStr}
                locality={shop.place?.name}
                categoryName={shop.category?.name}
              />
            );
          })
        )}
      </div>

      {/* ── Location Net: Wander to nearby areas & neighborhood mesh ── */}
      <LocationNetMesh
        city={city}
        citySlug={citySlug}
        places={places}
        activePlaceName={selectedPlaceName}
        onSelectPlace={handleSelectPlace}
      />
    </div>
  );
}

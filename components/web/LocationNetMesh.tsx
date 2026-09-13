import Link from "next/link";
import { IconHub } from "@/components/web/icons";

export interface PlaceNode {
  id: number | string;
  name: string;
  city?: string | null;
  state?: string | null;
  storeCount: number;
}

export interface LocationNetMeshProps {
  city: string;
  citySlug: string;
  places: PlaceNode[];
  activePlaceName?: string | null;
  onSelectPlace?: (placeName: string | null) => void;
}

export default function LocationNetMesh({
  city,
  citySlug,
  places,
  activePlaceName,
  onSelectPlace,
}: LocationNetMeshProps) {
  if (!places || places.length === 0) return null;

  return (
    <div className="mt-8 mb-8">
      {/* ── Section Title ── */}

      {/* ── Location Net: Complete Neighborhood Mesh ── */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <IconHub size={16} className="text-[#ec7813]" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Location Net • {city}
          </h4>
        </div>

        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          Explore neighborhood stores and verified businesses across all
          localities in {city}:
        </p>

        <div className="flex flex-wrap gap-2">
          {/* All Places Chip */}
          <button
            type="button"
            onClick={() => onSelectPlace?.(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              !activePlaceName
                ? "bg-[#0b1c30] text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
            }`}
          >
            All {city}
          </button>

          {/* Place Nodes */}
          {places.map((place) => {
            const isSelected =
              activePlaceName?.toLowerCase() === place.name.toLowerCase();
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => onSelectPlace?.(place.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? "bg-[#ec7813] text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>{place.name}</span>
                {place.storeCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {place.storeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Semantic Crawlable Links for Search Engine Spiders */}
        <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-600">
            Local Directories:
          </span>
          {places.map((place) => (
            <Link
              key={`link-${place.id}`}
              href={`/web/local/${citySlug}?place=${encodeURIComponent(place.name.toLowerCase())}`}
              className="text-[#974800] hover:underline"
            >
              Stores in {place.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

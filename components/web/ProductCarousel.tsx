"use client";

import { useState, useRef } from "react";

type Props = {
  images: string[];
  productName: string;
};

/**
 * CSS scroll-snap image carousel — port of the native HeroCarousel.
 * Uses aspect-ratio 4/5 and pagination dots.
 */
export default function ProductCarousel({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  const displayImages = images.length > 0 ? images : [];

  return (
    <div className="w-full relative" style={{ aspectRatio: "4/5", backgroundColor: "#e2e8f0" }}>
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full h-full flex overflow-x-auto"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {displayImages.length > 0 ? (
          displayImages.map((src, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${productName} image ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "48px" }}>
              image
            </span>
          </div>
        )}
      </div>

      {/* Pagination dots */}
      {displayImages.length > 1 && (
        <div
          className="absolute flex gap-1.5 justify-center"
          style={{ bottom: "56px", left: 0, right: 0, zIndex: 20, pointerEvents: "none" }}
        >
          {displayImages.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-200"
              style={{
                backgroundColor:
                  i === activeIndex ? "white" : "rgba(255,255,255,0.4)",
                boxShadow:
                  i === activeIndex
                    ? "0 1px 3px rgba(0,0,0,0.2)"
                    : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom gradient overlay (to white, same as native) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.6) 100%)",
        }}
      />
    </div>
  );
}

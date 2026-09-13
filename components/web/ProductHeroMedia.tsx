"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IconImage } from "@/components/web/icons";

type Props = {
  images: string[];
  productName: string;
  isFullScreen: boolean;
  onImagePress?: () => void;
};

/**
 * Full-bleed Hero Media Carousel — port of the native HeroCarousel.
 * Supports horizontal scroll-snap paging, tap-to-toggle media focus, and responsive sizing.
 */
export default function ProductHeroMedia({
  images,
  productName,
  isFullScreen,
  onImagePress,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0 ? images : [];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050508] select-none overflow-hidden">
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
              onClick={() => onImagePress?.()}
              className="w-full h-full flex-shrink-0 relative cursor-pointer flex items-center justify-center"
              style={{ scrollSnapAlign: "start" }}
              title={
                isFullScreen
                  ? "Tap to restore details"
                  : "Tap to view full photo"
              }
            >
              <div
                className={`relative w-full transition-all duration-300 ${
                  isFullScreen
                    ? "h-full flex items-center justify-center p-2"
                    : "h-full"
                }`}
              >
                <Image
                  src={src}
                  alt={`${productName} image ${i + 1}`}
                  fill
                  priority={i === 0}
                  className={`transition-all duration-300 ${
                    isFullScreen ? "object-contain" : "object-cover"
                  }`}
                  sizes="(max-width: 430px) 100vw, 430px"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#050508]">
            <IconImage size={54} className="text-slate-700" />
          </div>
        )}
      </div>

      {/* Pagination Pill */}
      {displayImages.length > 1 && (
        <div
          className={`absolute left-0 right-0 flex justify-center pointer-events-none transition-all duration-300 z-20 ${
            isFullScreen ? "bottom-16" : "bottom-[42px]"
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
            {displayImages.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ambient Gradient to transition into content sheet in normal mode */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isFullScreen ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,8,0.2) 0%, transparent 40%, rgba(5,5,8,0.6) 100%)",
        }}
      />
    </div>
  );
}

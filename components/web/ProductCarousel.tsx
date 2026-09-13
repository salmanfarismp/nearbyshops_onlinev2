"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { IconImage, IconClose } from "@/components/web/icons";

type Props = {
  images: string[];
  productName: string;
};

/**
 * CSS scroll-snap image carousel with interactive fullscreen lightbox viewer.
 * Uses aspect-ratio 4/5, pagination dots, and tap-to-zoom modal.
 */
export default function ProductCarousel({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const displayImages = images.length > 0 ? images : [];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  }, [displayImages.length]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextLightboxImage();
      else if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, closeLightbox, nextLightboxImage, prevLightboxImage]);

  // Touch swipe in lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextLightboxImage();
      } else {
        prevLightboxImage();
      }
    }
    touchStartX.current = null;
  };

  return (
    <>
      <div
        className="w-full relative"
        style={{ aspectRatio: "4/5", backgroundColor: "#e2e8f0" }}
      >
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
                onClick={() => openLightbox(i)}
                className="w-full h-full flex-shrink-0 relative cursor-zoom-in group"
                style={{ scrollSnapAlign: "start" }}
                title="Click to view full image"
              >
                <Image
                  src={src}
                  alt={`${productName} image ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                  sizes="(max-width: 430px) 100vw, 430px"
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <IconImage size={48} className="text-slate-400" />
            </div>
          )}
        </div>

        {/* Pagination dots */}
        {displayImages.length > 1 && (
          <div
            className="absolute flex gap-1.5 justify-center"
            style={{
              bottom: "56px",
              left: 0,
              right: 0,
              zIndex: 20,
              pointerEvents: "none",
            }}
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

      {/* ── Fullscreen Lightbox Modal ── */}
      {isLightboxOpen && displayImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none animate-in fade-in duration-200"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-5 py-4 z-10">
            <span className="text-sm font-medium text-white/80">
              {lightboxIndex + 1} / {displayImages.length}
            </span>
            <button
              onClick={closeLightbox}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white"
              aria-label="Close image viewer"
            >
              <IconClose size={22} />
            </button>
          </div>

          {/* Central Image Presentation Area */}
          <div
            className="relative flex-1 w-full max-w-4xl mx-auto flex items-center justify-center px-4"
            onClick={closeLightbox}
          >
            <div
              className="relative w-full h-full max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[lightboxIndex]}
                alt={`${productName} full view ${lightboxIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 85vw"
              />
            </div>

            {/* Left Nav Arrow */}
            {displayImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                aria-label="Previous image"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Right Nav Arrow */}
            {displayImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                aria-label="Next image"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Thumbnails (if multiple images) */}
          {displayImages.length > 1 ? (
            <div className="flex justify-center gap-2 px-4 py-4 overflow-x-auto z-10">
              {displayImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    i === lightboxIndex
                      ? "ring-2 ring-white scale-105"
                      : "opacity-40 hover:opacity-75"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}
    </>
  );
}

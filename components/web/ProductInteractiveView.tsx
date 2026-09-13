"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShareLink from "@/components/ui/ShareLink";
import { IconArrowBack, IconShare, IconLocation } from "@/components/web/icons";
import ProductHeroMedia from "@/components/web/ProductHeroMedia";
import StoreCardMini from "@/components/web/StoreCardMini";
import { formatPrice } from "@/utils/price";

export type SheetState = "collapsed" | "normal" | "expanded";

type ProductInteractiveViewProps = {
  product: any;
  imageUrls: string[];
  store: any;
  storeLogo: string | null;
  placeName: string | null;
  productCategoryName: string | null;
  storeCategoryName: string | null;
  averageRating: number;
  reviewCount: number;
  whatsappHref: string | null;
  backHref: string;
  shareUrl: string;
};

export default function ProductInteractiveView({
  product,
  imageUrls,
  store,
  storeLogo,
  placeName,
  productCategoryName,
  storeCategoryName,
  averageRating,
  reviewCount,
  whatsappHref,
  backHref,
  shareUrl,
}: ProductInteractiveViewProps) {
  const router = useRouter();

  // 3-Snap Sheet State: "collapsed" | "normal" | "expanded"
  const [sheetState, setSheetState] = useState<SheetState>("normal");
  const sheetStateRef = useRef<SheetState>("normal");
  const [viewportHeight, setViewportHeight] = useState(800);
  const [viewportWidth, setViewportWidth] = useState(430);

  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Initialize and track viewport dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(Math.min(window.innerWidth, 430));
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Geometry calculations (matching native app)
  const heroHeight = useMemo(() => {
    return Math.round(viewportWidth * 1.22);
  }, [viewportWidth]);

  const normalTop = useMemo(() => {
    return Math.max(heroHeight - 36, 320);
  }, [heroHeight]);

  const collapsedTop = useMemo(() => {
    return Math.max(viewportHeight - 56, normalTop + 100);
  }, [viewportHeight, normalTop]);

  const expandedTop = 64;

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  };

  const animateToNormal = useCallback(() => {
    sheetStateRef.current = "normal";
    setSheetState("normal");
    triggerHaptic();
  }, []);

  const animateToCollapsed = useCallback(() => {
    sheetStateRef.current = "collapsed";
    setSheetState("collapsed");
    triggerHaptic();
  }, []);

  const animateToExpanded = useCallback(() => {
    sheetStateRef.current = "expanded";
    setSheetState("expanded");
    triggerHaptic();
  }, []);

  // Handle image tap (toggles fullscreen media focus)
  const handleImagePress = useCallback(() => {
    if (sheetStateRef.current === "collapsed") {
      animateToNormal();
    } else {
      animateToCollapsed();
    }
  }, [animateToNormal, animateToCollapsed]);

  // Handle header back button (if drawer is expanded or collapsed, restore normal first)
  const handleHeaderBack = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (sheetStateRef.current !== "normal") {
        animateToNormal();
      } else {
        if (typeof window !== "undefined") {
          const hasOriginReferrer =
            document.referrer &&
            document.referrer.startsWith(window.location.origin);
          const hasHistoryState =
            window.history.state &&
            typeof window.history.state.idx === "number" &&
            window.history.state.idx > 0;

          if (
            hasOriginReferrer ||
            hasHistoryState ||
            window.history.length > 1
          ) {
            window.history.back();
            return;
          }
        }
        router.push(backHref);
      }
    },
    [animateToNormal, backHref, router],
  );

  // Handle drag gesture on drawer handle area (Touch + Mouse)
  const handlePointerDown = (clientY: number) => {
    touchStartY.current = clientY;
  };

  const handlePointerUp = (clientY: number) => {
    if (touchStartY.current === null) return;
    const deltaY = clientY - touchStartY.current;
    const currentState = sheetStateRef.current;

    if (currentState === "normal") {
      if (deltaY > 30) {
        animateToCollapsed();
      } else if (deltaY < -30) {
        animateToExpanded();
      }
    } else if (currentState === "collapsed") {
      if (deltaY < -15) {
        animateToNormal();
      }
    } else if (currentState === "expanded") {
      const isScrolledToTop =
        !scrollBodyRef.current || scrollBodyRef.current.scrollTop <= 5;
      if (deltaY > 30 && isScrolledToTop) {
        animateToNormal();
      }
    }
    touchStartY.current = null;
  };

  // Determine active top position
  const currentTop =
    sheetState === "collapsed"
      ? collapsedTop
      : sheetState === "expanded"
        ? expandedTop
        : normalTop;

  return (
    <div className="relative w-full h-[100dvh] bg-[#050508] overflow-hidden select-none">
      {/* ── Full-bleed Hero Media Carousel ── */}
      <ProductHeroMedia
        images={imageUrls}
        productName={product.name}
        isFullScreen={sheetState === "collapsed"}
        onImagePress={handleImagePress}
      />

      {/* ── Floating Header (Transparent Glassmorphism overlay) ── */}
      <header className="absolute top-0 left-0 right-0 z-40 px-4 pt-3 pb-2 flex items-center justify-between pointer-events-none">
        <Link
          href={backHref}
          onClick={handleHeaderBack}
          className="pointer-events-auto w-11 h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 active:scale-95 border border-white/20 text-white backdrop-blur-md transition-all"
          aria-label="Back"
        >
          <IconArrowBack size={20} className="text-white" />
        </Link>

        <div className="pointer-events-auto w-11 h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 active:scale-95 border border-white/20 text-white backdrop-blur-md transition-all">
          <ShareLink href={shareUrl} aria-label="Share this product">
            <IconShare size={20} className="text-white" />
          </ShareLink>
        </div>
      </header>

      {/* ── 3-Snap Point Content Sheet with Native Drawer Physics ── */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-[32px] z-30 flex flex-col shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          top: `${currentTop}px`,
          boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Drawer Drag Handle Area (Tapping or dragging navigates snap points) */}
        <div
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientY)}
          onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientY)}
          onMouseDown={(e) => handlePointerDown(e.clientY)}
          onMouseUp={(e) => handlePointerUp(e.clientY)}
          onClick={() => {
            if (sheetState === "collapsed") animateToNormal();
            else if (sheetState === "normal") animateToExpanded();
            else animateToNormal();
          }}
          className="w-full py-3 flex items-center justify-center cursor-pointer flex-shrink-0 touch-none active:opacity-75"
        >
          <div className="w-11 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={scrollBodyRef}
          onTouchStart={(e) => {
            // If in expanded mode and at the top, allow drag down to collapse
            if (
              sheetState === "expanded" &&
              scrollBodyRef.current &&
              scrollBodyRef.current.scrollTop <= 0
            ) {
              touchStartY.current = e.touches[0].clientY;
            }
          }}
          onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientY)}
          className={`px-6 pt-1 pb-36 flex-1 ${
            sheetState === "expanded"
              ? "overflow-y-auto overscroll-contain"
              : "overflow-hidden"
          }`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Category & Place Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {productCategoryName && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#974800]/10 text-[#974800]">
                {productCategoryName}
              </span>
            )}
            {storeCategoryName && !productCategoryName && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#974800]/10 text-[#974800]">
                {storeCategoryName}
              </span>
            )}
            {placeName && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                <IconLocation size={11} />
                {placeName}
              </span>
            )}
          </div>

          {/* Product name + price */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <h1 className="flex-1 text-[26px] font-extrabold text-[#0b1c30] leading-tight">
              {product.name}
            </h1>
            {product.price ? (
              <span
                className="text-2xl font-bold flex-shrink-0 mt-0.5"
                style={{ color: "#974800" }}
              >
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>

          {/* Rating row */}
          <div className="flex items-center gap-1.5 mb-6">
            <span style={{ color: "#f59e0b", fontSize: "18px" }}>★</span>
            <span className="text-sm font-bold text-[#0b1c30]">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-slate-400">
              ({reviewCount} reviews)
            </span>
          </div>

          {/* Description */}
          {product.description ? (
            <div className="mb-8">
              <p
                className="text-xs font-bold uppercase text-slate-400 mb-3"
                style={{ letterSpacing: "1.5px" }}
              >
                Description
              </p>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          ) : null}

          {/* Store Card Mini */}
          {store && (
            <StoreCardMini
              store={store}
              storeLogo={storeLogo}
              placeName={placeName}
              storeLocation={store?.location}
            />
          )}
        </div>
      </div>

      {/* ── Fixed Bottom WhatsApp CTA (Translates down in collapsed mode) ── */}
      {whatsappHref && (
        <div
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 pb-8 pt-4 z-50 transition-all duration-300 ${
            sheetState === "collapsed"
              ? "translate-y-36 opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100 pointer-events-auto"
          }`}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 40%)",
            }}
          />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative pointer-events-auto flex items-center justify-center gap-3 w-full h-16 rounded-2xl text-white font-bold text-lg active:scale-[0.98] transition-transform"
            style={{
              backgroundColor: "#25D366",
              boxShadow: "0 10px 30px rgba(37,211,102,0.35)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Props = {
  /** The native app UUID of the store/product (for deep-link custom scheme) */
  entityId: string;
  /** "shop" | "product" */
  type: "shop" | "product";
};

/**
 * Sticky dismissible banner shown only on the web page.
 * If the app is installed, iOS Universal Links would have already intercepted
 * the URL — so this banner is primarily for users who don't have the app.
 * It detects iOS/Android and shows the correct store link.
 */
export default function OpenInAppBanner({ entityId, type }: Props) {
  const [visible, setVisible] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    // Don't show if dismissed in this session
    const dismissed = sessionStorage.getItem("oia_dismissed");
    if (dismissed) return;

    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);

    if (isIOS) {
      setStoreUrl(
        process.env.NEXT_PUBLIC_APP_STORE_URL ||
          "https://apps.apple.com/in/app/wandershops/id6786978367",
      );
    } else if (isAndroid) {
      setStoreUrl(
        process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
          "https://play.google.com/store/apps/details?id=com.sallmanfaaris.wandershops",
      );
    }

    setVisible(true);
  }, []);

  const handleOpenInApp = () => {
    // Try custom scheme first — silently fails if app not installed
    const scheme = type === "shop"
      ? `wandershops://shop/${entityId}`
      : `wandershops://product/${entityId}`;

    // Use an iframe trick: custom scheme attempt + timeout to fallback to store
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = scheme;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe);
      // If app wasn't opened (we're still here), go to store
      if (storeUrl) window.location.href = storeUrl;
    }, 1500);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("oia_dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-slate-100"
      style={{ backgroundColor: "#fdf2e9" }}
    >
      {/* App Icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/ad-icon.png"
        alt="Wandershops"
        className="w-10 h-10 rounded-xl flex-shrink-0"
      />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#0b1c30] leading-tight">
          Wandershops
        </p>
        <p className="text-[11px] text-slate-500 leading-tight">
          Open in the app for the best experience
        </p>
      </div>

      {/* Open Button */}
      <button
        onClick={handleOpenInApp}
        className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: "#974800" }}
      >
        Open
      </button>

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600"
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
          close
        </span>
      </button>
    </div>
  );
}

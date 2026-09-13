"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ShareLink from "@/components/ui/ShareLink";
import { IconArrowBack, IconShare } from "@/components/web/icons";

type WebHeaderProps = {
  backHref?: string;
  backLabel?: string;
  title?: string;
  shareUrl?: string;
};

export default function WebHeader({
  backHref = "/",
  backLabel = "Back",
  title,
  shareUrl,
}: WebHeaderProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const hasOriginReferrer =
        document.referrer &&
        document.referrer.startsWith(window.location.origin);
      const hasHistoryState =
        window.history.state &&
        typeof window.history.state.idx === "number" &&
        window.history.state.idx > 0;

      if (hasOriginReferrer || hasHistoryState || window.history.length > 1) {
        window.history.back();
        return;
      }
    }
    router.push(backHref);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="flex items-center px-4 py-3 gap-3">
        {backHref && (
          <Link
            href={backHref}
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 flex-shrink-0"
            aria-label={backLabel}
          >
            <IconArrowBack size={20} className="text-slate-700" />
          </Link>
        )}

        {title ? (
          <h1 className="flex-1 text-center font-bold text-[#0b1c30] text-lg truncate">
            {title}
          </h1>
        ) : (
          <div className="flex-1" />
        )}
        {shareUrl && (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50">
            <ShareLink href={shareUrl} aria-label="Share this page">
              <IconShare size={20} className="text-slate-700" />
            </ShareLink>
          </div>
        )}
      </div>
    </header>
  );
}

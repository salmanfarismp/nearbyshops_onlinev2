import Link from "next/link";
import ShareLink from "@/components/ui/ShareLink";

type WebHeaderProps = {
  backHref?: string;
  backLabel?: string;
  title?: string;
  shareUrl: string;
};

export default function WebHeader({
  backHref = "/",
  backLabel = "Back",
  title,
  shareUrl,
}: WebHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="flex items-center px-4 py-3 gap-3">
        <Link
          href={backHref}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 flex-shrink-0"
          aria-label={backLabel}
        >
          <span
            className="material-symbols-outlined text-slate-700"
            style={{ fontSize: "20px" }}
          >
            arrow_back_ios
          </span>
        </Link>
        {title ? (
          <h1 className="flex-1 text-center font-bold text-[#0b1c30] text-lg truncate">
            {title}
          </h1>
        ) : (
          <div className="flex-1" />
        )}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50">
          <ShareLink href={shareUrl} aria-label="Share this page">
            <span
              className="material-symbols-outlined text-slate-700"
              style={{ fontSize: "20px" }}
            >
              share
            </span>
          </ShareLink>
        </div>
      </div>
    </header>
  );
}

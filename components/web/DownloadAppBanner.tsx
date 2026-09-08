import Image from "next/image";

export default function DownloadAppBanner() {
  const appStoreUrl =
    process.env.NEXT_PUBLIC_APP_STORE_URL ||
    "https://apps.apple.com/in/app/wandershops/id6786978367";
  const playStoreUrl =
    process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
    "https://play.google.com/store/apps/details?id=com.sallmanfaaris.wandershops";

  return (
    <div className="px-4 pb-8">
      <div
        className="rounded-2xl p-4 flex items-center gap-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(151,72,0,0.06), rgba(236,120,19,0.06))",
          border: "1px solid rgba(151,72,0,0.12)",
        }}
      >
        <Image
          src="/assets/ad-icon.png"
          alt="Wandershops app"
          width={48}
          height={48}
          className="w-12 h-12 rounded-xl flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-sm font-bold text-[#0b1c30]">
            Get the Full Experience
          </p>
          <p className="text-xs text-slate-500">
            Discover more shops on Wandershops
          </p>
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold px-3 py-1.5 rounded-full text-white text-center"
            style={{ backgroundColor: "#0b1c30" }}
          >
            App Store
          </a>
          <a
            href={playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold px-3 py-1.5 rounded-full text-white text-center"
            style={{ backgroundColor: "#0b1c30" }}
          >
            Play Store
          </a>
        </div>
      </div>
    </div>
  );
}

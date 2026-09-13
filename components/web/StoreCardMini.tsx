import Link from "next/link";
import Image from "next/image";
import { IconLocation, IconChevronRight } from "@/components/web/icons";

type StoreCardMiniProps = {
  store: {
    name: string;
    slug?: string | null;
    address?: string | null;
  };
  storeLogo?: string | null;
  placeName?: string | null;
};

export default function StoreCardMini({
  store,
  storeLogo,
  placeName,
}: StoreCardMiniProps) {
  return (
    <Link
      href={store.slug ? `/web/shop/${store.slug}` : "/"}
      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 mb-6"
      style={{ textDecoration: "none" }}
    >
      {/* Store logo */}
      <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0">
        {storeLogo ? (
          <Image
            src={storeLogo}
            alt={store.name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200" />
        )}
      </div>

      {/* Store info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] font-bold uppercase text-[#974800] mb-0.5"
          style={{ letterSpacing: "0.5px" }}
        >
          Available at
        </p>
        <p className="text-base font-bold text-[#0b1c30] truncate">
          {store.name}
        </p>
        {(store.address || placeName) && (
          <div className="flex items-center gap-1 mt-0.5">
            <IconLocation size={14} className="text-slate-500" />
            <p className="text-xs text-slate-500 truncate">
              {store.address || placeName}
            </p>
          </div>
        )}
      </div>

      <IconChevronRight size={24} className="text-slate-300 flex-shrink-0" />
    </Link>
  );
}

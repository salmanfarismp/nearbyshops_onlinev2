import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "rgba(151,72,0,0.1)" }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "32px", color: "#974800" }}
        >
          inventory_2
        </span>
      </div>
      <h1 className="text-2xl font-extrabold text-[#0b1c30] mb-2">
        Product Not Found
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        This product doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full text-white font-bold text-sm"
        style={{ backgroundColor: "#974800" }}
      >
        Explore Wandershops
      </Link>
    </div>
  );
}

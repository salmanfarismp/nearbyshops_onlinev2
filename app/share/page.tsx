import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ClientRedirect from "./ClientRedirect"; // We will create this below
import { getTransformedUrl } from "@/utils/image";

type Props = {
  searchParams: Promise<{ type?: string; id?: string }>;
};

// 1. DYNAMIC META GENERATION FOR WHATSAPP/SOCIALS
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { type, id } = await searchParams;

  // Crucial: Use absolute URL for the fallback image
  const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "https://wandershops.com";
  let title = "Discover local stores on Wandershops";
  let description =
    "Find local vendors and amazing products right in your neighborhood.";
  let imageUrl = `${DOMAIN}/assets/ad-icon.png`;

  if (type && id) {
    try {
      // Safely initialize Supabase
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      if (type === "store") {
        const { data: store } = await supabase
          .from("Store")
          .select("name,description,profile_url")
          .eq("slug", id)
          .single();

        if (store) {
          title = `${store.name} | Wandershops`;
          description = store.description || description;
          imageUrl = getTransformedUrl(store.profile_url) || imageUrl;
        }
      }

      if (type === "product") {
        const { data: product } = await supabase
          .from("Product")
          .select(`*, images:ProductImage(*)`)
          .eq("id", id)
          .single();

        if (product) {
          const primaryImg =
            product.images?.find((img: any) => img.is_primary) ||
            product.images?.[0];

          title = `${product.name} | Wandershops`;
          description = product.description || description;
          imageUrl = getTransformedUrl(primaryImg?.img_url) || imageUrl;
        }
      }
    } catch (error) {
      console.error("Error fetching metadata details", error);
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: "website",
    },
  };
}

// 2. THE VISUAL PAGE
export default async function SharePage({ searchParams }: Props) {
  const { type, id } = await searchParams;
  // Instead of server redirect, we return a simple page with a client-side redirect component.
  // This allows the HTML (and its metadata tags) to be successfully served to WhatsApp.
  const targetUrl = `/web/${type === "product" ? "product" : "shop"}/${id}`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h2>Opening Wandershops...</h2>
      <p style={{ color: "#666" }}>
        Redirecting you to our application download page.
      </p>
      <ClientRedirect target={targetUrl} />
    </div>
  );
}

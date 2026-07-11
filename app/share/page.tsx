import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ type?: string; id?: string }>;
};

// 1. DYNAMIC META GENERATION FOR WHATSAPP/SOCIALS
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { type, id } = await searchParams;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Default values if parameters are missing
  let title = "Discover local stores on Wandershops";
  let description =
    "Find local vendors and amazing products right in your neighborhood.";
  let imageUrl = "/assets/ad-icon.png";

  if (type && id) {
    try {
      // Fetch data directly from your backend/database

      if (type === "store") {
        const { data: store, error: storeError } = await supabase
          .from("Store")
          .select("name,description,profile_url")
          .eq("slug", id)
          .single();

        if (store) {
          title = `${store.name} | Wandershops`;
          description = store.description;
          imageUrl = store.profile_url || imageUrl;
        }
      }
      if (type === "product") {
        const { data: product, error: productError } = await supabase
          .from("Product")
          .select(
            `
          *,
          images:ProductImage(*)
        `,
          )
          .eq("id", id)
          .single();

        const primaryImg =
          product.images?.find((img: any) => img.is_primary) ||
          product.images?.[0];

        if (product) {
          title = `${product.name} | Wandershops`;
          description = product.description;
          imageUrl = primaryImg.img_url || imageUrl;
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

// 2. THE VISUAL FALLBACK PAGE (If the user doesn't have the app)
export default async function SharePage({ searchParams }: Props) {
  // Option A: Instantly auto-redirect them to the Play Store/App Store landing page
  redirect("/#download-app");
}

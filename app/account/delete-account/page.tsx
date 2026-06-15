import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DeleteAccountForm } from "./DeleteAccountForm";

export const metadata = {
  title: "Delete Account - Nearbyshops",
  description: "Request permanent deletion of your Nearbyshops vendor account and business data.",
};

export default async function DeleteAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const isAppView = resolvedSearchParams["app_view"] === "true";

  return (
    <>
      {!isAppView && <Navbar />}
      <main className={isAppView ? "" : "pt-20 min-h-[calc(100vh-16rem)] flex flex-col justify-center"}>
        <DeleteAccountForm isAppView={isAppView} />
      </main>
      {!isAppView && <Footer />}
    </>
  );
}

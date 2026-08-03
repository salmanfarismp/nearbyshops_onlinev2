import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Privacy Policy - Wandershops",
  description: "Our privacy policy and data handling practices.",
};

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const isAppView =
    resolvedSearchParams["app_view"] === "true" ||
    resolvedSearchParams["app-view"] === "true";

  return (
    <>
      <Navbar />
      <main className={isAppView ? "" : "pt-20"}>
        <Section className={isAppView ? "bg-white" : "bg-surface"}>
          <Container className="max-w-3xl">
            <div className="mb-8 md:mb-12">
              <h1 className="font-display-lg text-4xl md:text-display-lg text-on-surface mb-4 md:mb-6">
                Privacy Policy
              </h1>
              <div className="text-on-surface-variant text-base md:text-lg">
                <p>
                  <strong>Last Updated:</strong> April 30, 2026
                </p>
                <p>
                  <strong>Owner:</strong> Salmanul Faris M P
                </p>
                <p>
                  <strong>Contact:</strong>{" "}
                  <a
                    href="mailto:hello@webbymuse.com"
                    className="text-primary-container hover:underline break-all"
                  >
                    hello@webbymuse.com
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-8 md:space-y-12 text-on-surface-variant text-base md:text-lg leading-relaxed font-body-md">
              {/* 1. INTRODUCTION */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  1. Introduction
                </h2>
                <p className="mb-4">
                  Welcome to Wandershops. This Privacy Policy explains how
                  Salmanul Faris M P ("we," "us," or
                  "our"), collects, uses, and protects information when you use
                  the Wandershops mobile application.
                </p>
                <p>
                  Our mission is to support local communities in India by
                  connecting shoppers with nearby vendors. We are committed to a
                  "human-centric" approach, which means we collect the absolute
                  minimum amount of data required to provide our service.
                </p>
              </div>

              {/* 2. INFORMATION WE COLLECT */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-4 md:mb-6">
                  2. Information We Collect
                </h2>

                <h3 className="font-headline-sm text-lg md:text-xl font-bold text-on-surface mb-3 md:mb-4">
                  A. For Users (Shoppers)
                </h3>
                <p className="mb-3 md:mb-4">
                  We believe in total anonymity for our users.
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3 mb-6 md:mb-8">
                  <li>
                    <strong>No Personal Accounts:</strong> We do not collect
                    your name, phone number, or email address.
                  </li>
                  <li>
                    <strong>Device Identifier:</strong> We use a unique,
                    anonymous Device ID to save your "Favorites" and "Ratings."
                    This data is stored on our servers but is never linked to
                    your real-world identity.
                  </li>
                  <li>
                    <strong>Location Data:</strong> To show you shops in your
                    vicinity, we request access to your location when the app is
                    open.
                    <ul className="list-[circle] pl-5 md:pl-6 mt-2 space-y-2">
                      <li>
                        We <strong>DO NOT</strong> track your location in the
                        background.
                      </li>
                      <li>
                        We <strong>DO NOT</strong> store your location history
                        on our servers; it is kept locally on your device only.
                      </li>
                    </ul>
                  </li>
                </ul>

                <h3 className="font-headline-sm text-lg md:text-xl font-bold text-on-surface mb-3 md:mb-4">
                  B. For Vendors (Shop Owners)
                </h3>
                <p className="mb-3 md:mb-4">
                  To enable customers to find and contact you, we collect:
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li>
                    <strong>Shop Details:</strong> Name, description, category,
                    and images.
                  </li>
                  <li>
                    <strong>Contact Information:</strong> Mobile number and
                    WhatsApp number.
                  </li>
                  <li>
                    <strong>Digital Presence:</strong> Instagram ID and other
                    social media handles.
                  </li>
                  <li>
                    <strong>Physical Location:</strong> The coordinates and
                    address of your shop.
                  </li>
                  <li>
                    <strong>Subscription Status:</strong> We store your current
                    plan level and expiry date.
                  </li>
                </ul>
              </div>

              {/* 3. PAYMENTS & SUBSCRIPTIONS */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  3. Payments & Subscriptions
                </h2>
                <p className="mb-3 md:mb-4">
                  Wandershops offers premium tier features for vendors. We do
                  not process, see, or store your financial or payment card
                  details on our servers.
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li>
                    <strong>iOS Subscriptions:</strong> Processed securely via
                    Apple In-App Purchases (IAP). Your transaction details are
                    subject to Apple's Privacy Policy.
                  </li>
                  <li>
                    <strong>Android Subscriptions:</strong> Processed securely
                    via Google Play Billing. We collect and store minimal
                    transaction metadata (such as payment success status,
                    transaction ID, and plan duration) solely to activate and
                    validate your vendor subscription features.
                  </li>
                </ul>
              </div>

              {/* 4. THIRD-PARTY SERVICES */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  4. Third-Party Services
                </h2>
                <p className="mb-3 md:mb-4">
                  We share data only with service providers essential to the
                  app's core functionality:
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li>
                    <strong>Supabase:</strong> Used for our secure PostgreSQL
                    database storage.
                  </li>
                  <li>
                    <strong>Meta / WhatsApp Cloud API:</strong> Used for
                    communication and vendor redirects.
                  </li>
                  <li>
                    <strong>Redirects:</strong> When a shopper clicks to contact
                    a vendor, they are seamlessly redirected to WhatsApp. Those
                    conversations are fully private and governed entirely by
                    WhatsApp's Privacy Policy.
                  </li>
                  <li>
                    <strong>Analytics:</strong> We value your privacy and do not
                    use any third-party marketing, behavioral analytics
                    tracking, or tracking cookies.
                  </li>
                </ul>
              </div>

              {/* 5. DATA RETENTION & DELETION */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  5. Data Retention & Deletion
                </h2>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li>
                    <strong>Users:</strong> Since we do not collect any personal
                    data or require accounts for shoppers, no account data is
                    stored on our servers. Your "Favorites" and "Ratings" are
                    tied anonymously to your device identifier. To clear your
                    saved items, simply unfavorite the shops and products
                    directly within the app.
                  </li>
                  <li>
                    <strong>Vendors:</strong> You retain full control over your
                    data. You can permanently delete your shop listing, contact
                    details, and account data at any time directly within the
                    app by navigating to
                    <strong> Settings / Store Information</strong> and selecting
                    the <strong>"Delete my account"</strong> option. This action
                    immediately and irreversibly removes your vendor profile
                    from our active database.
                  </li>
                </ul>
              </div>

              {/* 6. COMPLIANCE */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  6. Compliance
                </h2>
                <p>
                  This policy is built to align with India's Digital Personal
                  Data Protection (DPDP) Act and international mobile
                  application store guidelines.
                </p>
              </div>

              {/* 7. RIGHTS OF DATA PRINCIPALS */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  7. Rights of Data Principals
                </h2>
                <p className="mb-3 md:mb-4">
                  In compliance with India's DPDP Act, users and vendors
                  (referred to as Data Principals) hold the following rights:
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li>
                    <strong>Right to Information:</strong> Request a summary of
                    personal data currently being processed and the processing
                    activities.
                  </li>
                  <li>
                    <strong>Right to Correction and Erasure:</strong> Correct
                    inaccuracies or request complete erasure of your personal
                    data when it is no longer required for the purpose it was
                    collected.
                  </li>
                  <li>
                    <strong>Right to Withdraw Consent:</strong> You may withdraw
                    your consent to data collection or processing at any time
                    simply by uninstalling the application or requesting a
                    vendor profile deletion.
                  </li>
                </ul>
              </div>

              {/* 8. GRIEVANCE REDRESSAL */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  8. Grievance Redressal
                </h2>
                <p className="mb-3 md:mb-4">
                  If you have any questions, feedback, or complaints regarding
                  how your data is handled, you may contact our designated
                  Grievance Officer:
                </p>
                <div className="bg-surface-container rounded-xl p-5 md:p-6 break-words">
                  <p className="font-bold text-on-surface mb-1">
                    Grievance Officer
                  </p>
                  <p className="mb-2 text-on-surface">Salmanul Faris M P</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:hello@webbymuse.com"
                      className="text-primary-container hover:underline"
                    >
                      hello@webbymuse.com
                    </a>
                  </p>
                </div>
              </div>

              {/* 9. CONTACT US */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  9. Contact Us
                </h2>
                <p className="mb-3 md:mb-4">
                  For general privacy inquiries or data requests, please
                  contact:
                </p>
                <div className="bg-surface-container rounded-xl p-5 md:p-6 break-words">
                  <p className="font-bold text-on-surface mb-2">
                    Salmanul Faris M P
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:hello@webbymuse.com"
                      className="text-primary-container hover:underline"
                    >
                      hello@webbymuse.com
                    </a>
                  </p>
                  <p>
                    Web:{" "}
                    <a
                      href="https://www.wandershops.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-container hover:underline"
                    >
                      www.wandershops.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Privacy Policy - Nearbyshops",
  description: "Our privacy policy and data handling practices.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Section className="bg-surface">
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
                  <strong>Owner:</strong> Web by Muse
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
                  Welcome to Nearbyshops. This Privacy Policy explains how Web
                  by Muse ("we," "us," or "our") collects, uses, and protects
                  information when you use the Nearbyshops mobile application.
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
                  Nearbyshops offers tiered subscription plans for vendors. We
                  do not store your financial or card details on our servers.
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li>
                    <strong>iOS Subscriptions:</strong> Processed via Apple
                    In-App Purchases (IAP). Your transaction is subject to
                    Apple's Privacy Policy.
                  </li>
                  <li>
                    <strong>Android Subscriptions:</strong> Processed via
                    Razorpay. Your data is handled according to Razorpay's
                    PCI-DSS compliant standards.
                  </li>
                  <li>
                    <strong>Pricing:</strong> Current tiers are set at ₹240 for
                    3 months and ₹960 for 1 year (subject to change with
                    notice).
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
                  app's functionality:
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
                    <strong>Redirects:</strong> When a user clicks to contact a
                    vendor, they are redirected to WhatsApp. Those conversations
                    are private and governed by WhatsApp's Privacy Policy.
                  </li>
                  <li>
                    <strong>Analytics:</strong> We do not use any third-party
                    analytics or tracking cookies.
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
                    <strong>Users:</strong> You can wipe all local data and
                    device-linked favorites at any time by clicking the "Clear
                    All Data" button at the bottom of the Privacy/Settings page
                    in the app.
                  </li>
                  <li>
                    <strong>Vendors:</strong> If you wish to delete your shop
                    listing or account data, please contact us at the email
                    provided below.
                  </li>
                </ul>
              </div>

              {/* 6. COMPLIANCE */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  6. Compliance
                </h2>
                <p>
                  This policy is designed to comply with India's Digital
                  Personal Data Protection (DPDP) Act and international app
                  store guidelines.
                </p>
              </div>

              {/* 7. CONTACT US */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  7. Contact Us
                </h2>
                <p className="mb-3 md:mb-4">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact:
                </p>
                <div className="bg-surface-container rounded-xl p-5 md:p-6 break-words">
                  <p className="font-bold text-on-surface mb-2">Web by Muse</p>
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
                      href="https://www.nearbyshops.online"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-container hover:underline"
                    >
                      www.nearbyshops.online
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

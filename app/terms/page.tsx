import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Terms of Service - Nearbyshops",
  description: "Terms of Service and User Agreement for Nearbyshops.",
};

export default async function TermsPage({
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
                Terms of Service
              </h1>
              <div className="text-on-surface-variant text-base md:text-lg">
                <p>
                  <strong>Last Updated:</strong> April 30, 2026
                </p>
                <p>
                  <strong>Entity:</strong> Salmanul Faris M P, operating as Web by
                  Muse
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
              {/* 1. Agreement to Terms */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  1. Agreement to Terms
                </h2>
                <p>
                  By accessing or using Nearbyshops, you agree to be bound by
                  these Terms of Service. These terms constitute a legally
                  binding agreement between you and Salmanul Faris M P, operating
                  as Web by Muse. If you do not agree to these terms, please do
                  not install or use the application.
                </p>
              </div>

              {/* 2. Nature of Service */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  2. Nature of Service
                </h2>
                <p className="mb-3 md:mb-4">
                  Nearbyshops acts as a localized marketplace platform and
                  directory that connects local shoppers with nearby vendors in
                  India.
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3 mb-3 md:mb-4">
                  <li>
                    <strong>Users (Shoppers):</strong> We provide an
                    informational directory to discover local shops and vendors
                    in your current vicinity.
                  </li>
                  <li>
                    <strong>Vendors (Shop Owners):</strong> We provide a digital
                    listing service to display and showcase your storefront,
                    location, and details to nearby customers.
                  </li>
                  <li>
                    <strong>Transactions:</strong> Nearbyshops is not an
                    intermediary, agent, or payment processor for the
                    transactions occurring between shoppers and vendors. All
                    business interactions, item negotiations, payments, and
                    orders occur directly between the parties involved—typically
                    off-platform via WhatsApp. We hold no responsibility for the
                    condition, legality, quality, safety, or fulfillment of any
                    items or services advertised by vendors.
                  </li>
                </ul>
              </div>

              {/* 3. Vendor Subscriptions and Payments */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  3. Vendor Subscriptions and Payments
                </h2>
                <p className="mb-3 md:mb-4">
                  To publish a premium business storefront on Nearbyshops,
                  vendors must enroll in an available subscription plan.
                </p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li>
                    <strong>Pricing & Tiers:</strong> Subscription details,
                    available tiers, and current rates are displayed within the
                    app platform prior to purchase and are subject to change
                    with prior notice.
                  </li>
                  <li>
                    <strong>Payment Processors:</strong>
                    <ul className="list-[circle] pl-5 md:pl-6 mt-2 space-y-2">
                      <li>
                        <strong>iOS:</strong> All purchases and subscriptions
                        are handled, managed, and securely processed exclusively
                        through Apple In-App Purchases (IAP).
                      </li>
                      <li>
                        <strong>Android:</strong> All purchases and
                        subscriptions are handled, managed, and securely
                        processed exclusively through Google Play Billing.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Management & Cancellation:</strong> Subscriptions
                    are managed directly through your personal device platform
                    settings (Apple ID Subscriptions or Google Play
                    Subscriptions). You retain the right to cancel or alter your
                    subscription tier at any time through those centralized
                    store interfaces.
                  </li>
                  <li>
                    <strong>Refunds:</strong> Payments are processed directly by
                    the respective platform stores and are generally governed by
                    Apple and Google's respective digital distribution refund
                    policies.
                  </li>
                </ul>
              </div>

              {/* 4. User Conduct and Content */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  4. User Conduct and Content
                </h2>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li>
                    <strong>Accuracy of Information:</strong> Vendors assume
                    sole responsibility for maintaining accurate, truthful, and
                    current shop descriptions, phone numbers, WhatsApp
                    addresses, and geographical coordinates.
                  </li>
                  <li>
                    <strong>Prohibited Activities:</strong> You may not upload,
                    publish, or share store descriptions, images, or items that
                    are fraudulent, unlawful, deceptive, or otherwise harmful to
                    the community. We reserve the right to instantly remove any
                    vendor storefront listing that violates our localized safety
                    standards.
                  </li>
                  <li>
                    <strong>Anonymity & Security:</strong> Shoppers navigate the
                    system anonymously via an encrypted, randomly assigned
                    Device ID. Any deliberate attempt to disrupt, breach, or
                    exploit our technical database or security perimeter is
                    strictly prohibited.
                  </li>
                </ul>
              </div>

              {/* 5. Limitation of Liability */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  5. Limitation of Liability
                </h2>
                <p>
                  We provide Nearbyshops strictly on an "as is" and "as
                  available" basis. While we strive to maintain high
                  availability and reliable uptime, we cannot guarantee
                  constant, uninterrupted service or mistake-free database
                  listings. We are not liable for any financial, material, or
                  relational fallout stemming from app outages, incorrect vendor
                  details, or transactional disputes arising out of a connection
                  initiated through the app.
                </p>
              </div>

              {/* 6. Termination */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  6. Termination
                </h2>
                <p className="mb-3">
                  We reserve the right to suspend, restrict, or entirely
                  terminate access to our listing directory for any storefront
                  or individual found violating these terms or conducting
                  deceptive local practices.
                </p>
                <p>
                  Vendors retain full autonomy over their presence and can
                  permanently opt out and close their accounts at any given
                  point. This can be done directly by opening the app and
                  accessing the <strong>"Delete my account"</strong> button
                  located under the{" "}
                  <strong>Settings / Store Information</strong> panel.
                </p>
              </div>

              {/* 7. Contact Us */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">
                  7. Contact Us
                </h2>
                <p className="mb-3 md:mb-4">
                  For support tickets, structural questions, or formal clarity
                  regarding these Terms of Service, please contact us at:
                </p>
                <div className="bg-surface-container rounded-xl p-5 md:p-6 break-words">
                  <p className="font-bold text-on-surface mb-1">
                    Salmanul Faris M P
                  </p>
                  <p className="text-on-surface mb-2">Web by Muse</p>
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
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}

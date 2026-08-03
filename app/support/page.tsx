import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Support & Help Center - Wandershops",
  description: "Get support for Wandershops or learn how to upgrade your shop subscription.",
};

export default async function SupportPage({
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
        {/* Simple & Elegant Centered Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-20 bg-surface">
          {/* Decorative background blurs */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-orange-100/40 rounded-full blur-3xl -z-10"></div>
          
          <Container className="text-center">
            <div className="max-w-3xl mx-auto z-10">
              <span className="inline-block text-primary-container font-label-sm uppercase tracking-wider mb-4 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100/50">
                Help & Support
              </span>
              <h1 className="font-display-lg text-4xl md:text-5xl text-on-surface mb-6 leading-tight tracking-tight">
                How can we <span className="text-primary-container">help</span> you today?
              </h1>
              <p className="font-body-lg text-base md:text-lg text-on-surface-variant mb-8 leading-relaxed">
                Whether you are a vendor seeking plan upgrades, or a shopper looking for support, we are here to ensure you have a seamless experience. Find our contact channels or common answers below.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="primary" href="https://wa.me/918921931499" className="hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined mr-2">chat</span> Chat on WhatsApp
                </Button>
                <Button variant="outline" href="#contact-channels" className="transition-all">
                  Contact Support
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Contact Channels Grid (styled like the Home Page Features) */}
        <Section id="contact-channels" className="bg-white border-y border-surface-variant/10">
          <Container>
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-3xl text-on-surface mb-3 tracking-tight">Direct Contact Channels</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-base">
                Choose the channel that is most convenient for you. We typically respond within 24 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* WhatsApp card */}
              <div className="p-8 bg-surface rounded-[2rem] border border-surface-variant/20 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-6 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.398 9.805-9.802.002-2.618-1.01-5.078-2.856-6.927C16.378 1.986 13.924 1.01 11.997 1.01 6.6 1.01 2.204 5.41 2.202 10.806c-.001 1.492.393 2.94 1.14 4.225l-1.02 3.725 3.825-.992-.09-.044zm11.517-5.328c-.287-.144-1.702-.84-1.965-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.129-.168.192-.336.216-.624.072-.288-.144-1.217-.449-2.317-1.43-856-.763-1.433-1.706-1.6-1.993-.168-.288-.018-.444.126-.587.13-.13.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.564-.473-.488-.648-.497-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.399 0 1.416 1.032 2.784 1.176 2.976.144.192 2.03 3.1 4.92 4.35.687.297 1.224.474 1.643.607.69.219 1.319.19 1.815.115.552-.083 1.702-.696 1.942-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
                  </svg>
                </div>
                <h3 className="font-headline-md text-xl text-on-surface mb-3">WhatsApp</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm mb-6 flex-grow">
                  Fast support, subscription help, or general queries. Message us directly.
                </p>
                <Button variant="primary" href="https://wa.me/918921931499" className="w-full">
                  Chat Now
                </Button>
              </div>

              {/* Email card */}
              <div className="p-8 bg-surface rounded-[2rem] border border-surface-variant/20 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-primary-container flex items-center justify-center mb-6 group-hover:bg-primary-container group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <h3 className="font-headline-md text-xl text-on-surface mb-3">Email Support</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm mb-6 flex-grow">
                  For formal requests, listing verifications, or other inquiries.
                </p>
                <Button variant="outline" href="mailto:hello@webbymuse.com" className="w-full">
                  hello@webbymuse.com
                </Button>
              </div>

              {/* Phone card */}
              <div className="p-8 bg-surface rounded-[2rem] border border-surface-variant/20 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-primary-container flex items-center justify-center mb-6 group-hover:bg-primary-container group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl">call</span>
                </div>
                <h3 className="font-headline-md text-xl text-on-surface mb-3">Phone Line</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm mb-6 flex-grow">
                  Need to speak directly? Call our customer support line during business hours.
                </p>
                <Button variant="outline" href="tel:+918921931499" className="w-full">
                  +91 89219 31499
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* FAQs */}
        <Section className="bg-surface">
          <Container className="max-w-[800px]">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-3xl text-on-surface mb-3 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-on-surface-variant text-base">Quick answers to common questions about Wandershops.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-surface-variant/10 shadow-[0_4px_20px_-10px_rgba(151,72,0,0.05)]">
                <h3 className="font-headline-md text-lg text-on-surface mb-3 font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">delete</span>
                  How do I delete my vendor shop listing?
                </h3>
                <p className="text-on-surface-variant text-base leading-relaxed pl-8">
                  Deleting your profile is instant and irreversible. Within the Wandershops mobile application, navigate to{" "}
                  <strong>Settings</strong> &gt; <strong>Store Information</strong>, and click the{" "}
                  <strong>"Delete my account"</strong> button. This will delete all your shop listings and contact details from our active database.
                </p>
              </div>

              {/* Redesigned Payment Plans FAQ answer with subscription steps */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-surface-variant/10 shadow-[0_4px_20px_-10px_rgba(151,72,0,0.05)]">
                <h3 className="font-headline-md text-lg text-on-surface mb-3 font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">credit_card</span>
                  How do I upgrade my shop subscription?
                </h3>
                <div className="text-on-surface-variant text-base leading-relaxed pl-8 space-y-3">
                  <p>
                    Upgrading your shop subscription can be done directly within the Wandershops mobile application by following these steps:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 mt-2">
                    <li>
                      <strong>Go to your profile (App dashboard):</strong> Open the Wandershops app and navigate to your Vendor Dashboard or Profile tab.
                    </li>
                    <li>
                      <strong>Select 'Subscription' (Settings):</strong> Tap on Subscription Settings or Manage Plan to view your current tier.
                    </li>
                    <li>
                      <strong>Choose your new tier (Plan options):</strong> Browse the available subscription tiers and select the plan that best fits your shop's needs.
                    </li>
                    <li>
                      <strong>Complete the payment (Secure checkout):</strong> Confirm your choice. Once the payment is processed, your new features and higher limits will be activated instantly.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 border border-surface-variant/10 shadow-[0_4px_20px_-10px_rgba(151,72,0,0.05)]">
                <h3 className="font-headline-md text-lg text-on-surface mb-3 font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">location_on</span>
                  Do you store my location details?
                </h3>
                <p className="text-on-surface-variant text-base leading-relaxed pl-8">
                  For shoppers, we value total privacy and anonymity. We do not track your location in the background or store location history. Shop discovery location calculations are processed on-device.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Business and Legal entity details */}
        <section className="bg-white py-12 border-t border-surface-variant/10">
          <Container className="text-center text-on-surface-variant/60 text-sm">
            <div className="max-w-md mx-auto space-y-2">
              <p>Salmanul Faris M P</p>
              <p>
                Website:{" "}
                <a
                  href="https://www.wandershops.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-container hover:underline"
                >
                  www.wandershops.com
                </a>
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

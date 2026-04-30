import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Terms of Service - Nearbyshops',
  description: 'Terms of Service and User Agreement for Nearbyshops.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Section className="bg-surface">
          <Container className="max-w-3xl">
            <div className="mb-8 md:mb-12">
              <h1 className="font-display-lg text-4xl md:text-display-lg text-on-surface mb-4 md:mb-6">Terms of Service</h1>
              <div className="text-on-surface-variant text-base md:text-lg">
                <p><strong>Last Updated:</strong> April 30, 2026</p>
                <p><strong>Entity:</strong> Web by Muse</p>
                <p><strong>Contact:</strong> <a href="mailto:hello@nearbyshops.online" className="text-primary-container hover:underline break-all">hello@nearbyshops.online</a></p>
              </div>
            </div>

            <div className="space-y-8 md:space-y-12 text-on-surface-variant text-base md:text-lg leading-relaxed font-body-md">
              {/* 1. Agreement to Terms */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using Nearbyshops, you agree to be bound by these Terms. These terms are a legal agreement between you and Web by Muse. If you do not agree, please do not use the application.
                </p>
              </div>

              {/* 2. Nature of Service */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">2. Nature of Service</h2>
                <p className="mb-3 md:mb-4">Nearbyshops is a platform that connects local shoppers with local vendors.</p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3 mb-3 md:mb-4">
                  <li><strong>Users:</strong> We provide a directory to discover local businesses.</li>
                  <li><strong>Vendors:</strong> We provide a listing service to showcase your business to local customers.</li>
                  <li><strong>Transactions:</strong> Nearbyshops is not a payment intermediary between shoppers and vendors. All purchases, negotiations, and interactions occur directly between the user and the vendor (typically via WhatsApp). We are not responsible for the quality, safety, or legality of the items advertised.</li>
                </ul>
              </div>

              {/* 3. Vendor Subscriptions and Payments */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">3. Vendor Subscriptions and Payments</h2>
                <p className="mb-3 md:mb-4">To list a business on Nearbyshops, vendors must choose a subscription tier.</p>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li><strong>Pricing:</strong> Current rates are ₹240 for 3 months or ₹960 for 1 year.</li>
                  <li>
                    <strong>Payment Processors:</strong>
                    <ul className="list-[circle] pl-5 md:pl-6 mt-2 space-y-2">
                      <li><strong>iOS:</strong> Payments are handled exclusively through Apple In-App Purchases.</li>
                      <li><strong>Android:</strong> Payments are processed securely via Razorpay.</li>
                    </ul>
                  </li>
                  <li><strong>Renewal:</strong> Subscriptions may set to auto-renew depending on your platform settings (Apple ID or Google Play). You can manage or cancel your subscription at any time through your device's subscription settings.</li>
                  <li><strong>Refunds:</strong> Payments are generally non-refundable once the service period has started, as digital listing space is granted immediately.</li>
                </ul>
              </div>

              {/* 4. User Conduct and Content */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">4. User Conduct and Content</h2>
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                  <li><strong>Accuracy:</strong> Vendors are responsible for ensuring their shop details, location, and contact information are accurate and up-to-date.</li>
                  <li><strong>Prohibited Content:</strong> You may not post content that is illegal, fraudulent, or harmful. Web by Muse reserves the right to remove any listing that violates community standards.</li>
                  <li><strong>Anonymity:</strong> Users interact with the app via an anonymous Device ID. You agree not to attempt to circumvent our technical security measures.</li>
                </ul>
              </div>

              {/* 5. Limitation of Liability */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">5. Limitation of Liability</h2>
                <p>
                  Web by Muse provides Nearbyshops "as is." While we strive for 100% uptime, we are not liable for any service interruptions or for the accuracy of vendor-provided data. We are not responsible for any disputes that arise between a shopper and a vendor.
                </p>
              </div>

              {/* 6. Termination */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">6. Termination</h2>
                <p>
                  We reserve the right to suspend or terminate access to our services for anyone who violates these terms or engages in fraudulent activity.
                </p>
              </div>

              {/* 7. Contact Us */}
              <div>
                <h2 className="font-headline-md text-2xl md:text-headline-md text-on-surface mb-3 md:mb-4">7. Contact Us</h2>
                <p className="mb-3 md:mb-4">For support or questions regarding these terms, please reach out to us:</p>
                <div className="bg-surface-container rounded-xl p-5 md:p-6 break-words">
                  <p className="font-bold text-on-surface mb-2">Web by Muse</p>
                  <p>Email: <a href="mailto:hello@nearbyshops.online" className="text-primary-container hover:underline">hello@nearbyshops.online</a></p>
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

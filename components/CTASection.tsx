"use client";
import React from "react";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";

const appstorelink = "https://apps.apple.com/in/app/wandershops/id6786978367";
const playstorelink =
  "https://play.google.com/store/apps/details?id=com.sallmanfaaris.wandershops";

export const CTASection = () => {
  return (
    <Section id="download-app" className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="bg-primary-container rounded-3xl p-8 sm:p-12 lg:p-20 relative overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center text-on-primary">
          <h2 className="font-display-lg text-3xl sm:text-4xl lg:text-display-lg mb-4 sm:mb-8">
            Ready to explore your neighborhood?
          </h2>
          <p className="text-base sm:text-body-lg mb-8 sm:mb-12 max-w-2xl mx-auto opacity-90">
            Join 50,000+ neighbors who are discovering unique products while
            building a stronger local economy.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => window.open(appstorelink, "_blank")}
              className="bg-on-background text-white flex items-center gap-3 px-8 py-4 rounded-xl pill-button hover:bg-slate-900 transition-all"
            >
              <span className="material-symbols-outlined">ios</span>
              <div className="text-left">
                <div className="text-[10px] leading-none uppercase opacity-70">
                  Download on the
                </div>
                <div className="text-lg font-bold leading-none">App Store</div>
              </div>
            </button>
            <button
              onClick={() => window.open(playstorelink, "_blank")}
              className="bg-on-background text-white flex items-center gap-3 px-8 py-4 rounded-xl pill-button hover:bg-slate-900 transition-all"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                play_arrow
              </span>
              <div className="text-left">
                <div className="text-[10px] leading-none uppercase opacity-70">
                  Get it on
                </div>
                <div className="text-lg font-bold leading-none">
                  Google Play
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

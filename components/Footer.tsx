'use client';
import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const FooterContent = () => {
  const searchParams = useSearchParams();
  const isAppView = searchParams.get('app_view') === 'true';

  if (isAppView) return null;

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-12 px-8 max-w-[1280px] mx-auto w-full text-sm">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-xl font-bold text-slate-900 flex items-center">
            <Image 
              src="/assets/ad-icon.png"
              alt="Nearbyshops Logo"
              width={40}
              height={40}
              className="w-auto inline-block mr-2 h-10"
            />
            Nearbyshops
          </Link>
          <p className="text-slate-500">© {new Date().getFullYear()} Nearbyshops. Built with love for the neighborhood.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/privacy" className="text-slate-500 hover:text-primary-container transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-slate-500 hover:text-primary-container transition-colors">Terms of Service</Link>
          {/* <a className="text-slate-500 hover:text-primary-container transition-colors" href="#">Help Center</a> */}
          <a className="text-slate-500 hover:text-primary-container transition-colors" target='_blank' href="https://www.instagram.com/nearbyshops.online/">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export const Footer = () => {
  return (
    <Suspense fallback={null}>
      <FooterContent />
    </Suspense>
  );
};

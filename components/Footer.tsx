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
              src="https://lh3.googleusercontent.com/aida/ADBb0uipWJb82nbC5SvrynNrv7Lmk8DZAp9_wSToa2ExjrePVwmP4GT3vvS6F_21AHlUGfAY9Dz1a6Oa1MV-qQ8SEYccEiCPyfWWATU8_eqDpWha2aZQiPZd_42qlXxFnSQUiDk1sB7GiiL0H8iIzcUPgCGHgTQtsPaKonokEURHp32X02TgvTcpZZEIE5OlLVCdcbiNWJhKrmHF1bW2TTlQ9ULcf_3S7ImJI52oCUHSvsExZ3ioDCiLc0tyFm0n-oS88lrC_gTUKoUNkA"
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
          <a className="text-slate-500 hover:text-primary-container transition-colors" href="#">Help Center</a>
          <a className="text-slate-500 hover:text-primary-container transition-colors underline" href="#">Instagram</a>
          <a className="text-slate-500 hover:text-primary-container transition-colors" href="#">Twitter</a>
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

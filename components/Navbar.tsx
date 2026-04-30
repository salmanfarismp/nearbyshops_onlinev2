'use client';
import React, { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/Button';
import { Container } from './ui/Container';

const NavbarContent = () => {
  const searchParams = useSearchParams();
  const isAppView = searchParams.get('app_view') === 'true';

  if (isAppView) return null;

  return (
    <nav className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-surface-variant/20">
      <Container className="flex justify-between items-center h-20">
        <Link href="/" className="text-2xl font-black text-primary-container tracking-tighter flex items-center">
          <Image 
            src="https://lh3.googleusercontent.com/aida/ADBb0uipWJb82nbC5SvrynNrv7Lmk8DZAp9_wSToa2ExjrePVwmP4GT3vvS6F_21AHlUGfAY9Dz1a6Oa1MV-qQ8SEYccEiCPyfWWATU8_eqDpWha2aZQiPZd_42qlXxFnSQUiDk1sB7GiiL0H8iIzcUPgCGHgTQtsPaKonokEURHp32X02TgvTcpZZEIE5OlLVCdcbiNWJhKrmHF1bW2TTlQ9ULcf_3S7ImJI52oCUHSvsExZ3ioDCiLc0tyFm0n-oS88lrC_gTUKoUNkA" 
            alt="Nearbyshops Logo" 
            width={48}
            height={48}
            className="w-auto inline-block mr-2 h-12"
          />
          Nearbyshops
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="primary" size="sm" href="/#download-app">Get the App</Button>
        </div>
      </Container>
    </nav>
  );
};

export const Navbar = () => {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
};

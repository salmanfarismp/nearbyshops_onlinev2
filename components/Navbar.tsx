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
      <Container className="flex justify-between items-center h-16 sm:h-20 px-4 sm:px-8">
        <Link href="/" className="text-lg sm:text-2xl font-black text-primary-container tracking-tighter flex items-center">
          <Image 
            src="/assets/ad-icon.png" 
            alt="Wandershops Logo" 
            width={48}
            height={48}
            className="w-auto inline-block mr-0 sm:mr-2 h-10 sm:h-12"
          />
          <span>Wandershops</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="primary" size="sm" className="!px-4 sm:!px-6 !py-2 sm:!py-3 text-xs sm:text-sm" href="/#download-app">Get the App</Button>
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

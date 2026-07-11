'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirect({ target }: { target: string }) {
  const router = useRouter();

  useEffect(() => {
    // This only triggers in real web browsers, not for WhatsApp scraper bots.
    router.replace(target);
  }, [router, target]);

  return null;
}
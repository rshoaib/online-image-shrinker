'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeProvider } from '../contexts/ThemeContext';
import { FilesProvider } from '../contexts/FilesContext';
import Layout from './Layout';
import CookieConsent from './CookieConsent';
import ReactGA from 'react-ga4';
import '../i18n';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (GA_MEASUREMENT_ID && pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      ReactGA.send({ hitType: 'pageview', page: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <FilesProvider>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Layout>
          {children}
        </Layout>
        <CookieConsent />
      </FilesProvider>
    </ThemeProvider>
  );
}

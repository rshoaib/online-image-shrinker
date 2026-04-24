import '../src/index.css';
import '../src/styles/hero.css';
import ClientLayout from '../src/components/ClientLayout';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata = {
  title: 'Online Image Shrinker - Free Privacy-First Image Tools',
  description: 'Compress, resize, convert, and edit images 100% locally in your browser. AI background remover, upscaler, PDF maker, and 20+ free tools. No uploads, no accounts.',
  metadataBase: new URL('https://onlineimageshrinker.com'),
  openGraph: {
    type: 'website',
    siteName: 'Online Image Shrinker',
    title: 'Online Image Shrinker - Free Privacy-First Image Tools',
    description: 'Compress, resize, convert, and edit images 100% locally in your browser. 20+ free tools, no uploads required.',
    url: 'https://onlineimageshrinker.com',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Image Shrinker - Free Privacy-First Image Tools',
    description: '20+ free image tools that run locally in your browser. No uploads, 100% private.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  // Trim to guard against a trailing newline/whitespace in the env var
  // (Vercel env values have been observed with a stray \n which corrupts the src URL).
  const adClient = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '').trim();
  const adsenseEnabled = adClient && !adClient.includes('0000000000000000');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="pXaoDecTkY4aJ20mOVSVOMg7ao-Sz67d1_yUTcf_eqg" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />

        {/*
          Google AdSense verification snippet.
          Rendered as a plain <script> tag (not next/script) so it appears in the
          initial server-rendered HTML. Googlebot does not execute Next.js's
          lazyOnload/afterInteractive hydration, so the snippet must be in the
          raw HTML for the site to be verified.
        */}
        {adsenseEnabled && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
          />
        )}
        {adsenseEnabled && (
          <meta name="google-adsense-account" content={adClient} />
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Online Image Shrinker',
              url: 'https://onlineimageshrinker.com',
              description: 'Compress, resize, convert, and edit images 100% locally in your browser.'
            })
          }}
        />

        {/* Blocking theme script to prevent flash */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var migrated = localStorage.getItem('theme_v2');
                if (!migrated) {
                  localStorage.setItem('theme', 'light');
                  localStorage.setItem('theme_v2', '1');
                }
                var t = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', t);
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'light');
              }
            })();
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

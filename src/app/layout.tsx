import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';

import { Header } from '@/components/layouts/header';
import { Footer } from '@/components/layouts/footer';
import { safeJsonLd } from '@/components/seo/json-ld';
import { ServiceWorkerRegister } from '@/components/features/sw-register';
import { PushOptIn } from '@/components/features/push-opt-in';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YouthAtlas — Opportunities for Young People',
  description:
    'Find scholarships, fellowships, internships, grants, and more. Updated daily with AI-powered matching.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'YouthAtlas',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'YouthAtlas',
      url: 'https://youthatlas.com',
      description:
        'Find scholarships, fellowships, internships, grants, and more. Updated daily with AI-powered matching.',
    },
    {
      '@type': 'WebSite',
      name: 'YouthAtlas',
      url: 'https://youthatlas.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://youthatlas.com/opportunities?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className="font-body min-h-screen flex flex-col bg-background text-text-primary">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-481EY7ZP89"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-481EY7ZP89');
          `}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ServiceWorkerRegister />
        <PushOptIn />
      </body>
    </html>
  );
}

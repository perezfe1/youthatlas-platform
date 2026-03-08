import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';

import { Header } from '@/components/layouts/header';
import { Footer } from '@/components/layouts/footer';
import { safeJsonLd } from '@/components/seo/json-ld';

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
      </head>
      <body className="font-body min-h-screen flex flex-col bg-background text-text-primary">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

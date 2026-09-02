import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getContent } from '../lib/content';
import { createOrganizationJsonLd, createPageMetadata, createWebsiteJsonLd, siteName, siteUrl } from '../lib/seo';
import WhatsAppButton from '../components/WhatsAppButton';

const content = getContent();

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  generator: 'Next.js',
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: 'Technology, marketing, training, manpower, and workspace services',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...createPageMetadata({
    title: `${siteName} | Technology, Marketing, Training & Workspace Solutions`,
    description: content.meta.description,
    path: '/',
    keywords: [
      'IT consulting company in India',
      'software development company',
      'digital marketing services',
      'manpower solutions',
      'internship programs',
      'coworking space in Kuppam',
      'business automation services',
    ],
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = createOrganizationJsonLd();
  const websiteJsonLd = createWebsiteJsonLd();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" data-theme="light" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}

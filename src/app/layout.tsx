import type { Metadata } from 'next';
import './globals.css';
import { getContent } from '../lib/content';
import { createOrganizationJsonLd, createPageMetadata, createWebsiteJsonLd, siteName, siteUrl } from '../lib/seo';

const content = getContent();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  generator: 'Next.js',
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: 'Digital marketing and IT services',
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
    title: `${siteName} | IT Services, Web Development & Digital Marketing`,
    description: content.meta.description,
    path: '/',
    keywords: [
      'digital marketing agency in India',
      'web development company',
      'SEO services',
      'Google Ads management',
      'social media marketing',
      'business automation services',
    ],
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = createOrganizationJsonLd();
  const websiteJsonLd = createWebsiteJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
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
      </body>
    </html>
  );
}

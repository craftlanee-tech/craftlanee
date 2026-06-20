import type { Metadata } from 'next';
import './globals.css';
import content from '../content';

export const metadata: Metadata = {
  title: content.siteTitle,
  description: content.meta.description,
  keywords: [...content.meta.keywords],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}

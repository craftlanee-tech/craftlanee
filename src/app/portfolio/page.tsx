import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import PortfolioGrid from '../../components/PortfolioGrid';
import { createPageMetadata, siteName } from '../../lib/seo';

export const metadata = createPageMetadata({
  title: `Portfolio | ${siteName} Web Design & Digital Marketing Work`,
  description: 'Explore Craftlanee projects across websites, brand systems, SEO, ads, and digital growth campaigns for modern businesses.',
  path: '/portfolio',
  keywords: ['web design portfolio', 'digital marketing portfolio', 'SEO case studies', 'brand launch work', 'business growth projects'],
  image: '/images/ROI.png',
});

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      <section className="border-b border-theme bg-theme-surface px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Portfolio"
            title="Clean digital work for growing brands"
            description="A focused look at websites, brand systems, and growth campaigns built with clarity, polish, and measurable outcomes."
          />
        </div>
      </section>

      <PortfolioGrid />
      <Footer />
    </main>
  );
}

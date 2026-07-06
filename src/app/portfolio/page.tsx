import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import PortfolioGrid from '../../components/PortfolioGrid';
import { createPageMetadata, siteName } from '../../lib/seo';

export const metadata = createPageMetadata({
  title: `Portfolio | ${siteName} Technology, Marketing & Workspace Solutions`,
  description: 'Explore how CraftLanee supports technology delivery, marketing execution, training, hiring, and collaborative workspace needs.',
  path: '/portfolio',
  keywords: ['technology solutions', 'digital marketing solutions', 'training programs', 'manpower support', 'workspace Kuppam'],
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
            title="Practical solutions for businesses and professionals"
            description="A focused look at technology, marketing, training, talent, and workspace support built around real growth needs."
          />
        </div>
      </section>

      <PortfolioGrid />
      <Footer />
    </main>
  );
}

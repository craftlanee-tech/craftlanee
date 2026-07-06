import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServiceCards from '../components/ServiceCards';
import PortfolioGrid from '../components/PortfolioGrid';
import TestimonialSection from '../components/TestimonialSection';
import Footer from '../components/Footer';
import PageFooter from '../components/PageFooter';
import { createPageMetadata, siteName } from '../lib/seo';
import { getContent } from '../lib/content';

const content = getContent();

export const metadata = createPageMetadata({
  title: `${siteName} | Technology, Marketing, Training & Workspace Solutions`,
  description: content.hero.description,
  path: '/',
  keywords: [
    'IT consulting for businesses',
    'software development company',
    'digital marketing services',
    'manpower solutions',
    'internship programs',
    'workspace in Kuppam',
    'CraftLanee',
    'craftlanee',
  ],
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />
      <HeroSection />
      <ServiceCards />
      <PortfolioGrid />
      <TestimonialSection />
      <PageFooter />
      <Footer />
    </main>
  );
}

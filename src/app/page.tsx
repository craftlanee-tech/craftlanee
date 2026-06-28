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
  title: `${siteName} | IT Services, Web Development & Digital Marketing`,
  description: content.hero.description,
  path: '/',
  keywords: [
    'IT services for businesses',
    'digital marketing agency',
    'website development',
    'lead generation services',
    'SEO and ads agency',
    'Craftlanee',
    'craftlane',
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

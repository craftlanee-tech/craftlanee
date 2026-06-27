import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServiceCards from '../components/ServiceCards';
import PortfolioGrid from '../components/PortfolioGrid';
import TestimonialSection from '../components/TestimonialSection';
import Footer from '../components/Footer';
import PageFooter from '../components/PageFooter';

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

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageFooter from '../../components/PageFooter';
import SectionHeader from '../../components/SectionHeader';
import ServicesShowcase from '../../components/ServicesShowcase';
import GradientMesh from '../../components/GradientMesh';
import HeroImage from '../../components/HeroImage';
import Reveal from '../../components/Reveal';
import { Lightbulb } from 'lucide-react';
import { getContent } from '../../lib/content';
import { createPageMetadata, createServiceJsonLd, siteName } from '../../lib/seo';

const content = getContent();

export const metadata = createPageMetadata({
  title: `Services | ${siteName} IT, Marketing, Manpower, Training & Workspace`,
  description: content.services.subtitle,
  path: '/services',
  keywords: [
    'IT consulting services',
    'website development services',
    'software development services',
    'digital marketing services',
    'manpower solutions',
    'internship programs',
    'business automation',
    'coworking space Kuppam',
  ],
});

export default function ServicesPage() {
  const serviceJsonLd = createServiceJsonLd();

  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10 sm:py-28">
        <GradientMesh />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <SectionHeader eyebrow="Services" title="Services designed for innovation, growth, and opportunity" description={content.services.subtitle} />
            </Reveal>

            <HeroImage
              src="/images/port.png"
              alt="Ideas engineered into connected technology solutions"
              badgeIcon={Lightbulb}
              badgeLabel="Approach"
              badgeValue="Ideas engineered into systems"
            />
          </div>
        </div>
      </section>

      <ServicesShowcase />
      <PageFooter />
      <Footer />
    </main>
  );
}

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import ServiceCards from '../../components/ServiceCards';
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

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,195,255,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow="Services" title="Services designed for innovation, growth, and opportunity" description={content.services.subtitle} />
        </div>
      </section>

      <ServiceCards />
      <Footer />
    </main>
  );
}

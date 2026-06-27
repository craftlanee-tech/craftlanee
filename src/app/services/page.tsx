import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import ServiceCards from '../../components/ServiceCards';
import { getContent } from '../../lib/content';

const content = getContent();

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,195,255,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow="Services" title="Digital services that help brands grow" description={content.services.subtitle} />
        </div>
      </section>

      <ServiceCards />
      <Footer />
    </main>
  );
}

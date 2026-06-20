import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import ServiceCards from '../../components/ServiceCards';
import content from '../../content';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-brand-background text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,195,255,0.14),_transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow="Services" title="Digital services that help brands grow" description={content.services.subtitle} />
        </div>
      </section>

      <ServiceCards />
      <Footer />
    </main>
  );
}

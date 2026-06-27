import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import PortfolioGrid from '../../components/PortfolioGrid';

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,195,255,0.14),_transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow="Portfolio" title="Selected work across digital marketing and web design" description="Projects that reflect strategic thinking, brand clarity, and measurable outcomes." />
        </div>
      </section>

      <PortfolioGrid />
      <Footer />
    </main>
  );
}

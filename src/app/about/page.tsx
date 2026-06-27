import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import { getContent } from '../../lib/content';

const content = getContent();

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,195,255,0.14),_transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow={content.about.eyebrow} title={content.about.headline} description={content.about.description} />
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-3">
          {content.about.values.map((value) => (
            <div key={value.title} className="rounded-[32px] border border-theme bg-theme-surface-soft p-8 shadow-glow backdrop-blur-xl transition hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-theme-primary">{value.title}</h3>
              <p className="mt-4 text-theme-secondary leading-7">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

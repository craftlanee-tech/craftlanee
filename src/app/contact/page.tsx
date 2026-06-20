import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import ContactForm from '../../components/ContactForm';
import content from '../../content';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-background text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,195,255,0.14),_transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow={content.contact.eyebrow} title={content.contact.headline} description={content.contact.description} />
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid gap-10 lg:grid-cols-[1fr_0.95fr] max-w-7xl">
          <div className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Contact details</h2>
            <div className="space-y-4">
              {content.contact.details.map((detail) => (
                <div key={detail.label} className="rounded-3xl bg-black/60 p-5">
                  <p className="text-sm uppercase tracking-[0.35em] text-brand-primary">{detail.label}</p>
                  <p className="mt-2 text-lg font-medium text-white">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}

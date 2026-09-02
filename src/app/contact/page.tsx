import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import ContactForm from '../../components/ContactForm';
import GradientMesh from '../../components/GradientMesh';
import ContactMockup from '../../components/ContactMockup';
import Reveal from '../../components/Reveal';
import { getContent } from '../../lib/content';
import { createPageMetadata, siteName } from '../../lib/seo';

const detailIcons: Record<string, typeof Mail> = {
  Email: Mail,
  Phone: Phone,
  Location: MapPin,
  Hours: Clock,
};

const content = getContent();

export const metadata = createPageMetadata({
  title: `Contact ${siteName} | Start Your Technology, Marketing, Training or Workspace Inquiry`,
  description: content.contact.description,
  path: '/contact',
  keywords: ['contact CraftLanee', 'IT services inquiry', 'digital marketing inquiry', 'manpower support', 'internship inquiry', 'workspace Kuppam'],
});

const officeCoordinates = { lat: 12.741245, lng: 78.344534 };
const mapEmbedSrc = `https://www.google.com/maps?q=${officeCoordinates.lat},${officeCoordinates.lng}&z=18&output=embed`;
const mapDirectionsHref = `https://www.google.com/maps/search/?api=1&query=${officeCoordinates.lat},${officeCoordinates.lng}`;

function getContactHref(label: string, value: string) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes('email')) {
    return `mailto:${value}`;
  }

  if (normalizedLabel.includes('phone') || normalizedLabel.includes('mobile')) {
    return `tel:${value.replace(/[^\d+]/g, '')}`;
  }

  return null;
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10 sm:py-28">
        <GradientMesh />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <SectionHeader eyebrow={content.contact.eyebrow} title={content.contact.headline} description={content.contact.description} />
            </Reveal>

            <ContactMockup />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.95fr]">
          <Reveal direction="left" className="space-y-6 rounded-[32px] border border-theme bg-theme-surface-soft p-8 shadow-glow backdrop-blur-xl">
            <h2 className="font-display text-2xl font-bold text-theme-primary">Contact details</h2>
            <div className="space-y-4">
              {content.contact.details.map((detail) => {
                const Icon = detailIcons[detail.label] ?? Mail;

                return (
                  <div key={detail.label} className="group rounded-3xl bg-theme-surface-alt p-5 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-brand-primary">
                      <Icon size={16} />
                      {detail.label}
                    </div>
                    <div className="mt-3 space-y-2">
                      {detail.values.map((value) => {
                        const href = getContactHref(detail.label, value);

                        return href ? (
                          <a key={value} href={href} className="block text-lg font-medium text-theme-primary transition hover:text-brand-primary">
                            {value}
                          </a>
                        ) : (
                          <p key={value} className="text-lg font-medium text-theme-primary">
                            {value}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-brand-primary/20 bg-brand-primary/10 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary">
                <Clock size={18} />
              </span>
              <p className="text-justify text-sm leading-6 text-theme-secondary">
                We typically respond to every inquiry within <span className="font-semibold text-theme-primary">24 hours</span>.
              </p>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Find us</p>
              <h2 className="font-display text-2xl font-bold text-theme-primary sm:text-3xl">Visit the CraftLanee workspace</h2>
            </div>
            <a
              href={mapDirectionsHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary transition hover:gap-2.5 hover:text-brand-accent"
            >
              Get directions
              <ArrowUpRight size={16} />
            </a>
          </Reveal>

          <Reveal delay={0.1} className="shine-border overflow-hidden rounded-[28px] border border-theme shadow-glow-lg">
            <iframe
              src={mapEmbedSrc}
              title="CraftLanee office location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full border-0 grayscale-[15%] sm:h-[440px]"
            />
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

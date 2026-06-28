import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import ContactForm from '../../components/ContactForm';
import { getContent } from '../../lib/content';
import { createPageMetadata, siteName } from '../../lib/seo';

const content = getContent();

export const metadata = createPageMetadata({
  title: `Contact ${siteName} | Start Your Website, SEO or Marketing Project`,
  description: content.contact.description,
  path: '/contact',
  keywords: ['contact digital marketing agency', 'website project inquiry', 'SEO consultation', 'Google Ads consultation', 'business growth consultation'],
});

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

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,195,255,0.14),_transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow={content.contact.eyebrow} title={content.contact.headline} description={content.contact.description} />
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid gap-10 lg:grid-cols-[1fr_0.95fr] max-w-7xl">
          <div className="space-y-6 rounded-[32px] border border-theme bg-theme-surface-soft p-8 shadow-glow backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-theme-primary">Contact details</h2>
            <div className="space-y-4">
              {content.contact.details.map((detail) => (
                <div key={detail.label} className="rounded-3xl bg-theme-surface-soft p-5">
                  <p className="text-sm uppercase tracking-[0.35em] text-brand-primary">{detail.label}</p>
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

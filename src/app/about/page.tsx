import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import { getContent } from '../../lib/content';
import { createPageMetadata, siteName } from '../../lib/seo';
import { CheckCircle, Zap, Target } from 'lucide-react';

const content = getContent();

export const metadata = createPageMetadata({
  title: `About ${siteName} | Technology & Digital Growth Partner`,
  description: content.about.description,
  path: '/about',
  keywords: ['about Craftlanee', 'digital growth partner', 'technology consulting company', 'marketing execution partner'],
});

export default function AboutPage() {
  const coreValues = content.about.values;

  const processSteps = [
    {
      number: '01',
      title: 'Discovery & Strategy',
      description: 'We understand your business, market, and growth goals. Then we build a roadmap for technology, marketing channels, and brand positioning.',
    },
    {
      number: '02',
      title: 'Design & Build',
      description: 'Our team creates the foundation—a website, apps, or systems that are conversion-optimized and integrated with your marketing setup.',
    },
    {
      number: '03',
      title: 'Launch & Optimize',
      description: 'We set up tracking, run initial campaigns, and establish benchmarks so you can see exactly what drives growth.',
    },
    {
      number: '04',
      title: 'Grow & Scale',
      description: 'With proven data, we scale what works across channels, improve performance, and adapt your strategy based on real results.',
    },
  ];

  const stats = content.about.whoWeAre.stats;
  const directionItems = content.about.direction.items;
  const whyChooseItems = content.about.whyChoose.items;

  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,195,255,0.14),_transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeader eyebrow={content.about.eyebrow} title={content.about.headline} description={content.about.description} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-theme/20 bg-theme-surface-soft p-8 text-center backdrop-blur-sm">
                <div className="text-3xl font-bold text-theme-primary">{stat.value}</div>
                <div className="mt-2 text-sm text-theme-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">Our Core Values</h2>
            <p className="mt-4 text-lg text-theme-secondary">The principles that guide every project and partnership</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {coreValues.map((value, idx) => {
              let Icon = Target;
              if (idx === 1) Icon = Zap;
              if (idx === 2) Icon = CheckCircle;
              
              return (
                <div key={idx} className="rounded-2xl border border-theme/20 bg-theme-surface-soft p-8 backdrop-blur-sm hover:border-theme/40 transition">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-theme-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-theme-primary">{value.title}</h3>
                      <p className="mt-3 text-theme-secondary leading-7">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">How We Work</h2>
            <p className="mt-4 text-lg text-theme-secondary">A proven framework for digital growth and business transformation</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < processSteps.length - 1 && (
                  <div className="absolute -right-4 top-12 hidden h-0.5 w-8 bg-gradient-to-r from-theme-accent to-transparent lg:block" />
                )}

                <div className="rounded-2xl border border-theme/20 bg-theme-surface-soft p-8 backdrop-blur-sm h-full flex flex-col">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-theme-accent to-theme-accent/60">
                    <span className="text-lg font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-theme-primary">{step.title}</h3>
                  <p className="mt-3 text-theme-secondary leading-7 flex-grow">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="px-6 py-20 sm:px-10 bg-theme-surface-soft/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">Services We Offer</h2>
            <p className="mt-4 text-lg text-theme-secondary">A complete suite of IT and digital marketing solutions</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {content.services.groups.map((group, idx) => (
              <div key={idx} className="rounded-2xl border border-theme/20 bg-theme-background p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-theme-primary">{group.category}</h3>
                <p className="mt-3 text-theme-secondary leading-7">{group.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {group.items.slice(0, 5).map((item, itemIdx) => (
                    <span key={itemIdx} className="inline-flex items-center rounded-full bg-theme-accent/10 px-3 py-1 text-sm text-theme-accent border border-theme-accent/20">
                      {item}
                    </span>
                  ))}
                  {group.items.length > 5 && (
                    <span className="inline-flex items-center rounded-full bg-theme-accent/10 px-3 py-1 text-sm text-theme-accent border border-theme-accent/20">
                      +{group.items.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">{content.about.whoWeAre.title}</h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-lg text-theme-secondary leading-8">
                {content.about.whoWeAre.paragraph1}
              </p>
              <p className="mt-6 text-lg text-theme-secondary leading-8">
                {content.about.whoWeAre.paragraph2}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="rounded-xl border border-theme/20 bg-theme-surface-soft p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-theme-accent">{stat.value}</div>
                  <div className="mt-2 text-sm text-theme-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Direction Section */}
      <section className="px-6 py-20 sm:px-10 bg-theme-surface-soft/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">{content.about.direction.title}</h2>
            <p className="mt-4 text-lg text-theme-secondary">{content.about.direction.subtitle}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {directionItems.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-theme/20 bg-theme-background p-8 backdrop-blur-sm">
                <div className="mb-4 inline-block rounded-lg bg-theme-accent/20 px-4 py-2">
                  <span className="text-sm font-semibold text-theme-accent">{item.phase}</span>
                </div>
                <h3 className="text-xl font-bold text-theme-primary">{item.title}</h3>
                <p className="mt-4 text-theme-secondary leading-7">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Craftlanee Section */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">{content.about.whyChoose.title}</h2>
            <p className="mt-4 text-lg text-theme-secondary">{content.about.whyChoose.subtitle}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {whyChooseItems.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-theme/20 bg-theme-surface-soft p-8 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-theme-accent/20">
                  <span className="text-xl">{item.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold text-theme-primary">{item.title}</h3>
                <p className="mt-3 text-theme-secondary leading-7">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message CTA Section */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-theme-accent/30 bg-gradient-to-br from-theme-accent/15 to-theme-accent/5 p-10 text-center backdrop-blur-sm">
          <h3 className="text-2xl font-bold md:text-3xl">{content.about.cta.message}</h3>
          <p className="mt-3 text-theme-secondary">{content.about.cta.description}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-theme-accent px-6 py-2.5 font-semibold text-white transition hover:bg-theme-accent/90"
            >
              Contact Craftlanee
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-theme-accent/50 px-6 py-2.5 font-semibold text-theme-accent transition hover:bg-theme-accent/10"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-theme-accent/20 to-theme-accent/5 border border-theme-accent/30 p-12 text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to grow?</h2>
          <p className="mt-4 text-lg text-theme-secondary">Let's discuss your goals and build a strategy that delivers results.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-theme-accent px-8 py-3 font-semibold text-white transition hover:bg-theme-accent/90"
            >
              Start a Strategy Call
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center rounded-lg border border-theme-accent/50 px-8 py-3 font-semibold text-theme-accent transition hover:bg-theme-accent/10"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

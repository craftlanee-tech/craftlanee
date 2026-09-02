import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageFooter from '../../components/PageFooter';
import SectionHeader from '../../components/SectionHeader';
import GradientMesh from '../../components/GradientMesh';
import HeroImage from '../../components/HeroImage';
import AnimatedCounter from '../../components/AnimatedCounter';
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal';
import FounderCard from '../../components/FounderCard';
import { getContent } from '../../lib/content';
import { createPageMetadata, siteName } from '../../lib/seo';
import SoundHover from '../../components/SoundHover';
import StepConnector from '../../components/StepConnector';
import WhyChooseShowcase from '../../components/WhyChooseShowcase';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Building2,
  Check,
  CheckCircle,
  Code2,
  GraduationCap,
  Globe,
  Handshake,
  Layers,
  MessageCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
  Zap,
  Target,
} from 'lucide-react';

const content = getContent();

export const metadata = createPageMetadata({
  title: `About ${siteName} | Innovation, Opportunity & Digital Success`,
  description: content.about.description,
  path: '/about',
  keywords: ['about CraftLanee', 'technology company Kuppam', 'digital transformation partner', 'training and internship programs'],
});

export default function AboutPage() {
  const coreValues = content.about.values;

  const processSteps = [
    {
      number: '01',
      title: 'Discover & Plan',
      description: 'We understand your goals, challenges, audience, and requirements before creating a practical roadmap.',
    },
    {
      number: '02',
      title: 'Design & Develop',
      description: 'We craft user-focused experiences and build reliable, scalable technology, marketing, or training solutions.',
    },
    {
      number: '03',
      title: 'Launch',
      description: 'We deliver with quality assurance, clear communication, and the right support for a confident rollout.',
    },
    {
      number: '04',
      title: 'Support',
      description: 'We provide continuous maintenance, improvements, guidance, and long-term partnership as needs evolve.',
    },
  ];

  const stats = content.about.whoWeAre.stats;
  const directionItems = content.about.direction.items;
  const whyChooseItems = content.about.whyChoose.items;
  const valueIcons = [Target, Zap, CheckCircle, ShieldCheck];
  const statIcons = [Building2, Globe, Zap, Users];
  const directionIcons = [Code2, TrendingUp, GraduationCap];
  const whyChooseIcons = [Award, Layers, BookOpen, MessageCircle, Timer, Handshake];
  const whyChooseCards = whyChooseItems.map((item, idx) => {
    const Icon = whyChooseIcons[idx] ?? Sparkles;

    return {
      title: item.title,
      description: item.description,
      icon: <Icon size={22} />,
      watermarkIcon: (
        <Icon className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-brand-primary/[0.06] transition-transform duration-500 group-hover:scale-110" />
      ),
    };
  });

  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10 sm:py-28">
        <GradientMesh />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <SectionHeader eyebrow={content.about.eyebrow} title={content.about.headline} description={content.about.description} />
            </Reveal>

            <HeroImage
              src="/images/team.png"
              alt="CraftLanee team collaborating in a technology-driven workspace"
              badgeIcon={Sparkles}
              badgeLabel="Culture"
              badgeValue="Built on collaboration"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative overflow-hidden px-6 py-20 sm:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/25 to-transparent" />
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">By the numbers</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-theme-primary sm:text-4xl">CraftLanee at a glance</h2>
          </Reveal>

          <RevealGroup className="grid gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = statIcons[idx] ?? Sparkles;

              return (
                <RevealItem key={idx}>
                  <SoundHover className="group shine-border relative overflow-hidden rounded-2xl border border-theme bg-theme-surface-soft p-8 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-glow">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-primary/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon size={22} />
                    </div>

                    <div className="relative font-display text-3xl font-bold text-gradient sm:text-4xl">
                      <AnimatedCounter value={stat.value} delay={idx * 0.12} />
                    </div>
                    <div className="relative mt-2 text-sm text-theme-secondary">{stat.label}</div>
                  </SoundHover>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Our Core Values</h2>
            <p className="mt-4 text-justify text-lg text-theme-secondary">The principles that guide every project and partnership</p>
          </Reveal>
          <RevealGroup className="grid gap-8 sm:grid-cols-2">
            {coreValues.map((value, idx) => {
              const Icon = valueIcons[idx] ?? Target;

              return (
                <RevealItem key={idx} direction={idx % 2 === 0 ? 'left' : 'right'}>
                  <SoundHover className="group relative h-full overflow-hidden rounded-2xl border border-theme bg-theme-surface-soft p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-glow">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-primary/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary transition-transform duration-500 ease-out group-hover:rotate-[360deg]">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-theme-primary">{value.title}</h3>
                        <p className="mt-3 text-justify leading-7 text-theme-secondary">{value.description}</p>
                      </div>
                    </div>
                  </SoundHover>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="bg-theme-surface-alt px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-16 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">How We Work</h2>
            <p className="mt-4 text-justify text-lg text-theme-secondary">A clear process for technology, marketing, training, and business transformation</p>
          </Reveal>

          <RevealGroup className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
              <RevealItem key={idx} className="relative">
                {idx < processSteps.length - 1 && <StepConnector delay={idx * 0.15 + 0.3} />}

                <SoundHover className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-theme bg-theme-background p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-glow">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative mb-4 inline-flex h-12 w-12 [perspective:600px]">
                    <div className="relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent [backface-visibility:hidden]">
                        <span className="text-lg font-bold text-white">{step.number}</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-500 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <h3 className="relative text-xl font-semibold text-theme-primary">{step.title}</h3>
                  <p className="relative mt-3 flex-grow text-justify leading-7 text-theme-secondary">{step.description}</p>
                </SoundHover>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-16 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Featured Projects</h2>
            <p className="mt-4 text-lg text-theme-secondary">A focused look at how we support technology, marketing, and workspace outcomes</p>
          </Reveal>

          <RevealGroup className="grid gap-6 md:grid-cols-3">
            {content.projects.map((project, idx) => {
              const Icon = directionIcons[idx] ?? Code2;

              return (
                <RevealItem key={project.title}>
                  <article className="shine-border group flex h-full flex-col overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-glow">
                    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-primary to-brand-accent">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                          backgroundSize: '28px 28px',
                        }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                      />

                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                        <Icon size={30} className="text-white" />
                      </div>

                      {project.client ? (
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/95 py-1 pl-1.5 pr-3 shadow-sm">
                          {project.clientLogo ? (
                            <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white">
                              <Image src={project.clientLogo} alt="" fill sizes="24px" className="object-contain p-0.5" />
                            </span>
                          ) : null}
                          <span className="text-[11px] font-semibold text-slate-700">{project.client}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col space-y-4 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                          Project {String(idx + 1).padStart(2, '0')}
                        </p>
                        <ArrowUpRight size={18} className="shrink-0 text-theme-muted transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-primary" />
                      </div>
                      <h3 className="font-display text-xl font-semibold leading-tight text-theme-primary">{project.title}</h3>
                      <p className="flex-1 text-sm leading-7 text-theme-secondary">{project.description}</p>
                      <div className="border-t border-theme pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-muted">Outcome</p>
                        <p className="mt-1 text-sm font-semibold text-theme-primary">{project.result}</p>
                      </div>
                    </div>
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="bg-theme-surface-alt px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">{content.about.whoWeAre.title}</h2>
          </Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal direction="left" className="space-y-6">
              <p className="text-lg text-justify leading-8 text-theme-secondary">{content.about.whoWeAre.paragraph1}</p>
              <p className="text-lg text-justify leading-8 text-theme-secondary">{content.about.whoWeAre.paragraph2}</p>
            </Reveal>
            <RevealGroup className="grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <RevealItem key={idx} direction="right">
                  <div className="rounded-2xl border border-theme bg-theme-background p-6 backdrop-blur-sm">
                    <div className="font-display text-3xl font-bold text-brand-primary">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="mt-2 text-sm text-theme-secondary">{stat.label}</div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Meet the Founder Section */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal direction="left">
              <FounderCard name={content.about.founder.name} imageSrc="/images/Founder.jpeg" />
            </Reveal>

            <Reveal direction="right" delay={0.1} className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Leadership</p>
              <div>
                <h2 className="font-display text-3xl font-bold text-theme-primary sm:text-4xl">{content.about.founder.name}</h2>
                <p className="mt-1 text-theme-muted">{content.about.founder.role}</p>
              </div>

              <div className="relative rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
                <Quote className="absolute -left-2 -top-2 h-8 w-8 text-brand-primary/30" />
                <p className="font-display text-xl italic leading-relaxed text-theme-primary sm:text-2xl">
                  &ldquo;{content.about.founder.quote}&rdquo;
                </p>
              </div>

              <p className="text-lg text-justify leading-8 text-theme-secondary">{content.about.founder.bio}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Direction Section */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">{content.about.direction.title}</h2>
            <p className="mt-4 text-justify text-lg text-theme-secondary">{content.about.direction.subtitle}</p>
          </Reveal>

          <RevealGroup className="grid gap-8 md:grid-cols-3">
            {directionItems.map((item, idx) => {
              const Icon = directionIcons[idx] ?? Sparkles;
              const isLast = idx === directionItems.length - 1;

              return (
                <RevealItem key={idx} className="relative">
                  {!isLast && (
                    <div className="pointer-events-none absolute -right-6 top-14 z-10 hidden text-brand-primary/40 md:block">
                      <ArrowRight size={22} />
                    </div>
                  )}

                  <SoundHover className="group relative h-full overflow-hidden rounded-2xl border border-theme bg-theme-surface-soft p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-glow">
                    <Icon className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-brand-primary/[0.06] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-glow transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon size={26} />
                    </div>

                    <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">{item.phase}</p>
                    <h3 className="relative mt-2 text-xl font-bold text-theme-primary">{item.title}</h3>
                    <span className="relative mt-3 block h-0.5 w-10 bg-brand-primary/30 transition-all duration-300 group-hover:w-16 group-hover:bg-brand-primary" />
                    <p className="relative mt-4 text-justify leading-7 text-theme-secondary">{item.description}</p>
                  </SoundHover>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Why Choose CraftLanee Section */}
      <section className="bg-theme-surface-alt px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <WhyChooseShowcase
            eyebrow="Why Choose Us"
            title={content.about.whyChoose.title}
            subtitle={content.about.whyChoose.subtitle}
            cards={whyChooseCards}
          />
        </div>
      </section>

      {/* Message CTA Section */}
      <section className="px-6 py-16 sm:px-10">
        <Reveal className="mx-auto max-w-3xl rounded-2xl border border-brand-primary/30 bg-gradient-to-br from-brand-primary/15 to-brand-primary/5 p-10 text-center backdrop-blur-sm">
          <h3 className="font-display text-2xl font-bold md:text-3xl">{content.about.cta.message}</h3>
          <p className="mt-3 text-justify text-theme-secondary">{content.about.cta.description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-2.5 font-semibold text-white transition hover:bg-brand-accent"
            >
              Contact CraftLanee
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-brand-primary/50 px-6 py-2.5 font-semibold text-brand-primary transition hover:bg-brand-primary/10"
            >
              Explore Services
            </a>
          </div>
        </Reveal>
      </section>

      <PageFooter />
      <Footer />
    </main>
  );
}

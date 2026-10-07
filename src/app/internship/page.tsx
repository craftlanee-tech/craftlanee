import Image from 'next/image';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bot,
  Briefcase,
  CalendarCheck,
  Clapperboard,
  Code2,
  Compass,
  FolderKanban,
  GraduationCap,
  Megaphone,
  Palette,
  PenTool,
  PhoneCall,
  Rocket,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import GradientMesh from '../../components/GradientMesh';
import InternshipForm from '../../components/InternshipForm';
import Reveal from '../../components/Reveal';
import Button from '../../components/Button';
import Marquee from '../../components/Marquee';
import { createPageMetadata, siteName } from '../../lib/seo';

export const metadata = createPageMetadata({
  title: `Internships at ${siteName} | Live Projects, Mentorship & Certificates`,
  description:
    'Register for CraftLanee internship programs in web development, app development, digital marketing, UI/UX, design, AI and more. Work on live projects with experienced mentors.',
  path: '/internship',
  keywords: ['CraftLanee internship', 'internship Kuppam', 'student internship', 'web development internship', 'digital marketing internship', 'internship certificate'],
});

const stats = [
  { value: '8', label: 'Career tracks' },
  { value: '1–6', label: 'Months duration' },
  { value: '100%', label: 'Hands-on learning' },
  { value: '3', label: 'Modes: on-site, remote, hybrid' },
];

const domains = [
  { icon: Code2, title: 'Web Development', description: 'HTML, CSS, JavaScript, React and modern frameworks on real websites.' },
  { icon: Smartphone, title: 'App Development', description: 'Build and ship cross-platform mobile apps from idea to release.' },
  { icon: Megaphone, title: 'Digital Marketing', description: 'SEO, social media, ads and campaigns for live client brands.' },
  { icon: PenTool, title: 'UI/UX Design', description: 'Research, wireframes and polished interfaces in Figma.' },
  { icon: Palette, title: 'Graphic Design', description: 'Branding, posters, social creatives and visual identity.' },
  { icon: Clapperboard, title: 'Video Editing', description: 'Reels, ads and edits produced in our in-house media studio.' },
  { icon: Bot, title: 'Artificial Intelligence', description: 'Practical AI tools, automation and intelligent applications.' },
  { icon: BarChart3, title: 'Business Development', description: 'Sales, client communication, research and growth strategy.' },
];

const benefits = [
  { icon: FolderKanban, title: 'Live Projects', description: 'Work on real client projects, not classroom exercises.' },
  { icon: Users, title: 'Experienced Mentors', description: 'Weekly reviews and guidance from working professionals.' },
  { icon: Award, title: 'Internship Certificate', description: 'A verified certificate on successful completion.' },
  { icon: Briefcase, title: 'Portfolio Development', description: 'Leave with work samples employers want to see.' },
  { icon: BadgeCheck, title: 'Placement Assistance', description: 'Resume reviews, mock interviews and job referrals.' },
  { icon: Compass, title: 'Career Guidance', description: 'One-on-one sessions to plan your next move.' },
];

const steps = [
  { icon: GraduationCap, title: 'Register', description: 'Fill in the form below with your details and preferred track.' },
  { icon: PhoneCall, title: 'Screening Call', description: 'Our team calls you within 48 hours to understand your goals.' },
  { icon: CalendarCheck, title: 'Onboarding', description: 'Join a batch, meet your mentor and get your project brief.' },
  { icon: Rocket, title: 'Build & Certify', description: 'Deliver real work, present it, and earn your certificate.' },
];

export default function InternshipPage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
        <GradientMesh />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brand-primary">
              <Sparkles size={14} />
              Admissions open · New batch
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-theme-primary sm:text-5xl lg:text-6xl">
              Turn your skills into a <span className="text-gradient">real career</span>.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-theme-secondary">
              Industry-oriented internships for students and fresh graduates. Work on live client projects, learn from experienced mentors, and graduate with a certificate and a portfolio that gets you hired.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="#register" variant="primary">
                Apply Now <ArrowRight size={18} />
              </Button>
              <Button href="#tracks" variant="secondary">Explore Tracks</Button>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1} className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-brand-primary/20 blur-[60px]" />
            <div className="shine-border relative overflow-hidden rounded-[28px] border border-theme shadow-glow-lg">
              <Image src="/images/Hero.png" alt="Intern building a project at CraftLanee" width={735} height={722} className="h-auto w-full object-cover" priority />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white/90">Learn alongside a real team, on real projects.</p>
            </div>

            <div className="absolute -left-5 -top-5 hidden sm:block">
              <div className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <Award size={18} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">On completion</p>
                  <p className="text-sm font-semibold text-theme-primary">Verified Certificate</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 hidden sm:block">
              <div className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <FolderKanban size={18} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">Learn by doing</p>
                  <p className="text-sm font-semibold text-theme-primary">Live Client Projects</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative mx-auto mt-20 max-w-7xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-theme bg-[var(--color-border)] lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-theme-surface-soft px-6 py-6 backdrop-blur-xl">
                <p className="font-display text-3xl font-bold text-brand-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-theme-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="border-y border-theme bg-theme-surface-soft py-4">
        <Marquee items={domains.map((domain) => domain.title)} />
      </div>

      {/* Tracks */}
      <section id="tracks" className="scroll-mt-24 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl space-y-12">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader eyebrow="Career tracks" title="Choose the track that fits your future" />
            <p className="max-w-md text-theme-secondary">Every track mixes guided learning with real deliverables, so you finish with skills and proof of work.</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={(index % 4) * 0.06} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-theme bg-theme-surface-soft p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand-primary/50 hover:shadow-glow">
                  <span className="absolute right-5 top-5 font-display text-sm font-bold text-theme-muted/60">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-primary transition duration-300 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-theme-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-theme-secondary">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits with image */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal direction="left" className="relative">
            <div className="shine-border relative overflow-hidden rounded-[28px] border border-theme shadow-glow-lg">
              <Image
                src="/images/internship-career-path.png"
                alt="Student walking from education, through internship, to employment"
                width={1279}
                height={720}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>

          <div className="space-y-10">
            <Reveal>
              <SectionHeader eyebrow="Why intern with us" title="More than an internship, a career launchpad" />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, description }, index) => (
                <Reveal key={title} delay={index * 0.05}>
                  <div className="flex gap-4 rounded-2xl p-3 transition hover:bg-theme-surface-soft">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary">
                      <Icon size={18} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-theme-primary">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-theme-secondary">{description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-theme-surface-soft px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl space-y-14">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-primary">How it works</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-theme-primary sm:text-4xl">From application to certificate in four steps</h2>
          </Reveal>
          <div className="relative grid gap-8 md:grid-cols-4">
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent md:block" />
            {steps.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 0.1} className="relative text-center">
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-primary/40 bg-theme-background text-brand-primary shadow-glow">
                  <Icon size={24} />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">{index + 1}</span>
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-theme-primary">{title}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-6 text-theme-secondary">{description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-10">
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal direction="left" className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <SectionHeader eyebrow="Apply now" title="Reserve your seat in the next batch" description="Seats per batch are limited so every intern gets proper mentor attention. Register today and we'll get back to you within 48 hours." />
            <ul className="space-y-4">
              {['No prior experience required', 'Flexible on-site, remote or hybrid mode', 'Certificate + portfolio on completion'].map((point) => (
                <li key={point} className="flex items-center gap-3 text-theme-secondary">
                  <BadgeCheck size={20} className="shrink-0 text-brand-primary" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="relative hidden overflow-hidden rounded-[28px] border border-theme lg:block">
              <Image src="/images/office-exterior.jpeg" alt="CraftLanee office building in Kuppam" width={552} height={599} className="h-64 w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-5 right-5 text-sm font-semibold text-white">Visit us in Kuppam, or call / WhatsApp us anytime.</p>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <InternshipForm />
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

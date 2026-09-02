'use client';

import { motion } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Code2,
  GraduationCap,
  Layers,
  Megaphone,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import Button from './Button';
import GradientMesh from './GradientMesh';
import OrbitIllustration from './OrbitIllustration';
import AnimatedCounter from './AnimatedCounter';
import { getContent } from '../lib/content';

const content = getContent();

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const statIcons = [Building2, Layers, MapPin];

const focusIconList = [Briefcase, Code2, Megaphone, Users, GraduationCap, Building2];

const heroBadges = [
  { icon: <ShieldCheck size={18} />, label: 'Delivery', value: 'On-time, every time', tone: 'emerald' as const },
  { icon: <Sparkles size={18} />, label: 'Systems', value: 'Automation-ready', tone: 'primary' as const },
];

export default function HeroSection() {
  const orbitItems = content.hero.focus.map((label, index) => {
    const Icon = focusIconList[index] ?? Sparkles;
    return { label, icon: <Icon size={30} className="sm:h-9 sm:w-9" /> };
  });

  return (
    <section id="hero-orbit-section" className="relative isolate overflow-hidden bg-hero-gradient px-6 pb-24 pt-16 sm:px-10 sm:pb-32 sm:pt-20">
      <div className="bg-grid absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]" />
      <GradientMesh />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="space-y-7 lg:space-y-9">
            <motion.p
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary" />
              </span>
              {content.hero.eyebrow}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-theme-primary sm:text-6xl lg:text-[4.2rem]"
            >
              {content.hero.headline.split(content.hero.highlight).map((part, index, arr) => (
                <span key={index}>
                  {part}
                  {index < arr.length - 1 ? (
                    <span className="text-gradient animate-gradient-pan bg-[length:200%_auto]">{content.hero.highlight}</span>
                  ) : null}
                </span>
              ))}
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-xl text-justify text-base leading-8 text-theme-secondary sm:text-lg">
              {content.hero.description}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {content.hero.actions.map((action) => (
                <Button key={action.label} href={action.href} variant={action.variant as 'primary' | 'secondary'}>
                  {action.label}
                  {action.variant === 'primary' ? <ArrowRight size={18} /> : null}
                </Button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-3 pt-2 sm:grid-cols-3">
              {content.hero.stats.map((stat, index) => {
                const Icon = statIcons[index] ?? Sparkles;

                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface-soft/80 px-4 py-3 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-primary/30"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-base font-bold text-theme-primary">
                        <AnimatedCounter value={stat.value} />
                      </p>
                      <p className="truncate text-[11px] uppercase tracking-[0.14em] text-theme-muted">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <OrbitIllustration items={orbitItems} badges={heroBadges} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

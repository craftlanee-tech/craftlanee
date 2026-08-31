'use client';

import type { PointerEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight, Building2, ChevronDown, Layers, MapPin, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import Button from './Button';
import GradientMesh from './GradientMesh';
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

const chartBars = [38, 54, 46, 68, 58, 82, 74, 96];

const dashboardStats = [
  { label: 'Projects Delivered', value: '120+' },
  { label: 'Avg. Response', value: '<24h' },
  { label: 'Client Retention', value: '96%' },
];

function scrollToNextSection() {
  window.scrollTo({ top: window.innerHeight * 0.92, behavior: 'smooth' });
}

export default function HeroSection() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 18 });
  const transform = useMotionTemplate`perspective(1200px) rotateX(${springX}deg) rotateY(${springY}deg)`;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(py * -8);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section className="relative isolate overflow-hidden bg-hero-gradient px-6 py-24 sm:px-10 sm:py-32">
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

          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-center [perspective:1200px]"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <div className="relative w-full max-w-[540px]">
              <motion.div
                className="absolute -left-6 -top-6 z-20 hidden sm:block"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">Delivery</p>
                    <p className="text-sm font-semibold text-theme-primary">On-time, every time</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                style={{ transform }}
                className="shine-border overflow-hidden rounded-[28px] border border-theme bg-theme-surface/90 shadow-glow-lg backdrop-blur-2xl"
              >
                <div className="flex items-center gap-2 border-b border-theme bg-theme-surface-alt/70 px-5 py-3.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  <div className="ml-3 flex-1 truncate rounded-full bg-theme-surface-soft px-3 py-1 text-xs text-theme-muted">
                    craftlanee.com/growth-dashboard
                  </div>
                  <span className="hidden items-center gap-1.5 text-xs font-medium text-emerald-500 sm:flex">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Live
                  </span>
                </div>

                <div className="space-y-5 p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {dashboardStats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-theme bg-theme-surface-soft px-3 py-3 text-center">
                        <p className="font-display text-lg font-bold text-theme-primary">{stat.value}</p>
                        <p className="mt-0.5 text-[10px] leading-tight text-theme-muted">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-theme bg-theme-surface-soft p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-theme-primary">
                        <TrendingUp size={15} className="text-brand-primary" />
                        Growth Trajectory
                      </p>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">+128%</span>
                    </div>

                    <div className="flex h-20 items-end gap-2">
                      {chartBars.map((height, index) => (
                        <motion.div
                          key={index}
                          className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-brand-primary to-brand-accent"
                          style={{ height: `${height}%` }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {content.hero.focus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-theme bg-theme-surface-soft px-3 py-1.5 text-xs font-medium text-theme-secondary transition hover:border-brand-primary/40 hover:text-theme-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-4 z-20 hidden sm:block"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">Systems</p>
                    <p className="text-sm font-semibold text-theme-primary">Automation-ready</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        aria-label="Scroll to explore"
        onClick={scrollToNextSection}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-theme-muted transition hover:text-brand-primary sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1, duration: 0.6 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={18} />
      </motion.button>
    </section>
  );
}

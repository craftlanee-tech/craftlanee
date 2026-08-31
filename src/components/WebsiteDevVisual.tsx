'use client';

import { Gauge, Monitor, Search, ShieldCheck, Smartphone, Tablet } from 'lucide-react';
import { motion } from 'motion/react';

const navLinks = ['Home', 'Services', 'About', 'Contact'];

const features = [
  { icon: Gauge, title: 'Fast Loading', description: 'Optimized for speed' },
  { icon: Search, title: 'SEO Ready', description: 'Built to rank higher' },
  { icon: ShieldCheck, title: 'Secure', description: 'SSL & best practices' },
];

export default function WebsiteDevVisual({ pulse = 0 }: { pulse?: number }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-brand-primary/20 blur-[60px]" />

      <div className="shine-border relative overflow-hidden rounded-[28px] border border-theme bg-theme-surface shadow-glow-lg">
        <div className="flex items-center gap-2 border-b border-theme bg-theme-surface-alt/70 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <div className="ml-3 flex-1 truncate rounded-full bg-theme-surface-soft px-3 py-1 text-xs text-theme-muted">
            yourbusiness.com
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-bold text-theme-primary">
              Your<span className="text-brand-primary">Brand</span>
            </p>
            <div className="hidden gap-4 sm:flex">
              {navLinks.map((link) => (
                <span key={link} className="text-xs font-medium text-theme-muted">
                  {link}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            key={`hero-${pulse}`}
            initial={pulse > 0 ? { scale: 0.97 } : false}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-2 rounded-xl border border-theme bg-theme-surface-soft p-4"
          >
            <h4 className="font-display text-lg font-bold leading-snug text-theme-primary">Grow Your Business Online</h4>
            <p className="text-sm leading-6 text-theme-secondary">Modern, fast, and SEO-ready websites built for real results.</p>
            <motion.span
              key={`cta-${pulse}`}
              initial={pulse > 0 ? { boxShadow: '0 0 0 0 rgb(var(--color-primary-rgb) / 0.7)' } : false}
              animate={{ boxShadow: '0 0 0 12px rgb(var(--color-primary-rgb) / 0)' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mt-2 inline-flex items-center rounded-lg bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
            >
              Get Started
            </motion.span>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={`${feature.title}-${pulse}`}
                initial={pulse > 0 ? { opacity: 0.4, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: pulse > 0 ? index * 0.1 : 0, ease: 'easeOut' }}
                className="space-y-2 rounded-lg border border-theme bg-theme-surface-soft p-3"
              >
                <motion.div
                  initial={pulse > 0 ? { scale: 1 } : false}
                  animate={pulse > 0 ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ duration: 0.5, delay: pulse > 0 ? index * 0.1 : 0, ease: 'easeOut' }}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-brand-primary to-brand-accent text-white"
                >
                  <feature.icon size={16} />
                </motion.div>
                <p className="text-xs font-semibold leading-tight text-theme-primary">{feature.title}</p>
                <p className="text-[11px] leading-tight text-theme-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden sm:block">
        <div className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-brand-primary">
            <Monitor size={16} />
            <Tablet size={16} />
            <Smartphone size={16} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">Responsive</p>
            <p className="text-sm font-semibold text-theme-primary">Every screen size</p>
          </div>
        </div>
      </div>
    </div>
  );
}

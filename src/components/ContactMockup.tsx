'use client';

import { Clock } from 'lucide-react';
import { motion } from 'motion/react';
import Reveal from './Reveal';

export default function ContactMockup() {
  return (
    <Reveal direction="right" delay={0.1} className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-brand-primary/20 blur-[60px]" />
      <div className="shine-border relative overflow-hidden rounded-[28px] border border-theme bg-theme-surface/90 shadow-glow-lg backdrop-blur-2xl">
        <div className="flex items-center gap-2 border-b border-theme bg-theme-surface-alt/70 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <div className="ml-3 flex-1 truncate rounded-full bg-theme-surface-soft px-3 py-1 text-xs text-theme-muted">
            craftlanee.com/inbox
          </div>
          <span className="hidden items-center gap-1.5 text-xs font-medium text-emerald-500 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Online
          </span>
        </div>

        <div className="space-y-4 p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-end gap-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme-surface-soft text-[10px] font-semibold text-theme-secondary">
              YOU
            </span>
            <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-theme-surface-soft px-4 py-3 text-sm leading-6 text-theme-secondary">
              Hi, we need help scaling our e-commerce platform.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex items-end justify-end gap-2.5"
          >
            <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-gradient-to-br from-brand-primary to-brand-accent px-4 py-3 text-sm leading-6 text-white">
              On it — let&apos;s set up a call this week.
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[10px] font-semibold text-white">
              CL
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center gap-1.5 pl-10 text-theme-muted"
          >
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-theme-muted"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
              />
            ))}
          </motion.div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-theme bg-theme-surface-soft px-4 py-3 text-center">
              <p className="font-display text-lg font-bold text-theme-primary">&lt;24h</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-theme-muted">Avg. response</p>
            </div>
            <div className="rounded-xl border border-theme bg-theme-surface-soft px-4 py-3 text-center">
              <p className="font-display text-lg font-bold text-theme-primary">98%</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-theme-muted">Reply rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-5 hidden sm:block">
        <div className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <Clock size={18} />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">Availability</p>
            <p className="text-sm font-semibold text-theme-primary">Mon–Sat, 9am–7pm</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

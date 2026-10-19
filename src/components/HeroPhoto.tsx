'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import type { HeroFit } from '../lib/site-settings';

type Badge = { icon: React.ReactNode; label: string; value: string };

type HeroPhotoProps = {
  src: string;
  alt: string;
  fit: HeroFit;
  badges?: Badge[];
};

// Admin-uploaded replacement for the orbit illustration; same footprint so the hero layout doesn't shift.
export default function HeroPhoto({ src, alt, fit, badges = [] }: HeroPhotoProps) {
  return (
    <div className="relative mx-auto w-full max-w-[500px] px-4 sm:px-0">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-8 rounded-[48px] bg-brand-primary/25 blur-[70px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[34px] bg-gradient-to-br from-brand-primary via-brand-accent to-brand-primary p-[3px] shadow-glow-lg"
      >
        <div className={`relative aspect-[4/5] overflow-hidden rounded-[31px] ${fit === 'contain' ? 'bg-theme-surface' : 'bg-theme-surface-alt'}`}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 500px, 90vw"
            className={fit === 'contain' ? 'object-contain p-6' : 'object-cover'}
          />
          {fit === 'cover' && <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />}
        </div>
      </motion.div>

      {badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
          className={`absolute hidden items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl sm:flex ${
            index === 0 ? '-left-8 top-10' : '-right-6 bottom-12'
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">{badge.icon}</span>
          <span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-theme-muted">{badge.label}</span>
            <span className="block text-sm font-semibold text-theme-primary">{badge.value}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

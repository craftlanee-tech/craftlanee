'use client';

import type { PointerEvent, ReactNode } from 'react';
import Image from 'next/image';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';

export type OrbitItem = {
  label: string;
  icon: ReactNode;
};

export type OrbitBadge = {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: 'primary' | 'emerald';
};

type OrbitIllustrationProps = {
  items: OrbitItem[];
  badges?: OrbitBadge[];
  maxWidthClassName?: string;
};

export default function OrbitIllustration({ items, badges = [], maxWidthClassName = 'max-w-[500px]' }: OrbitIllustrationProps) {
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

  const topLeftBadge = badges[0];
  const bottomRightBadge = badges[1];

  return (
    <div
      className="relative flex items-center justify-center [perspective:1200px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={`relative flex w-full ${maxWidthClassName} items-center justify-center`}>
        {topLeftBadge ? (
          <motion.div
            className="absolute -left-2 -top-6 z-20 hidden sm:block"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex -rotate-3 items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
              <span
                className={`flex h-9 w-9 rotate-6 items-center justify-center rounded-2xl ${
                  topLeftBadge.tone === 'emerald' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-brand-primary/10 text-brand-primary'
                }`}
              >
                {topLeftBadge.icon}
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">{topLeftBadge.label}</p>
                <p className="text-sm font-semibold text-theme-primary">{topLeftBadge.value}</p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {bottomRightBadge ? (
          <motion.div
            className="absolute -bottom-4 -right-2 z-20 hidden sm:block"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <div className="flex rotate-2 items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
              <span
                className={`flex h-9 w-9 -rotate-6 items-center justify-center rounded-2xl ${
                  bottomRightBadge.tone === 'emerald' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-brand-primary/10 text-brand-primary'
                }`}
              >
                {bottomRightBadge.icon}
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">{bottomRightBadge.label}</p>
                <p className="text-sm font-semibold text-theme-primary">{bottomRightBadge.value}</p>
              </div>
            </div>
          </motion.div>
        ) : null}

        <motion.div style={{ transform }} className="relative flex aspect-square w-full items-center justify-center">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 -z-10 rounded-full bg-brand-primary/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-brand-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary shadow-[0_0_12px_2px_rgb(var(--color-primary-rgb)/0.7)]" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-10 rounded-full border-2 border-brand-accent/20 sm:inset-14"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent shadow-[0_0_10px_2px_rgb(var(--color-accent-rgb)/0.7)]" />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex items-center justify-center [perspective:1200px]">
              <motion.span
                aria-hidden="true"
                className="absolute -inset-6 rounded-full bg-gradient-to-br from-brand-primary/40 to-brand-accent/40 blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.55, 0.2, 0.55] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="relative [transform-style:preserve-3d] will-change-transform"
                animate={{ rotateY: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              >
                {/* Front face */}
                <div className="flex aspect-square w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary via-brand-accent to-brand-primary p-[3px] shadow-glow-lg [backface-visibility:hidden] sm:w-48">
                  <div className="relative h-full w-full overflow-hidden rounded-[14px]">
                    <Image src="/images/craftlanee-mark.png" alt="CraftLanee" fill sizes="192px" className="object-cover" />
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] mix-blend-overlay"
                      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                    />
                  </div>
                </div>

                {/* Back face */}
                <div className="absolute inset-0 flex aspect-square w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary via-brand-accent to-brand-primary p-[3px] shadow-glow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] sm:w-48">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-[14px] bg-gradient-to-br from-brand-primary to-brand-accent text-white">
                    <p className="font-display text-lg font-bold uppercase tracking-[0.2em]">CraftLanee</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <span aria-hidden="true" className="mt-3 h-2.5 w-24 rounded-full bg-black/30 blur-md sm:w-28" />
          </div>

          {items.map((item, index) => {
            const baseAngle = index * (360 / items.length);
            const duration = 24;

            return (
              <motion.div
                key={item.label}
                className="absolute inset-0"
                animate={{ rotate: [baseAngle, baseAngle + 360] }}
                transition={{ duration, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
                  <motion.div
                    title={item.label}
                    className="group relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-glow-lg ring-4 ring-theme-surface transition-transform hover:scale-110 sm:h-20 sm:w-20"
                    animate={{ rotate: [-baseAngle, -(baseAngle + 360)] }}
                    transition={{ duration, repeat: Infinity, ease: 'linear' }}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-3xl bg-white/25 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="relative">{item.icon}</span>
                  </motion.div>

                  <motion.span
                    animate={{ rotate: [-baseAngle, -(baseAngle + 360)] }}
                    transition={{ duration, repeat: Infinity, ease: 'linear' }}
                    className="whitespace-nowrap rounded-full border border-theme bg-theme-surface/95 px-2.5 py-1 text-[11px] font-semibold text-theme-primary shadow-glow backdrop-blur-xl"
                  >
                    {item.label}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

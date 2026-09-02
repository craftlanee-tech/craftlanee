'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import StackedCards, { type StackCardData } from './StackedCards';

function ChecklistRow({
  index,
  total,
  title,
  description,
  scrollYProgress,
}: {
  index: number;
  total: number;
  title: string;
  description: string;
  scrollYProgress: MotionValue<number>;
}) {
  const distance = useTransform(scrollYProgress, (value) => Math.abs(value * Math.max(total - 1, 1) - index));
  const opacity = useTransform(distance, [0, 1], [1, 0.7]);
  const scale = useTransform(distance, [0, 1], [1, 0.95]);
  const activeStrength = useTransform(distance, [0, 1], [1, 0]);
  const barScale = useTransform(distance, [0, 0.5], [1, 0]);

  return (
    <motion.div style={{ opacity }} className="relative flex items-start gap-4 rounded-xl py-3 pl-3 -ml-3">
      <motion.span
        style={{ opacity: activeStrength }}
        className="pointer-events-none absolute inset-0 rounded-xl bg-brand-primary/[0.06]"
      />

      <motion.span
        style={{ scale }}
        className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-theme bg-theme-surface-soft text-[11px] font-bold text-theme-secondary"
      >
        <motion.span
          style={{ opacity: activeStrength }}
          className="absolute inset-0 rounded-full border-2 border-brand-primary bg-brand-primary/10"
        />
        <span className="relative">{String(index + 1).padStart(2, '0')}</span>
        <motion.span
          style={{ scaleY: barScale }}
          className="absolute left-1/2 top-full h-8 w-px origin-top -translate-x-1/2 bg-brand-primary/30"
        />
      </motion.span>
      <div className="relative">
        <p className="text-sm font-semibold text-theme-primary">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-theme-secondary">{description}</p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseShowcase({
  eyebrow,
  title,
  subtitle,
  cards,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: StackCardData[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <div ref={containerRef} className="relative" style={{ height: `${cards.length * 80}vh` }}>
      <div className="sticky top-28 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">{eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">{title}</h2>
          <p className="mt-4 max-w-md text-lg leading-8 text-theme-secondary">{subtitle}</p>

          <div className="mt-10 max-w-sm border-t border-theme">
            {cards.map((card, index) => (
              <ChecklistRow
                key={card.title}
                index={index}
                total={cards.length}
                title={card.title}
                description={card.description}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        <StackedCards cards={cards} scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}

'use client';

import { useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';

type ShowcaseRowProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  visual: (pulse: number) => ReactNode;
  reversed?: boolean;
  ctaHref?: string;
};

export default function ShowcaseRow({ eyebrow, title, description, items, visual, reversed = false, ctaHref }: ShowcaseRowProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const [pulse, setPulse] = useState(0);
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], reversed ? [8, -8] : [-8, 8]);

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
      <motion.div
        initial={{ opacity: 0, x: reversed ? 60 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={reversed ? 'md:order-2' : ''}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">{eyebrow}</p>
        <h3 className="mt-4 font-display text-3xl font-bold text-theme-primary sm:text-4xl">{title}</h3>
        <p className="mt-4 text-lg leading-8 text-theme-secondary">{description}</p>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-theme-secondary">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              {item}
            </div>
          ))}
        </div>

        {ctaHref ? (
          <Link
            href={ctaHref}
            className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary transition hover:gap-2.5 hover:text-brand-accent"
          >
            Get a quote
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
      </motion.div>

      <motion.div
        ref={visualRef}
        initial={{ opacity: 0, x: reversed ? -60 : 60, filter: 'grayscale(100%)' }}
        whileInView={{ opacity: 1, x: 0, filter: 'grayscale(0%)' }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.015 }}
        style={{ rotate }}
        onClick={() => setPulse((value) => value + 1)}
        className={`relative cursor-pointer select-none [perspective:1000px] ${reversed ? 'md:order-1' : ''}`}
      >
        {visual(pulse)}

        <motion.div
          key={pulse}
          initial={pulse > 0 ? { opacity: 0.8, scale: 0.96 } : false}
          animate={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="pointer-events-none absolute -inset-2 rounded-[32px] ring-4 ring-brand-primary"
        />
      </motion.div>
    </div>
  );
}

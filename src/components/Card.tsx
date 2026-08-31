'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type CardProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function Card({ title, description, icon, children, className = '', ctaHref, ctaLabel = 'Get a quote' }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;

    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-theme bg-theme-surface p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-glow ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(var(--color-primary-rgb) / 0.14), transparent 70%)',
        }}
      />

      <div className="relative flex flex-1 flex-col">
        <div>
          {icon ? (
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              {icon}
            </div>
          ) : null}
          {title ? <h3 className="mb-2 text-xl font-semibold text-theme-primary">{title}</h3> : null}
          {description ? <p className="text-sm text-justify leading-7 text-theme-secondary">{description}</p> : null}
          {children}
        </div>

        {ctaHref ? (
          <Link
            href={ctaHref}
            className="mt-auto flex items-center gap-1.5 border-t border-theme pt-5 text-sm font-semibold text-brand-primary transition-colors hover:text-brand-accent"
          >
            {ctaLabel}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

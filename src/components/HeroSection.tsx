'use client';

import Button from './Button';
import SectionIntro from './SectionIntro';
import { getContent } from '../lib/content';
import Image from 'next/image';

const content = getContent();

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient px-6 py-16 sm:px-10 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,122,0,0.16),_transparent_34%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
            <p className="inline-flex rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">
              {content.hero.eyebrow}
            </p>
            <SectionIntro title={content.hero.headline} description={content.hero.description} />
            <div className="flex flex-wrap gap-3">
              {content.hero.actions.map((action) => (
                <Button key={action.href} href={action.href} variant={action.variant as 'primary' | 'secondary'}>
                  {action.label}
                </Button>
              ))}
            </div>
            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              {content.hero.stats.map((stat) => (
                <div key={stat.label} className="border-l border-theme pl-4">
                  <p className="text-lg font-semibold text-theme-primary">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-theme-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="w-full max-w-[560px] rounded-[24px] border border-theme bg-theme-surface-soft p-3 shadow-glow backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[18px] border border-theme bg-theme-surface-soft">
                <Image src="/images/Hero.png" alt="CraftLanee technology and digital solutions illustration" width={840} height={560} className="w-full h-auto object-cover" priority />
              </div>
              <div className="grid gap-2 pt-4 sm:grid-cols-2">
                {content.hero.focus.map((item) => (
                  <span key={item} className="rounded-2xl border border-theme bg-theme-surface-soft px-3 py-2 text-sm text-theme-secondary">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

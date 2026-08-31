import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import Reveal from './Reveal';

type HeroImageProps = {
  src: string;
  alt: string;
  badgeIcon: LucideIcon;
  badgeLabel: string;
  badgeValue: string;
  delay?: number;
};

export default function HeroImage({ src, alt, badgeIcon: Icon, badgeLabel, badgeValue, delay = 0.1 }: HeroImageProps) {
  return (
    <Reveal direction="right" delay={delay} className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-brand-primary/20 blur-[60px]" />
      <div className="shine-border relative overflow-hidden rounded-[28px] border border-theme shadow-glow-lg">
        <Image src={src} alt={alt} width={760} height={570} className="h-auto w-full object-cover" priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="absolute -bottom-5 -left-5 hidden sm:block">
        <div className="flex items-center gap-3 rounded-2xl border border-theme bg-theme-surface/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-theme-muted">{badgeLabel}</p>
            <p className="text-sm font-semibold text-theme-primary">{badgeValue}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

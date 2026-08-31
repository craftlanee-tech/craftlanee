import type { ReactNode } from 'react';

export default function Marquee({ items }: { items: ReactNode[] }) {
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-10 py-2 hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-theme-muted"
          >
            {item}
            <span className="text-brand-primary">&#9679;</span>
          </div>
        ))}
      </div>
    </div>
  );
}

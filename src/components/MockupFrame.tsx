import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type MockupFrameProps = {
  addressLabel: string;
  badgeIcon: LucideIcon;
  badgeLabel: string;
  badgeValue: string;
  children: ReactNode;
};

export default function MockupFrame({ addressLabel, badgeIcon: Icon, badgeLabel, badgeValue, children }: MockupFrameProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-brand-primary/20 blur-[60px]" />

      <div className="shine-border relative overflow-hidden rounded-[28px] border border-theme bg-theme-surface shadow-glow-lg">
        <div className="flex items-center gap-2 border-b border-theme bg-theme-surface-alt/70 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <div className="ml-3 flex-1 truncate rounded-full bg-theme-surface-soft px-3 py-1 text-xs text-theme-muted">
            {addressLabel}
          </div>
        </div>

        <div className="space-y-5 p-6">{children}</div>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden sm:block">
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
    </div>
  );
}

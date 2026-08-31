import { Palette } from 'lucide-react';
import MockupFrame from './MockupFrame';

export default function BrandingVisual() {
  return (
    <MockupFrame addressLabel="brand.craftlanee.com" badgeIcon={Palette} badgeLabel="Identity" badgeValue="Consistent across channels">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold text-theme-primary">Brand Kit</p>
        <span className="text-xs text-theme-muted">v1.0</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="aspect-square rounded-lg border border-theme bg-brand-primary" />
        <div className="aspect-square rounded-lg border border-theme bg-brand-accent" />
        <div className="aspect-square rounded-lg border border-theme bg-theme-surface-alt" />
        <div className="aspect-square rounded-lg border border-theme bg-theme-muted" />
      </div>

      <div className="rounded-xl border border-theme bg-theme-surface-soft p-4">
        <p className="font-display text-2xl font-bold text-theme-primary">Aa</p>
        <p className="mt-1 text-xs text-theme-muted">Plus Jakarta Sans / Inter</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent text-sm font-bold text-white">
          C
        </div>
        <div className="h-2 w-24 rounded-full bg-theme-surface-alt" />
      </div>
    </MockupFrame>
  );
}

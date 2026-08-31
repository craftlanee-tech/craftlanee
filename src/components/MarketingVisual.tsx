import { Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import MockupFrame from './MockupFrame';

const engagement = [
  { icon: Heart, value: '12.4K' },
  { icon: MessageCircle, value: '842' },
  { icon: Share2, value: '1.2K' },
];

const bars = [30, 50, 40, 70, 60, 90];

export default function MarketingVisual() {
  return (
    <MockupFrame addressLabel="ads.craftlanee.com" badgeIcon={TrendingUp} badgeLabel="Growth" badgeValue="+128% reach">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold text-theme-primary">Campaign Performance</p>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">+128%</span>
      </div>

      <div className="flex h-16 items-end gap-2 rounded-xl border border-theme bg-theme-surface-soft p-3">
        {bars.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-primary to-brand-accent"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-theme bg-theme-surface-soft p-3">
        {engagement.map((item) => (
          <div key={item.value} className="flex items-center gap-1.5 text-xs text-theme-secondary">
            <item.icon size={14} className="text-brand-primary" />
            {item.value}
          </div>
        ))}
      </div>
    </MockupFrame>
  );
}

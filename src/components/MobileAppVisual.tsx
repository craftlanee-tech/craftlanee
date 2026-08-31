import { Bell, Home, Search, Smartphone, User } from 'lucide-react';
import MockupFrame from './MockupFrame';

const navIcons = [Home, Search, Bell, User];

export default function MobileAppVisual() {
  return (
    <MockupFrame addressLabel="play.google.com/apps" badgeIcon={Smartphone} badgeLabel="Platforms" badgeValue="iOS & Android">
      <div className="flex justify-center">
        <div className="w-40 overflow-hidden rounded-2xl border border-theme bg-theme-surface-soft">
          <div className="flex items-center justify-between bg-brand-primary px-3 py-2">
            <span className="text-xs font-bold text-white">CraftLanee</span>
            <Bell size={13} className="text-white" />
          </div>
          <div className="space-y-2 p-3">
            <div className="h-16 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent" />
            <div className="h-2 w-3/4 rounded-full bg-theme-surface-alt" />
            <div className="h-2 w-1/2 rounded-full bg-theme-surface-alt" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-10 rounded-lg border border-theme bg-theme-surface" />
              <div className="h-10 rounded-lg border border-theme bg-theme-surface" />
            </div>
          </div>
          <div className="flex items-center justify-around border-t border-theme bg-theme-surface px-2 py-2">
            {navIcons.map((Icon, index) => (
              <Icon key={index} size={14} className={index === 0 ? 'text-brand-primary' : 'text-theme-muted'} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-theme-muted">
        <span>4.9 &#9733; rating</span>
        <span>50K+ downloads</span>
      </div>
    </MockupFrame>
  );
}

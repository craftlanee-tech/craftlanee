import { Building2, Coffee, Users, Wifi } from 'lucide-react';
import MockupFrame from './MockupFrame';

const amenities = [
  { icon: Wifi, label: 'High-speed Wi-Fi' },
  { icon: Coffee, label: 'Lounge & pantry' },
  { icon: Users, label: 'Meeting rooms' },
];

export default function WorkspaceVisual() {
  return (
    <MockupFrame addressLabel="workspace.craftlanee.com" badgeIcon={Building2} badgeLabel="Space" badgeValue="36 workstations">
      <p className="font-display text-sm font-bold text-theme-primary">Floor Plan</p>

      <div className="grid grid-cols-6 gap-1.5 rounded-xl border border-theme bg-theme-surface-soft p-4">
        {Array.from({ length: 18 }).map((_, index) => (
          <div key={index} className={`aspect-square rounded-sm ${index % 5 === 0 ? 'bg-brand-primary' : 'bg-theme-surface-alt'}`} />
        ))}
      </div>

      <div className="space-y-2">
        {amenities.map((amenity) => (
          <div key={amenity.label} className="flex items-center gap-2.5 text-xs text-theme-secondary">
            <amenity.icon size={14} className="text-brand-primary" />
            {amenity.label}
          </div>
        ))}
      </div>
    </MockupFrame>
  );
}

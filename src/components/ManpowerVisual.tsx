import { Users } from 'lucide-react';
import MockupFrame from './MockupFrame';

const candidates = [
  { name: 'Product Designer', match: 96 },
  { name: 'Backend Engineer', match: 91 },
  { name: 'Sales Executive', match: 88 },
];

export default function ManpowerVisual() {
  return (
    <MockupFrame addressLabel="careers.craftlanee.com" badgeIcon={Users} badgeLabel="Talent" badgeValue="Right fit, faster">
      <p className="font-display text-sm font-bold text-theme-primary">Shortlisted Candidates</p>

      <div className="space-y-2.5">
        {candidates.map((candidate) => (
          <div key={candidate.name} className="flex items-center gap-3 rounded-xl border border-theme bg-theme-surface-soft p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-xs font-bold text-white">
              {candidate.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-theme-primary">{candidate.name}</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-theme-surface-alt">
                <div className="h-1.5 rounded-full bg-brand-primary" style={{ width: `${candidate.match}%` }} />
              </div>
            </div>
            <span className="text-xs font-semibold text-brand-primary">{candidate.match}%</span>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
}

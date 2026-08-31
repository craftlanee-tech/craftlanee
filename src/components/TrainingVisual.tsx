import { Award, CheckCircle2, GraduationCap } from 'lucide-react';
import MockupFrame from './MockupFrame';

const modules = ['Foundations', 'Live Project Work', 'Portfolio Review'];

export default function TrainingVisual() {
  return (
    <MockupFrame addressLabel="learn.craftlanee.com" badgeIcon={GraduationCap} badgeLabel="Outcomes" badgeValue="Career-ready skills">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold text-theme-primary">Internship Track</p>
        <span className="text-xs font-semibold text-brand-primary">80%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-theme-surface-alt">
        <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent" />
      </div>

      <div className="space-y-2">
        {modules.map((module, index) => (
          <div
            key={module}
            className="flex items-center gap-2.5 rounded-lg border border-theme bg-theme-surface-soft px-3 py-2.5 text-xs text-theme-secondary"
          >
            <CheckCircle2 size={15} className={index < 2 ? 'text-emerald-500' : 'text-theme-muted'} />
            {module}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-brand-primary/20 bg-brand-primary/10 px-3 py-2 text-xs font-semibold text-brand-primary">
        <Award size={14} />
        Certificate on completion
      </div>
    </MockupFrame>
  );
}

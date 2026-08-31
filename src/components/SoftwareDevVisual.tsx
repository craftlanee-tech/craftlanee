import { Activity, Code2, Database, Server } from 'lucide-react';
import MockupFrame from './MockupFrame';

const stats = [
  { label: 'Uptime', value: '99.9%' },
  { label: 'Users', value: '12K+' },
  { label: 'Requests', value: '4.2M' },
];

export default function SoftwareDevVisual() {
  return (
    <MockupFrame addressLabel="app.craftlanee.com" badgeIcon={Code2} badgeLabel="Stack" badgeValue="Scalable & secure">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold text-theme-primary">Admin Dashboard</p>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-theme bg-theme-surface-soft p-3 text-center">
            <p className="font-display text-base font-bold text-theme-primary">{stat.value}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-theme-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-theme bg-theme-surface-soft p-4 font-mono text-[11px] leading-6">
        <p>
          <span className="text-brand-primary">POST</span> <span className="text-theme-secondary">/api/orders</span>
        </p>
        <p className="text-theme-muted">
          {'{ status: '}
          <span className="text-emerald-500">&quot;success&quot;</span>
          {', latency: '}
          <span className="text-brand-accent">42ms</span>
          {' }'}
        </p>
      </div>

      <div className="flex items-center gap-4 text-theme-muted">
        <div className="flex items-center gap-1.5 text-xs">
          <Database size={14} className="text-brand-primary" />
          Database
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Server size={14} className="text-brand-primary" />
          API
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Activity size={14} className="text-brand-primary" />
          Monitoring
        </div>
      </div>
    </MockupFrame>
  );
}

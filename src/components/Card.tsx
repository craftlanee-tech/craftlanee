import type { ReactNode } from 'react';

export default function Card({ title, description, icon, children }: { title?: string; description?: string; icon?: ReactNode; children?: ReactNode; }) {
  return (
    <div className="rounded-2xl border border-theme bg-theme-surface-soft p-6 shadow backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:bg-theme-surface-alt">
      {icon ? <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">{icon}</div> : null}
      {title ? <h3 className="text-xl font-semibold text-theme-primary mb-2">{title}</h3> : null}
      {description ? <p className="text-sm leading-7 text-theme-secondary">{description}</p> : null}
      {children}
    </div>
  );
}

'use client';

import Card from './Card';
import { BarChart3, Laptop, Search, Target, TrendingUp, Workflow } from 'lucide-react';
import content from '../../content.json';

const icons = {
  Target: <Target size={26} />,
  Laptop: <Laptop size={26} />,
  TrendingUp: <TrendingUp size={26} />,
  Search: <Search size={26} />,
  Workflow: <Workflow size={26} />,
  BarChart3: <BarChart3 size={26} />,
};

export default function ServiceCards() {
  return (
    <section className="bg-black/80 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Services</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{content.services.title}</h2>
          <p className="max-w-2xl leading-7 text-slate-300">{content.services.subtitle}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.services.items.map((item) => (
            <Card key={item.title} icon={icons[item.icon as keyof typeof icons]} title={item.title} description={item.description}>
              <div className="mt-6 grid gap-2">
                {item.deliverables.map((deliverable) => (
                  <div key={deliverable} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>{deliverable}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

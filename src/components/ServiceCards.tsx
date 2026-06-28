'use client';

import type { ReactNode } from 'react';
import Card from './Card';
import { BarChart3, Laptop, Target, TrendingUp } from 'lucide-react';
import { getContent } from '../lib/content';

const content = getContent();

const icons: Record<string, ReactNode> = {
  'IT Consulting & Technology Solutions': <Laptop size={26} />,
  'Digital Marketing Services': <Target size={26} />,
  'Creative Services': <TrendingUp size={26} />,
  'CraftLanee Media Studio': <BarChart3 size={26} />,
};

export default function ServiceCards() {
  return (
    <section className="bg-theme-surface-alt px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Services</p>
          <h2 className="text-3xl font-semibold text-theme-primary sm:text-4xl">{content.services.title}</h2>
          <p className="max-w-2xl leading-7 text-theme-secondary">{content.services.subtitle}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.services.groups.map((group) => (
            <Card key={group.category} icon={icons[group.category]} title={group.category} description={group.description}>
              <div className="mt-6 grid gap-2">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-theme-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>{item}</span>
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

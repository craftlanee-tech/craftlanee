'use client';

import Card from './Card';
import Image from 'next/image';
import { getContent } from '../lib/content';

const content = getContent();

export default function PortfolioGrid() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Portfolio</p>
          <h2 className="text-3xl font-semibold text-theme-primary sm:text-4xl">{content.portfolio.title}</h2>
          <p className="max-w-2xl leading-7 text-theme-secondary">{content.portfolio.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.portfolio.items.map((item) => (
            <Card key={item.title} title={item.title} description={item.description}>
              <div className="mt-5 inline-flex rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                {item.result}
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-theme bg-theme-surface-soft">
                <Image src={item.image} alt={item.title} width={540} height={360} className="h-52 w-full object-cover transition duration-300 hover:scale-105" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { getContent } from '../lib/content';

const content = getContent();
const portfolioItems = content.portfolio.items;

export default function PortfolioGrid() {
  return (
    <section className="bg-theme-background px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Portfolio</p>
            <h2 className="text-3xl font-semibold text-theme-primary sm:text-4xl">{content.portfolio.title}</h2>
            <p className="max-w-2xl leading-7 text-theme-secondary">{content.portfolio.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-theme bg-theme-surface-soft px-4 py-3 text-sm font-medium text-theme-secondary">
            <CheckCircle2 size={18} className="text-brand-primary" />
            <span>{portfolioItems.length} selected projects</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {portfolioItems.map((item, index) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-lg border border-theme bg-theme-surface transition duration-300 hover:-translate-y-1 hover:border-brand-primary/45"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-theme-surface-alt">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                      Project {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold leading-tight text-theme-primary">{item.title}</h3>
                  </div>
                  <ArrowUpRight size={20} className="mt-1 shrink-0 text-theme-muted transition group-hover:text-brand-primary" />
                </div>

                <p className="min-h-20 text-sm leading-7 text-theme-secondary">{item.description}</p>

                <div className="border-t border-theme pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-muted">Outcome</p>
                  <p className="mt-2 text-sm font-semibold text-theme-primary">{item.result}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

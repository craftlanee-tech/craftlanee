'use client';

import { useState, type ReactNode } from 'react';
import Card from './Card';
import Marquee from './Marquee';
import Reveal, { RevealGroup, RevealItem } from './Reveal';
import {
  BarChart3,
  Building2,
  Camera,
  ChevronDown,
  Code2,
  GraduationCap,
  Laptop,
  Palette,
  Smartphone,
  Target,
  Users,
} from 'lucide-react';
import { getContent } from '../lib/content';

const content = getContent();

const icons: Record<string, ReactNode> = {
  'IT Consulting & Technology Solutions': <Laptop size={26} />,
  'Website Development': <Laptop size={26} />,
  'Software Development': <Code2 size={26} />,
  'Mobile App Development': <Smartphone size={26} />,
  'Digital Marketing Services': <Target size={26} />,
  'Branding & Creative Design': <Palette size={26} />,
  'Creative Services': <Palette size={26} />,
  'Media Production Studio': <Camera size={26} />,
  'CraftLanee Media Studio': <BarChart3 size={26} />,
  'Manpower Solutions': <Users size={26} />,
  'Training & Internship Programs': <GraduationCap size={26} />,
  'CraftLanee Workspace': <Building2 size={26} />,
};

const VISIBLE_COUNT = 6;

type ServiceGroup = (typeof content.services.groups)[number];

function ServiceCard({ group }: { group: ServiceGroup }) {
  const [expanded, setExpanded] = useState(false);
  const remaining = group.items.length - VISIBLE_COUNT;
  const hasMore = remaining > 0;
  const visibleItems = expanded ? group.items : group.items.slice(0, VISIBLE_COUNT);

  return (
    <Card
      icon={icons[group.category]}
      title={group.category}
      description={group.description}
      className="h-full"
      ctaHref="/contact"
    >
      <div className="mt-6 grid gap-2">
        {visibleItems.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-theme-secondary">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      {hasMore ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] text-brand-primary transition hover:text-brand-accent"
        >
          {expanded ? 'Show less' : `+${remaining} more`}
          <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      ) : null}
    </Card>
  );
}

export default function ServiceCards() {
  return (
    <section className="bg-theme-surface-alt px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Services</p>
          <h2 className="font-display text-3xl font-bold text-theme-primary sm:text-4xl">{content.services.title}</h2>
          <p className="max-w-2xl text-justify leading-7 text-theme-secondary">{content.services.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1} className="mb-12 border-y border-theme py-4">
          <Marquee items={content.services.groups.map((group) => group.category)} />
        </Reveal>

        <RevealGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.services.groups.map((group) => (
            <RevealItem key={group.category} className="h-full">
              <ServiceCard group={group} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

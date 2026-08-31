'use client';

import type { ReactNode } from 'react';
import Marquee from './Marquee';
import ShowcaseRow from './ShowcaseRow';
import Reveal from './Reveal';
import WebsiteDevVisual from './WebsiteDevVisual';
import SoftwareDevVisual from './SoftwareDevVisual';
import MobileAppVisual from './MobileAppVisual';
import MarketingVisual from './MarketingVisual';
import BrandingVisual from './BrandingVisual';
import MediaVisual from './MediaVisual';
import ManpowerVisual from './ManpowerVisual';
import TrainingVisual from './TrainingVisual';
import WorkspaceVisual from './WorkspaceVisual';
import { getContent } from '../lib/content';

const content = getContent();

const visuals: Record<string, (pulse: number) => ReactNode> = {
  'Website Development': (pulse) => <WebsiteDevVisual pulse={pulse} />,
  'Software Development': () => <SoftwareDevVisual />,
  'Mobile App Development': () => <MobileAppVisual />,
  'Digital Marketing Services': () => <MarketingVisual />,
  'Branding & Creative Design': () => <BrandingVisual />,
  'Media Production Studio': () => <MediaVisual />,
  'Manpower Solutions': () => <ManpowerVisual />,
  'Training & Internship Programs': () => <TrainingVisual />,
  'CraftLanee Workspace': () => <WorkspaceVisual />,
};

export default function ServicesShowcase() {
  return (
    <section className="bg-theme-surface-alt px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Services</p>
          <h2 className="font-display text-3xl font-bold text-theme-primary sm:text-4xl">{content.services.title}</h2>
          <p className="max-w-2xl leading-7 text-theme-secondary">{content.services.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1} className="mb-16 border-y border-theme py-4">
          <Marquee items={content.services.groups.map((group) => group.category)} />
        </Reveal>

        <div className="space-y-24">
          {content.services.groups.map((group, index) => {
            const visual = visuals[group.category] ?? visuals['Website Development'];

            return (
              <ShowcaseRow
                key={group.category}
                eyebrow={`0${index + 1} / 0${content.services.groups.length}`}
                title={group.category}
                description={group.description}
                items={group.items}
                visual={visual}
                reversed={index % 2 === 1}
                ctaHref="/contact"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

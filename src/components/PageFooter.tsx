import { ArrowRight } from 'lucide-react';
import Button from './Button';
import Reveal from './Reveal';
import GradientMesh from './GradientMesh';

export default function PageFooter() {
  return (
    <section className="relative overflow-hidden border-y border-theme bg-theme-surface px-6 py-16 sm:px-10">
      <GradientMesh className="opacity-60" />
      <Reveal className="relative mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Ready to grow?</p>
          <p className="font-display text-3xl font-bold text-theme-primary sm:text-4xl">
            Build a sharper website, stronger campaigns, and a cleaner lead system.
          </p>
        </div>
        <Button href="/contact" variant="primary">
          Start a Project
          <ArrowRight size={18} />
        </Button>
      </Reveal>
    </section>
  );
}

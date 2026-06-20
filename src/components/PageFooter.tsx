import Button from './Button';

export default function PageFooter() {
  return (
    <section className="border-y border-white/10 bg-black px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">Ready to grow?</p>
          <p className="text-3xl font-semibold text-white sm:text-4xl">Build a sharper website, stronger campaigns, and a cleaner lead system.</p>
        </div>
        <Button href="/contact" variant="primary">Start a Project</Button>
      </div>
    </section>
  );
}

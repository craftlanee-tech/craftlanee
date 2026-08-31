export default function SectionIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="space-y-4">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-primary">{eyebrow}</p> : null}
      <h1 className="font-display text-4xl font-bold leading-[1.08] text-theme-primary sm:text-5xl">{title}</h1>
      {description ? <p className="max-w-2xl text-justify text-base leading-8 text-theme-secondary">{description}</p> : null}
    </div>
  );
}

export default function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string; }) {
  return (
    <div className="space-y-4">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-primary">{eyebrow}</p> : null}
      <h2 className="font-display max-w-3xl text-3xl font-bold leading-tight text-theme-primary sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="max-w-2xl text-justify text-base leading-8 text-theme-secondary">{description}</p> : null}
    </div>
  );
}

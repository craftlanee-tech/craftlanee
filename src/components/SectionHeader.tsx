export default function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string; }) {
  return (
    <div className="space-y-4">
      {eyebrow ? <p className="text-sm uppercase tracking-[0.35em] text-brand-primary">{eyebrow}</p> : null}
      <h2 className="max-w-3xl text-3xl font-semibold text-theme-primary sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm leading-7 text-theme-secondary">{description}</p> : null}
    </div>
  );
}

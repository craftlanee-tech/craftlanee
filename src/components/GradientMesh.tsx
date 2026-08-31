export default function GradientMesh({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="mesh-gradient absolute inset-0 animate-gradient-pan bg-[length:200%_200%]" />
      <div className="absolute left-1/4 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-primary/20 blur-[120px] animate-float" />
      <div
        className="absolute right-0 top-1/3 h-[320px] w-[320px] rounded-full bg-brand-accent/20 blur-[110px] animate-float"
        style={{ animationDelay: '1.5s' }}
      />
      <div className="bg-grain absolute inset-0" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-theme-background/90 text-theme-primary z-50">
      <div className="space-y-4 text-center">
        <div className="h-16 w-16 rounded-full border-4 border-brand-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-base font-medium">Loading Craftlanee...</p>
      </div>
    </div>
  );
}
 
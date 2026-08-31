import { Camera, Mic, Play } from 'lucide-react';
import MockupFrame from './MockupFrame';

export default function MediaVisual() {
  return (
    <MockupFrame addressLabel="studio.craftlanee.com" badgeIcon={Camera} badgeLabel="Production" badgeValue="Studio-grade quality">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-theme-surface-alt to-theme-surface-soft">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
          <Play size={18} className="ml-0.5 text-brand-primary" fill="currentColor" />
        </div>
        <div className="absolute bottom-2 left-2 right-2 h-1 rounded-full bg-white/30">
          <div className="h-1 w-2/3 rounded-full bg-brand-primary" />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-theme-muted">
        <span className="flex items-center gap-1.5">
          <Camera size={14} className="text-brand-primary" />
          4K Video
        </span>
        <span className="flex items-center gap-1.5">
          <Mic size={14} className="text-brand-primary" />
          Studio Audio
        </span>
      </div>
    </MockupFrame>
  );
}

'use client';

import type { ReactNode } from 'react';
import { playSoftClick } from '../lib/sound';

export default function SoundHover({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div onMouseEnter={playSoftClick} className={className}>
      {children}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type LogoProps = {
  className?: string;
  variant?: 'auto' | 'white' | 'color';
};

export default function Logo({ className = '', variant = 'auto' }: LogoProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (variant !== 'auto') {
      return;
    }

    const root = document.documentElement;
    const update = () => setIsDark(root.dataset.theme !== 'light');
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [variant]);

  const useWhite = variant === 'white' || (variant === 'auto' && isDark);

  return (
    <span className={`relative block ${className}`}>
      <Image
        src={useWhite ? '/images/craftlanee-logo-white.png' : '/images/craftlanee-logo-full.png'}
        alt="CraftLanee"
        fill
        priority
        sizes="200px"
        className="object-contain object-left"
      />
    </span>
  );
}

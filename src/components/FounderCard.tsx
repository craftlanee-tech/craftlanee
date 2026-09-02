'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Flame, RotateCw, Snowflake, Sparkles } from 'lucide-react';
import { playSoftClick } from '../lib/sound';

type FounderCardProps = {
  name: string;
  imageSrc: string;
};

export default function FounderCard({ name, imageSrc }: FounderCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-sm lg:mx-0">
      <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-brand-primary/20 blur-[60px]" />

      <button
        type="button"
        onClick={() => {
          playSoftClick();
          setFlipped((value) => !value);
        }}
        aria-label={flipped ? `Show ${name}'s photo` : `Reveal what drives ${name}`}
        className="group relative block aspect-[4/5] w-full [perspective:1600px]"
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Front: photo */}
          <div
            className="shine-border absolute inset-0 overflow-hidden rounded-[28px] border border-theme shadow-glow-lg [backface-visibility:hidden]"
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image src={imageSrc} alt={`${name}, Founder of CraftLanee`} fill sizes="(max-width: 1024px) 100vw, 400px" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Back: fire & ice */}
          <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-theme shadow-glow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div
              className="absolute inset-0 flex items-start justify-start bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 p-7"
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            >
              <div className="flex flex-col items-start gap-3">
                <Flame className="h-10 w-10 text-white drop-shadow" />
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/90">Burns like fire</span>
              </div>
            </div>

            <div
              className="absolute inset-0 flex items-end justify-end bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 p-7 pb-20 pr-9"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            >
              <div className="flex flex-col items-end gap-3 text-right">
                <Snowflake className="h-10 w-10 text-white drop-shadow" />
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/90">Melts like ice</span>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/85 bg-theme-background shadow-glow-lg">
              <Sparkles className="h-6 w-6 text-brand-primary" />
            </div>
          </div>
        </motion.div>

        <span className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
          <RotateCw size={17} className={`relative transition-transform duration-500 ${flipped ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-theme-muted lg:text-left">
        {flipped ? 'Tap to see the photo' : 'Tap the photo to see what drives him'}
      </p>
    </div>
  );
}

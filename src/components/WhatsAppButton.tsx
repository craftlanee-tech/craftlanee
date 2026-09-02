'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { playSoftClick } from '../lib/sound';

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(true);
  const ropeRef = useRef<HTMLDivElement>(null);
  const monkeyRef = useRef<HTMLDivElement>(null);
  const [travelRange, setTravelRange] = useState(0);

  useEffect(() => {
    const heroOrbit = document.getElementById('hero-orbit-section');

    if (!heroOrbit) {
      setVisible(true);
      return;
    }

    setVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heroOrbit);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateRange = () => {
      const ropeHeight = ropeRef.current?.offsetHeight ?? 0;
      const monkeyHeight = monkeyRef.current?.offsetHeight ?? 0;
      setTravelRange(Math.max(ropeHeight - monkeyHeight, 0));
    };

    updateRange();

    const resizeObserver = new ResizeObserver(updateRange);
    if (ropeRef.current) resizeObserver.observe(ropeRef.current);
    window.addEventListener('resize', updateRange);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRange);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.5 });
  const monkeyY = useTransform(smoothProgress, [0, 1], [0, travelRange]);

  return (
    <motion.div
      className="pointer-events-none fixed bottom-4 right-2 top-20 z-[70] flex flex-col items-center sm:right-4"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div ref={ropeRef} className="relative w-28 flex-1">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 bottom-0 w-[5px] -translate-x-1/2 rounded-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-55deg, var(--color-primary) 0 4px, color-mix(in srgb, var(--color-primary) 60%, black) 4px 8px)',
          }}
        />

        <motion.div ref={monkeyRef} className="absolute left-1/2 -translate-x-1/2" style={{ top: monkeyY }}>
          <Image
            src="/images/monkey-top-v2.png"
            alt=""
            width={233}
            height={440}
            priority
            className="h-28 w-auto translate-x-[0.1px] drop-shadow-xl sm:h-32"
          />
        </motion.div>
      </div>

      <div className="relative -mt-1" style={{ pointerEvents: visible ? 'auto' : 'none' }}>
        <Image
          src="/images/monkey-basket-bottom.png"
          alt=""
          width={356}
          height={600}
          className="h-40 w-auto drop-shadow-xl sm:h-48"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: 'var(--color-primary)',
            mixBlendMode: 'color',
            WebkitMaskImage: 'url(/images/monkey-basket-mask.png?v=3)',
            maskImage: 'url(/images/monkey-basket-mask.png?v=3)',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            maskMode: 'alpha',
          }}
        />
        <a
          href="https://www.instagram.com/craftlanee?igsi=MXYyaG9pNzdmemt0dQ=="
          target="_blank"
          rel="noreferrer"
          onClick={playSoftClick}
          aria-label="Follow CraftLanee on Instagram"
          className="absolute transition-transform duration-200 hover:scale-105"
          style={{ left: '16.9%', top: '51.7%', width: '36.5%', height: '23.3%' }}
        />
        <a
          href="https://wa.me/916301469575"
          target="_blank"
          rel="noreferrer"
          onClick={playSoftClick}
          aria-label="Chat with CraftLanee on WhatsApp"
          className="absolute transition-transform duration-200 hover:scale-105"
          style={{ left: '53.4%', top: '53%', width: '35.4%', height: '21.7%' }}
        />
      </div>
    </motion.div>
  );
}

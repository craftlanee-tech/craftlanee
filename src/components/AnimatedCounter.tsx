'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'motion/react';
import { playChime } from '../lib/sound';

type AnimatedCounterProps = {
  value: string;
  className?: string;
  delay?: number;
  sound?: boolean;
};

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SCRAMBLE_FRAMES = 16;
const SCRAMBLE_FRAME_MS = 30;

function parseValue(value: string) {
  const match = value.match(/-?\d[\d,]*\.?\d*/);

  if (!match) {
    return null;
  }

  const numeric = Number(match[0].replace(/,/g, ''));

  if (Number.isNaN(numeric)) {
    return null;
  }

  return {
    prefix: value.slice(0, match.index),
    numeric,
    suffix: value.slice((match.index ?? 0) + match[0].length),
    decimals: match[0].includes('.') ? match[0].split('.')[1].length : 0,
  };
}

export default function AnimatedCounter({ value, className, delay = 0, sound = true }: AnimatedCounterProps) {
  const parsed = parseValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 24, stiffness: 90 });
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);
  const [hasRevealed, setHasRevealed] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) {
      return;
    }

    hasStarted.current = true;
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      setHasRevealed(true);

      if (sound) {
        playChime();
      }

      if (parsed) {
        motionValue.set(parsed.numeric);
        return;
      }

      let frame = 0;
      intervalId = window.setInterval(() => {
        frame += 1;
        const revealCount = Math.round((frame / SCRAMBLE_FRAMES) * value.length);
        setDisplay(
          value
            .split('')
            .map((char, index) => (char === ' ' || index < revealCount ? char : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
            .join(''),
        );

        if (frame >= SCRAMBLE_FRAMES) {
          window.clearInterval(intervalId);
          setDisplay(value);
        }
      }, SCRAMBLE_FRAME_MS);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isInView, motionValue, parsed, sound, delay, value]);

  useEffect(() => {
    if (!parsed) {
      return;
    }

    const unsubscribe = spring.on('change', (latest) => {
      const formatted = parsed.decimals > 0 ? latest.toFixed(parsed.decimals) : Math.round(latest).toLocaleString();
      setDisplay(`${parsed.prefix}${formatted}${parsed.suffix}`);
    });

    return unsubscribe;
  }, [spring, parsed]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: hasRevealed ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {display}
    </motion.span>
  );
}

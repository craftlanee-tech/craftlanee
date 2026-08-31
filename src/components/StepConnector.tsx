'use client';

import { motion } from 'motion/react';

export default function StepConnector({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute -right-4 top-12 hidden h-0.5 w-8 origin-left bg-gradient-to-r from-brand-primary to-transparent lg:block"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

'use client';

import type { ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';

export type StackCardData = {
  icon: ReactNode;
  watermarkIcon: ReactNode;
  title: string;
  description: string;
};

function StackCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: StackCardData;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const distance = useTransform(scrollYProgress, (value) => value * Math.max(total - 1, 1) - index);
  const y = useTransform(distance, [-1, 0, 1], [260, 0, -26]);
  const scale = useTransform(distance, [-1, 0, 1], [0.92, 1, 0.94]);
  const rotate = useTransform(distance, [-1, 0, 1], [0, 0, index % 2 === 0 ? -3 : 3]);
  const opacity = useTransform(distance, [-1, -0.5, 0], [0, 1, 1]);

  return (
    <motion.div style={{ y, scale, rotate, opacity }} className="absolute inset-0">
      <div className="shine-border group relative flex h-full w-full flex-col justify-center overflow-hidden rounded-2xl border border-theme bg-theme-background p-8 shadow-xl backdrop-blur-sm sm:p-10">
        {card.watermarkIcon}

        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-primary">
          {card.icon}
        </div>
        <h3 className="relative mt-4 text-xl font-semibold text-theme-primary sm:text-2xl">{card.title}</h3>
        <p className="relative mt-3 text-justify leading-7 text-theme-secondary">{card.description}</p>
      </div>
    </motion.div>
  );
}

export default function StackedCards({ cards, scrollYProgress }: { cards: StackCardData[]; scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative mx-auto h-[21rem] w-full max-w-md sm:h-[19rem] sm:max-w-lg">
      {cards.map((card, index) => (
        <StackCard key={card.title} card={card} index={index} total={cards.length} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

type OmittedEventKeys = 'children' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  children: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, OmittedEventKeys>
  & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, OmittedEventKeys>;

const baseStyles = 'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary';
const variants = {
  primary: 'bg-brand-primary text-white shadow-glow hover:bg-brand-accent',
  secondary: 'border border-brand-primary text-theme-secondary bg-transparent hover:bg-theme-surface-soft hover:text-theme-primary',
  ghost: 'text-theme-primary hover:text-brand-primary',
};

const MotionLink = motion.create(Link);

export default function Button({ variant = 'primary', href, children, className, ...props }: ButtonProps) {
  const composedClassName = `${baseStyles} ${variants[variant]} ${className ?? ''}`;
  const motionProps = {
    whileHover: { scale: 1.035, y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 22 },
  };

  if (href) {
    return (
      <MotionLink href={href} className={composedClassName} {...motionProps} {...props}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button className={composedClassName} {...motionProps} {...props}>
      {children}
    </motion.button>
  );
}

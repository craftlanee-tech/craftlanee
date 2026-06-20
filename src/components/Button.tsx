import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import theme from '../../theme.json';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  children: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
  & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;

const baseStyles = 'inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary';
const variants = {
  primary: 'bg-brand-primary text-black hover:bg-brand-accent shadow-glow',
  secondary: 'border border-brand-primary text-brand-secondary bg-transparent hover:bg-white/5',
  ghost: 'text-white/85 hover:text-white',
};

export default function Button({ variant = 'primary', href, children, ...props }: ButtonProps) {
  const className = `${baseStyles} ${variants[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variants = {
  primary: 'bg-stone-800 text-stone-50 hover:bg-stone-700',
  secondary: 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50',
  ghost: 'text-stone-700 hover:bg-stone-100',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

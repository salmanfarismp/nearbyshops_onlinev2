import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', href, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-label-lg rounded-full pill-button transition-all';
    
    const variants = {
      primary: 'bg-primary-container text-on-primary shadow-lg hover:brightness-110 active:scale-95',
      outline: 'border-2 border-slate-200 text-on-surface hover:bg-slate-50 active:scale-95',
      ghost: 'bg-on-background text-white hover:bg-slate-900 active:scale-95'
    };

    const sizes = {
      sm: 'px-6 py-3 text-sm',
      md: 'px-8 py-4',
      lg: 'px-10 py-5 text-lg'
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
      return (
        <Link 
          href={href} 
          className={combinedClasses} 
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as any)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={combinedClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

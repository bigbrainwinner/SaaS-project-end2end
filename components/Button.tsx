import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<any>) => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // custom classes for the outer container layer
  innerClassName?: string; // custom classes for the inner button layer
  variant?: 'primary' | 'secondary' | 'dark' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  href,
  type = 'button',
  className = '',
  innerClassName = '',
  variant = 'primary',
  disabled = false,
  fullWidth = false
}: ButtonProps) {
  const containerVariants = {
    primary: 'btn-primary-container',
    secondary: 'btn-secondary-container',
    dark: 'btn-dark-container',
    danger: 'btn-danger-container'
  };

  const topVariants = {
    primary: 'btn-primary-top',
    secondary: 'btn-secondary-top',
    dark: 'btn-dark-top',
    danger: 'btn-danger-top'
  };

  const containerClasses = `stacked-button-container font-sans text-center transition-opacity duration-150 ${
    fullWidth ? 'w-full flex' : 'inline-block'
  } ${containerVariants[variant]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`;

  const topClasses = `stacked-button-top py-2.5 px-6 text-xs font-bold w-full ${topVariants[variant]} ${innerClassName}`;

  if (href) {
    return (
      <Link href={href} className={containerClasses} onClick={onClick}>
        <span className={topClasses}>
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={containerClasses}
    >
      <span className={topClasses}>
        {children}
      </span>
    </button>
  );
}

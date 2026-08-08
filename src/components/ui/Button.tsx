import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'outline' 
  | 'destructive' 
  | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  /** Force focus state for design system showcase */
  isFocusedState?: boolean;
  /** Force hover state for design system showcase */
  isHoveredState?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  disabled,
  isFocusedState = false,
  isHoveredState = false,
  type = 'button',
  ...props
}, ref) => {

  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-colors duration-100 ease-out select-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-4 text-xs gap-1.5 min-w-[5rem]",
    md: "h-10 px-5 text-sm gap-2 min-w-[6.5rem]",
    lg: "h-12 px-7 text-base gap-2.5 min-w-[8rem]"
  };

  const variantStyles: Record<ButtonVariant, string> = {
    // Primary Style: Flat Brand Teal-Slate Pill with white text (Zero shadow/glow)
    primary: `bg-[#34505e] text-white 
      ${isHoveredState ? 'bg-[#283e4a]' : 'hover:bg-[#283e4a]'} 
      ${isFocusedState ? 'ring-2 ring-[#34505e] ring-offset-2 dark:ring-offset-slate-900' : 'focus-visible:ring-2 focus-visible:ring-[#34505e] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'}`,

    // Secondary Style: Flat White Pill with thin border and dark text (Zero shadow/glow)
    secondary: `bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 
      ${isHoveredState ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-950 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-950 dark:hover:text-white'} 
      ${isFocusedState ? 'ring-2 ring-slate-400 dark:ring-slate-500 ring-offset-2 dark:ring-offset-slate-900' : 'focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'}`,

    // Tertiary Style: Text-only
    tertiary: `bg-transparent text-purple-700 dark:text-purple-400 
      ${isHoveredState ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300' : 'hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-800 dark:hover:text-purple-300'} 
      ${isFocusedState ? 'ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-slate-900' : 'focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'}`,

    // Outline Style
    outline: `bg-transparent text-[#34505e] dark:text-[#527788] border-2 border-[#34505e] dark:border-[#527788] 
      ${isHoveredState ? 'bg-[#34505e]/10 dark:bg-[#527788]/10 text-[#283e4a] dark:text-slate-100' : 'hover:bg-[#34505e]/10 dark:hover:bg-[#527788]/10 hover:text-[#283e4a] dark:hover:text-slate-100'} 
      ${isFocusedState ? 'ring-2 ring-[#34505e] ring-offset-2 dark:ring-offset-slate-900' : 'focus-visible:ring-2 focus-visible:ring-[#34505e] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'}`,

    // Destructive / Danger Style
    destructive: `bg-red-600 text-white 
      ${isHoveredState ? 'bg-red-700' : 'hover:bg-red-700'} 
      ${isFocusedState ? 'ring-2 ring-red-600 ring-offset-2 dark:ring-offset-slate-900' : 'focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'}`,

    // Ghost / Neutral Minimal Style
    ghost: `bg-transparent text-slate-700 dark:text-slate-300 
      ${isHoveredState ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'} 
      ${isFocusedState ? 'ring-2 ring-slate-400 dark:ring-slate-500 ring-offset-2 dark:ring-offset-slate-900' : 'focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'}`
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const sizeClass = sizeStyles[size] || sizeStyles.md;
  const variantClass = variantStyles[variant] || variantStyles.primary;
  const safeClassName = typeof className === 'string' ? className : '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeClass}
        ${variantClass}
        ${widthStyle}
        ${safeClassName}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin me-1.5 shrink-0" />
      ) : (
        startIcon && <span className="inline-flex shrink-0 items-center me-0.5">{startIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && endIcon && (
        <span className="inline-flex shrink-0 items-center ms-0.5">{endIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

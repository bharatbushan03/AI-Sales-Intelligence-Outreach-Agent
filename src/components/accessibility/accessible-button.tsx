import { useState } from 'react';
import { SrOnly } from './accessibility-utils';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Loading state */
  isLoading?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Icon to show */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Whether to show focus ring */
  focusRing?: boolean;
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Whether the button is block level */
  block?: boolean;
}

export function AccessibleButton({
  isLoading = false,
  loadingText = "Loading...",
  icon,
  iconPosition = 'left',
  focusRing = true,
  size = 'md',
  variant = 'primary',
  block = false,
  className = '',
  children,
  ...props
}: AccessibleButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Size configurations
  const sizeConfig: Record<string, { px: number; py: number; textSize: string }> = {
    sm: { px: 2, py: 1, textSize: 'xs' },
    md: { px: 3, py: 2, textSize: 'sm' },
    lg: { px: 4, py: 3, textSize: 'base' }
  };

  // Variant configurations
  const variantConfig: Record<string, {
    bg: string;
    text: string;
    hover: string;
    active: string;
    disabled: string;
  }> = {
    primary: {
      bg: 'bg-indigo-600',
      text: 'text-white',
      hover: 'hover:bg-indigo-700',
      active: 'active:bg-indigo-800',
      disabled: 'disabled:bg-indigo-300 disabled:text-indigo-100'
    },
    secondary: {
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      hover: 'hover:bg-slate-200',
      active: 'active:bg-slate-300',
      disabled: 'disabled:bg-slate-200 disabled:text-slate-400'
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-50',
      active: 'active:bg-indigo-100',
      disabled: 'disabled:border disabled:text-indigo-200'
    },
    ghost: {
      bg: 'bg-transparent',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-50',
      active: 'active:bg-indigo-100',
      disabled: 'disabled:text-indigo-200'
    }
  };

  const { px, py, textSize } = sizeConfig[size];
  const { bg, text, hover, active, disabled } = variantConfig[variant];

  // Handle disabled state
  const isDisabled = props.disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={
        `
          flex items-center justify-center gap-2
          ${bg} ${text} font-medium
          px-${px} py-${py} rounded-lg
          ${focusRing ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20' : ''}
          transition-all duration-200
          ${disabled}
          ${hover}
          ${active}
          ${block ? 'w-full' : ''}
          ${className}
        `
      }
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {isLoading ? (
        <>
          {iconPosition === 'left' && icon && (
            <span className="flex-shrink-0">
              {icon}
            </span>
          )}
          <span className="flex items-center justify-center animate-pulse">
            {loadingText}
          </span>
          {iconPosition === 'right' && icon && (
            <span className="flex-shrink-0">
              {icon}
            </span>
          )}
        </>
      ) : (
        <>
          {iconPosition === 'left' && icon && (
            <span className="flex-shrink-0">
              {icon}
            </span>
          )}
          <span className="flex-1">
            {children}
            {props['aria-label'] && (
              <SrOnly>
                {props['aria-label']}
              </SrOnly>
            )}
          </span>
          {iconPosition === 'right' && icon && (
            <span className="flex-shrink-0">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
}

/**
 * Accessible icon button
 */
export function AccessibleIconButton({
  icon,
  label,
  size = 'md',
  variant = 'secondary',
  isLoading = false,
  className = '',
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const [isPressed, setIsPressed] = useState(false);

  // Size configurations
  const sizeConfig: Record<string, { dimension: number; textSize: string }> = {
    sm: { dimension: 24, textSize: 'xs' },
    md: { dimension: 32, textSize: 'sm' },
    lg: { dimension: 40, textSize: 'base' }
  };

  // Variant configurations
  const variantConfig: Record<string, {
    bg: string;
    text: string;
    hover: string;
    active: string;
    disabled: string;
  }> = {
    primary: {
      bg: 'bg-indigo-600',
      text: 'text-white',
      hover: 'hover:bg-indigo-700',
      active: 'active:bg-indigo-800',
      disabled: 'disabled:bg-indigo-300 disabled:text-indigo-100'
    },
    secondary: {
      bg: 'bg-transparent',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-50',
      active: 'active:bg-indigo-100',
      disabled: 'disabled:bg-indigo-100/20 disabled:text-indigo-400'
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-50',
      active: 'active:bg-indigo-100',
      disabled: 'disabled:border disabled:text-indigo-200'
    },
    ghost: {
      bg: 'bg-transparent',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-50',
      active: 'active:bg-indigo-100',
      disabled: 'disabled:text-indigo-200'
    }
  };

  const { dimension, textSize } = sizeConfig[size];
  const { bg, text, hover, active, disabled } = variantConfig[variant];

  // Handle disabled state
  const isDisabled = props.disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={
        `
          flex items-center justify-center
          w-[${dimension}px] h-[${dimension}px]
          ${bg} ${text}
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20
          transition-all duration-200
          ${disabled}
          ${hover}
          ${active}
          ${className}
        `
      }
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <SrOnly>{label}</SrOnly>
      {isLoading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </span>
      ) : (
        icon
      )}
    </button>
  );
}

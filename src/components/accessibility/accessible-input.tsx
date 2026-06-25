import { useState, useRef } from 'react';
import { SrOnly } from './accessibility-utils';
import { X } from 'lucide-react';

interface AccessibleInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix'
> {
  /** Label for the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Input variant */
  variant?: 'default' | 'underlined' | 'filled';
  /** Whether input is required */
  required?: boolean;
  /** Whether to show clear button */
  clearable?: boolean;
  /** Whether input is read-only */
  readOnly?: boolean;
  /** Input prefix */
  prefix?: React.ReactNode;
  /** Input suffix */
  suffix?: React.ReactNode;
  /** ClassName */
  className?: string;
}

export function AccessibleInput({
  label,
  placeholder = '',
  helperText = '',
  error = '',
  success = '',
  size = 'md',
  variant = 'default',
  required = false,
  clearable = false,
  readOnly = false,
  prefix,
  suffix,
  className = '',
  ...props
}: AccessibleInputProps) {
  const [value, setValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeConfig: Record<string, { px: number; py: number; textSize: string }> = {
    sm: { px: 2, py: 1, textSize: 'xs' },
    md: { px: 3, py: 2, textSize: 'sm' },
    lg: { px: 4, py: 3, textSize: 'base' },
  };

  // Variant configurations
  const variantConfig: Record<
    string,
    {
      bg: string;
      border: string;
      focus: string;
      hover: string;
    }
  > = {
    default: {
      bg: 'bg-white',
      border: 'border-slate-300',
      focus: 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
      hover: 'hover:border-slate-400',
    },
    underlined: {
      bg: 'bg-transparent',
      border: 'border-b border-slate-300',
      focus: 'focus:border-b-2 focus:border-indigo-500',
      hover: 'hover:border-b-2 hover:border-slate-400',
    },
    filled: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      focus: 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
      hover: 'hover:bg-slate-100',
    },
  };

  const { px, py, textSize } = sizeConfig[size];
  const { bg, border, focus, hover } = variantConfig[variant];

  // Handle clear button
  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
    props.onChange?.(new Event('input') as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // Handle hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Determine if there's an error
  const hasError = !!error || props['aria-invalid'] === 'true';

  return (
    <div className={`${className} space-y-2`}>
      {label && (
        <div className="mb-1 flex items-start gap-1.5">
          <label
            htmlFor={props.id}
            className={`flex items-center gap-1 text-sm font-medium ${
              hasError ? 'text-red-500' : 'text-slate-100'
            }`}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          {props['aria-describedby'] && (
            <SrOnly id={props['aria-describedby']}>{helperText || error || success}</SrOnly>
          )}
        </div>
      )}
      <div className="relative">
        <div
          className={`flex items-center pl-${px} pr-${px} py-${py} bg-${bg.slice(3)} ${border} rounded-md ${focus} ${hover} transition-all duration-200 ${
            isFocused ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' : ''
          } ${props.disabled || readOnly ? 'cursor-not-allowed bg-slate-100/50' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {prefix && <span className="flex-shrink-0 text-slate-400">{prefix}</span>}
          <input
            ref={inputRef}
            type={props.type || 'text'}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-0 flex-1 bg-transparent pr-0 pl-0 text-sm text-slate-900 focus:ring-0 focus:outline-none"
            {...props}
            required={required}
            readOnly={readOnly}
          />
          {suffix && <span className="flex-shrink-0 text-slate-400">{suffix}</span>}
          {clearable && value && !readOnly && !props.disabled && (
            <button
              type="button"
              className="flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100/50 hover:text-slate-600"
              onClick={handleClear}
              aria-label="Clear input"
            >
              <SrOnly>Clear input</SrOnly>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      {helperText && !hasError && !success && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && !error && <p className="text-xs text-green-500">{success}</p>}
    </div>
  );
}

interface AccessibleTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  className?: string;
}

export function AccessibleTextarea({
  label,
  placeholder = '',
  helperText = '',
  error = '',
  success = '',
  size = 'md',
  required = false,
  className = '',
  readOnly = false,
  ...props
}: AccessibleTextareaProps) {
  const [value, setValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Size configurations
  const sizeConfig: Record<string, { px: number; py: number; textSize: string }> = {
    sm: { px: 2, py: 1, textSize: 'xs' },
    md: { px: 3, py: 2, textSize: 'sm' },
    lg: { px: 4, py: 3, textSize: 'base' },
  };

  const { px, py, textSize } = sizeConfig[size];

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // Handle hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Determine if there's an error
  const hasError = !!error || props['aria-invalid'] === 'true';

  return (
    <div className={`${className} space-y-2`}>
      {label && (
        <div className="mb-1 flex items-start gap-1.5">
          <label
            htmlFor={props.id}
            className={`flex items-center gap-1 text-sm font-medium ${
              hasError ? 'text-red-500' : 'text-slate-100'
            }`}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          {props['aria-describedby'] && (
            <SrOnly id={props['aria-describedby']}>{helperText || error || success}</SrOnly>
          )}
        </div>
      )}
      <div className="relative">
        <div
          className={`flex items-center pl-${px} pr-${px} py-${py} rounded-md border border-slate-300 bg-white transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
            isFocused ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' : ''
          } ${props.disabled || readOnly ? 'cursor-not-allowed bg-slate-100/50' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-0 flex-1 bg-transparent pr-0 pl-0 text-sm text-slate-900 focus:ring-0 focus:outline-none"
            {...props}
            required={required}
            readOnly={readOnly}
          />
        </div>
      </div>
      {helperText && !hasError && !success && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && !error && <p className="text-xs text-green-500">{success}</p>}
    </div>
  );
}

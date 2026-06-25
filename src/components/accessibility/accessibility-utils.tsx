// Accessibility utilities for WCAG compliance

/**
 * Check if element is accessible via keyboard
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const focusableElements = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ];

  return focusableElements.some((selector) => element.matches(selector));
}

/**
 * Trap focus within an element (for modals, dialogs)
 */
export function focusTrap(element: HTMLElement) {
  const focusableElements = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ].join(',');

  const focusable = element.querySelectorAll(focusableElements) as NodeListOf<HTMLElement>;
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  return function trapKey(e: KeyboardEvent) {
    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      // shift + tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
}

/**
 * Skip to content link component
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="absolute top-4 left-4 z-50 -translate-y-full transform bg-indigo-600 px-3 py-2 text-white transition-transform duration-300 focus:translate-y-0"
    >
      Skip to main content
    </a>
  );
}

/**
 * Screen reader only text
 */
export function SrOnly({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <span className="sr-only" id={id}>
      {children}
    </span>
  );
}

/**
 * Visually hidden but accessible element
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="not-sr-only">{children}</span>;
}

/**
 * Announce changes to screen readers
 */
export function LiveAnnouncer({
  message,
  live = 'polite',
}: {
  message: string;
  live?: 'off' | 'polite' | 'assertive';
}) {
  return (
    <div aria-live={live} className="fixed top-0 left-0 m-0 h-1 w-1 overflow-hidden p-0">
      {message}
    </div>
  );
}

/**
 * Keyboard shortcut help
 */
export function KeyboardHelp() {
  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-xs rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-md">
      <h3 className="mb-2 text-sm font-medium text-slate-100">Keyboard Shortcuts</h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 font-medium text-indigo-400">⌘</span>
          <span>Navigate to dashboard</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 font-medium text-indigo-400">⌥</span>
          <span>Open search</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 font-medium text-indigo-400">⌃</span>
          <span>Open notifications</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 font-medium text-indigo-400">⌘</span>
          <span>Focus search input</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 font-medium text-indigo-400">⎋</span>
          <span>Close modal/dropdown</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Focus indicator enhancement
 */
export function FocusIndicator({ children }: { children: React.ReactNode }) {
  return (
    <div
      tabIndex={0}
      className="relative"
      onFocus={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.outline = '2px solid indigo-500';
        target.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.outline = 'none';
        target.style.outlineOffset = '0';
      }}
    >
      {children}
    </div>
  );
}

/**
 * Skip link collection for common navigation points
 */
export function SkipLinks() {
  return (
    <>
      <a
        href="#main-navigation"
        className="absolute top-4 left-4 z-50 -translate-y-4 transform bg-indigo-600 px-3 py-2 text-white transition-transform duration-300 focus:translate-y-0"
      >
        Skip to navigation
      </a>
      <a
        href="#main-content"
        className="absolute top-4 left-4 z-50 -translate-y-3 transform bg-indigo-600 px-3 py-2 text-white transition-transform duration-300 focus:translate-y-0"
      >
        Skip to main content
      </a>
      <a
        href="#footer"
        className="absolute top-4 left-4 z-50 -translate-y-2 transform bg-indigo-600 px-3 py-2 text-white transition-transform duration-300 focus:translate-y-0"
      >
        Skip to footer
      </a>
    </>
  );
}

/**
 * Color contrast checker
 */
export function checkColorContrast(foreground: string, background: string): number {
  // Simplified contrast ratio calculation
  // In practice, you'd use a proper color contrast library

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) {
    return 1; // Return minimum contrast if parsing fails
  }

  // Calculate relative luminance
  const luminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((val) => {
      val /= 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fgLum = luminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLum = luminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get accessible color based on background
 */
export function getAccessibleColor(
  background: string,
  options: string[] = ['#ffffff', '#000000'],
): string {
  let bestColor = options[0];
  let bestContrast = 0;

  for (const color of options) {
    const contrast = checkColorContrast(color, background);
    if (contrast > bestContrast) {
      bestContrast = contrast;
      bestColor = color;
    }
  }

  return bestContrast >= 4.5 ? bestColor : options[0]; // WCAG AA threshold
}

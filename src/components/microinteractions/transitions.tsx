// Transition utility classes and functions for smooth animations

// Preset transition classes
export const transitions = {
  // Basic transitions
  basic: 'transition-all duration-200',
  slow: 'transition-all duration-500',
  fast: 'transition-all duration-100',

  // Specific property transitions
  opacity: 'transition-opacity duration-200',
  transform: 'transition-transform duration-200',
  color: 'transition-background-color duration-200',
  shadow: 'transition-shadow duration-200',

  // Complex transitions
  card: 'transition-all duration-300 ease-in-out',
  menu: 'transition-all duration-200 ease-out',
  modal: 'transition-all duration-300 ease-out',
  tooltip: 'transition-all duration-150 ease-in',
  toast: 'transition-all duration-200 ease-out',

  // Animation presets
  fadeIn: 'transition-opacity duration-200 ease-in',
  fadeOut: 'transition-opacity duration-200 ease-out',
  slideIn: 'transition-transform duration-200 ease-in',
  slideOut: 'transition-transform duration-200 ease-out',
  scaleIn: 'transition-transform duration-200 ease-in',
  scaleOut: 'transition-transform duration-200 ease-out',
};

// Animation keyframes for custom animations
export const keyframes = {
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `,
  fadeInUp: `
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeInDown: `
    @keyframes fadeInDown {
      0% { opacity: 0; transform: translateY(-20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeInLeft: `
    @keyframes fadeInLeft {
      0% { opacity: 0; transform: translateX(-20px); }
      100% { opacity: 1; transform: translateX(0); }
    }
  `,
  fadeInRight: `
    @keyframes fadeInRight {
      0% { opacity: 0; transform: translateX(20px); }
      100% { opacity: 1; transform: translateX(0); }
    }
  `,
  zoomIn: `
    @keyframes zoomIn {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
  `,
  zoomOut: `
    @keyframes zoomOut {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.8); }
    }
  `,
};

// Custom animation classes
export const animations = {
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  spin: 'animate-spin',
  ping: 'animate-ping',
};

// Utility function to apply transitions
export function applyTransition(element: HTMLElement, transition: string) {
  element.style.transition = transition;
}

// Utility function to trigger reflow (forces browser to recalculate layout)
export function triggerReflow(element: HTMLElement) {
  void element.offsetHeight;
}

// Utility function to add animation class with timeout for removal
export function animateElement(
  element: HTMLElement,
  animationClass: string,
  duration: number = 500,
) {
  element.classList.add(animationClass);

  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

// Preset animation sequences
export const animationSequences = {
  // Button click feedback
  buttonClick: ['scale-95', 'scale-100'],

  // Form validation feedback
  validationError: ['shake', 'border-red-500', 'border-slate-300'],

  // Success feedback
  successFeedback: ['scale-105', 'scale-100', 'bg-green-500/20', 'bg-transparent'],

  // Loading state
  loadingPulse: ['animate-pulse'],

  // Toast appearance
  toastAppear: ['opacity-0 translate-y-4', 'opacity-100 translate-y-0'],

  // Modal appearance
  modalAppear: ['opacity-0 scale-95', 'opacity-100 scale-100'],
};

// Custom hover effects that can be applied to elements
export const hoverEffects = {
  // Basic hover lift
  lift: "transition-transform duration-200 hover:-translate-y-1",

  // Hover lift with shadow
  liftShadow: "transition-transform duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/20",

  // Hover scale
  scale: "transition-transform duration-200 hover:scale-105",

  // Hover scale with shadow
  scaleShadow: "transition-transform duration-200 hover:scale-105 hover:shadow-md hover:shadow-indigo-500/20",

  // Hover background change
  bgChange: "transition-background-color duration-200 hover:bg-slate-800/50",

  // Hover border change
  borderChange: "transition-border-color duration-200 hover:border-indigo-400",

  // Hover glow
  glow: "transition-shadow duration-200 hover:shadow-[0_0_0_2px_theme(colors.indigo.400)]",

  // Hover overlay
  overlay: "relative overflow-hidden",
  overlayContent: "absolute inset-0 bg-indigo-500/0 transition-all duration-300 group-hover:bg-indigo-500/10",

  // Hover underline
  underline: "relative after:content-[\"\"] after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-indigo-500 after:transition-all duration-200 group-hover:w-full",

  // Hover fade-in
  fadeIn: "transition-opacity duration-200 group-hover:opacity-100",

  // Card hover effects
  cardHover: "transition-all duration-300 hover:bg-slate-900/70 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/10",

  // Button hover effects
  buttonHover: "transition-all duration-200 hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/20",

  // Input hover effects
  inputHover: "transition-border-color duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",

  // Tab hover effects
  tabHover: "transition-all duration-200 hover:text-indigo-400 hover:border-indigo-400",

  // Menu item hover effects
  menuItemHover: "transition-all duration-200 hover:bg-indigo-900/20 hover:text-indigo-400",
};

// Utility function to apply hover effects
export function applyHoverEffects(element: HTMLElement, effects: string[]) {
  effects.forEach(effect => {
    if (hoverEffects[effect as keyof typeof hoverEffects]) {
      // This would typically be done via CSS classes in practice
      // For demonstration, we're showing the concept
      console.log(`Applying hover effect: ${effect}`);
    }
  });
}

// Export individual effects for direct use
export {
  hoverEffects
};
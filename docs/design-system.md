# Design System Documentation

## Overview

This document outlines the design system for the Autonomous B2B Sales Intelligence Agent platform. The design system provides a cohesive visual language, reusable components, and guidelines to ensure consistency across the application.

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing](#spacing)
5. [Shadows](#shadows)
6. [Border Radius](#border-radius)
7. [Components](#components)
8. [Usage Guidelines](#usage-guidelines)
9. [Accessibility](#accessibility)
10. [Performance](#performance)

## Design Principles

### Clarity
- Prioritize readability and comprehension
- Use clear visual hierarchies
- Minimize cognitive load

### Consistency
- Maintain uniformity across all interfaces
- Reuse components and patterns
- Follow established conventions

### Efficiency
- Optimize for common tasks
- Reduce user effort
- Leverage familiar patterns

### Feedback
- Provide clear system feedback
- Use microinteractions for state changes
- Ensure visibility of system status

## Color System

### Primary Colors
- **Indigo**: #6366F1 (primary brand color)
- **Indigo Light**: #818CF8
- **Indigo Dark**: #4F46E5
- **Indigo Darker**: #3730A3

### Neutral Colors
- **Slate 50**: #F8FAFC
- **Slate 100**: #F1F5F9
- **Slate 200**: #E2E8F0
- **Slate 300**: #CBD5E1
- **Slate 400**: #94A3B8
- **Slate 500**: #64748B
- **Slate 600**: #475569
- **Slate 700**: #334155
- **Slate 800**: #263238
- **Slate 900**: #1E293B
- **Slate 950**: #0F172A

### Semantic Colors
- **Success**: #10B981 (Emerald)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Info**: #3B82F6 (Blue)

### Background Colors
- **White**: #FFFFFF
- **Dark**: #0A0A0A
- **Slate 50**: #F8FAFC (light background)
- **Slate 900**: #1E293B (dark background)

## Typography

### Font Families
- **Primary**: Geist Sans (system UI font)
- **Secondary**: Geist Mono (for code and technical content)

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **SemiBold**: 600
- **Bold**: 700
- **ExtraBold**: 800

### Font Sizes
- **Text Sizes**:
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)
  - 2xl: 1.5rem (24px)
  - 3xl: 1.875rem (30px)
  - 4xl: 2.25rem (36px)
  - 5xl: 3rem (48px)
  - 6xl: 3.75rem (60px)

### Line Heights
- **Tight**: 1.25
- **Normal**: 1.5
- **Relaxed**: 1.75
- **Loose**: 2

### Letter Spacing
- **Tighter**: -0.05em
- **Tight**: -0.025em
- **Normal**: 0em
- **Wide**: 0.025em
- **Wider**: 0.05em
- **Widest**: 0.1em

## Spacing

### Spacing Scale
- 0: 0px
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 5: 1.25rem (20px)
- 6: 1.5rem (24px)
- 7: 1.75rem (28px)
- 8: 2rem (32px)
- 9: 2.25rem (36px)
- 10: 2.5rem (40px)
- 11: 2.75rem (44px)
- 12: 3rem (48px)
- 14: 3.5rem (56px)
- 16: 4rem (64px)
- 20: 5rem (80px)
- 24: 6rem (96px)
- 28: 7rem (112px)
- 32: 8rem (128px)
- 36: 9rem (144px)
- 40: 10rem (160px)
- 44: 11rem (176px)
- 48: 12rem (192px)
- 52: 13rem (208px)
- 56: 14rem (224px)
- 60: 15rem (240px)
- 64: 16rem (256px)
- 72: 18rem (288px)
- 80: 20rem (320px)
- 96: 24rem (384px)

## Shadows

### Shadow Scale
- **sm**: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- **DEFAULT**: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
- **md**: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- **lg**: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1)
- **xl**: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
- **2xl**: 0 25px 50px -12px rgb(0 0 0 / 0.25)
- **inner**: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)
- **none**: 0 0 #0000

## Border Radius

### Radius Scale
- **none**: 0px
- **sm**: 0.125rem (2px)
- **DEFAULT**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **3xl**: 1.25rem (20px)
- **full**: 9999px

## Components

### Buttons
- **Primary**: Blue background with white text
- **Secondary**: Gray background with blue text
- **Outline**: Transparent with blue border and text
- **Ghost**: Transparent with blue text only
- **Sizes**: Small, Medium, Large
- **States**: Default, Hover, Active, Disabled, Loading

### Inputs
- **Types**: Text, Textarea, Select, Checkbox, Radio, File
- **Variants**: Default, Underlined, Filled
- **States**: Default, Focus, Hover, Disabled, Error, Success
- **Features**: Label, Helper text, Prefix, Suffix, Clearable

### Cards
- **Basic**: Container with padding and border
- **Elevated**: With shadow for depth
- **Interactive**: Hover effects for clickable cards
- **Variants**: Default, Image, Actionable

### Navigation
- **Sidebar**: Vertical navigation with collapsible sections
- **Top Bar**: Horizontal navigation with utility actions
- **Breadcrumbs**: Hierarchical navigation path
- **Tabs**: Horizontal tabbed interface
- **Pagination**: Page navigation controls

### Modals & Dialogs
- **Modal**: Overlay dialog for focused interactions
- **Alert**: Simple message dialog
- **Confirmation**: Action confirmation dialog
- **Prompt**: Input-based dialog

### Tables
- **Basic**: Simple data table with borders
- **Sortable**: Columns with sorting indicators
- **Selectable**: Rows with checkbox selection
- **Paginated**: Table with pagination controls
- **Virtualized**: Large dataset optimization

### Feedback Components
- **Toast**: Temporary notification
- **Progress Bar**: Visual progress indicator
- **Skeleton Loader**: Placeholder for loading content
- **Empty State**: Placeholder for empty data
- **Error State**: Display for error conditions

## Usage Guidelines

### Do's
- Use the spacing scale consistently
- Follow the color system for semantic meaning
- Maintain proper touch targets (minimum 44x44px)
- Ensure sufficient color contrast (WCAG AA minimum)
- Use semantic HTML elements
- Provide meaningful alt text for images
- Use ARIA labels when necessary
- Follow responsive design principles

### Don'ts
- Don't use arbitrary colors outside the system
- Don't mix different border radii inconsistently
- Don't create custom spacing values
- Don't use low contrast text combinations
- Don't ignore keyboard navigation
- Don't rely solely on color for information
- Don't use tiny touch targets
- Don't override focus outlines without alternatives

## Accessibility

### WCAG Compliance
- **Perceivable**: Provide text alternatives, adaptable content, distinguishable content
- **Operable**: Keyboard accessible, sufficient time, seizure prevention, navigable
- **Understandable**: Readable text, predictable behavior, input assistance
- **Robust**: Compatible with assistive technologies

### Specific Guidelines
- Color contrast ratio of at least 4.5:1 for normal text
- Color contrast ratio of at least 3:1 for large text
- Minimum touch target size of 44x44px
- All interactive elements keyboard accessible
- Visible focus indicators
- Proper ARIA labeling
- Semantic HTML structure
- Responsive design for all screen sizes

## Performance

### Optimization Techniques
- **Code Splitting**: Lazy load routes and components
- **Image Optimization**: Use appropriate formats and sizes
- **Caching**: Leverage browser caching for static assets
- **Minification**: Minify CSS, JavaScript, and HTML
- **Critical CSS**: Inline above-the-fold CSS
- **Font Loading**: Optimize web font loading

### Component-Level Optimizations
- **Virtualization**: For large lists and tables
- **Skeleton Loaders**: For perceived performance
- **Debouncing**: For input fields and search
- **Throttling**: For scroll and resize events
- **Memoization**: For expensive computations

### Metrics Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s
- **Total Blocking Time**: < 150ms
- **Lighthouse Score**: > 90

## Implementation

### Using the Design System
1. Import Tailwind CSS utilities
2. Use the provided spacing, color, and typography classes
3. Leverage the pre-built components
4. Follow the usage guidelines
5. Test for accessibility compliance

### Customization
- Extend the theme in tailwind.config.ts
- Add custom utilities when necessary
- Maintain consistency with existing patterns
- Document any additions or changes

## Contributing

When adding new components or modifying existing ones:

1. Follow the established patterns
2. Ensure accessibility compliance
3. Test across screen sizes
4. Update documentation accordingly
5. Provide usage examples

## Versioning

This documentation corresponds to Design System v1.0.0
Last updated: June 23, 2026
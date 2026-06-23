# Contributing Guidelines

Thank you for your interest in contributing to the Autonomous B2B Sales Intelligence Agent platform! This document outlines our development process, coding standards, and contribution procedures to help you get started.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Pull Request Process](#pull-request-process)
5. [Testing Guidelines](#testing-guidelines)
6. [Documentation Standards](#documentation-standards)
7. [Community Guidelines](#community-guidelines)
8. [License](#license)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later (or yarn/pnpm)
- Git
- Code editor (VS Code recommended)

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/visualization.git
   cd visualization
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Project Structure

```
visualization/
├── app/                 # Next.js app router
├── components/          # Reusable UI components
├── docs/                # Documentation
├── lib/                 # Utility functions, hooks, services
├── public/              # Static assets
├── styles/              # Global styles
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── tailwind.config.ts   # Tailwind CSS configuration
```

## Development Workflow

### Branching Strategy

We use a trunk-based development model with feature branches:

- `main`: Production-ready code
- `develop`: Integration branch for upcoming release
- `feature/*`: New features (`feature/authentication`, `feature/crm-enhancements`)
- `bugfix/*`: Bug fixes (`bugfix/login-issue`, `bugfix/table-sorting`)
- `hotfix/*`: Urgent production fixes (`hotfix/security-patch`)
- `release/*`: Release preparation (`release/v1.2.0`)

### Making Changes

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Commit frequently with descriptive messages:
   ```bash
   git commit -m "feat: add lead scoring algorithm"
   git commit -m "fix: resolve timezone display issue"
   git commit -m "docs: update API documentation for opportunities"
   ```

4. Keep your branch up to date with `develop`:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

5. Push your branch and open a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

#### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi-colons, etc.
- `refactor`: Code refactoring without functional changes
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Build process or auxiliary tool changes
- `revert`: Reverts a previous commit

#### Examples
- `feat(auth): add JWT refresh token handling`
- `fix(crm): correct lead score calculation`
- `docs(api): update opportunities endpoints documentation`
- `refactor(components): simplify button variant logic`
- `perf(dashboard): implement virtualized list for opportunities`
- `test(research): add unit tests for company search`
- `chore(deps): update lodash to version 4.17.21`

## Coding Standards

### TypeScript

- Use strict mode (`"strict": true` in tsconfig.json)
- Prefer interfaces over types for object shapes
- Use type aliases for unions, intersections, and mapped types
- Enable `noImplicitAny`, `strictNullChecks`, and `strictFunctionTypes`
- Avoid `any` type; use `unknown` when type is uncertain
- Use enum for fixed sets of related constants
- Prefix boolean variables with `is`, `has`, `should`, or `can`
- Use PascalCase for types and interfaces, camelCase for variables and functions

### React Components

- Use functional components with hooks
- Export components as default exports
- Use PascalCase for component names
- Destructure props in function signature when possible
- Use early returns for conditional rendering
- Extract complex JSX into separate variables or functions
- Use fragments (`<>...</>`) instead of unnecessary divs
- Memoize expensive computations with `useMemo` and `useCallback`
- Use `React.memo` for components that render frequently with same props
- Handle loading and error states gracefully
- Ensure accessibility compliance (WCAG 2.1 AA)

### Styling (Tailwind CSS)

- Use utility-first approach
- Follow the design system's spacing, color, and typography scales
- Avoid arbitrary values when possible (`mt-[22px]` → use design system)
- Use responsive prefixes (`md:`, `lg:`) for responsive design
- Group related utilities with comments for readability
- Extract repetitive utility patterns into `@apply` in CSS when beneficial
- Use variant modifiers (`hover:`, `focus:`, `dark:`) appropriately
- Maintain consistent naming for custom classes

### Code Organization

- Keep functions small and focused (under 50 lines when possible)
- Keep components focused on a single responsibility
- Use barrel exports (`index.ts`) for clean imports
- Place related files together (component, styles, tests)
- Separate concerns: UI, logic, data, services
- Use absolute imports with `@/` alias for cleaner imports
- Avoid deeply nested imports (`../../../components/Button`)
- Group imports: React, third-party, internal (alphabetical within groups)

### File Naming

- Use kebab-case for files and directories
- Use PascalCase for component files (`Button.tsx`)
- Use camelCase for utility files (`formatDate.ts`)
- Use descriptive names that indicate purpose
- Group related files in directories

## Pull Request Process

### Before Submitting

1. Ensure your code follows our coding standards
2. Run the test suite: `npm test`
3. Run linting: `npm run lint`
4. Fix any linting errors: `npm run lint -- --fix`
5. Ensure your changes don't break existing functionality
6. Update documentation if applicable
7. Squash commits if necessary for clean history

### Submitting a Pull Request

1. Push your branch to your fork
2. Navigate to the original repository
3. Click "New Pull Request"
4. Select your branch as the compare branch
5. Ensure the base branch is `develop`
6. Fill out the pull request template completely
7. Request reviews from appropriate team members
8. Address feedback promptly

### Pull Request Template

```
## Summary
Brief description of the changes

## Related Issue
Fixes #[issue-number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactor
- [ ] Performance improvement
- [ ] Testing

## Checklist
- [ ] Code follows coding standards
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or they are documented)
- [ ] Screenshots/GIFs for UI changes (if applicable)

## Screenshots/GIFs
(If applicable, add screenshots or GIFs demonstrating the changes)
```

### Review Process

1. At least one approving review is required
2. Address all reviewer comments
3. Maintainers may request additional changes
4. Once approved, maintainers will merge the PR
5. After merging, delete your feature branch

## Testing Guidelines

### Test Philosophy

We aim for comprehensive test coverage to ensure reliability and prevent regressions:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components and services
- **End-to-End Tests**: Test critical user flows
- **Visual Regression Tests**: Test UI consistency (planned)

### Test Frameworks

- **Jest**: JavaScript/TypeScript testing framework
- **React Testing Library**: React component testing
- **Cypress**: End-to-end testing (planned)
- **MSW**: Mock Service Worker for API mocking

### Writing Tests

#### Unit Tests

```typescript
// utils/formatDate.test.ts
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate(new Date('2026-06-23'))).toBe('Jun 23, 2026');
  });

  it('should handle null input', () => {
    expect(formatDate(null)).toBe('');
  });
});
```

#### Component Tests

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { AccessibleButton } from './AccessibleButton';

describe('AccessibleButton', () => {
  it('renders with correct label', () => {
    render(<AccessibleButton>Click me</AccessibleButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>);
    screen.getByRole('button', { name: /click me/i }).click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<AccessibleButton isLoading>Processing</AccessibleButton>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByLabelText(/processing/i)).toBeInTheDocument();
  });
});
```

#### API Tests

```typescript
// lib/api/crmService.test.ts
import { crmService } from './crmService';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/crm/leads', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [{ id: 'lead_1', name: 'John Doe' }]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('crmService', () => {
  it('should fetch leads successfully', async () => {
    const leads = await crmService.getLeads();
    expect(leads).toHaveLength(1);
    expect(leads[0].id).toBe('lead_1');
  });
});
```

### Test Coverage

- Aim for >80% line coverage overall
- Critical paths should have >90% coverage
- Test edge cases and error conditions
- Mock external dependencies appropriately
- Keep tests fast and reliable

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/components/Button.test.tsx
```

## Documentation Standards

### Code Documentation

- Use JSDoc for functions and TypeScript interfaces
- Document complex algorithms and business logic
- Keep documentation close to the code it describes
- Update documentation when changing code
- Include examples for complex functions

### API Documentation

- Follow the API documentation standards in `/docs/api.md`
- Keep API documentation up to date with implementation
- Include request/response examples
- Document error cases and validation rules

### User Documentation

- Write clear, concise documentation for end users
- Include screenshots and examples when helpful
- Follow the style guide in `/docs/design-system.md`
- Update documentation for UI changes
- Provide both overview and detailed instructions

### Documentation Files

- Keep documentation in the `/docs` directory
- Use markdown (.md) format
- Follow consistent heading structure
- Include table of contents for longer documents
- Link related documents appropriately
- Use code blocks for examples with appropriate language tags

## Community Guidelines

### Communication

- Be respectful and professional in all interactions
- Listen to and value different perspectives
- Provide constructive feedback
- Ask for help when needed
- Share knowledge freely

### Issue Reporting

- Search existing issues before creating new ones
- Provide clear, descriptive titles
- Include steps to reproduce for bugs
- Include expected vs actual behavior
- Include screenshots and error messages when applicable
- Label issues appropriately (bug, enhancement, question, etc.)

### Code Reviews

- Review code, not the person
- Be specific in your feedback
- Explain the reasoning behind suggestions
- Acknowledge good practices
- Focus on improving the codebase
- Be open to feedback on your own code

### Mentoring

- Help newcomers get started
- Share tips and best practices
- Be patient with different experience levels
- Encourage questions and learning
- Recognize and appreciate contributions

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license (see LICENSE file).

## Getting Help

If you need help or have questions:

1. Check the documentation in `/docs`
2. Look for similar patterns in the codebase
3. Ask in the team communication channels
4. Reach out to maintainers directly
5. Review existing pull requests for examples

Thank you for contributing to make this platform better!

## Versioning

This documentation corresponds to Contributing Guidelines v1.0.0
Last updated: June 23, 2026
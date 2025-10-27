# Frontend Testing Guide

This directory contains the testing infrastructure for the Reiseklar frontend application.

## Testing Stack

- **Vitest** - Fast unit test framework powered by Vite
- **React Testing Library** - Testing utilities for React components
- **jsdom** - DOM implementation for Node.js
- **@testing-library/user-event** - Simulate user interactions
- **@testing-library/jest-dom** - Custom matchers for DOM assertions

## Running Tests

```bash
# Run tests in watch mode (interactive)
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Run tests with coverage report
pnpm test:coverage

# Run tests with UI interface
pnpm test:ui
```

## Project Structure

```
apps/frontend/
├── __tests__/              # Test files
│   ├── components/         # Component tests
│   │   └── ui/            # UI component tests
│   ├── hooks/             # Custom hook tests
│   └── utils/             # Utility function tests
├── tests/                  # Test utilities and setup
│   ├── setup.ts           # Global test setup
│   ├── test-utils.tsx     # Custom render functions
│   └── README.md          # This file
└── vitest.config.ts       # Vitest configuration
```

## Writing Tests

### Basic Component Test

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing with Redux Store

```tsx
import { renderWithProviders } from '@/tests/test-utils';
import { MyConnectedComponent } from '@/components/MyConnectedComponent';

describe('MyConnectedComponent', () => {
  it('should access Redux state', () => {
    const preloadedState = {
      auth: { user: { name: 'John' } }
    };

    renderWithProviders(<MyConnectedComponent />, { preloadedState });
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```tsx
import userEvent from '@testing-library/user-event';

describe('Form Component', () => {
  it('should handle form submission', async () => {
    const user = userEvent.setup();
    render(<Form />);

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

## Mocked Dependencies

The following are automatically mocked in `tests/setup.ts`:

- **next/navigation** - Router, pathname, search params
- **next-intl** - Translation functions
- **window.matchMedia** - Media query matching
- **IntersectionObserver** - Intersection observer API

## Best Practices

1. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
2. **Test behavior, not implementation** - Focus on what users see and do
3. **Arrange-Act-Assert** - Structure tests clearly
4. **Avoid testing implementation details** - Test public API only
5. **Use user-event over fireEvent** - More realistic user interactions
6. **Mock external dependencies** - Keep tests fast and isolated

## Coverage Goals

- **Critical components**: 80%+ coverage
- **Utility functions**: 90%+ coverage
- **Overall project**: 60%+ coverage

## Common Testing Patterns

### Testing Async Components

```tsx
import { waitFor } from '@testing-library/react';

it('should load data', async () => {
  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Testing Error States

```tsx
it('should show error message', () => {
  render(<Component error="Something went wrong" />);
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

### Testing Accessibility

```tsx
it('should be accessible', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toHaveAccessibleName('Click me');
});
```

## Troubleshooting

### Tests failing with "Cannot find module '@/...'"

Check that path aliases in `vitest.config.ts` match your `tsconfig.json`.

### "window is not defined" errors

Make sure `environment: 'jsdom'` is set in `vitest.config.ts`.

### Mock not working

Ensure mocks are defined in `tests/setup.ts` or at the top of your test file before imports.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

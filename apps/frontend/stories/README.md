# Reiseklar Storybook Documentation

Welcome to the Reiseklar component library! This Storybook contains interactive documentation for all UI components, form elements, and layout components used in the application.

## Getting Started

### Running Storybook

```bash
# Development mode
pnpm storybook

# Build static version
pnpm build-storybook
```

Storybook will be available at `http://localhost:6006`

## What's Inside

### UI Components (`/UI`)
Basic, reusable UI components that form the building blocks of the application:

- **Button** - Primary action component with multiple variants and sizes
- **Input** - Text input field with support for various types
- **Card** - Container component for grouped content
- **Label** - Form label component with accessibility features

### Form Components (`/Forms`)
Complex form inputs and interactive elements:

- **DateTimePicker** - Date and time selection with responsive layouts
- **LocationAutocomplete** - Location search with geolocation support (documentation pending)
- **SearchForm** - Journey search form (documentation pending)

### Navigation (`/Navigation`)
Navigation and layout documentation:

- **Navigation Overview** - Complete navigation system documentation

## Component Stories

Each component includes multiple stories demonstrating:

1. **Default State** - Basic usage example
2. **Variants** - Different visual styles (e.g., button variants: default, destructive, outline)
3. **Sizes** - Different size options where applicable
4. **States** - Interactive states (disabled, loading, error)
5. **Accessibility** - WCAG 2.1 AA compliance features
6. **Complex Examples** - Real-world usage scenarios

## Accessibility Features

All components are built with accessibility in mind:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant color ratios
- **Semantic HTML**: Proper use of HTML5 elements

### Accessibility Testing

Use the **Accessibility** addon (bottom toolbar) to:
- Run automated accessibility checks
- View violations and warnings
- Test color contrast
- Verify ARIA attributes

## Controls

Most stories include interactive controls (check the **Controls** tab):

- Modify props in real-time
- Test different configurations
- Experiment with edge cases
- Copy code examples

## Design Tokens

The component library uses consistent design tokens:

### Colors
- **Primary**: Blue (`#003366` - Norwegian Blue)
- **Destructive**: Red for warning/danger actions
- **Secondary**: Gray for secondary actions
- **Ghost**: Transparent with hover states

### Spacing
- **Small**: `h-8` (32px)
- **Default**: `h-9` (36px)
- **Large**: `h-10` (40px)

### Typography
- **Font Family**: System font stack
- **Sizes**: Tailwind's default scale (text-sm, text-base, text-lg, etc.)

## Component Guidelines

### When to Use Button vs Link
- **Button**: For actions that change state (submit forms, open modals, trigger API calls)
- **Link**: For navigation between pages
- Use `variant="link"` on Button for link-styled actions

### Form Validation
- Always pair inputs with labels
- Show error messages below the input
- Use red color (`text-red-500`) for errors
- Mark required fields with `*`

### Loading States
- Use disabled state with loading spinner
- Provide visual feedback for async operations
- Keep button text visible during loading

## Tech Stack

- **React 19**: Latest React with server components
- **Next.js 15**: App Router for routing
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible primitives
- **shadcn/ui**: Component patterns
- **TypeScript**: Type safety
- **Storybook 9**: Component documentation

## Development Workflow

### Adding a New Component

1. Create the component in `/components`
2. Create a story file: `ComponentName.stories.tsx`
3. Add multiple stories demonstrating usage
4. Document accessibility features
5. Add JSDoc comments for props
6. Test with accessibility addon

### Story File Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta = {
  title: 'Category/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Define prop controls
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

## Best Practices

### Accessibility
- Always include ARIA labels
- Test with keyboard only
- Verify with screen readers
- Check color contrast
- Use semantic HTML

### Performance
- Lazy load heavy components
- Optimize images
- Minimize re-renders
- Use React.memo for expensive components

### Testing
- Write unit tests for all components
- Test accessibility in Storybook
- Use React Testing Library
- Aim for 60%+ coverage on critical components

## Resources

- [Storybook Documentation](https://storybook.js.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Testing Library](https://testing-library.com/react)

## Contributing

When adding new components:

1. Follow existing patterns
2. Include accessibility features
3. Add comprehensive stories
4. Document props with JSDoc
5. Write tests
6. Update this README if needed

## Support

For questions or issues:
- Check existing stories for examples
- Review component tests in `__tests__`
- See main README.md for project setup
- Contact the development team

---

**Version**: 1.0.0
**Last Updated**: October 2025
**Maintainer**: Reiseklar Development Team

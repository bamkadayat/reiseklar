import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple smoke test to verify test setup is working
describe('Test Setup Verification', () => {
  it('should run a basic test', () => {
    expect(true).toBe(true);
  });

  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello Test</div>;
    render(<TestComponent />);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });

  it('should have access to testing library matchers', () => {
    const element = document.createElement('div');
    element.textContent = 'Test';
    expect(element).toBeTruthy();
  });
});

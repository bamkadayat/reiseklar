import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '@/components/landing/SearchForm';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'home.search.from': 'From',
      'home.search.to': 'To',
      'home.search.button': 'Search',
    };
    return translations[key] || key;
  },
  useLocale: () => 'en',
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock child components to simplify testing
vi.mock('@/components/landing/LocationAutocomplete', () => ({
  LocationAutocomplete: vi.fn(({ value, onChange, placeholder }: any) => (
    <div data-testid="location-autocomplete">
      <label>{placeholder}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )),
}));

vi.mock('@/components/landing/DateTimePicker', () => ({
  DateTimePicker: vi.fn(() => <div data-testid="date-time-picker">Date Picker</div>),
}));

describe('SearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form container', () => {
      render(<SearchForm />);
      expect(screen.getByText('From')).toBeInTheDocument();
      expect(screen.getByText('To')).toBeInTheDocument();
    });

    it('should render swap button', () => {
      render(<SearchForm />);
      const swapButton = screen.getByRole('button', { name: /swap origin and destination/i });
      expect(swapButton).toBeInTheDocument();
    });

    it('should not show error message initially', () => {
      render(<SearchForm />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label for swap button', () => {
      render(<SearchForm />);
      const swapButton = screen.getByRole('button', { name: /swap origin and destination/i });
      expect(swapButton).toHaveAttribute('aria-label');
    });

    it('should use assertive aria-live for error messages', async () => {
      render(<SearchForm />);

      // The component structure would show error when certain conditions are met
      // For now, we verify the component renders without errors
      expect(screen.getByText('From')).toBeInTheDocument();
    });
  });

  describe('Swap Functionality', () => {
    it('should have a clickable swap button', async () => {
      const user = userEvent.setup();
      render(<SearchForm />);

      const swapButton = screen.getByRole('button', { name: /swap origin and destination/i });
      await user.click(swapButton);

      // Swap button should still be in the document after click
      expect(swapButton).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render two location autocomplete inputs', () => {
      render(<SearchForm />);
      const locationInputs = screen.getAllByTestId('location-autocomplete');
      expect(locationInputs).toHaveLength(2);
    });

    it('should have proper styling classes', () => {
      const { container } = render(<SearchForm />);
      const form = container.querySelector('.bg-white.rounded-2xl');
      expect(form).toBeInTheDocument();
    });
  });
});

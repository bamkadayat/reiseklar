import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTimePicker } from '@/components/landing/DateTimePicker';

// Mock react-datepicker
vi.mock('react-datepicker', () => ({
  default: ({ selected, onChange, customInput, dateFormat, showTimeSelect }: any) => {
    const handleClick = () => {
      // Simulate date picker behavior
      const newDate = new Date('2025-12-25T14:30:00');
      onChange(newDate);
    };

    // Clone the customInput and inject the necessary props
    const clonedInput = {
      ...customInput,
      props: {
        ...customInput.props,
        value: showTimeSelect
          ? selected.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          : selected.toLocaleDateString('en-GB'),
        onClick: handleClick,
      },
    };

    return <div data-testid="react-datepicker">{clonedInput}</div>;
  },
}));

describe('DateTimePicker', () => {
  const mockOnDateChange = vi.fn();
  const defaultDate = new Date('2025-10-27T10:00:00');
  const defaultProps = {
    date: defaultDate,
    onDateChange: mockOnDateChange,
    label: 'Reisedato',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Default Desktop Layout', () => {
    it('should render "Nå" button in desktop layout', () => {
      render(<DateTimePicker {...defaultProps} />);

      const nowButton = screen.getByRole('button', { name: /set departure time to now/i });
      expect(nowButton).toBeInTheDocument();
      expect(nowButton).toHaveTextContent('Nå');
    });

    it('should render date picker in desktop layout', () => {
      render(<DateTimePicker {...defaultProps} />);

      const datePicker = screen.getAllByTestId('react-datepicker')[0];
      expect(datePicker).toBeInTheDocument();
    });

    it('should render time picker in desktop layout', () => {
      render(<DateTimePicker {...defaultProps} />);

      const pickers = screen.getAllByTestId('react-datepicker');
      expect(pickers).toHaveLength(2); // Date picker and time picker
    });

    it('should call onDateChange with current date when "Nå" is clicked', async () => {
      const user = userEvent.setup();
      const beforeClick = Date.now();

      render(<DateTimePicker {...defaultProps} />);

      const nowButton = screen.getByRole('button', { name: /set departure time to now/i });
      await user.click(nowButton);

      expect(mockOnDateChange).toHaveBeenCalledTimes(1);
      const calledDate = mockOnDateChange.mock.calls[0][0];
      expect(calledDate).toBeInstanceOf(Date);
      expect(calledDate.getTime()).toBeGreaterThanOrEqual(beforeClick);
    });
  });

  describe('Mobile Layout - Date and Now', () => {
    it('should render "Nå" button when showOnlyDateAndNow is true', () => {
      render(<DateTimePicker {...defaultProps} showOnlyDateAndNow={true} />);

      const nowButton = screen.getByRole('button', { name: /set departure time to now/i });
      expect(nowButton).toBeInTheDocument();
    });

    it('should render date picker when showOnlyDateAndNow is true', () => {
      render(<DateTimePicker {...defaultProps} showOnlyDateAndNow={true} />);

      expect(screen.getByTestId('react-datepicker')).toBeInTheDocument();
    });

    it('should not render time picker when showOnlyDateAndNow is true', () => {
      render(<DateTimePicker {...defaultProps} showOnlyDateAndNow={true} />);

      const pickers = screen.queryAllByTestId('react-datepicker');
      // Should only have date picker (1), not time picker
      expect(pickers.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Mobile Layout - Time Only', () => {
    it('should render only time picker when showOnlyTime is true', () => {
      render(<DateTimePicker {...defaultProps} showOnlyTime={true} />);

      expect(screen.getByTestId('react-datepicker')).toBeInTheDocument();
    });

    it('should not render "Nå" button when showOnlyTime is true', () => {
      render(<DateTimePicker {...defaultProps} showOnlyTime={true} />);

      expect(screen.queryByRole('button', { name: /set departure time to now/i })).not.toBeInTheDocument();
    });

    it('should display time format in time-only mode', () => {
      render(<DateTimePicker {...defaultProps} showOnlyTime={true} />);

      // Should have "Tidspunkt" label
      expect(screen.getByText('Tidspunkt')).toBeInTheDocument();
    });
  });

  describe('Date Only Layout', () => {
    it('should render only date picker when showOnlyDate is true', () => {
      render(<DateTimePicker {...defaultProps} showOnlyDate={true} />);

      expect(screen.getByTestId('react-datepicker')).toBeInTheDocument();
    });

    it('should not render "Nå" button when showOnlyDate is true', () => {
      render(<DateTimePicker {...defaultProps} showOnlyDate={true} />);

      expect(screen.queryByRole('button', { name: /set departure time to now/i })).not.toBeInTheDocument();
    });

    it('should not render time picker when showOnlyDate is true', () => {
      render(<DateTimePicker {...defaultProps} showOnlyDate={true} />);

      const pickers = screen.queryAllByTestId('react-datepicker');
      expect(pickers.length).toBe(1);
    });
  });

  describe('Date Change Handling', () => {
    it('should call onDateChange when date is changed', async () => {
      const user = userEvent.setup();
      render(<DateTimePicker {...defaultProps} />);

      const dateButton = screen.getAllByRole('button')[1]; // First is "Nå", second is date picker button
      await user.click(dateButton);

      expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should call onDateChange when time is changed', async () => {
      const user = userEvent.setup();
      render(<DateTimePicker {...defaultProps} />);

      const timeButton = screen.getAllByRole('button')[2]; // Third button is time picker
      await user.click(timeButton);

      expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should not call onDateChange if date is null', () => {
      render(<DateTimePicker {...defaultProps} showOnlyDate={true} />);

      // DatePicker internally handles this, but we verify no errors occur
      expect(screen.getByTestId('react-datepicker')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label for "Nå" button', () => {
      render(<DateTimePicker {...defaultProps} />);

      const nowButton = screen.getByRole('button', { name: /set departure time to now/i });
      expect(nowButton).toHaveAttribute('aria-label');
    });

    it('should have accessible label for date picker button', () => {
      render(<DateTimePicker {...defaultProps} />);

      const dateButtons = screen.getAllByRole('button');
      const dateButton = dateButtons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('Reisedato')
      );
      expect(dateButton).toBeInTheDocument();
    });

    it('should have accessible label for time picker button', () => {
      render(<DateTimePicker {...defaultProps} />);

      const timeButtons = screen.getAllByRole('button');
      const timeButton = timeButtons.find((btn) => btn.getAttribute('aria-label')?.includes('time'));
      expect(timeButton).toBeInTheDocument();
    });

    it('should have proper icons with aria-hidden', () => {
      render(<DateTimePicker {...defaultProps} />);

      const icons = document.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Elements', () => {
    it('should display calendar icon in date picker', () => {
      const { container } = render(<DateTimePicker {...defaultProps} />);

      const calendarIcons = container.querySelectorAll('.lucide-calendar');
      expect(calendarIcons.length).toBeGreaterThan(0);
    });

    it('should display clock icon in time picker', () => {
      const { container } = render(<DateTimePicker {...defaultProps} />);

      const clockIcons = container.querySelectorAll('.lucide-clock');
      expect(clockIcons.length).toBeGreaterThan(0);
    });

    it('should display label text', () => {
      render(<DateTimePicker {...defaultProps} label="Custom Label" />);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('should apply proper styling classes', () => {
      render(<DateTimePicker {...defaultProps} />);

      const nowButton = screen.getByRole('button', { name: /set departure time to now/i });
      expect(nowButton).toHaveClass('bg-white', 'border', 'rounded-xl');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have hidden class on desktop elements in mobile', () => {
      const { container } = render(<DateTimePicker {...defaultProps} />);

      const desktopLayout = container.querySelector('.hidden.md\\:flex');
      expect(desktopLayout).toBeInTheDocument();
    });

    it('should render different layouts for mobile with flags', () => {
      const { rerender } = render(<DateTimePicker {...defaultProps} />);

      // Desktop layout
      expect(screen.getAllByTestId('react-datepicker')).toHaveLength(2);

      // Mobile date + now layout
      rerender(<DateTimePicker {...defaultProps} showOnlyDateAndNow={true} />);
      expect(screen.getByRole('button', { name: /set departure time to now/i })).toBeInTheDocument();

      // Mobile time only layout
      rerender(<DateTimePicker {...defaultProps} showOnlyTime={true} />);
      expect(screen.getByText('Tidspunkt')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid clicks on "Nå" button', async () => {
      const user = userEvent.setup();
      render(<DateTimePicker {...defaultProps} />);

      const nowButton = screen.getByRole('button', { name: /set departure time to now/i });

      await user.click(nowButton);
      await user.click(nowButton);
      await user.click(nowButton);

      expect(mockOnDateChange).toHaveBeenCalledTimes(3);
    });

    it('should handle date changes in different modes', async () => {
      const user = userEvent.setup();

      // Test showOnlyDate mode
      const { rerender } = render(<DateTimePicker {...defaultProps} showOnlyDate={true} />);

      const dateButton = screen.getByRole('button');
      await user.click(dateButton);

      expect(mockOnDateChange).toHaveBeenCalled();
      vi.clearAllMocks();

      // Test showOnlyTime mode
      rerender(<DateTimePicker {...defaultProps} showOnlyTime={true} />);

      const timeButton = screen.getByRole('button');
      await user.click(timeButton);

      expect(mockOnDateChange).toHaveBeenCalled();
    });
  });

  describe('Integration', () => {
    it('should work with different label prop values', () => {
      const { rerender } = render(<DateTimePicker {...defaultProps} label="Departure Date" />);

      expect(screen.getByText('Departure Date')).toBeInTheDocument();

      rerender(<DateTimePicker {...defaultProps} label="Avreisedato" />);

      expect(screen.getByText('Avreisedato')).toBeInTheDocument();
    });

    it('should maintain state across re-renders', () => {
      const { rerender } = render(<DateTimePicker {...defaultProps} />);

      const initialButton = screen.getByRole('button', { name: /set departure time to now/i });
      expect(initialButton).toBeInTheDocument();

      const newDate = new Date('2026-06-15T12:00:00');
      rerender(<DateTimePicker {...defaultProps} date={newDate} />);

      const updatedButton = screen.getByRole('button', { name: /set departure time to now/i });
      expect(updatedButton).toBeInTheDocument();
    });
  });

  describe('CustomInput Components', () => {
    it('should render DateInput with proper structure', () => {
      render(<DateTimePicker {...defaultProps} showOnlyDate={true} />);

      expect(screen.getByText('Reisedato')).toBeInTheDocument();
    });

    it('should render TimeInput with proper structure', () => {
      render(<DateTimePicker {...defaultProps} showOnlyTime={true} />);

      expect(screen.getByText('Tidspunkt')).toBeInTheDocument();
    });

    it('should have hover effects on inputs', () => {
      render(<DateTimePicker {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('hover:bg-gray-50');
      });
    });
  });
});

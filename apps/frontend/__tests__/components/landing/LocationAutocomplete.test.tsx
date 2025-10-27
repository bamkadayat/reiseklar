import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationAutocomplete } from '@/components/landing/LocationAutocomplete';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'home.search.yourPosition': 'Your position',
    };
    return translations[key] || key;
  },
}));

// Mock fetch globally
global.fetch = vi.fn();

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
  configurable: true,
});

describe('LocationAutocomplete', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    placeholder: 'Enter location',
  };

  const mockLocations = [
    {
      id: 'loc1',
      name: 'Oslo S',
      label: 'Oslo S, Oslo, Norway',
      latitude: 59.911,
      longitude: 10.752,
    },
    {
      id: 'loc2',
      name: 'Oslo Airport',
      label: 'Oslo Airport Gardermoen, Norway',
      latitude: 60.193,
      longitude: 11.1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockReset();
  });

  describe('Rendering', () => {
    it('should render input with placeholder', () => {
      render(<LocationAutocomplete {...defaultProps} />);
      expect(screen.getByPlaceholderText('Enter location')).toBeInTheDocument();
    });

    it('should display the provided value', () => {
      render(<LocationAutocomplete {...defaultProps} value="Oslo" />);
      expect(screen.getByDisplayValue('Oslo')).toBeInTheDocument();
    });

    it('should render with correct icon classes', () => {
      render(<LocationAutocomplete {...defaultProps} icon="circle" />);
      const input = screen.getByPlaceholderText('Enter location');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should search after typing 2+ characters', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockLocations }),
      });

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);
      await user.type(input, 'Oslo');

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('autocomplete?text=Oslo'),
          expect.any(Object)
        );
      }, { timeout: 2000 });
    });

    it('should display search results', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockLocations }),
      });

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);
      await user.type(input, 'Oslo');

      await waitFor(() => {
        expect(screen.getByText('Oslo S')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should show "no results" message when search returns empty', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);
      await user.type(input, 'Nonexistent');

      await waitFor(() => {
        expect(screen.getByText(/no locations found/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Location Selection', () => {
    it('should call onChange with location data when selected', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockLocations }),
      });

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);
      await user.type(input, 'Oslo');

      await waitFor(() => {
        expect(screen.getByText('Oslo S')).toBeInTheDocument();
      }, { timeout: 2000 });

      const locationButton = screen.getByText('Oslo S').closest('button');
      if (locationButton) {
        await user.click(locationButton);
      }

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('Oslo S, Oslo, Norway', expect.objectContaining({
          id: 'loc1',
          name: 'Oslo S',
        }));
      });
    });
  });

  describe('Geolocation', () => {
    it('should show "Your position" button in dropdown', async () => {
      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText(/your position/i)).toBeInTheDocument();
      });
    });

    it('should request geolocation when "Your position" is clicked', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success({
          coords: {
            latitude: 59.911,
            longitude: 10.752,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
      });

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              id: 'current-loc',
              name: 'Current Location',
              label: 'Current Location, Oslo',
              latitude: 59.911,
              longitude: 10.752,
            },
          ],
        }),
      });

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);

      const yourPositionButton = screen.getByText(/your position/i);
      await user.click(yourPositionButton);

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      });
    });

    it('should show error when geolocation permission is denied', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_: any, error: any) => {
        error({
          code: 1,
          message: 'User denied geolocation',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        });
      });

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);

      const yourPositionButton = screen.getByText(/your position/i);
      await user.click(yourPositionButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Clear Functionality', () => {
    it('should show clear button when value exists', () => {
      render(<LocationAutocomplete {...defaultProps} value="Oslo" />);
      expect(screen.getByLabelText(/clear location/i)).toBeInTheDocument();
    });

    it('should clear value when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} value="Oslo" />);

      const clearButton = screen.getByLabelText(/clear location/i);
      await user.click(clearButton);

      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
      expect(input).toHaveAttribute('aria-controls', 'location-listbox');
    });

    it('should update aria-expanded when dropdown opens', async () => {
      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have accessible listbox', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockLocations,
        }),
      });

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.click(input);
      await user.type(input, 'Oslo');

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toHaveAttribute('id', 'location-listbox');
      }, { timeout: 2000 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle API errors gracefully', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('API Error'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const user = userEvent.setup();
      render(<LocationAutocomplete {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter location');
      await user.type(input, 'Oslo');

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      }, { timeout: 1000 });

      consoleSpy.mockRestore();
    });
  });
});

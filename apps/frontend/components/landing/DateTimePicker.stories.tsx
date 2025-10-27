import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';
import { DateTimePicker } from './DateTimePicker';

const meta = {
  title: 'Forms/DateTimePicker',
  component: DateTimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    date: {
      control: 'date',
      description: 'The selected date and time',
    },
    label: {
      control: 'text',
      description: 'Label for the date picker',
    },
    showOnlyDateAndNow: {
      control: 'boolean',
      description: 'Mobile layout: Show only date picker and "Nå" button',
    },
    showOnlyTime: {
      control: 'boolean',
      description: 'Mobile layout: Show only time picker',
    },
    showOnlyDate: {
      control: 'boolean',
      description: 'Show only date picker without "Nå" button',
    },
  },
  args: {
    onDateChange: fn(),
    date: new Date(),
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLayout: Story = {
  args: {
    label: 'Reisedato',
  },
  parameters: {
    docs: {
      description: {
        story: 'Desktop layout with "Nå" button, date picker, and time picker in a single row.',
      },
    },
  },
};

export const MobileDateAndNow: Story = {
  args: {
    label: 'Reisedato',
    showOnlyDateAndNow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile layout showing "Nå" button and date picker side by side.',
      },
    },
  },
};

export const MobileTimeOnly: Story = {
  args: {
    label: 'Tidspunkt',
    showOnlyTime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile layout showing only the time picker.',
      },
    },
  },
};

export const DateOnly: Story = {
  args: {
    label: 'Velg dato',
    showOnlyDate: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows only the date picker without the "Nå" button or time picker.',
      },
    },
  },
};

export const CustomDate: Story = {
  args: {
    label: 'Departure',
    date: new Date('2025-12-25T14:30:00'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Date picker with a custom initial date (Christmas 2025).',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  args: {
    date: new Date(),
    onDateChange: fn(),
    label: 'Reisedato',
  },
  render: () => {
    const date = new Date();
    const onChange = fn();

    return (
      <div className="space-y-8 w-full max-w-4xl">
        <div>
          <h3 className="text-lg font-semibold mb-4">Desktop Layout (Full)</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <DateTimePicker
              date={date}
              onDateChange={onChange}
              label="Reisedato"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Mobile Layouts</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Date + Now Button:</p>
              <div className="grid grid-cols-2 gap-3 h-14">
                <DateTimePicker
                  date={date}
                  onDateChange={onChange}
                  label="Reisedato"
                  showOnlyDateAndNow={true}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Time Only:</p>
              <div className="grid grid-cols-2 gap-3 h-14">
                <DateTimePicker
                  date={date}
                  onDateChange={onChange}
                  label="Tidspunkt"
                  showOnlyTime={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all DateTimePicker layouts: desktop full layout and mobile variants.',
      },
    },
  },
};

export const Accessibility: Story = {
  args: {
    label: 'Reisedato',
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:
- **ARIA Labels**: All buttons have descriptive aria-labels
- **Keyboard Navigation**: Full keyboard support via react-datepicker
- **Icons**: Icons are marked as aria-hidden="true"
- **Visual Focus**: Clear focus indicators on all interactive elements
- **Screen Reader Friendly**: Labels describe both the field and current value
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
};

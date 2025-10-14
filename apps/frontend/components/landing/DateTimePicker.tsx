"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { forwardRef } from "react";

interface DateTimePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label: string;
  showOnlyDateAndNow?: boolean;
  showOnlyTime?: boolean;
}

// Custom input component for DatePicker
const DateInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; label: string }
>(({ value, onClick, label }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors"
  >
    <CalendarIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
    <div className="flex flex-col items-start">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-base text-gray-900 font-medium">{value}</span>
    </div>
  </button>
));
DateInput.displayName = "DateInput";

// Custom input component for TimePicker
const TimeInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void }
>(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors"
  >
    <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
    <div className="flex flex-col items-start">
      <span className="text-xs text-gray-500">Tidspunkt</span>
      <span className="text-base text-gray-900 font-medium">{value}</span>
    </div>
  </button>
));
TimeInput.displayName = "TimeInput";

export function DateTimePicker({
  date,
  onDateChange,
  label,
  showOnlyDateAndNow = false,
  showOnlyTime = false,
}: DateTimePickerProps) {
  const handleNowClick = () => {
    onDateChange(new Date());
  };

  // Mobile specific layouts
  if (showOnlyDateAndNow) {
    return (
      <>
        <button
          type="button"
          onClick={handleNowClick}
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm">Nå</span>
        </button>

        <DatePicker
          selected={date}
          onChange={(newDate) => {
            if (newDate) {
              onDateChange(newDate);
            }
          }}
          dateFormat="dd.MM.yyyy"
          minDate={new Date()}
          customInput={<DateInput label={label} />}
          calendarClassName="shadow-lg border border-gray-200"
        />
      </>
    );
  }

  if (showOnlyTime) {
    return (
      <DatePicker
        selected={date}
        onChange={(newDate) => {
          if (newDate) {
            onDateChange(newDate);
          }
        }}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={1}
        timeCaption="Tid"
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        customInput={<TimeInput />}
        calendarClassName="shadow-lg border border-gray-200"
      />
    );
  }

  return (
    <>
      {/* Desktop Layout: Nå, Date, and Time in same row */}
      <div className="hidden md:flex gap-3">
        {/* Now button */}
        <button
          type="button"
          onClick={handleNowClick}
          className="w-24 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 px-4 py-3"
        >
          <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <span className="text-base">Nå</span>
        </button>

        {/* Date Picker */}
        <div className="flex-1">
          <DatePicker
            selected={date}
            onChange={(newDate) => {
              if (newDate) {
                onDateChange(newDate);
              }
            }}
            dateFormat="dd.MM.yyyy"
            minDate={new Date()}
            customInput={<DateInput label={label} />}
            calendarClassName="shadow-lg border border-gray-200"
          />
        </div>

        {/* Time Picker */}
        <div className="flex-1">
          <DatePicker
            selected={date}
            onChange={(newDate) => {
              if (newDate) {
                onDateChange(newDate);
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            timeCaption="Tid"
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            customInput={<TimeInput />}
            calendarClassName="shadow-lg border border-gray-200"
          />
        </div>
      </div>
    </>
  );
}

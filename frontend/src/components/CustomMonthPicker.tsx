import React, { useState, useRef, useEffect } from 'react';

/**
 * Custom Month Picker Component
 * 
 * A fully customizable month-year picker that replaces the native HTML month input.
 * Provides complete control over styling to match dark/light themes.
 * 
 * Features:
 * - Input field for direct typing with auto-completion
 * - Dropdown interface with year and month selectors
 * - Tab-based auto-completion for months and years
 * - Dark/light mode theming
 * - Click outside to close functionality
 * - Smooth animations and transitions
 * - Accessible design with proper labels and focus states
 */

interface CustomMonthPickerProps {
  value: string; // Format: "YYYY-MM" (e.g., "2024-03")
  onChange: (value: string) => void; // Callback function when date changes
  isDarkMode?: boolean; // Dark mode flag for theming
  id?: string; // HTML id attribute
  name?: string; // HTML name attribute
}

const CustomMonthPicker: React.FC<CustomMonthPickerProps> = ({
  value,
  onChange,
  isDarkMode = false,
  id,
  name
}) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  
  // Parse current value to get selected year and month
  const [selectedYear, setSelectedYear] = useState(() => {
    return value ? parseInt(value.split('-')[0]) : new Date().getFullYear();
  });
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return value ? parseInt(value.split('-')[1]) - 1 : new Date().getMonth();
  });
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state when value prop changes
  useEffect(() => {
    if (value) {
      const [year, month] = value.split('-');
      setSelectedYear(parseInt(year));
      setSelectedMonth(parseInt(month) - 1);
    }
  }, [value]);

  // Constants
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 9 }, (_, i) => currentYear - 5 + i);

  /**
   * Handle click outside dropdown to close it
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Update the selected date and call onChange
   */
  const updateDate = (month: number, year: number) => {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const yearStr = year.toString();
    const result = `${yearStr}-${monthStr}`;
    onChange(result);
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  /**
   * Filter months based on input text
   */
  const getFilteredMonths = () => {
    // If user is not actively typing, show all months
    if (!isUserTyping) {
      return months;
    }
    if (!inputValue) return months;
    return months.filter(month => 
      month.toLowerCase().startsWith(inputValue.toLowerCase())
    );
  };

  /**
   * Filter years based on input text
   */
  const getFilteredYears = () => {
    // If user is not actively typing, show all years
    if (!isUserTyping) {
      return years;
    }
    if (!inputValue) return years;
    return years.filter(year => 
      year.toString().startsWith(inputValue)
    );
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsUserTyping(true);
    
    // Clear selection if input is empty
    if (!value.trim()) {
      onChange('');
      setSelectedMonth(new Date().getMonth());
      setSelectedYear(new Date().getFullYear());
      setIsOpen(false);
      setIsUserTyping(false);
      return;
    }

    setIsOpen(true);
  };

  /**
   * Handle input focus
   */
  const handleInputFocus = () => {
    setIsOpen(true);
    if (value && !inputValue) {
      setInputValue(formatDisplayValue());
    }
  };

  /**
   * Handle input blur
   */
  const handleInputBlur = () => {
    setTimeout(() => {
      if (inputValue && !value) {
        setInputValue('');
      }
    }, 150);
  };

  /**
   * Handle tab key for auto-completion
   */
  const handleTabCompletion = (currentValue: string) => {
    // Try to auto-complete month
    const filteredMonths = months.filter(month => 
      month.toLowerCase().startsWith(currentValue.toLowerCase())
    );
    
    // Try to auto-complete year
    let filteredYears: number[] = [];
    if (/^\d+$/.test(currentValue)) {
      // Pure year input
      filteredYears = years.filter(year => 
        year.toString().startsWith(currentValue)
      );
    } else {
      // Mixed input with year pattern
      const yearMatch = currentValue.match(/\d+/);
      if (yearMatch) {
        const yearInput = yearMatch[0];
        filteredYears = years.filter(year => 
          year.toString().startsWith(yearInput)
        );
      }
    }
    
    // Auto-complete month
    if (filteredMonths.length === 1) {
      const matchedMonth = filteredMonths[0];
      const monthIndex = months.indexOf(matchedMonth);
      updateDate(monthIndex, selectedYear);
      setInputValue(matchedMonth + ' ');
      setIsOpen(false);
      return true;
    }
    
    // Auto-complete year
    if (filteredYears.length === 1) {
      const year = filteredYears[0];
      updateDate(selectedMonth, year);
      
      if (/^\d+$/.test(currentValue)) {
        setInputValue(year.toString());
      } else {
        setInputValue(currentValue.replace(/\d+/, year.toString()));
      }
      setIsOpen(false);
      return true;
    }
    
    // Auto-complete current year for month with space
    const monthWithSpace = months.find(month => 
      currentValue.toLowerCase().startsWith(month.toLowerCase() + ' ')
    );
    
    if (monthWithSpace && !currentValue.match(/\d+/)) {
      const monthIndex = months.indexOf(monthWithSpace);
      updateDate(monthIndex, currentYear);
      setInputValue(monthWithSpace + ' ' + currentYear);
      setIsOpen(false);
      return true;
    }
    
    return false;
  };

  /**
   * Handle key down events
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const completed = handleTabCompletion(e.currentTarget.value);
      if (!completed) {
        // Keep dropdown open if no completion was made
        return;
      }
    }
    
    if (e.key === 'Escape') {
      setIsOpen(false);
      setInputValue('');
    }
    
    if (e.key === 'ArrowDown') {
      setIsOpen(true);
    }
  };

  /**
   * Handle dropdown button click
   */
  const handleDropdownClick = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setIsUserTyping(false);
    
    // When opening the dropdown, clear inputValue to show all options
    if (newIsOpen) {
      setInputValue('');
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Handle month selection from dropdown
   */
  const handleMonthSelect = (monthIndex: number) => {
    updateDate(monthIndex, selectedYear);
    setInputValue('');
  };

  /**
   * Handle year selection from dropdown
   */
  const handleYearSelect = (year: number) => {
    updateDate(selectedMonth, year);
    setInputValue('');
  };

  /**
   * Handle clearing the input
   */
  const handleClear = () => {
    setInputValue('');
    onChange('');
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Format the current value for display
   */
  const formatDisplayValue = () => {
    if (!value) return '';
    const [year, month] = value.split('-');
    const monthIndex = parseInt(month) - 1;
    return `${months[monthIndex]} ${year}`;
  };

  /**
   * Get the display value for the input
   */
  const getDisplayValue = () => {
    if (inputValue) return inputValue;
    if (value) return formatDisplayValue();
    return '';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder="Type month or year, or click dropdown..."
          className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 pr-16 border-1 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
            isDarkMode
              ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
              : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
          }`}
          id={id}
          name={name}
        />
        
        {/* Clear button */}
        {(inputValue || value) && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-8 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'text-green-400 hover:bg-gray-800 hover:text-green-300' 
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title="Clear selection"
          >
            <svg 
              className="w-5 h-5"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Dropdown arrow */}
        <button
          type="button"
          onClick={handleDropdownClick}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded transition-colors ${
            isDarkMode 
              ? 'text-green-400 hover:bg-gray-800' 
              : 'text-slate-400 hover:bg-slate-100'
          }`}
        >
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={`absolute z-50 w-full mt-1 border rounded-lg shadow-lg ${
          isDarkMode 
            ? 'bg-gray-900 border-green-500' 
            : 'bg-white border-slate-300'
        }`}>
          
          {/* Year selector */}
          <div className={`p-3 border-b ${
            isDarkMode ? 'border-green-700' : 'border-slate-200'
          }`}>
            <div className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              Year
            </div>
            
            <div className="flex flex-wrap gap-1">
              {getFilteredYears().map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    selectedYear === year
                      ? isDarkMode
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-100 text-slate-700'
                      : isDarkMode
                        ? 'text-green-100 hover:bg-gray-800'
                        : 'text-slate-700 hover:bg-blue-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Month selector */}
          <div className="p-3">
            <div className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              Month
            </div>
            
            <div className="grid grid-cols-3 gap-1">
              {getFilteredMonths().map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    selectedMonth === index
                      ? isDarkMode
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-100 text-slate-700'
                      : isDarkMode
                        ? 'text-green-100 hover:bg-gray-800'
                        : 'text-slate-700 hover:bg-blue-200'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMonthPicker; 
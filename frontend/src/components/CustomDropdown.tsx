import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom Dropdown Component
 * 
 * A fully customizable dropdown that replaces native HTML select elements.
 * Provides complete control over styling to match dark/light themes.
 * 
 * Features:
 * - Custom styling that matches the design system
 * - Dark/light mode theming
 * - Click outside to close functionality
 * - Smooth animations and transitions
 * - Accessible design with proper labels and focus states
 * - Search/filter functionality
 * - Keyboard navigation support
 */

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  isDarkMode?: boolean;
  id?: string;
  name?: string;
  label?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
  // Styling props
  borderColor?: string;
  borderFocusColor?: string;
  backgroundColor?: string;
  textColor?: string;
  placeholderColor?: string;
  padding?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  isDarkMode = false,
  id,
  name,
  label,
  disabled = false,
  searchable = false,
  className = "",
  // Default styling props
  borderColor = isDarkMode ? 'border-green-500' : 'border-slate-300',
  borderFocusColor = isDarkMode ? 'focus:border-green-400' : 'focus:border-blue-500',
  backgroundColor = isDarkMode ? 'bg-gray-800' : 'bg-white',
  textColor = isDarkMode ? 'text-green-100' : 'text-slate-800',
  placeholderColor = isDarkMode ? 'placeholder-green-300' : 'placeholder-slate-500',
  padding = 'px-3 sm:px-4 py-2 sm:py-3'
}) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Get the selected option label
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption && value !== '' ? selectedOption.label : '';

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !option.disabled
      )
    : options.filter(option => !option.disabled);

  /**
   * Handle option selection
   */
  const handleOptionSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  }, [onChange]);

  /**
   * Handle click outside dropdown to close it
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionSelect(filteredOptions[highlightedIndex].value);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, highlightedIndex, handleOptionSelect]);

  /**
   * Handle dropdown toggle
   */
  const handleDropdownToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  /**
   * Handle search input focus
   */
  const handleSearchFocus = () => {
    setIsOpen(true);
  };

  /**
   * Handle search input blur
   */
  const handleSearchBlur = () => {
    // Small delay to allow option clicks to register
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    }, 150);
  };

  /**
   * Scroll highlighted option into view
   */
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium mb-2 font-mono ${
          isDarkMode ? 'text-green-300' : 'text-slate-700'
        }`}>
          {label}
        </label>
      )}

      {/* Main input field */}
      <div className={`relative ${className}`}>
        {searchable ? (
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : displayValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            className={`w-full ${padding} rounded-lg border transition-all duration-300 font-mono text-xs sm:text-sm ${
              disabled
                ? isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                : `${backgroundColor} ${borderColor} ${textColor} ${placeholderColor} ${borderFocusColor} focus:ring-2 ${isDarkMode ? 'focus:ring-green-400' : 'focus:ring-blue-400'}`
            }`}
            id={id}
            name={name}
          />
        ) : (
          <button
            type="button"
            onClick={handleDropdownToggle}
            disabled={disabled}
            className={`w-full ${padding} rounded-lg border transition-all duration-300 font-mono text-xs sm:text-sm text-left pr-10 ${
              disabled
                ? isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                : `${backgroundColor} ${borderColor} ${isDarkMode ? 'hover:border-green-400' : 'hover:border-blue-400'} ${borderFocusColor} focus:ring-2 ${isDarkMode ? 'focus:ring-green-400' : 'focus:ring-blue-400'}`
            }`}
            id={id}
          >
            <span className={`truncate block ${!displayValue ? (isDarkMode ? 'text-green-300' : 'text-slate-500') : textColor}`}>
              {displayValue || placeholder}
            </span>
          </button>
        )}
        
        {/* Dropdown arrow */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <button
            type="button"
            onClick={handleDropdownToggle}
            disabled={disabled}
            className={`p-2 rounded transition-colors flex items-center justify-center ${
              disabled
                ? isDarkMode
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-400 cursor-not-allowed'
                : isDarkMode 
                  ? 'text-green-400 hover:bg-gray-700' 
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
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={`absolute z-[9999] w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-900 border-green-500' 
            : 'bg-white border-slate-300'
        }`}>
          
          {/* Options list */}
          <div 
            ref={optionsRef}
            className="overflow-y-auto max-h-60"
          >
            {filteredOptions.length === 0 ? (
              <div className={`px-3 py-2 text-xs sm:text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
                  disabled={option.disabled}
                  className={`w-full ${padding} text-left text-xs sm:text-sm font-mono transition-colors ${
                    option.disabled
                      ? isDarkMode
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-gray-400 cursor-not-allowed'
                      : index === highlightedIndex
                        ? isDarkMode
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white'
                        : isDarkMode
                          ? 'text-green-400 hover:bg-gray-800'
                          : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 
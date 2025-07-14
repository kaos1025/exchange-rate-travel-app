import React, { useState } from 'react';

export function Select({ children, value, onValueChange, ...props }) {
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { value, onValueChange, ...props });
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({ children, value, onValueChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {React.Children.map(children, child => {
            if (child.type === SelectContent) {
              return React.cloneElement(child, { 
                value, 
                onValueChange: (newValue) => {
                  onValueChange(newValue);
                  setIsOpen(false);
                },
                onClose: () => setIsOpen(false)
              });
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children, value, onValueChange }) {
  return (
    <div className="max-h-60 overflow-auto py-1">
      {React.Children.map(children, child => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, { 
            value, 
            onValueChange,
            isSelected: child.props.value === value
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectItem({ children, value: itemValue, onValueChange, isSelected }) {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center py-2 px-3 text-sm hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-900' : ''}`}
      onClick={() => onValueChange(itemValue)}
    >
      {children}
    </div>
  );
}
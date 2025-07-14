import React from 'react';

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '',
  disabled = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  };
  
  const sizes = {
    default: 'h-9 py-2 px-4',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-10 px-8',
    icon: 'h-9 w-9'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
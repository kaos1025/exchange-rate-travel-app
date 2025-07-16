import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {currentYear} ExchangeAlert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
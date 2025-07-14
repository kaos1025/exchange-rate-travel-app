import React from 'react';

export function MinimalHeader() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900">Exchange</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Menu
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
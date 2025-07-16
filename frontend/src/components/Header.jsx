import React from 'react';
import { ThemeToggle } from './ui/ThemeToggle';

export function Header() {
  const navItems = [
    { href: '#rates', label: '환율' },
    { href: '#calculator', label: '계산기' },
    { href: '#alerts', label: '알림' },
    { href: '#about', label: '소개' }
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ExchangeAlert
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a
              href="#login"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              로그인
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
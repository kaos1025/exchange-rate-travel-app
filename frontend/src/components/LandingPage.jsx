import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { ExchangeRatesGrid } from './ExchangeRatesGrid';
import { Calculator } from './Calculator';
import { AlertSettings } from './AlertSettings';
import { Features } from './Features';
import { Footer } from './Footer';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastProvider } from './ui/Toast';

export function LandingPage() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Hero />
              <ExchangeRatesGrid />
              <Calculator />
              <AlertSettings />
              <Features />
            </div>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
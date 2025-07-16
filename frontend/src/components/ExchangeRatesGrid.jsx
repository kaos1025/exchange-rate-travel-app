import React, { useState, useEffect } from 'react';

export function ExchangeRatesGrid() {
  const [rates, setRates] = useState([
    {
      id: 1,
      currencyPair: 'USD/KRW',
      flag: '🇺🇸',
      rate: 1340.50,
      change: 12.30,
      changePercent: 0.93,
      isPositive: true
    },
    {
      id: 2,
      currencyPair: 'JPY/KRW',
      flag: '🇯🇵',
      rate: 8.94,
      change: -0.05,
      changePercent: -0.56,
      isPositive: false
    },
    {
      id: 3,
      currencyPair: 'EUR/KRW',
      flag: '🇪🇺',
      rate: 1456.78,
      change: 8.45,
      changePercent: 0.58,
      isPositive: true
    },
    {
      id: 4,
      currencyPair: 'CNY/KRW',
      flag: '🇨🇳',
      rate: 184.32,
      change: 2.15,
      changePercent: 1.18,
      isPositive: true
    }
  ]);

  return (
    <section id="rates" className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rates.map((rate) => (
          <div key={rate.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-gray-900 dark:text-white">
                {rate.currencyPair}
              </span>
              <span className="text-2xl">
                {rate.flag}
              </span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {rate.rate.toLocaleString()}
            </div>
            
            <div className={`text-sm font-medium ${
              rate.isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {rate.isPositive ? '+' : ''}{rate.change} ({rate.isPositive ? '+' : ''}{rate.changePercent}%)
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
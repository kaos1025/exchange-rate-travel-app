import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
          <Card key={rate.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {rate.currencyPair}
                </span>
                <span className="text-2xl">
                  {rate.flag}
                </span>
              </div>
              
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {rate.rate.toLocaleString()}
              </div>
              
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                rate.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {rate.isPositive ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>
                  {rate.isPositive ? '+' : ''}{rate.change}
                </span>
                <span>
                  ({rate.isPositive ? '+' : ''}{rate.changePercent}%)
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
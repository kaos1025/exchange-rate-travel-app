import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function ExchangeRateCard() {
  const [exchangeData, setExchangeData] = useState({
    rate: 1340.50,
    change: 0.75,
    changePercent: 0.056,
    isPositive: true
  });

  return (
    <Card className="max-w-md mx-auto animate-fade-in hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="text-center space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
              USD/KRW
            </h2>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 dark:text-gray-100 animate-scale-in">
              {exchangeData.rate.toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className={`flex items-center space-x-1 ${
              exchangeData.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {exchangeData.isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>
                {exchangeData.isPositive ? '+' : ''}{exchangeData.change}
              </span>
              <span>
                ({exchangeData.isPositive ? '+' : ''}{exchangeData.changePercent}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
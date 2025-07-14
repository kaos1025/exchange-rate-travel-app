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
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-gray-600 tracking-wide">
              USD/KRW
            </h2>
            <div className="text-5xl font-light text-gray-900">
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
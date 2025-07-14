import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { ArrowRight } from 'lucide-react';

export function CurrencyCalculator() {
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('134,050');
  const [exchangeRate] = useState(1340.50);

  const handleFromAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFromAmount(value);
    const converted = (parseFloat(value) || 0) * exchangeRate;
    setToAmount(converted.toLocaleString());
  };

  const handleToAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9,]/g, '').replace(/,/g, '');
    setToAmount(parseFloat(value).toLocaleString());
    const converted = (parseFloat(value) || 0) / exchangeRate;
    setFromAmount(converted.toFixed(2));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="flex items-center space-x-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              USD
            </label>
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              className="w-full text-2xl font-light border-0 bg-transparent focus:outline-none focus:ring-0 p-0 text-gray-900"
              placeholder="0"
            />
          </div>
          
          <div className="flex-shrink-0 pt-8">
            <ArrowRight className="text-gray-600" size={20} />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              KRW
            </label>
            <input
              type="text"
              value={toAmount}
              onChange={handleToAmountChange}
              className="w-full text-2xl font-light border-0 bg-transparent focus:outline-none focus:ring-0 p-0 text-gray-900"
              placeholder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
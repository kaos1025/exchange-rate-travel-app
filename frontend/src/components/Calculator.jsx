import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function Calculator() {
  const [fromAmount, setFromAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KRW');
  const [result, setResult] = useState('134,050');

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'KRW', name: 'Korean Won' }
  ];

  const handleCalculate = () => {
    // Mock calculation - in real app, this would call an API
    const rates = {
      'USD': { 'KRW': 1340.50, 'JPY': 149.8, 'EUR': 0.92, 'CNY': 7.25 },
      'JPY': { 'KRW': 8.94, 'USD': 0.0067, 'EUR': 0.0061, 'CNY': 0.048 },
      'EUR': { 'KRW': 1456.78, 'USD': 1.09, 'JPY': 163.4, 'CNY': 7.89 },
      'CNY': { 'KRW': 184.32, 'USD': 0.138, 'JPY': 20.7, 'EUR': 0.127 }
    };

    if (fromCurrency === toCurrency) {
      setResult(fromAmount);
    } else {
      const rate = rates[fromCurrency]?.[toCurrency] || 1;
      const calculatedResult = (parseFloat(fromAmount) * rate).toFixed(2);
      setResult(Number(calculatedResult).toLocaleString());
    }
  };

  return (
    <section id="calculator" className="mb-12">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
          환율 계산기
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="w-32 px-4 py-3 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="100"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <ArrowRight className="text-gray-400 dark:text-gray-500" size={24} />
          </div>
          
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={result}
              readOnly
              className="w-40 px-4 py-3 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
              placeholder="134,050"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <div className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            {fromAmount} {fromCurrency} = {result} {toCurrency}
          </div>
          
          <button
            onClick={handleCalculate}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            계산하기
          </button>
        </div>
      </div>
    </section>
  );
}
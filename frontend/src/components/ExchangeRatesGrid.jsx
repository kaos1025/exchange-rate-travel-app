import React, { useState, useEffect } from 'react';
import { useExchangeRates } from '../hooks/useApi';

export function ExchangeRatesGrid() {
  // API에서 실제 환율 데이터 가져오기
  const { data: apiRates, loading, error } = useExchangeRates();
  
  // 기본값 (API 실패 시 사용)
  const fallbackRates = [
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
  ];
  
  const [rates, setRates] = useState(fallbackRates);
  
  // API 데이터가 있으면 실제 환율로 업데이트
  useEffect(() => {
    if (apiRates && apiRates.rates) {
      console.log('✅ ExchangeRatesGrid - API 데이터로 업데이트:', apiRates);
      
      const targetCurrencies = ['USD', 'JPY', 'EUR', 'CNY'];
      const flags = { USD: '🇺🇸', JPY: '🇯🇵', EUR: '🇪🇺', CNY: '🇨🇳' };
      
      const updatedRates = targetCurrencies.map((currency, index) => {
        const rate = currency === 'USD' ? apiRates.rates.KRW : apiRates.rates.KRW / apiRates.rates[currency];
        
        return {
          id: index + 1,
          currencyPair: `${currency}/KRW`,
          flag: flags[currency],
          rate: parseFloat(rate.toFixed(2)),
          change: 0, // 변동폭 데이터가 없어서 0으로 설정
          changePercent: 0, // 변동률 데이터가 없어서 0으로 설정
          isPositive: true
        };
      });
      
      setRates(updatedRates);
    } else {
      console.log('❌ ExchangeRatesGrid - API 데이터 없음, fallback 사용');
    }
  }, [apiRates]);

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
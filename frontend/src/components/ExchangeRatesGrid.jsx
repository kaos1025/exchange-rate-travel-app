import React, { useState, useEffect } from 'react';
import { useExchangeRates } from '../hooks/useApi';

export function ExchangeRatesGrid() {
  // API에서 실제 환율 데이터 가져오기
  const { data: apiRates, loading, error } = useExchangeRates();
  
  // Fallback 데이터 제거됨 - 실제 API 데이터만 사용
  const [rates, setRates] = useState([]);
  
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
      console.log('❌ ExchangeRatesGrid - API 데이터 없음');
      setRates([]);
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
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

const POPULAR_PAIRS = [
  { from: 'USD', to: 'KRW', label: 'USD → KRW' },
  { from: 'EUR', to: 'KRW', label: 'EUR → KRW' },
  { from: 'JPY', to: 'KRW', label: 'JPY → KRW' },
  { from: 'GBP', to: 'KRW', label: 'GBP → KRW' },
  { from: 'CNY', to: 'KRW', label: 'CNY → KRW' }
];

export function ExchangeRateDisplay() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);

    try {
      // 실제 API 호출 (mock 데이터 제거)
      setError('환율 데이터를 사용할 수 없습니다. 실제 API를 연결해주세요.');
      setRates({});
      setLastUpdate(null);
    } catch (err) {
      setError('환율 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 300000); // 5분마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const formatRate = (rate, fromCurrency, toCurrency) => {
    if (fromCurrency === 'JPY' && toCurrency === 'KRW') {
      return (rate * 100).toFixed(2);
    }
    if (toCurrency === 'KRW') {
      return rate.toFixed(0);
    }
    return rate.toFixed(4);
  };

  const getRateDisplay = (fromCurrency, toCurrency) => {
    const fromRates = rates[fromCurrency];
    if (!fromRates || !fromRates.rates) return null;
    
    const rate = fromRates.rates[toCurrency];
    if (!rate) return null;

    return {
      rate: rate,
      formatted: formatRate(rate, fromCurrency, toCurrency)
    };
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold text-blue-900">💱 실시간 환율</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchRates}
          disabled={loading}
          className="border-blue-200 hover:bg-blue-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid gap-4">
          {POPULAR_PAIRS.map((pair, index) => {
            const rateInfo = getRateDisplay(pair.from, pair.to);
            const randomChange = (Math.random() - 0.5) * 2; // 임시 변화율
            const isPositive = randomChange > 0;
            
            return (
              <div 
                key={`${pair.from}-${pair.to}`}
                className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-all duration-200 border border-blue-100 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {pair.from}
                    </div>
                    <span className="text-blue-400">→</span>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {pair.to}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {rateInfo ? (
                    <>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="font-bold text-2xl text-gray-800">
                          {rateInfo.formatted}
                          {pair.to === 'KRW' && <span className="text-lg text-gray-600">원</span>}
                        </div>
                        {isPositive ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{randomChange.toFixed(2)}%
                        </span>
                        {pair.from === 'JPY' && pair.to === 'KRW' && (
                          <span className="text-xs text-gray-500 ml-2">
                            (100엔당)
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {lastUpdate && (
          <div className="mt-6 text-sm text-blue-600 text-center bg-blue-50 p-2 rounded-lg">
            🕐 마지막 업데이트: {lastUpdate.toLocaleString('ko-KR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
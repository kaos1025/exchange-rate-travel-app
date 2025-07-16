import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useCurrencyConverter, useExchangeRates } from '../hooks/useApi';
import { apiService } from '../services/api';

export function CurrencyCalculator() {
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KRW');
  const [isConverting, setIsConverting] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true);
  
  const { convert, result, loading, error } = useCurrencyConverter();
  const { data: exchangeRates } = useExchangeRates();

  // 임시 환율 데이터 (실제 API 연동 전까지 사용)
  const mockExchangeRates = {
    'USD-KRW': 1340.5,
    'KRW-USD': 1/1340.5,
    'USD-JPY': 150,
    'JPY-USD': 1/150,
    'USD-EUR': 0.85,
    'EUR-USD': 1/0.85,
    'USD-GBP': 0.79,
    'GBP-USD': 1/0.79,
    'KRW-JPY': 150/1340.5,
    'JPY-KRW': 1340.5/150,
    'EUR-KRW': 1340.5/0.85,
    'KRW-EUR': 0.85/1340.5,
    'GBP-KRW': 1340.5/0.79,
    'KRW-GBP': 0.79/1340.5,
    'EUR-JPY': 150/0.85,
    'JPY-EUR': 0.85/150,
    'GBP-JPY': 150/0.79,
    'JPY-GBP': 0.79/150,
    'EUR-GBP': 0.79/0.85,
    'GBP-EUR': 0.85/0.79
  };

  // 백엔드 연결 상태 확인
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await apiService.healthCheck();
        setIsBackendOnline(true);
        setOfflineMode(false);
      } catch (error) {
        setIsBackendOnline(false);
        setOfflineMode(true);
      }
    };

    checkBackendStatus();
    // 30초마다 백엔드 상태 재확인
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleConvert = async () => {
    if (!fromAmount || isNaN(parseFloat(fromAmount))) return;
    
    try {
      setIsConverting(true);
      
      // 오프라인 모드가 아니고 백엔드가 온라인일 때만 API 호출 시도
      if (!offlineMode && isBackendOnline) {
        try {
          const convertResult = await convert(fromCurrency, toCurrency, parseFloat(fromAmount));
          if (convertResult) {
            setToAmount(convertResult.converted_amount.toLocaleString());
            return;
          }
        } catch (apiError) {
          console.log('API 호출 실패, 오프라인 모드로 전환:', apiError.message);
          setOfflineMode(true);
          setIsBackendOnline(false);
        }
      }
      
      // 오프라인 모드 또는 API 실패 시 목업 데이터 사용
      const rateKey = `${fromCurrency}-${toCurrency}`;
      const rate = mockExchangeRates[rateKey];
      
      if (rate) {
        const convertedAmount = parseFloat(fromAmount) * rate;
        setToAmount(convertedAmount.toLocaleString());
      } else {
        // 같은 통화인 경우
        if (fromCurrency === toCurrency) {
          setToAmount(parseFloat(fromAmount).toLocaleString());
        } else {
          setToAmount('환율 정보 없음');
        }
      }
      
    } catch (err) {
      console.error('환율 변환 실패:', err);
      setToAmount('변환 실패');
    } finally {
      setIsConverting(false);
    }
  };

  const handleFromAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFromAmount(value);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount.replace(/,/g, ''));
    setToAmount('');
  };

  // 금액이 변경될 때마다 자동 변환
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const timeoutId = setTimeout(() => {
        handleConvert();
      }, 500); // 500ms 디바운스
      
      return () => clearTimeout(timeoutId);
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="bg-transparent border-0 text-sm font-medium text-gray-600 focus:outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="KRW">KRW</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </label>
              <input
                type="text"
                value={fromAmount}
                onChange={handleFromAmountChange}
                className="w-full text-2xl font-light border-0 bg-transparent focus:outline-none focus:ring-0 p-0 text-gray-900"
                placeholder="0"
              />
            </div>
            
            <div className="flex flex-col items-center pt-8 space-y-2">
              <button
                onClick={swapCurrencies}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="통화 바꾸기"
              >
                <RefreshCw className="text-gray-600" size={16} />
              </button>
              <ArrowRight className="text-gray-600" size={20} />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="bg-transparent border-0 text-sm font-medium text-gray-600 focus:outline-none"
                >
                  <option value="KRW">KRW</option>
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="w-full text-2xl font-light border-0 bg-transparent focus:outline-none focus:ring-0 p-0 text-gray-900"
                  placeholder="0"
                />
                {(loading || isConverting) && (
                  <div className="absolute right-0 top-2">
                    <RefreshCw className="animate-spin text-gray-400" size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 오프라인 모드가 아닐 때만 에러 표시 */}
          {!offlineMode && error && (
            <div className="text-red-600 text-sm text-center">
              환율 변환 중 오류가 발생했습니다: {error}
            </div>
          )}
          
          {toAmount && toAmount !== '변환 실패' && toAmount !== '환율 정보 없음' && (
            <div className="text-center text-sm text-gray-600">
              환율: 1 {fromCurrency} = {mockExchangeRates[`${fromCurrency}-${toCurrency}`]?.toFixed(6) || 'N/A'} {toCurrency}
              {offlineMode && <span className="text-xs text-gray-500 ml-2">(오프라인 모드)</span>}
              {!offlineMode && isBackendOnline && result && <span className="text-xs text-green-500 ml-2">(실시간 환율)</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
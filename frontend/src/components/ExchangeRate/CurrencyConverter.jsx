import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { ArrowUpDown, Calculator } from 'lucide-react';
import { useCurrencyConverter } from '../../hooks/useApi';

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'KRW', name: 'Korean Won', symbol: '₩' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
];

export function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KRW');
  
  // 실제 API 훅 사용
  const { result, loading, error, convert, clearError } = useCurrencyConverter();

  const convertCurrency = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    // 실제 API 호출
    try {
      await convert(fromCurrency, toCurrency, parseFloat(amount));
    } catch (err) {
      // 에러는 useCurrencyConverter 훅에서 처리
      console.error('환율 변환 오류:', err);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    clearError();
  };

  const formatCurrency = (value, currency) => {
    const currencyInfo = POPULAR_CURRENCIES.find(c => c.code === currency);
    const symbol = currencyInfo?.symbol || currency;
    
    return new Intl.NumberFormat('ko-KR', {
      style: 'decimal',
      minimumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 6
    }).format(value) + ' ' + currency;
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency]);

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-900">
          <Calculator className="h-6 w-6" />
          💰 환율 계산기
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-blue-800">💵 변환할 금액</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="금액을 입력하세요"
            min="0"
            step="0.01"
            className="text-lg h-12 border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2 items-end">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-blue-800">From</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                disabled={loading}
                className="border-blue-200 hover:bg-blue-50 text-blue-600"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-blue-800">To</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button 
          onClick={convertCurrency} 
          className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          disabled={loading || !amount || fromCurrency === toCurrency}
        >
          {loading ? '🔄 변환 중...' : '✨ 환율 변환'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm font-medium">❌ {error}</p>
          </div>
        )}

        {result && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl space-y-3">
            <div className="text-center">
              <div className="text-lg text-blue-700 font-medium mb-2">💰 변환 결과</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(result.amount, result.from_currency)}
              </div>
              <div className="text-blue-500 text-xl my-2">⬇️</div>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(result.converted_amount, result.to_currency)}
              </div>
            </div>
            <div className="border-t border-blue-200 pt-3 space-y-1">
              <div className="text-sm text-blue-700 font-medium text-center">
                📊 환율: 1 {result.from_currency} = {result.rate.toFixed(6)} {result.to_currency}
              </div>
              <div className="text-xs text-blue-500 text-center">
                💹 {result.data_source === 'realtime' ? '실시간' : '저장된'} 환율 데이터 사용
              </div>
              <div className="text-xs text-blue-500 text-center">
                🕐 {new Date(result.timestamp).toLocaleString('ko-KR')}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
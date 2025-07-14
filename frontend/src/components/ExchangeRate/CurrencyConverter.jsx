import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { ArrowUpDown, Calculator } from 'lucide-react';

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
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convertCurrency = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('올바른 금액을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 목업 환율 데이터 (실제 API 대신 사용)
      const mockRates = {
        'USD-KRW': 1320.50,
        'KRW-USD': 0.000757,
        'EUR-KRW': 1450.30,
        'KRW-EUR': 0.000689,
        'JPY-KRW': 8.95,
        'KRW-JPY': 0.112,
        'GBP-KRW': 1680.75,
        'KRW-GBP': 0.000595,
        'CNY-KRW': 185.20,
        'KRW-CNY': 0.0054,
        'USD-EUR': 0.91,
        'EUR-USD': 1.10,
        'USD-JPY': 147.50,
        'JPY-USD': 0.0068,
        'USD-GBP': 0.79,
        'GBP-USD': 1.27
      };

      // 2초 대기 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const rateKey = `${fromCurrency}-${toCurrency}`;
      const rate = mockRates[rateKey] || 1;
      const convertedAmount = parseFloat(amount) * rate;

      const result = {
        amount: parseFloat(amount),
        from_currency: fromCurrency,
        to_currency: toCurrency,
        rate: rate,
        converted_amount: convertedAmount,
        timestamp: new Date().toISOString()
      };

      setResult(result);
    } catch (err) {
      setError('환율 변환에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
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
                🕐 {new Date(result.timestamp).toLocaleString('ko-KR')}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
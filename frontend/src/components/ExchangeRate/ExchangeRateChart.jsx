import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const CHART_PERIODS = [
  { value: '7', label: '7일' },
  { value: '30', label: '30일' },
  { value: '90', label: '90일' }
];

const CURRENCY_PAIRS = [
  { from: 'USD', to: 'KRW', label: 'USD/KRW' },
  { from: 'EUR', to: 'KRW', label: 'EUR/KRW' },
  { from: 'JPY', to: 'KRW', label: 'JPY/KRW' },
  { from: 'GBP', to: 'KRW', label: 'GBP/KRW' }
];

export function ExchangeRateChart() {
  const [selectedPair, setSelectedPair] = useState('USD-KRW');
  const [period, setPeriod] = useState('7');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 목업 기준 환율
      const baseRates = {
        'USD-KRW': 1320.50,
        'EUR-KRW': 1450.30,
        'JPY-KRW': 8.95,
        'GBP-KRW': 1680.75
      };
      
      const currentRate = baseRates[selectedPair] || 1320.50;
      const mockData = generateMockChartData(currentRate, parseInt(period));
      
      setChartData(mockData);
    } catch (err) {
      setError('차트 데이터를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 실제 이력 데이터가 없으므로 현재 환율 기준으로 모의 데이터 생성
  const generateMockChartData = (baseRate, days) => {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // 기준 환율의 ±3% 범위에서 랜덤 변동
      const variation = (Math.random() - 0.5) * 0.06; // -3% to +3%
      const rate = baseRate * (1 + variation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        rate: parseFloat(rate.toFixed(selectedPair.includes('JPY') ? 4 : 2)),
        displayDate: date.toLocaleDateString('ko-KR', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return data;
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedPair, period]);

  const formatTooltip = (value, name, props) => {
    if (name === 'rate') {
      const [fromCurrency, toCurrency] = selectedPair.split('-');
      return [
        `${value.toLocaleString()} ${toCurrency}`,
        `1 ${fromCurrency}`
      ];
    }
    return [value, name];
  };

  const currentPair = CURRENCY_PAIRS.find(pair => 
    `${pair.from}-${pair.to}` === selectedPair
  );

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            환율 차트
          </CardTitle>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {chartData.length > 0 && 
                `${chartData[0]?.displayDate} - ${chartData[chartData.length - 1]?.displayDate}`
              }
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPair} onValueChange={setSelectedPair}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_PAIRS.map((pair) => (
                <SelectItem key={`${pair.from}-${pair.to}`} value={`${pair.from}-${pair.to}`}>
                  {pair.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHART_PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-red-700 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-1">
              MVP 버전에서는 실제 이력 데이터 대신 시뮬레이션 데이터를 표시합니다.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">차트 로딩 중...</div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `날짜: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">현재 환율:</span>
              <span className="font-semibold">
                {chartData[chartData.length - 1]?.rate.toLocaleString()} {selectedPair.split('-')[1]}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ※ MVP 버전에서는 시뮬레이션 데이터로 차트를 표시합니다.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
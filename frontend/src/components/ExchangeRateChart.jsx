import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card, CardContent } from './ui/Card'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

// Mock 데이터 생성 함수 제거됨 - 실제 API 데이터 사용 필요

export function ExchangeRateChart({ 
  currencyPair = 'USD/KRW',
  period = '30D',
  chartType: initialChartType = 'line' 
}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState(period)
  const [chartType, setChartType] = useState(initialChartType)

  useEffect(() => {
    // Mock 데이터 제거됨 - 실제 API 연결 필요
    const fetchData = async () => {
      setLoading(true)
      // 실제 API 호출 대신 빈 데이터 설정
      setData([])
      setLoading(false)
    }

    fetchData()
  }, [selectedPeriod])

  const calculateChange = () => {
    if (data.length < 2) return { change: 0, percentage: 0, isPositive: true }
    
    const latest = data[data.length - 1].rate
    const previous = data[data.length - 2].rate
    const change = latest - previous
    const percentage = (change / previous) * 100
    
    return {
      change: change.toFixed(2),
      percentage: percentage.toFixed(2),
      isPositive: change >= 0
    }
  }

  const { change, percentage, isPositive } = calculateChange()
  const latestRate = data.length > 0 ? data[data.length - 1].rate : 0

  const periods = [
    { value: '7D', label: '7일' },
    { value: '30D', label: '30일' },
    { value: '90D', label: '90일' }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-blue-600">
            {payload[0].value.toLocaleString()} KRW
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{currencyPair} 환율 차트</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">
                {latestRate.toLocaleString()}
              </span>
              <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span className="text-sm font-medium">
                  {isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{percentage}%)
                </span>
              </div>
            </div>
          </div>
          
          {/* 기간 선택 */}
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-500" />
            <div className="flex bg-gray-100 rounded-lg p-1">
              {periods.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSelectedPeriod(value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 차트 */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#666"
                  fontSize={12}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tick={{ fill: '#666' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#666"
                  fontSize={12}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tick={{ fill: '#666' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 차트 컨트롤 */}
        <div className="flex justify-center mt-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                chartType === 'line'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              선 그래프
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              영역 그래프
            </button>
          </div>
        </div>

        {/* 통계 정보 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">최고가</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.max(...data.map(d => d.rate)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">최저가</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.min(...data.map(d => d.rate)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">평균가</p>
            <p className="text-lg font-semibold text-gray-900">
              {(data.reduce((sum, d) => sum + d.rate, 0) / data.length).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 차트 타입을 변경할 수 있는 상태 관리
function useChartType() {
  const [chartType, setChartType] = useState('line')
  return [chartType, setChartType]
}

// 기본 export에 차트 타입 컨트롤 포함
export default function ExchangeRateChartWithControls(props) {
  const [chartType, setChartType] = useChartType()
  
  return (
    <ExchangeRateChart 
      {...props} 
      chartType={chartType}
      onChartTypeChange={setChartType}
    />
  )
}
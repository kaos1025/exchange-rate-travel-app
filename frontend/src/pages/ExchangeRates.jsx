import React, { useState, useEffect } from 'react'
import { useAuth } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const ExchangeRates = () => {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [rates, setRates] = useState({})
  const [loadingRates, setLoadingRates] = useState(true)
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('KRW')
  const [convertedAmount, setConvertedAmount] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      setRates(response.data.rates)
      setLoadingRates(false)
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      setLoadingRates(false)
    }
  }

  const handleConvert = () => {
    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount)
      return
    }

    let rate = 1
    if (fromCurrency === 'USD') {
      rate = rates[toCurrency] || 1
    } else if (toCurrency === 'USD') {
      rate = 1 / (rates[fromCurrency] || 1)
    } else {
      const usdToFrom = 1 / (rates[fromCurrency] || 1)
      const usdToTo = rates[toCurrency] || 1
      rate = usdToFrom * usdToTo
    }

    setConvertedAmount(amount * rate)
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/login')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const majorCurrencies = ['KRW', 'JPY', 'EUR', 'GBP', 'CNY', 'AUD', 'CAD']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold">
                Exchange Rate Travel App
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-gray-900">
                대시보드
              </Link>
              <Link to="/alerts" className="text-gray-700 hover:text-gray-900">
                알림설정
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">환율 정보</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">환율 계산기</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">금액</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">기준 통화</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    {majorCurrencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">변환 통화</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    {majorCurrencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleConvert}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                변환
              </button>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-lg font-semibold">
                  {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">주요 환율 (USD 기준)</h3>
            {loadingRates ? (
              <div className="text-center">환율 정보를 불러오는 중...</div>
            ) : (
              <div className="space-y-3">
                {majorCurrencies.map(currency => (
                  <div key={currency} className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">1 USD</span>
                    <span>{rates[currency]?.toFixed(2)} {currency}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={fetchExchangeRates}
              className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              환율 새로고침
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ExchangeRates
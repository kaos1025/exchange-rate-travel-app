import React, { useState, useEffect } from 'react'
import { useAuth } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'

const AlertSettings = () => {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    currency_from: 'USD',
    currency_to: 'KRW',
    target_rate: '',
    condition: 'below'
  })

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/login')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newAlert = {
      id: Date.now().toString(),
      ...formData,
      target_rate: parseFloat(formData.target_rate),
      is_active: true,
      created_at: new Date().toISOString()
    }
    setAlerts([...alerts, newAlert])
    setFormData({
      currency_from: 'USD',
      currency_to: 'KRW',
      target_rate: '',
      condition: 'below'
    })
    setShowForm(false)
  }

  const toggleAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, is_active: !alert.is_active } : alert
    ))
  }

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const currencies = ['USD', 'KRW', 'JPY', 'EUR', 'GBP', 'CNY', 'AUD', 'CAD']

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
              <Link to="/exchange" className="text-gray-700 hover:text-gray-900">
                환율
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
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">알림 설정</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? '취소' : '새 알림 추가'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">새 알림 설정</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">기준 통화</label>
                  <select
                    value={formData.currency_from}
                    onChange={(e) => setFormData({...formData, currency_from: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">대상 통화</label>
                  <select
                    value={formData.currency_to}
                    onChange={(e) => setFormData({...formData, currency_to: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">목표 환율</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.target_rate}
                    onChange={(e) => setFormData({...formData, target_rate: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">조건</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="below">이하일 때</option>
                    <option value="above">이상일 때</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                알림 추가
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">내 알림 목록</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                설정된 알림이 없습니다. 새 알림을 추가해보세요.
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {alert.currency_from}/{alert.currency_to}
                      </span>
                      <span className="text-gray-500">
                        {alert.target_rate} {alert.condition === 'below' ? '이하' : '이상'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        alert.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.is_active ? '활성' : '비활성'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      생성일: {new Date(alert.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-3 py-1 text-sm rounded ${
                        alert.is_active
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {alert.is_active ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AlertSettings
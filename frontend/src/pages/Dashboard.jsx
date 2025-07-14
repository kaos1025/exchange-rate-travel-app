import React, { useEffect } from 'react'
import { useAuth } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'

const Dashboard = () => {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Exchange Rate Travel App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/exchange" className="text-gray-700 hover:text-gray-900">
                환율
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">대시보드</h2>
          <p className="text-gray-600">환영합니다, {user.email}님!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold">$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      현재 USD/KRW
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      1,350.00
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/exchange" className="font-medium text-blue-600 hover:text-blue-500">
                  자세히 보기
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold">🔔</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      활성 알림
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      3개
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/alerts" className="font-medium text-green-600 hover:text-green-500">
                  알림 관리
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold">✈️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      여행 정보
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      곧 출시
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-gray-400">준비 중</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
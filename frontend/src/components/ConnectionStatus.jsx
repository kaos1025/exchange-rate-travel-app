import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, Server, AlertCircle } from 'lucide-react'
import { apiService } from '../services/api'
import { LoadingSpinner } from './ui/LoadingSpinner'

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [backendStatus, setBackendStatus] = useState('checking') // 'online', 'offline', 'checking'
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // 네트워크 상태 확인
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // 백엔드 상태 확인
    const checkBackendStatus = async () => {
      try {
        await apiService.healthCheck()
        setBackendStatus('online')
      } catch (error) {
        setBackendStatus('offline')
      }
    }

    checkBackendStatus()
    
    // 30초마다 백엔드 상태 확인
    const interval = setInterval(checkBackendStatus, 30000)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      clearInterval(interval)
    }
  }, [])

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500'
    if (backendStatus === 'online') return 'bg-green-500'
    if (backendStatus === 'offline') return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getStatusText = () => {
    if (!isOnline) return '인터넷 연결 없음'
    if (backendStatus === 'online') return '온라인'
    if (backendStatus === 'offline') return '오프라인 모드'
    return '연결 확인 중...'
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={14} />
    if (backendStatus === 'online') return <Server size={14} />
    if (backendStatus === 'offline') return <AlertCircle size={14} />
    return <LoadingSpinner size="sm" className="text-white" />
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full text-white text-sm font-medium shadow-lg transition-all hover:shadow-xl ${getStatusColor()}`}
      >
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </button>

      {showDetails && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">연결 상태</span>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">인터넷</span>
                <div className="flex items-center space-x-1">
                  {isOnline ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600">연결됨</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-600">연결 끊김</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">백엔드 서버</span>
                <div className="flex items-center space-x-1">
                  {backendStatus === 'online' ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600">온라인</span>
                    </>
                  ) : backendStatus === 'offline' ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-yellow-600">오프라인</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600">확인 중</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {backendStatus === 'offline' && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-800">
                    <div className="font-medium mb-1">오프라인 모드</div>
                    <div>일부 기능이 제한됩니다. 환율 데이터는 임시 값을 사용합니다.</div>
                    <div className="mt-2">
                      <strong>백엔드 서버 시작 방법:</strong>
                      <br />
                      <code className="bg-yellow-100 px-1 rounded text-xs">
                        cd backend && python start_local.py
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={async () => {
                  setBackendStatus('checking')
                  try {
                    await apiService.healthCheck()
                    setBackendStatus('online')
                  } catch (error) {
                    setBackendStatus('offline')
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                연결 상태 새로고침
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
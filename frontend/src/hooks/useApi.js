import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

// 일반적인 API 호출 훅
export const useApiCall = (apiFunction, dependencies = []) => {
  console.log('🎆 useApiCall 훅 시작!');
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = async (...args) => {
    console.log('📥 useApiCall execute 시작');
    try {
      setLoading(true)
      setError(null)
      console.log('📞 API 함수 호출 전...');
      const result = await apiFunction(...args)
      console.log('✅ API 함수 호출 성공:', result);
      setData(result)
      return result
    } catch (err) {
      console.error('❌ API 함수 호출 실패:', err);
      setError(err.message)
      throw err
    } finally {
      console.log('🏁 API 호출 완료 - loading false');
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🔄 useApiCall useEffect - dependencies:', dependencies);
    if (dependencies.length === 0) {
      console.log('🚀 자동 execute 실행!');
      execute()
    }
  }, dependencies)

  return { data, loading, error, execute, refetch: execute }
}

// 환율 정보 훅
export const useExchangeRates = () => {
  console.log('🎯 useExchangeRates 훅 실행!');
  
  const result = useApiCall(() => {
    console.log('🚀 useExchangeRates - API 호출 시작');
    console.log('📡 apiService 객체:', apiService);
    return apiService.getExchangeRates();
  });
  
  console.log('📊 useExchangeRates - 결과:', result);
  console.log('📈 useExchangeRates - data:', result.data);
  console.log('⏳ useExchangeRates - loading:', result.loading);
  console.log('❌ useExchangeRates - error:', result.error);
  
  return result;
}

// 최신 환율 데이터 및 변동률 훅
export const useLatestRatesWithChanges = () => {
  console.log('🎯 useLatestRatesWithChanges 훅 실행!');
  
  const result = useApiCall(() => {
    console.log('🚀 useLatestRatesWithChanges - API 호출 시작');
    return apiService.getLatestRatesWithChanges();
  });
  
  console.log('📊 useLatestRatesWithChanges - 결과:', result);
  return result;
}

// 일일 환율 데이터 훅
export const useDailyRates = (targetDate = null) => {
  console.log('🎯 useDailyRates 훅 실행!');
  
  const result = useApiCall(() => {
    console.log('🚀 useDailyRates - API 호출 시작');
    return apiService.getDailyRates(targetDate);
  }, [targetDate]);
  
  console.log('📊 useDailyRates - 결과:', result);
  return result;
}

// 환율 변환 훅
export const useCurrencyConverter = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const convert = async (from, to, amount) => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.convertCurrency(from, to, amount)
      setResult(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return { result, loading, error, convert, clearError }
}

// 사용자 알림 설정 훅
export const useAlerts = () => {
  const { data: alerts, loading, error, execute: refetch } = useApiCall(() => apiService.getAlerts())

  const createAlert = async (alertData) => {
    const newAlert = await apiService.createAlert(alertData)
    await refetch() // 목록 새로고침
    return newAlert
  }

  const updateAlert = async (alertId, alertData) => {
    const updatedAlert = await apiService.updateAlert(alertId, alertData)
    await refetch() // 목록 새로고침
    return updatedAlert
  }

  const deleteAlert = async (alertId) => {
    await apiService.deleteAlert(alertId)
    await refetch() // 목록 새로고침
  }

  return {
    alerts,
    loading,
    error,
    refetch,
    createAlert,
    updateAlert,
    deleteAlert
  }
}

// 알림 통계 훅
export const useAlertStatistics = () => {
  return useApiCall(() => apiService.getAlertStatistics())
}

// 알림 이력 훅
export const useNotificationHistory = (limit = 50) => {
  return useApiCall(() => apiService.getNotificationHistory(limit), [limit])
}

// 모니터링 상태 훅
export const useMonitoringStatus = () => {
  const { data: status, loading, error, execute: refetch } = useApiCall(
    () => apiService.getMonitoringStatus()
  )

  const startMonitoring = async () => {
    await apiService.startMonitoring()
    await refetch()
  }

  const stopMonitoring = async () => {
    await apiService.stopMonitoring()
    await refetch()
  }

  return {
    status,
    loading,
    error,
    refetch,
    startMonitoring,
    stopMonitoring
  }
}

// 사용자 프로필 훅
export const useUserProfile = () => {
  const { data: profile, loading, error, execute: refetch } = useApiCall(
    () => apiService.getCurrentUser()
  )

  const updateProfile = async (profileData) => {
    const updatedProfile = await apiService.updateProfile(profileData)
    await refetch() // 프로필 새로고침
    return updatedProfile
  }

  return {
    profile,
    loading,
    error,
    refetch,
    updateProfile
  }
}

// 인증 상태 훅
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = apiService.getToken()
        if (token) {
          const userData = await apiService.getCurrentUser()
          setUser(userData)
        }
      } catch (err) {
        // 토큰이 유효하지 않으면 제거
        apiService.removeToken()
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.login(email, password)
      const userData = await apiService.getCurrentUser()
      setUser(userData)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password, displayName) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.signup(email, password, displayName)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } finally {
      setUser(null)
      apiService.removeToken()
    }
  }

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }
}
import config from '../config.js'

// Railway URL을 강제로 사용 (config가 실패할 경우 대비)
const API_BASE_URL = config.API_BASE_URL || 'https://exchange-rate-travel-app-production.up.railway.app'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // 토큰 관리
  getToken() {
    return localStorage.getItem('access_token')
  }

  setToken(token) {
    localStorage.setItem('access_token', token)
  }

  removeToken() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // HTTP 요청 헬퍼
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  // 인증 API
  async signup(email, password, displayName) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        display_name: displayName
      })
    })
    return response
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    })

    if (response.access_token) {
      this.setToken(response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
    }

    return response
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST'
      })
    } finally {
      this.removeToken()
    }
  }

  async getCurrentUser() {
    return await this.request('/auth/me')
  }

  async updateProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  // 환율 API
  async getExchangeRates() {
    return await this.request('/exchange/rates');
  }

  async convertCurrency(from, to, amount) {
    const params = new URLSearchParams({
      from_currency: from,
      to_currency: to,
      amount: amount.toString()
    })
    return await this.request(`/exchange/convert?${params}`)
  }

  // 최신 환율 데이터 및 변동률 조회
  async getLatestRatesWithChanges() {
    return await this.request('/exchange/rates/latest');
  }

  // 저장된 환율 데이터만 조회 (실시간 API 호출 없음)
  async getStoredRates() {
    return await this.request('/exchange/rates/stored');
  }

  // 환율 히스토리 데이터 조회
  async getExchangeRateHistory(currencyPair, days = 30) {
    // currency_pair 형식: "USD/KRW" -> "USD", "KRW"로 분리
    const [fromCurrency, toCurrency] = currencyPair.split('/');
    const endpoint = `/exchange/rates/history/${fromCurrency}/${toCurrency}?days=${days}`;
    console.log('🚀 API 호출 시작:', endpoint);
    
    try {
      const result = await this.request(endpoint);
      console.log('✅ API 호출 성공:', result);
      return result;
    } catch (error) {
      console.error('❌ API 호출 실패:', error);
      throw error;
    }
  }

  // 일일 환율 데이터 조회
  async getDailyRates(targetDate = null) {
    const params = targetDate ? `?target_date=${targetDate}` : '';
    return await this.request(`/exchange/rates/daily${params}`);
  }

  // 수동 일일 환율 저장 (테스트용)
  async storeDailyRates() {
    return await this.request('/exchange/rates/store', {
      method: 'POST'
    });
  }

  // 알림 설정 API
  async getAlerts() {
    return await this.request('/alerts')
  }

  async createAlert(alertData) {
    return await this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData)
    })
  }

  async updateAlert(alertId, alertData) {
    return await this.request(`/alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify(alertData)
    })
  }

  async deleteAlert(alertId) {
    return await this.request(`/alerts/${alertId}`, {
      method: 'DELETE'
    })
  }

  async getNotificationHistory(limit = 50) {
    const params = new URLSearchParams({ limit: limit.toString() })
    return await this.request(`/alerts/history/notifications?${params}`)
  }

  async getAlertStatistics() {
    return await this.request('/alerts/statistics/summary')
  }

  // 모니터링 API
  async getMonitoringStatus() {
    return await this.request('/alerts/monitoring/status')
  }

  async startMonitoring() {
    return await this.request('/alerts/monitoring/start', {
      method: 'POST'
    })
  }

  async stopMonitoring() {
    return await this.request('/alerts/monitoring/stop', {
      method: 'POST'
    })
  }

  async sendTestEmail() {
    return await this.request('/alerts/test/email', {
      method: 'POST'
    })
  }

  // 헬스 체크
  async healthCheck() {
    return await this.request('/health')
  }
}

export const apiService = new ApiService()
export default apiService
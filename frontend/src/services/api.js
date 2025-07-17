import config from '../config.js'

// Railway URL을 강제로 사용 (config가 실패할 경우 대비)
const API_BASE_URL = config.API_BASE_URL || 'https://exchange-rate-travel-app-production.up.railway.app'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    console.log('🔧 ApiService 생성됨. baseURL:', this.baseURL);
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
      console.error(`API request failed: ${endpoint}`, error)
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
    console.log('=== ApiService.getExchangeRates ===');
    console.log('API URL:', `${this.baseURL}/exchange/rates`);
    console.log('Current time:', new Date().toISOString());
    try {
      const result = await this.request('/exchange/rates');
      console.log('API 성공 응답:', result);
      console.log('Response type:', typeof result);
      console.log('Response keys:', Object.keys(result || {}));
      return result;
    } catch (error) {
      console.error('API 오류 상세:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async convertCurrency(from, to, amount) {
    const params = new URLSearchParams({
      from,
      to,
      amount: amount.toString()
    })
    return await this.request(`/exchange/convert?${params}`)
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
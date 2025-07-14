import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AlertForm } from './AlertForm';
import { AlertList } from './AlertList';
import { Plus, Bell, TrendingUp, Mail, RefreshCw } from 'lucide-react';

export function AlertDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // MVP용 사용자 ID (실제로는 인증에서 가져옴)
  const userId = 'demo_user';

  useEffect(() => {
    loadAlerts();
    loadStatistics();
    loadNotificationHistory();
  }, []);

  const loadAlerts = async () => {
    try {
      // 목업 데이터 (실제로는 API 호출)
      const mockAlerts = [
        {
          id: '1',
          user_id: userId,
          currency_from: 'USD',
          currency_to: 'KRW',
          target_rate: 1400,
          condition: 'above',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: userId,
          currency_from: 'EUR',
          currency_to: 'KRW',
          target_rate: 1500,
          condition: 'below',
          is_active: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setAlerts(mockAlerts);
    } catch (err) {
      setError('알림 목록을 불러오는데 실패했습니다.');
    }
  };

  const loadStatistics = async () => {
    try {
      // 목업 통계 데이터
      const mockStats = {
        total_alerts: 2,
        active_alerts: 1,
        inactive_alerts: 1,
        total_notifications: 5,
        recent_notifications: 2,
        last_notification: new Date(Date.now() - 3600000).toISOString()
      };

      setStatistics(mockStats);
    } catch (err) {
      console.error('통계 로딩 실패:', err);
    }
  };

  const loadNotificationHistory = async () => {
    try {
      // 목업 알림 이력 데이터
      const mockHistory = [
        {
          id: '1',
          user_id: userId,
          alert_setting_id: '1',
          triggered_rate: 1405.50,
          notification_type: 'email',
          sent_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          user_id: userId,
          alert_setting_id: '2',
          triggered_rate: 1480.20,
          notification_type: 'email',
          sent_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setNotificationHistory(mockHistory);
    } catch (err) {
      console.error('알림 이력 로딩 실패:', err);
    }
  };

  const handleCreateAlert = async (alertData) => {
    setLoading(true);
    try {
      // 실제로는 API 호출
      const newAlert = {
        id: Date.now().toString(),
        user_id: userId,
        ...alertData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setAlerts(prev => [...prev, newAlert]);
      setShowForm(false);
      await loadStatistics();
    } catch (err) {
      throw new Error('알림 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAlert = async (alertData) => {
    setLoading(true);
    try {
      // 실제로는 API 호출
      const updatedAlert = {
        ...editingAlert,
        ...alertData,
        updated_at: new Date().toISOString()
      };

      setAlerts(prev => prev.map(alert => 
        alert.id === editingAlert.id ? updatedAlert : alert
      ));
      setEditingAlert(null);
      setShowForm(false);
      await loadStatistics();
    } catch (err) {
      throw new Error('알림 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      // 실제로는 API 호출
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      await loadStatistics();
    } catch (err) {
      setError('알림 삭제에 실패했습니다.');
    }
  };

  const handleToggleAlert = async (alertId, newStatus) => {
    try {
      // 실제로는 API 호출
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_active: newStatus, updated_at: new Date().toISOString() }
          : alert
      ));
      await loadStatistics();
    } catch (err) {
      setError('알림 상태 변경에 실패했습니다.');
    }
  };

  const handleRegisterEmail = async () => {
    if (!userEmail.trim()) {
      setError('이메일 주소를 입력해주세요.');
      return;
    }

    try {
      // 실제로는 API 호출
      alert(`이메일이 등록되었습니다: ${userEmail}`);
      setUserEmail('');
    } catch (err) {
      setError('이메일 등록에 실패했습니다.');
    }
  };

  const handleTestEmail = async () => {
    try {
      // 실제로는 API 호출
      alert('테스트 이메일이 발송되었습니다!');
    } catch (err) {
      setError('테스트 이메일 발송에 실패했습니다.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">알림 설정</h1>
        <p className="text-gray-600">환율 변화를 실시간으로 모니터링하고 알림을 받아보세요.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* 통계 카드 */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{statistics.total_alerts}</p>
                  <p className="text-sm text-gray-600">총 알림</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{statistics.active_alerts}</p>
                  <p className="text-sm text-gray-600">활성 알림</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{statistics.total_notifications}</p>
                  <p className="text-sm text-gray-600">발송된 알림</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{statistics.recent_notifications}</p>
                  <p className="text-sm text-gray-600">최근 7일</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 이메일 설정 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            이메일 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="알림을 받을 이메일 주소"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleRegisterEmail}>
              등록
            </Button>
            <Button variant="outline" onClick={handleTestEmail}>
              테스트
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            알림을 받을 이메일 주소를 등록하고 테스트 이메일을 발송해보세요.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 알림 목록 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">알림 목록</h2>
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingAlert(null);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              새 알림
            </Button>
          </div>

          <AlertList
            alerts={alerts}
            onEdit={(alert) => {
              setEditingAlert(alert);
              setShowForm(true);
            }}
            onDelete={handleDeleteAlert}
            onToggle={handleToggleAlert}
          />
        </div>

        {/* 알림 폼 */}
        <div>
          {showForm && (
            <AlertForm
              initialData={editingAlert}
              onSubmit={editingAlert ? handleEditAlert : handleCreateAlert}
              onCancel={() => {
                setShowForm(false);
                setEditingAlert(null);
              }}
            />
          )}

          {!showForm && notificationHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>최근 알림 이력</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notificationHistory.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">환율: {notification.triggered_rate}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(notification.sent_at).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {notification.notification_type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
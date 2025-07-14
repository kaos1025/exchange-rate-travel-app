import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Bell, Edit, Trash2, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from 'lucide-react';

export function AlertList({ alerts, onEdit, onDelete, onToggle }) {
  const [loading, setLoading] = useState({});

  const handleToggle = async (alertId, currentStatus) => {
    setLoading(prev => ({ ...prev, [alertId]: true }));
    try {
      await onToggle(alertId, !currentStatus);
    } finally {
      setLoading(prev => ({ ...prev, [alertId]: false }));
    }
  };

  const handleDelete = async (alertId) => {
    if (!window.confirm('이 알림을 삭제하시겠습니까?')) {
      return;
    }
    
    setLoading(prev => ({ ...prev, [alertId]: true }));
    try {
      await onDelete(alertId);
    } finally {
      setLoading(prev => ({ ...prev, [alertId]: false }));
    }
  };

  const formatRate = (rate, toCurrency) => {
    const numRate = parseFloat(rate);
    if (toCurrency === 'KRW') {
      return numRate.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
    }
    return numRate.toFixed(6);
  };

  const getConditionIcon = (condition) => {
    return condition === 'above' ? (
      <ArrowUp className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-500" />
    );
  };

  const getConditionText = (condition) => {
    return condition === 'above' ? '이상' : '이하';
  };

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">설정된 알림이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">
            새 알림을 추가하여 환율 변화를 놓치지 마세요!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`${!alert.is_active ? 'opacity-60' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-lg">
                    {alert.currency_from} → {alert.currency_to}
                  </span>
                  {getConditionIcon(alert.condition)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {alert.is_active ? '활성' : '비활성'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">목표:</span> {formatRate(alert.target_rate, alert.currency_to)} {getConditionText(alert.condition)}
                </div>
                
                <div className="text-xs text-gray-500">
                  생성: {new Date(alert.created_at).toLocaleDateString('ko-KR')}
                  {alert.updated_at !== alert.created_at && (
                    <span className="ml-2">
                      수정: {new Date(alert.updated_at).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(alert.id, alert.is_active)}
                  disabled={loading[alert.id]}
                  title={alert.is_active ? '알림 비활성화' : '알림 활성화'}
                >
                  {alert.is_active ? (
                    <ToggleRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(alert)}
                  disabled={loading[alert.id]}
                  title="알림 수정"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(alert.id)}
                  disabled={loading[alert.id]}
                  title="알림 삭제"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Plus, Bell, Target } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'KRW', name: 'Korean Won' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CNY', name: 'Chinese Yuan' }
];

export function AlertForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    currency_from: initialData?.currency_from || 'USD',
    currency_to: initialData?.currency_to || 'KRW',
    target_rate: initialData?.target_rate || '',
    condition: initialData?.condition || 'above',
    is_active: initialData?.is_active ?? true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.target_rate || parseFloat(formData.target_rate) <= 0) {
      setError('올바른 목표 환율을 입력해주세요.');
      return;
    }

    if (formData.currency_from === formData.currency_to) {
      setError('서로 다른 통화를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        target_rate: parseFloat(formData.target_rate)
      };
      
      await onSubmit(submitData);
    } catch (err) {
      setError(err.message || '알림 설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-900">
          <Bell className="h-6 w-6" />
          🔔 {initialData ? '알림 수정' : '알림 설정'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-blue-800">💱 기준 통화</label>
              <Select 
                value={formData.currency_from} 
                onValueChange={(value) => handleInputChange('currency_from', value)}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-blue-800">🎯 대상 통화</label>
              <Select 
                value={formData.currency_to} 
                onValueChange={(value) => handleInputChange('currency_to', value)}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-blue-800">📊 목표 환율</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
              <Input
                type="number"
                step="0.000001"
                min="0"
                value={formData.target_rate}
                onChange={(e) => handleInputChange('target_rate', e.target.value)}
                placeholder="목표 환율을 입력하세요"
                className="pl-12 h-12 text-lg border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-blue-800">⚙️ 알림 조건</label>
            <Select 
              value={formData.condition} 
              onValueChange={(value) => handleInputChange('condition', value)}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">📈 목표 환율 이상일 때</SelectItem>
                <SelectItem value="below">📉 목표 환율 이하일 때</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-blue-800 cursor-pointer">
              🔔 알림 활성화
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
            >
              {loading ? '🔄 처리 중...' : (initialData ? '✏️ 수정' : '✨ 생성')}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={loading}
                className="px-6 h-12 border-blue-200 hover:bg-blue-50 text-blue-600"
              >
                취소
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
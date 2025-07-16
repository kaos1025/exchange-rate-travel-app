import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { useToast } from './ui/Toast';

export function AlertSettings() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    currencyPair: 'USD/KRW',
    condition: '이상',
    targetRate: '',
    notificationMethod: '이메일'
  });

  const currencyPairs = [
    { value: 'USD/KRW', label: 'USD/KRW' },
    { value: 'JPY/KRW', label: 'JPY/KRW' },
    { value: 'EUR/KRW', label: 'EUR/KRW' },
    { value: 'CNY/KRW', label: 'CNY/KRW' }
  ];

  const conditions = [
    { value: '이상', label: '이상' },
    { value: '이하', label: '이하' }
  ];

  const notificationMethods = [
    { value: '이메일', label: '이메일' },
    { value: '푸시 알림', label: '푸시 알림' },
    { value: 'SMS', label: 'SMS' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.targetRate) {
      error('목표 환율을 입력해주세요.');
      return;
    }

    success('환율 알림이 설정되었습니다!');
    console.log('Alert settings:', formData);
  };

  return (
    <section id="alerts" className="mb-12">
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            환율 알림 설정
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  통화쌍
                </label>
                <select
                  name="currencyPair"
                  value={formData.currencyPair}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  {currencyPairs.map((pair) => (
                    <option key={pair.value} value={pair.value}>
                      {pair.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  조건
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  {conditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  목표 환율
                </label>
                <input
                  type="number"
                  name="targetRate"
                  value={formData.targetRate}
                  onChange={handleInputChange}
                  placeholder="1,350"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  알림 방법
                </label>
                <select
                  name="notificationMethod"
                  value={formData.notificationMethod}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  {notificationMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                알림 설정하기
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
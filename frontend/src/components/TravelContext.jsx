import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Home, Coffee, Train } from 'lucide-react';

export function TravelContext() {
  const contextItems = [
    {
      icon: Home,
      label: '서울 원룸 월세',
      value: '2개월치'
    },
    {
      icon: Coffee,
      label: '스타벅스 아메리카노',
      value: '27잔'
    },
    {
      icon: Train,
      label: '지하철',
      value: '89회'
    }
  ];

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {contextItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <item.icon size={16} className="text-gray-600" />
                <span className="text-sm text-gray-900">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
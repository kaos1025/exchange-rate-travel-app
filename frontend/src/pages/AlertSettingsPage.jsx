import React from 'react';
import { AlertDashboard } from '../components/AlertSettings';

export function AlertSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-900">🔔 환율 알림</h1>
        <p className="text-xl text-blue-600">원하는 환율에 도달했을 때 알림을 받아보세요</p>
      </div>
      
      <AlertDashboard />
    </div>
  );
}
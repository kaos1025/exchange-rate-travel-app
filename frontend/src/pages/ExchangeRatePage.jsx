import React from 'react';
import ExchangeRateDashboard from '../components/ExchangeRate/ExchangeRateDashboard';
import { CurrencyConverter, ExchangeRateChart } from '../components/ExchangeRate';

export function ExchangeRatePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-900">💱 환율 정보</h1>
        <p className="text-xl text-blue-600">실시간 환율 조회, 계산기, 차트를 한 곳에서 확인하세요</p>
      </div>

      {/* 카드 기반 환율 대시보드 */}
      <ExchangeRateDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <CurrencyConverter />
        </div>
        <div className="lg:sticky lg:top-8">
          <ExchangeRateChart />
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6 shadow-lg">
        <h3 className="font-bold text-amber-800 mb-4 text-lg flex items-center gap-2">
          ℹ️ 서비스 안내
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-amber-700">📊 데이터 제공</h4>
            <ul className="text-sm text-amber-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>실시간 환율 정보 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>주요 통화 6개국 지원</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>5분마다 자동 업데이트</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-amber-700">🚀 향후 계획</h4>
            <ul className="text-sm text-amber-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>실제 차트 데이터 연동</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>더 많은 통화 지원</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>고급 분석 기능</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
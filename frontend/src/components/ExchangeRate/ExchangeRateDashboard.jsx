import { useEffect, useState } from "react";
import ExchangeRateCard from "./ExchangeRateCard";
import { useExchangeRates } from "../../hooks/useApi";

// 백업 데이터 (API 실패 시 사용)
const fallbackRates = [
  { pair: "USD/KRW", country: "US", rate: 1340.5, diff: 12.3, diffRate: 0.93 },
  { pair: "JPY/KRW", country: "JP", rate: 8.94, diff: -0.05, diffRate: -0.56 },
  { pair: "EUR/KRW", country: "EU", rate: 1456.78, diff: 8.45, diffRate: 0.58 },
  { pair: "CNY/KRW", country: "CN", rate: 184.32, diff: 2.15, diffRate: 1.18 },
];

export default function ExchangeRateDashboard() {
  // 즉시 실행되는 로그
  console.log('🚀 ExchangeRateDashboard 컴포넌트 로드됨!');
  console.log('Current URL:', window.location.href);
  console.log('User Agent:', navigator.userAgent);
  
  const { data: apiRates, loading, error, refetch } = useExchangeRates();
  const [displayRates, setDisplayRates] = useState(fallbackRates);
  
  // 디버깅을 위한 로그
  console.log('=== ExchangeRateDashboard Debug ===');
  console.log('apiRates:', apiRates);
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('displayRates:', displayRates);
  console.log('Current time:', new Date().toISOString());
  console.log('================================');

  useEffect(() => {
    if (apiRates && apiRates.rates) {
      // API 데이터를 컴포넌트에 맞는 형태로 변환
      const targetCurrencies = ['USD', 'JPY', 'EUR', 'CNY'];
      const transformedRates = targetCurrencies.map(currency => {
        const pair = `${currency}/KRW`;
        const rate = currency === 'USD' ? apiRates.rates.KRW : apiRates.rates.KRW / apiRates.rates[currency];
        
        return {
          pair,
          country: getCountryCode(currency),
          rate: parseFloat(rate.toFixed(2)),
          diff: 0, // 변동폭 데이터가 없어서 0으로 설정
          diffRate: 0 // 변동률 데이터가 없어서 0으로 설정
        };
      });
      setDisplayRates(transformedRates);
    }
  }, [apiRates]);

  // 통화 코드를 국가 코드로 변환하는 헬퍼 함수
  const getCountryCode = (currency) => {
    const currencyToCountry = {
      'USD': 'US',
      'JPY': 'JP', 
      'EUR': 'EU',
      'CNY': 'CN',
      'GBP': 'GB',
      'AUD': 'AU',
      'CAD': 'CA'
    };
    return currencyToCountry[currency] || currency;
  };

  // 렌더링 전 로그
  console.log('🎨 ExchangeRateDashboard 렌더링 시작');
  
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="bg-red-100 border border-red-400 rounded-lg p-4 mb-4">
        <h2 className="font-bold text-red-800">테스트: 이 메시지가 보이면 JavaScript가 작동하고 있음</h2>
        <p className="text-red-700 text-sm">Console에서 로그를 확인하세요</p>
        <button 
          onClick={() => {
            console.log('👆 버튼 클릭됨!');
            alert('JavaScript 정상 작동!');
          }}
          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
        >
          클릭 테스트
        </button>
        <button 
          onClick={async () => {
            console.log('🌐 직접 API 호출 테스트');
            try {
              const response = await fetch('https://exchange-rate-travel-app-production.up.railway.app/exchange/rates');
              const data = await response.json();
              console.log('직접 API 응답:', data);
              alert(`API 성공: USD/KRW = ${data.rates?.KRW || 'N/A'}`);
            } catch (error) {
              console.error('직접 API 에러:', error);
              alert('API 에러: ' + error.message);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-2"
        >
          직접 API 호출
        </button>
      </div>
      <div className="text-center py-2 mb-4">
        <div className="bg-gray-100 rounded-lg p-3 text-xs font-mono">
          <p><strong>Debug Info:</strong></p>
          <p>Loading: {loading ? 'true' : 'false'}</p>
          <p>Error: {error || 'none'}</p>
          <p>API Data: {apiRates ? 'received' : 'null'}</p>
          <p>Display Mode: {apiRates?.rates ? 'Real API' : 'Fallback'}</p>
          <p>Current Time: {new Date().toLocaleTimeString()}</p>
          <p>API Structure: {apiRates ? JSON.stringify(Object.keys(apiRates)) : 'no data'}</p>
          <p>Display Rates Count: {displayRates.length}</p>
          <p>Sample Rate: {displayRates[0] ? `${displayRates[0].pair}: ${displayRates[0].rate}` : 'none'}</p>
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">환율 정보를 불러오는 중...</p>
        </div>
      )}
      
      {apiRates && !loading && (
        <div className="text-center py-2 mb-4">
          <p className="text-green-600 text-xs">✅ 실시간 환율 데이터 ({apiRates.timestamp})</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-4 mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">실시간 환율 정보를 불러올 수 없습니다.</p>
            <p className="text-yellow-600 text-xs mt-1">임시 데이터를 표시하고 있습니다.</p>
            <p className="text-red-600 text-xs mt-1">에러: {error}</p>
            <button 
              onClick={refetch}
              className="mt-2 text-xs bg-yellow-100 hover:bg-yellow-200 px-2 py-1 rounded transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayRates.map((rate) => (
          <ExchangeRateCard key={rate.pair} {...rate} />
        ))}
      </div>
    </div>
  );
} 
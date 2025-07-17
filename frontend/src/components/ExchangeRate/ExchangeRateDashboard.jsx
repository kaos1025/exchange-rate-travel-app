import { useEffect, useState } from "react";
import ExchangeRateCard from "./ExchangeRateCard";
import { useExchangeRates, useLatestRatesWithChanges } from "../../hooks/useApi";

// 백업 데이터 제거 - 이제 서버에서 저장된 데이터로 폴백 처리

export default function ExchangeRateDashboard() {
  // 즉시 실행되는 로그
  console.log('🚀 ExchangeRateDashboard 컴포넌트 로드됨!');
  console.log('Current URL:', window.location.href);
  console.log('User Agent:', navigator.userAgent);
  
  const { data: latestRates, loading, error, refetch } = useLatestRatesWithChanges();
  const [displayRates, setDisplayRates] = useState([]);
  
  // 디버깅을 위한 로그
  console.log('=== ExchangeRateDashboard Debug ===');
  console.log('latestRates:', latestRates);
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('displayRates:', displayRates);
  console.log('Current time:', new Date().toISOString());
  console.log('================================');

  useEffect(() => {
    console.log('🔄 useEffect 실행 - latestRates 변경 감지:', latestRates);
    
    if (latestRates && latestRates.rates) {
      console.log('✅ 최신 환율 데이터 있음! 변환 시작');
      console.log('Latest rates 구조:', latestRates.rates);
      
      // 새로운 API 데이터를 컴포넌트에 맞는 형태로 변환
      const transformedRates = latestRates.rates.map(rate => {
        const [from, to] = rate.currency_pair.split('/');
        
        return {
          pair: rate.currency_pair,
          country: getCountryCode(from),
          rate: parseFloat(rate.rate.toFixed(2)),
          diff: parseFloat(rate.change_amount.toFixed(2)),
          diffRate: parseFloat(rate.change_percentage.toFixed(2))
        };
      });
      
      console.log('💱 변환된 환율 데이터:', transformedRates);
      setDisplayRates(transformedRates);
      console.log('✅ displayRates 업데이트 완료');
    } else {
      console.log('❌ 최신 환율 데이터 없음 - fallback 사용');
      console.log('latestRates:', latestRates);
      console.log('latestRates?.rates:', latestRates?.rates);
    }
  }, [latestRates]);

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
              const response = await fetch('https://exchange-rate-travel-app-production.up.railway.app/exchange/rates/latest');
              const data = await response.json();
              console.log('직접 API 응답:', data);
              const usdRate = data.rates?.find(r => r.currency_pair === 'USD/KRW');
              alert(`API 성공: USD/KRW = ${usdRate?.rate || 'N/A'} (변동: ${usdRate?.change_amount || 0})`);
            } catch (error) {
              console.error('직접 API 에러:', error);
              alert('API 에러: ' + error.message);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-2"
        >
          직접 API 호출
        </button>
        <button 
          onClick={async () => {
            console.log('💾 일일 환율 저장 테스트');
            try {
              const response = await fetch('https://exchange-rate-travel-app-production.up.railway.app/exchange/rates/store', {
                method: 'POST'
              });
              const data = await response.json();
              console.log('일일 환율 저장 응답:', data);
              alert(`저장 ${data.success ? '성공' : '실패'}: ${data.duration_seconds || 0}초 소요`);
            } catch (error) {
              console.error('일일 환율 저장 에러:', error);
              alert('저장 에러: ' + error.message);
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 ml-2"
        >
          일일 환율 저장
        </button>
      </div>
      <div className="text-center py-2 mb-4">
        <div className="bg-gray-100 rounded-lg p-3 text-xs font-mono">
          <p><strong>Debug Info:</strong></p>
          <p>Loading: {loading ? 'true' : 'false'}</p>
          <p>Error: {error || 'none'}</p>
          <p>API Data: {latestRates ? 'received' : 'null'}</p>
          <p>Display Mode: {latestRates?.rates ? `✅ ${latestRates.data_source} API with Changes` : '❌ No Data'}</p>
          <p>API Status: {loading ? 'Loading...' : error ? 'Error' : latestRates ? 'Success' : 'No Data'}</p>
          <p>Rates Available: {latestRates?.rates ? latestRates.rates.length + ' currency pairs' : 'None'}</p>
          <p>Data Source: {latestRates?.data_source || 'unknown'}</p>
          <p>Is Realtime: {latestRates?.is_realtime ? 'Yes' : 'No'}</p>
          <p>Current Time: {new Date().toLocaleTimeString()}</p>
          <p>Display Rates Count: {displayRates.length}</p>
          <p>Sample Rate: {displayRates[0] ? `${displayRates[0].pair}: ${displayRates[0].rate} (${displayRates[0].diff > 0 ? '+' : ''}${displayRates[0].diff})` : 'none'}</p>
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">환율 정보를 불러오는 중...</p>
        </div>
      )}
      
      {latestRates && !loading && (
        <div className="text-center py-2 mb-4">
          <p className={`text-xs ${latestRates.is_realtime ? 'text-green-600' : 'text-orange-600'}`}>
            {latestRates.is_realtime ? '✅ 실시간 환율 데이터' : '⚠️ 저장된 환율 데이터'} (변동률 포함)
          </p>
          <p className="text-xs text-gray-500 mt-1">{latestRates.message}</p>
        </div>
      )}
      
      {error && displayRates.length === 0 && (
        <div className="text-center py-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">환율 정보를 불러올 수 없습니다.</p>
            <p className="text-red-600 text-xs mt-1">서버 연결에 문제가 있습니다.</p>
            <p className="text-red-600 text-xs mt-1">에러: {error}</p>
            <button 
              onClick={refetch}
              className="mt-2 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayRates.length > 0 ? (
          displayRates.map((rate) => (
            <ExchangeRateCard key={rate.pair} {...rate} />
          ))
        ) : (
          !loading && (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-500">
                <p>환율 데이터를 불러올 수 없습니다.</p>
                <p className="text-sm mt-2">잠시 후 다시 시도해주세요.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
} 
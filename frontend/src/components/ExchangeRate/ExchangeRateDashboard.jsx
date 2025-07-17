import { useEffect, useState } from "react";
import ExchangeRateCard from "./ExchangeRateCard";
import { useExchangeRates, useLatestRatesWithChanges } from "../../hooks/useApi";

// 백업 데이터 제거 - 이제 서버에서 저장된 데이터로 폴백 처리

export default function ExchangeRateDashboard() {
  const { data: latestRates, loading, error, refetch } = useLatestRatesWithChanges();
  const [displayRates, setDisplayRates] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  useEffect(() => {
    if (latestRates && latestRates.rates) {
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
      
      setDisplayRates(transformedRates);
      setIsInitialLoading(false);
      setHasReceivedData(true);
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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          실시간 환율 정보
        </h1>
        <p className="text-gray-600 text-lg">주요 통화의 원화 환율과 변동률을 확인하세요</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">환율 정보를 불러오는 중...</p>
        </div>
      )}
      
      {latestRates && !loading && (
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${latestRates.is_realtime ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            <span className="text-base">
              {latestRates.is_realtime ? '🟢' : '🟡'}
            </span>
            {latestRates.is_realtime ? '실시간 환율 데이터' : '저장된 환율 데이터'}
          </div>
          <p className="text-xs text-gray-500 mt-2">{latestRates.message}</p>
        </div>
      )}
      
      {error && displayRates.length === 0 && (
        <div className="text-center py-8 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-800 text-lg font-medium mb-2">환율 정보를 불러올 수 없습니다</p>
            <p className="text-red-600 text-sm mb-4">잠시 후 다시 시도해주세요</p>
            <button 
              onClick={refetch}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hasReceivedData && displayRates.length > 0 ? (
          displayRates.map((rate) => (
            <ExchangeRateCard key={rate.pair} {...rate} />
          ))
        ) : (
          !loading && hasReceivedData && displayRates.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💱</div>
              <div className="text-gray-500">
                <p className="text-lg font-medium mb-2">환율 데이터를 준비하고 있습니다</p>
                <p className="text-sm">잠시 후 다시 시도해주세요</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
} 
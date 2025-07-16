import ExchangeRateCard from "./ExchangeRateCard";

const rates = [
  { pair: "USD/KRW", country: "US", rate: 1340.5, diff: 12.3, diffRate: 0.93 },
  { pair: "JPY/KRW", country: "JP", rate: 8.94, diff: -0.05, diffRate: -0.56 },
  { pair: "EUR/KRW", country: "EU", rate: 1456.78, diff: 8.45, diffRate: 0.58 },
  { pair: "CNY/KRW", country: "CN", rate: 184.32, diff: 2.15, diffRate: 1.18 },
];

export default function ExchangeRateDashboard() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-lg font-bold text-center mb-2">실시간 환율 알림 서비스</h2>
      <p className="text-center text-gray-500 mb-8">원하는 환율에 도달하면 즉시 알림을 받아보세요</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rates.map((rate) => (
          <ExchangeRateCard key={rate.pair} {...rate} />
        ))}
      </div>
    </div>
  );
} 
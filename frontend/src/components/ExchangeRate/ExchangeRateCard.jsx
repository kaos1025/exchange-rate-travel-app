import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export default function ExchangeRateCard({ pair, country, rate, diff, diffRate }) {
  const isUp = diff > 0;
  const isDown = diff < 0;
  const isFlat = diff === 0;
  
  // 변동률에 따른 색상 및 배경 설정
  const getColorClasses = () => {
    if (isUp) return {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100"
    };
    if (isDown) return {
      text: "text-blue-600", 
      bg: "bg-blue-50",
      border: "border-blue-100"
    };
    return {
      text: "text-gray-600",
      bg: "bg-gray-50", 
      border: "border-gray-100"
    };
  };
  
  const colors = getColorClasses();
  
  // 통화 쌍에서 기호 추출
  const [fromCurrency, toCurrency] = pair.split('/');
  
  // 통화별 아이콘 
  const getCurrencyIcon = (currency) => {
    const icons = {
      'USD': '$',
      'JPY': '¥', 
      'EUR': '€',
      'CNY': '¥',
      'KRW': '₩',
      'GBP': '£',
      'AUD': 'A$',
      'CAD': 'C$'
    };
    return icons[currency] || '💱';
  };

  // 통화별 색상
  const getCurrencyColor = (currency) => {
    const colors = {
      'USD': 'from-green-500 to-green-600',
      'JPY': 'from-red-500 to-red-600', 
      'EUR': 'from-blue-500 to-blue-600',
      'CNY': 'from-yellow-500 to-yellow-600',
      'KRW': 'from-purple-500 to-purple-600',
      'GBP': 'from-indigo-500 to-indigo-600',
      'AUD': 'from-orange-500 to-orange-600',
      'CAD': 'from-pink-500 to-pink-600'
    };
    return colors[currency] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={`relative bg-white border-2 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 flex flex-col gap-3 min-w-[200px] ${colors.border} group`}>
      {/* 상단 그라데이션 바 */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${isUp ? 'bg-gradient-to-r from-red-400 to-red-600' : isDown ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-gray-400 to-gray-600'}`}></div>
      
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 bg-gradient-to-br ${getCurrencyColor(fromCurrency)} rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300`}>
            {getCurrencyIcon(fromCurrency)}
          </div>
          <span className="text-sm font-semibold text-gray-700">{pair}</span>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors">{country}</span>
      </div>
      
      <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
        {rate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
        <span className="text-sm font-normal text-gray-500 ml-1">원</span>
      </div>
      
      <div className={`flex items-center justify-between p-3 rounded-lg ${colors.bg} group-hover:shadow-inner transition-all duration-300`}>
        <div className={`flex items-center gap-2 text-sm font-semibold ${colors.text}`}>
          <div className="flex items-center gap-1">
            {isUp && <ArrowUpRight size={18} className="group-hover:scale-125 transition-transform duration-300" />}
            {isDown && <ArrowDownRight size={18} className="group-hover:scale-125 transition-transform duration-300" />}
            {isFlat && <Minus size={18} className="group-hover:scale-125 transition-transform duration-300" />}
            <span>
              {diff > 0 ? "+" : ""}{diff.toFixed(2)}
            </span>
          </div>
        </div>
        <div className={`text-sm font-semibold ${colors.text} bg-white bg-opacity-50 px-2 py-1 rounded`}>
          {diffRate > 0 ? "+" : ""}{diffRate.toFixed(2)}%
        </div>
      </div>
      
      <div className="flex justify-center">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${isUp ? 'bg-red-100 text-red-700' : isDown ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} group-hover:shadow-sm transition-all duration-300`}>
          {isUp && "📈 상승"}
          {isDown && "📉 하락"}
          {isFlat && "➖ 보합"}
        </span>
      </div>
    </div>
  );
} 
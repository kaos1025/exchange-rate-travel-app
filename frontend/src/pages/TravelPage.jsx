import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Plane, 
  MapPin, 
  CreditCard, 
  Coffee, 
  Utensils, 
  Bed, 
  Car, 
  ShoppingBag,
  Wallet,
  Calculator,
  TrendingUp
} from 'lucide-react';

const TRAVEL_ITEMS = [
  {
    category: '교통',
    icon: Plane,
    color: 'blue',
    items: [
      { name: '항공료', price: 850, currency: 'USD', krw: 1123250 },
      { name: '공항 택시', price: 45, currency: 'USD', krw: 59422 },
      { name: '지하철/버스', price: 25, currency: 'USD', krw: 33012 }
    ]
  },
  {
    category: '숙박',
    icon: Bed,
    color: 'green',
    items: [
      { name: '호텔 (3박)', price: 420, currency: 'USD', krw: 554610 },
      { name: '에어비앤비 (4박)', price: 320, currency: 'USD', krw: 422560 }
    ]
  },
  {
    category: '식사',
    icon: Utensils,
    color: 'orange',
    items: [
      { name: '레스토랑 식사', price: 45, currency: 'USD', krw: 59422 },
      { name: '카페/커피', price: 8, currency: 'USD', krw: 10564 },
      { name: '패스트푸드', price: 12, currency: 'USD', krw: 15846 }
    ]
  },
  {
    category: '쇼핑',
    icon: ShoppingBag,
    color: 'purple',
    items: [
      { name: '기념품', price: 80, currency: 'USD', krw: 105640 },
      { name: '의류', price: 150, currency: 'USD', krw: 198075 },
      { name: '전자제품', price: 200, currency: 'USD', krw: 264100 }
    ]
  }
];

const BUDGET_SUMMARY = {
  total_usd: 2185,
  total_krw: 2888022,
  daily_average_usd: 312,
  daily_average_krw: 412574
};

export function TravelPage() {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  const formatPrice = (amount, currency) => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString()}`;
    }
    return `${amount.toLocaleString()}원`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-900">✈️ 여행 예산 계획</h1>
        <p className="text-xl text-blue-600">미국 여행 7일 예상 경비</p>
      </div>

      {/* Budget Summary Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">💰 총 예산 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">{formatPrice(BUDGET_SUMMARY.total_usd, 'USD')}</div>
              <div className="text-blue-100">총 예산 (USD)</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">{formatPrice(BUDGET_SUMMARY.total_krw, 'KRW')}</div>
              <div className="text-blue-100">총 예산 (KRW)</div>
            </div>
          </div>
          <div className="border-t border-blue-400 mt-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-semibold">{formatPrice(BUDGET_SUMMARY.daily_average_usd, 'USD')}</div>
                <div className="text-blue-100 text-sm">일평균 (USD)</div>
              </div>
              <div>
                <div className="text-xl font-semibold">{formatPrice(BUDGET_SUMMARY.daily_average_krw, 'KRW')}</div>
                <div className="text-blue-100 text-sm">일평균 (KRW)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TRAVEL_ITEMS.map((category) => {
          const IconComponent = category.icon;
          const totalUSD = category.items.reduce((sum, item) => sum + item.price, 0);
          const totalKRW = category.items.reduce((sum, item) => sum + item.krw, 0);
          
          return (
            <Card key={category.category} className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className={`p-3 rounded-full ${getColorClasses(category.color)}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-blue-100">
                    <div className="font-medium text-gray-700">{item.name}</div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-600">{formatPrice(item.price, item.currency)}</div>
                      <div className="text-sm text-gray-500">{formatPrice(item.krw, 'KRW')}</div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-blue-200 pt-3 mt-4">
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span className="text-blue-800">소계</span>
                    <div className="text-right">
                      <div className="text-blue-600">{formatPrice(totalUSD, 'USD')}</div>
                      <div className="text-sm text-blue-500">{formatPrice(totalKRW, 'KRW')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Calculator className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-800">예산 계산기</h3>
            <p className="text-green-600">여행 예산을 직접 계산해보세요</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              계산하기
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-purple-800">환율 알림</h3>
            <p className="text-purple-600">좋은 환율을 놓치지 마세요</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              알림 설정
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Wallet className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-orange-800">여행 팁</h3>
            <p className="text-orange-600">환전 및 결제 꿀팁 모음</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              보러가기
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-900 text-center">💡 여행 환전 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-indigo-800 text-lg">💳 결제 수단</h4>
              <ul className="space-y-2 text-indigo-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>해외 수수료 무료 카드 활용</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>현금은 20-30% 정도만 준비</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>ATM 출금 시 현지 은행 이용</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-indigo-800 text-lg">📈 환전 타이밍</h4>
              <ul className="space-y-2 text-indigo-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>환율 알림으로 좋은 시점 포착</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>여행 2-3주 전 환율 모니터링</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>분할 환전으로 리스크 분산</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
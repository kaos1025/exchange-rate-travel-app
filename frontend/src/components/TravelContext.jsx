import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Home, Coffee, Train, Utensils, Car, ShoppingBag, MapPin, Plane, Hotel } from 'lucide-react';

export function TravelContext() {
  const [selectedCountry, setSelectedCountry] = useState('korea');
  const [amount, setAmount] = useState(100);
  const [currency] = useState('USD');

  const countries = {
    korea: {
      name: '한국 (서울)',
      currency: 'KRW',
      exchangeRate: 1340,
      items: [
        { icon: Coffee, label: '스타벅스 아메리카노', price: 4900, unit: '잔' },
        { icon: Utensils, label: '비빔밥', price: 8000, unit: '그릇' },
        { icon: Train, label: '지하철 기본요금', price: 1500, unit: '회' },
        { icon: Car, label: '택시 기본요금', price: 4800, unit: '회' },
        { icon: Home, label: '원룸 월세', price: 700000, unit: '개월' },
        { icon: ShoppingBag, label: '맥도날드 빅맥', price: 6500, unit: '개' }
      ]
    },
    japan: {
      name: '일본 (도쿄)',
      currency: 'JPY',
      exchangeRate: 150,
      items: [
        { icon: Coffee, label: '스타벅스 아메리카노', price: 450, unit: '잔' },
        { icon: Utensils, label: '라멘', price: 800, unit: '그릇' },
        { icon: Train, label: 'JR 야마노테선', price: 160, unit: '회' },
        { icon: Car, label: '탭시 기본요금', price: 500, unit: '회' },
        { icon: Hotel, label: '비즈니스 호텔', price: 12000, unit: '박' },
        { icon: ShoppingBag, label: '빅맥', price: 390, unit: '개' }
      ]
    },
    usa: {
      name: '미국 (뉴욕)',
      currency: 'USD',
      exchangeRate: 1,
      items: [
        { icon: Coffee, label: '스타벅스 아메리카노', price: 5.5, unit: '잔' },
        { icon: Utensils, label: '핸버거 세트', price: 12, unit: '세트' },
        { icon: Train, label: '지하철', price: 2.9, unit: '회' },
        { icon: Car, label: '탭시', price: 15, unit: 'km' },
        { icon: Hotel, label: '중급 호텔', price: 200, unit: '박' },
        { icon: ShoppingBag, label: '빅맩', price: 5.5, unit: '개' }
      ]
    },
    europe: {
      name: '유럽 (파리)',
      currency: 'EUR',
      exchangeRate: 0.85,
      items: [
        { icon: Coffee, label: '카페 에스프레소', price: 3.5, unit: '잔' },
        { icon: Utensils, label: '파스타', price: 15, unit: '그릇' },
        { icon: Train, label: '메트로', price: 2.1, unit: '회' },
        { icon: Car, label: '탭시', price: 8, unit: 'km' },
        { icon: Hotel, label: '중급 호텔', price: 150, unit: '박' },
        { icon: ShoppingBag, label: '빅맥', price: 4.5, unit: '개' }
      ]
    }
  };

  const selectedCountryData = countries[selectedCountry];
  const convertedAmount = amount * selectedCountryData.exchangeRate;

  const calculateQuantity = (price) => {
    return Math.floor(convertedAmount / price);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 및 컨트롤 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">여행 맥락 정보</h3>
              <p className="text-sm text-gray-600 mt-1">
                {amount} {currency}로 할 수 있는 것들
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* 금액 입력 */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">금액:</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10000"
                  />
                  <span className="ml-1 text-sm text-gray-600">{currency}</span>
                </div>
              </div>
              
              {/* 국가 선택 */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">국가:</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(countries).map(([key, country]) => (
                    <option key={key} value={key}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 아이템 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedCountryData.items.map((item, index) => {
          const quantity = calculateQuantity(item.price);
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <item.icon size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.price.toLocaleString()} {selectedCountryData.currency}
                    </p>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-blue-600">
                        {quantity.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 환율 정보 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              현재 환율: 1 {currency} = {selectedCountryData.exchangeRate.toLocaleString()} {selectedCountryData.currency}
            </span>
            <span className="text-gray-600">
              총 예산: {convertedAmount.toLocaleString()} {selectedCountryData.currency}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
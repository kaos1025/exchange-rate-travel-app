#!/usr/bin/env python3
"""
ExchangeRate-API 테스트 스크립트
"""

import urllib.request
import urllib.parse
import json
import sys
from datetime import datetime

def test_exchange_rate_api():
    """ExchangeRate-API 연동 테스트"""
    print("=== ExchangeRate-API 연동 테스트 ===")
    
    try:
        # USD 기준 환율 조회
        url = "https://api.exchangerate-api.com/v4/latest/USD"
        
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
        
        print(f"✅ API 응답 성공")
        print(f"📅 날짜: {data.get('date', 'N/A')}")
        print(f"💱 기준 통화: {data.get('base', 'N/A')}")
        
        # 주요 통화 환율 표시
        rates = data.get('rates', {})
        major_currencies = ['KRW', 'EUR', 'JPY', 'GBP', 'CNY']
        
        print("\n💰 주요 환율 (1 USD 기준):")
        for currency in major_currencies:
            if currency in rates:
                rate = rates[currency]
                if currency == 'KRW':
                    print(f"  → {rate:,.0f} {currency}")
                else:
                    print(f"  → {rate:.4f} {currency}")
        
        return data
        
    except Exception as e:
        print(f"❌ API 테스트 실패: {e}")
        return None

def test_conversion():
    """환율 변환 테스트"""
    print("\n=== 환율 변환 테스트 ===")
    
    try:
        # USD → KRW 변환
        usd_data = test_api_call("USD")
        if usd_data and 'KRW' in usd_data['rates']:
            usd_to_krw = usd_data['rates']['KRW']
            amount = 100
            converted = amount * usd_to_krw
            print(f"✅ {amount} USD = {converted:,.0f} KRW")
        
        # EUR → KRW 변환
        eur_data = test_api_call("EUR")
        if eur_data and 'KRW' in eur_data['rates']:
            eur_to_krw = eur_data['rates']['KRW']
            amount = 100
            converted = amount * eur_to_krw
            print(f"✅ {amount} EUR = {converted:,.0f} KRW")
            
    except Exception as e:
        print(f"❌ 변환 테스트 실패: {e}")

def test_api_call(base_currency):
    """API 호출 헬퍼 함수"""
    try:
        url = f"https://api.exchangerate-api.com/v4/latest/{base_currency}"
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"❌ {base_currency} API 호출 실패: {e}")
        return None

def simulate_backend_logic():
    """백엔드 로직 시뮬레이션"""
    print("\n=== 백엔드 로직 시뮬레이션 ===")
    
    # 실제 구현된 ExchangeRateService 로직 시뮬레이션
    class MockExchangeRateService:
        def __init__(self):
            self.base_url = "https://api.exchangerate-api.com/v4"
        
        def get_current_rates(self, base_currency="USD"):
            try:
                url = f"{self.base_url}/latest/{base_currency}"
                with urllib.request.urlopen(url) as response:
                    return json.loads(response.read().decode())
            except Exception as e:
                raise Exception(f"환율 조회 실패: {e}")
        
        def convert_amount(self, amount, from_currency, to_currency):
            rates_data = self.get_current_rates(from_currency)
            rate = rates_data["rates"].get(to_currency, 0.0)
            converted_amount = amount * rate
            
            return {
                "amount": amount,
                "from_currency": from_currency,
                "to_currency": to_currency,
                "rate": rate,
                "converted_amount": round(converted_amount, 2),
                "timestamp": datetime.now().isoformat()
            }
    
    # 테스트
    service = MockExchangeRateService()
    
    test_cases = [
        {"amount": 100, "from": "USD", "to": "KRW"},
        {"amount": 50, "from": "EUR", "to": "KRW"},
        {"amount": 10000, "from": "JPY", "to": "KRW"}
    ]
    
    for case in test_cases:
        try:
            result = service.convert_amount(
                case["amount"], 
                case["from"], 
                case["to"]
            )
            print(f"✅ {result['amount']} {result['from_currency']} = {result['converted_amount']:,.2f} {result['to_currency']}")
            print(f"   환율: 1 {result['from_currency']} = {result['rate']:.4f} {result['to_currency']}")
        except Exception as e:
            print(f"❌ 변환 실패: {e}")

def test_popular_rates():
    """인기 환율 쌍 테스트"""
    print("\n=== 인기 환율 쌍 테스트 ===")
    
    popular_pairs = {
        "USD": ["KRW", "EUR", "JPY", "GBP"],
        "EUR": ["KRW", "USD", "JPY"],
        "KRW": ["USD", "JPY", "EUR"]
    }
    
    for base, targets in popular_pairs.items():
        try:
            data = test_api_call(base)
            if data:
                print(f"\n📊 {base} 기준:")
                for target in targets:
                    if target in data['rates']:
                        rate = data['rates'][target]
                        if target == 'KRW':
                            print(f"  → {rate:,.0f} {target}")
                        else:
                            print(f"  → {rate:.4f} {target}")
        except Exception as e:
            print(f"❌ {base} 환율 조회 실패: {e}")

def main():
    print("🚀 백엔드 환율 API 테스트 시작")
    print("=" * 50)
    
    # 1. 기본 API 연동 테스트
    api_data = test_exchange_rate_api()
    
    if api_data:
        # 2. 환율 변환 테스트
        test_conversion()
        
        # 3. 백엔드 로직 시뮬레이션
        simulate_backend_logic()
        
        # 4. 인기 환율 쌍 테스트
        test_popular_rates()
    
    print("\n" + "=" * 50)
    print("🏁 테스트 완료")

if __name__ == "__main__":
    main()
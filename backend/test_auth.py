#!/usr/bin/env python3
"""
인증 시스템 테스트 스크립트
백엔드 서버가 실행 중일 때 사용
"""

import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:8000"

def test_auth_system():
    """인증 시스템 전체 테스트"""
    print("🔐 인증 시스템 테스트 시작...")
    
    # 테스트용 사용자 정보
    test_user = {
        "email": "test@example.com",
        "password": "testpass123",
        "display_name": "Test User"
    }
    
    # 1. 회원가입 테스트
    print("\n1. 회원가입 테스트...")
    signup_response = requests.post(f"{BASE_URL}/auth/signup", json=test_user)
    print(f"Status: {signup_response.status_code}")
    print(f"Response: {signup_response.json()}")
    
    # 2. 로그인 테스트
    print("\n2. 로그인 테스트...")
    login_data = {
        "email": test_user["email"],
        "password": test_user["password"]
    }
    login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        login_result = login_response.json()
        print(f"Login successful: {login_result['message']}")
        access_token = login_result.get('access_token')
        
        if access_token:
            # 3. 인증이 필요한 엔드포인트 테스트
            print("\n3. 사용자 정보 조회 테스트...")
            headers = {"Authorization": f"Bearer {access_token}"}
            me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            print(f"Status: {me_response.status_code}")
            print(f"Response: {me_response.json()}")
            
            # 4. 프로필 업데이트 테스트
            print("\n4. 프로필 업데이트 테스트...")
            update_data = {
                "display_name": "Updated Test User",
                "preferred_currency": "USD"
            }
            update_response = requests.put(f"{BASE_URL}/auth/profile", json=update_data, headers=headers)
            print(f"Status: {update_response.status_code}")
            print(f"Response: {update_response.json()}")
        else:
            print("❌ 액세스 토큰을 받지 못했습니다.")
    else:
        print(f"❌ 로그인 실패: {login_response.json()}")
    
    # 5. 로그아웃 테스트
    print("\n5. 로그아웃 테스트...")
    logout_response = requests.post(f"{BASE_URL}/auth/logout")
    print(f"Status: {logout_response.status_code}")
    print(f"Response: {logout_response.json()}")

def test_health_check():
    """서버 상태 확인"""
    print("🏥 서버 상태 확인...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.")
        return False

if __name__ == "__main__":
    if test_health_check():
        test_auth_system()
    else:
        print("\n💡 서버를 시작하려면:")
        print("cd backend && uvicorn app.main:app --reload")
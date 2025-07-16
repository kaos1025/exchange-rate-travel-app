import React from 'react';

export function Hero() {
  return (
    <section className="text-center py-12 mb-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          실시간 환율 알림 서비스
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          원하는 환율에 도달하면 즉시 알림을 받아보세요
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            시작하기
          </button>
          <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
            더 알아보기
          </button>
        </div>
      </div>
    </section>
  );
}
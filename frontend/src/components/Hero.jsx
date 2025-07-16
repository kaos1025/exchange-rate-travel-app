import React from 'react';

export function Hero() {
  return (
    <section className="text-center py-16 mb-16 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
          실시간 환율 알림 서비스
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          원하는 환율에 도달하면 즉시 알림을 받아보세요
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            시작하기
          </button>
          <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500">
            더 알아보기
          </button>
        </div>
      </div>
    </section>
  );
}
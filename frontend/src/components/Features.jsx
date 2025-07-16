import React from 'react';

export function Features() {
  const features = [
    {
      id: 1,
      icon: '⚡',
      title: '실시간 알림',
      description: '원하는 환율에 도달하면 즉시 알림을 받아보세요'
    },
    {
      id: 2,
      icon: '📊',
      title: '정확한 데이터',
      description: '신뢰할 수 있는 금융 기관의 실시간 환율 정보'
    },
    {
      id: 3,
      icon: '🌍',
      title: '다양한 통화',
      description: '전 세계 주요 통화의 환율을 한눈에 확인'
    },
    {
      id: 4,
      icon: '📱',
      title: '모바일 최적화',
      description: '어디서나 편리하게 환율을 확인하고 알림을 받아보세요'
    }
  ];

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          주요 기능
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <div key={feature.id} className="text-center p-6 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
            <div className="text-4xl mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
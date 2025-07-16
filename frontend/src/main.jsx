import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 즉시 실행 로그
console.log('🚀 main.jsx 로드됨!');
console.log('현재 시간:', new Date().toISOString());
console.log('환경:', import.meta.env.MODE);
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
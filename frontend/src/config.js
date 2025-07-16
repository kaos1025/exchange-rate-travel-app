const config = {
  development: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://exchange-rate-travel-app-production.up.railway.app',
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL || 'https://exchange-rate-travel-app-production.up.railway.app',
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
};

const environment = import.meta.env.VITE_ENVIRONMENT || 'development';

// Railway URL을 기본값으로 강제 설정
const finalConfig = {
  ...config[environment],
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://exchange-rate-travel-app-production.up.railway.app'
};

export default finalConfig;
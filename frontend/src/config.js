const config = {
  development: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
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
export default config[environment];
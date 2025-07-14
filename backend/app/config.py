import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_service_key: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    exchange_rate_api_key: str = os.getenv("EXCHANGE_RATE_API_KEY", "")
    sendgrid_api_key: str = os.getenv("SENDGRID_API_KEY", "")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")

settings = Settings()
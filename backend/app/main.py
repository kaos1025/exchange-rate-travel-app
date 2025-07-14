from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, exchange, alerts

app = FastAPI(title="Exchange Rate Travel App", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(exchange.router, tags=["exchange"])
app.include_router(alerts.router, tags=["alerts"])

@app.get("/")
def read_root():
    return {"message": "Exchange Rate Travel App API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Coding & DSA Platform"
    API_V1_STR: str = "/api/v1"
    
    # JWT authentication details
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_jwt_signing_key_change_me_in_production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./database.db")
    
    # Code Execution API
    PISTON_API_URL: str = os.getenv("PISTON_API_URL", "https://emkc.org/api/v2/piston")
    
    # AI API Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings()

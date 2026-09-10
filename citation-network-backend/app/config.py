"""
Configuration settings for Research Network API
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    ENV: str = "development"
    DEBUG: bool = True
    
    # API Keys
    SERPAPI_KEY: str = ""
    SEMANTIC_SCHOLAR_API_KEY: str = ""  # Optional - free tier works fine
    DEEPSEEK_API_KEY: str = ""  # For LLM cluster labeling
    OPENAI_API_KEY: str = ""  # Alternative for LLM cluster labeling
    
    # Demo/Default - your profile for initial data/demos
    DEFAULT_GOOGLE_SCHOLAR_AUTHOR_ID: str = ""  # Set this to your ID for demo data
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:9002",
        "https://drjforrest.com",
        "https://www.drjforrest.com",
        "https://api.drjforrest.com"  # API itself for docs UI
    ]
    
    # Database (optional for now)
    DATABASE_URL: str = "sqlite:///./research_network.db"
    
    # Data directories
    DATA_DIR: str = "data"
    RAW_DATA_DIR: str = "data/raw"
    PROCESSED_DATA_DIR: str = "data/processed"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra='ignore'  # Allow extra env vars without validation errors
    )


settings = Settings()
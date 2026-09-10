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
    
    # Optional — only used to turn a Google Scholar URL into a name
    SERPER_API_KEY: str = ""
    SEMANTIC_SCHOLAR_API_KEY: str = ""
    DEEPSEEK_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # OpenAlex (primary paper source — no API key)
    OPENALEX_MAILTO: str = ""
    DEFAULT_OPENALEX_AUTHOR_ID: str = "A5022908989"
    DEFAULT_AUTHOR_NAME: str = "Jamie I. Forrest"
    DEFAULT_GOOGLE_SCHOLAR_AUTHOR_ID: str = "iHagz9UAAAAJ"
    
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
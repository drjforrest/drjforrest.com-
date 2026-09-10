"""
FastAPI Main Application
research-network-api/app/main.py
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from datetime import datetime

from app.config import settings
from app.routers import papers, health

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="Research Network API",
    description="API for Jamie Forrest's research citation network visualization",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(papers.router, prefix="/api", tags=["papers"])


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("Research Network API starting up...")
    logger.info(f"Environment: {settings.ENV}")
    logger.info(f"CORS origins: {settings.ALLOWED_ORIGINS}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Research Network API shutting down...")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Research Network API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat(),
        "docs": "/api/docs"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.ENV == "development" else "An error occurred"
        }
    )

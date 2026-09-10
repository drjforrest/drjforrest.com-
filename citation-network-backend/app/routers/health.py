"""
Health check endpoints
"""
from fastapi import APIRouter
from datetime import datetime
import psutil
import os

router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Research Network API"
    }


@router.get("/health/detailed")
async def detailed_health():
    """Detailed health check with system metrics"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Research Network API",
        "system": {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent
        },
        "environment": {
            "python_version": os.sys.version,
            "process_id": os.getpid()
        }
    }

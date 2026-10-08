from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import router as v1_router
from app.core.config import settings
from app.core.logging import logger

app = FastAPI(
    title="PRAVAH - Predictive Disaster Decision Intelligence System",
    description="Predictive Resilience & Adaptive Vulnerability-Aware Hazard Response API for Urban Flooding & Cascading Crisis Management",
    version="1.0.0"
)

# Enable CORS for React frontend (Vercel production, preview regex, local dev)
allowed_origins = [
    "https://pravah-sooty.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000"
]

if getattr(settings, "CORS_ORIGINS", None):
    for origin in settings.CORS_ORIGINS.split(","):
        cleaned = origin.strip()
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")

@app.get("/health")
async def root_health():
    return {
        "system": "PRAVAH",
        "status": "OPERATIONAL",
        "environment": settings.ENVIRONMENT,
        "demo_mode": settings.DEMO_MODE,
        "hazard_scenario": "CHENNAI_URBAN_FLOOD_RESPONSE"
    }

@app.on_event("startup")
async def on_startup():
    logger.info("PRAVAH Decision Intelligence Backend initialized successfully.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)

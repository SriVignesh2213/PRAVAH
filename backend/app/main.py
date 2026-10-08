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

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

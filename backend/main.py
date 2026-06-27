import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import engine
from database import models
from api.endpoints import router as api_router

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Parashari Jyotish Software API",
    description="Vedic Astrology Calculation Engine and Database Services",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "Parashari Jyotish Software API is running.",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

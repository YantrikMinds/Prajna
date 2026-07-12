from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.seeder import seed_problems
from app.api.router import api_router

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    
    # Create static directory if it doesn't exist
    os.makedirs("app/static", exist_ok=True)
    
    # Seed problems if not already present
    db = SessionLocal()
    try:
        seed_problems(db)
    finally:
        db.close()
        
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default port
    "http://localhost:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
def serve_home():
    index_path = "app/static/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Welcome to the AI-Powered Coding & DSA Platform Backend API! Static frontend index.html not found."}


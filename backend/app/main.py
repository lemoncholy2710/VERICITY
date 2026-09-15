from contextlib import asynccontextmanager

from fastapi import FastAPI

from .database import init_db
from .routes.complaints import router as complaints_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="VERICITY API",
    description="Backend API for transparent and accountable civic complaint resolution.",
    version="0.1.0",
    lifespan=lifespan,
)


app.include_router(complaints_router)


@app.get("/")
def root():
    return {
        "message": "VERICITY API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
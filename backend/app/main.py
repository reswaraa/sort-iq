from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import classification

app = FastAPI(
    title="Smart Waste Bin API",
    description="API for classifying waste images and tracking waste weights",
    version="0.1.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(classification.router, prefix="/api", tags=["Classification"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "OK", "message": "Smart Waste Bin API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
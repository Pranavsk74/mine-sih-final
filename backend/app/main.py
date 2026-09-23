import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routes import sensors, predictions, models, reports

# Create DB tables if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BGY Subterranean Risk Prediction API",
    description="Real PyTorch LSTM & Transformer Machine Learning Engine for BhoomiGatYaan Underground Mining Rover",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sensors.router)
app.include_router(predictions.router)
app.include_router(models.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "project": "BGY — BhoomiGatYaan",
        "system": "Subterranean Risk ML Engine",
        "status": "ONLINE",
        "models": ["PyTorch LSTM", "PyTorch Transformer"],
        "database": "SQLite (SQLAlchemy)"
    }

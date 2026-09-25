import os
import sys
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.database import get_db
from app.models import ModelMetric

router = APIRouter(prefix="/api/ml", tags=["ML Models"])

MODELS_DIR = os.path.join(BACKEND_DIR, "models")
METRICS_PATH = os.path.join(MODELS_DIR, "metrics.json")
HISTORY_PATH = os.path.join(MODELS_DIR, "history.json")

@router.get("/metrics")
def get_model_metrics(db: Session = Depends(get_db)):
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            return json.load(f)
    
    # Fallback to DB
    metrics_db = db.query(ModelMetric).all()
    if metrics_db:
        result = {}
        for m in metrics_db:
            result[m.model_name] = {
                "model_name": m.model_name,
                "accuracy": m.accuracy,
                "precision": m.precision,
                "recall": m.recall,
                "f1_score": m.f1_score,
                "confusion_matrix": json.loads(m.confusion_matrix)
            }
        return result

    raise HTTPException(status_code=404, detail="Model metrics not found. Run train.py first.")

@router.get("/history")
def get_training_history():
    if os.path.exists(HISTORY_PATH):
        with open(HISTORY_PATH, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Training history not found. Run train.py first.")

@router.get("/models")
def get_model_status():
    lstm_exists = os.path.exists(os.path.join(MODELS_DIR, "lstm.pt"))
    trans_exists = os.path.exists(os.path.join(MODELS_DIR, "transformer.pt"))
    scaler_exists = os.path.exists(os.path.join(MODELS_DIR, "scaler.pkl"))

    return {
        "status": "ONLINE" if (lstm_exists and trans_exists and scaler_exists) else "INITIALIZING",
        "models": {
            "lstm": {
                "id": "lstm",
                "name": "PyTorch LSTM Classifier",
                "category": "Temporal Sensor Risk Model",
                "architecture": "PyTorch LSTM (2 Layers, 64 Hidden Units, Dropout 0.2)",
                "sequence_length": 20,
                "status": "ONLINE" if lstm_exists else "OFFLINE",
                "features": ["CH4", "CO", "Temperature", "Humidity", "Pressure", "Vibration"]
            },
            "transformer": {
                "id": "transformer",
                "name": "PyTorch Transformer Classifier",
                "category": "Attention-Based Time-Series Model",
                "architecture": "PyTorch TransformerEncoder (4 Heads, 3 Encoder Layers, d_model 64)",
                "sequence_length": 20,
                "status": "ONLINE" if trans_exists else "OFFLINE",
                "features": ["CH4", "CO", "Temperature", "Humidity", "Pressure", "Vibration"]
            }
        }
    }

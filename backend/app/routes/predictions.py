import os
import sys
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.database import get_db
from app.models import SensorReading
from app.schemas import SensorReadingCreate, PredictionResponse
from ml.inference import InferenceEngine

router = APIRouter(prefix="/api/predict", tags=["Predictions"])

MODELS_DIR = "backend/models"
inference_engine = InferenceEngine(models_dir=MODELS_DIR)

@router.post("", response_model=PredictionResponse)
def predict_risk(
    reading_in: SensorReadingCreate,
    save_to_db: bool = True,
    db: Session = Depends(get_db)
):
    try:
        # Fetch up to 19 recent historical readings from database to build 20-timestep sequence window
        recent_readings = db.query(SensorReading).order_by(SensorReading.id.desc()).limit(19).all()
        recent_dicts = [
            {
                "methane_ch4": r.methane_ch4,
                "carbon_monoxide_co": r.carbon_monoxide_co,
                "temperature": r.temperature,
                "humidity": r.humidity,
                "pressure": r.pressure,
                "vibration": r.vibration
            }
            for r in reversed(recent_readings)
        ]
        
        # Append current user input reading
        current_dict = {
            "methane_ch4": reading_in.methane_ch4,
            "carbon_monoxide_co": reading_in.carbon_monoxide_co,
            "temperature": reading_in.temperature,
            "humidity": reading_in.humidity,
            "pressure": reading_in.pressure,
            "vibration": reading_in.vibration
        }
        recent_dicts.append(current_dict)

        # Execute PyTorch inference engine
        pred_result = inference_engine.predict_sequence(recent_dicts)
        fused_class_index = pred_result["fused_risk"]["class_index"]

        if save_to_db:
            db_reading = SensorReading(
                timestamp=datetime.now(),
                mission_id=reading_in.mission_id or "SHAFT-B4-EXP1",
                methane_ch4=reading_in.methane_ch4,
                carbon_monoxide_co=reading_in.carbon_monoxide_co,
                temperature=reading_in.temperature,
                humidity=reading_in.humidity,
                pressure=reading_in.pressure,
                vibration=reading_in.vibration,
                source=reading_in.source or "synthetic",
                risk_label=fused_class_index,
                created_at=datetime.now()
            )
            db.add(db_reading)
            db.commit()

        return PredictionResponse(
            input_reading=reading_in,
            timestamp=datetime.now(),
            lstm=pred_result["lstm"],
            transformer=pred_result["transformer"],
            fused_risk=pred_result["fused_risk"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

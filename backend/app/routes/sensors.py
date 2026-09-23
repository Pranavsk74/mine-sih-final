import os
import sys
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.database import get_db
from app.models import SensorReading
from app.schemas import SensorReadingCreate, SensorReadingResponse, PaginatedSensorResponse
from ml.inference import InferenceEngine

router = APIRouter(prefix="/api/sensors", tags=["Sensors"])

MODELS_DIR = "backend/models"
inference_engine = InferenceEngine(models_dir=MODELS_DIR)

@router.get("", response_model=PaginatedSensorResponse)
def get_sensor_readings(
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    mission_id: Optional[str] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SensorReading)

    if mission_id:
        query = query.filter(SensorReading.mission_id == mission_id)
    if source:
        query = query.filter(SensorReading.source == source)

    total = query.count()
    readings = query.order_by(SensorReading.id.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return PaginatedSensorResponse(
        total=total,
        page=page,
        page_size=page_size,
        readings=readings
    )

@router.post("", response_model=SensorReadingResponse)
def add_sensor_reading(
    reading_in: SensorReadingCreate,
    db: Session = Depends(get_db)
):
    # Perform quick inference to obtain risk_label if inference engine is ready
    risk_label = None
    try:
        # Fetch last 19 readings to construct 20-step sequence window
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
        recent_dicts.append(reading_in.dict())

        pred = inference_engine.predict_sequence(recent_dicts)
        risk_label = pred["fused_risk"]["class_index"]
    except Exception as e:
        print(f"[Warning] Live inference warning during reading insertion: {e}")

    db_reading = SensorReading(
        timestamp=datetime.now(),
        mission_id=reading_in.mission_id or "SHAFT-B4-EXP1",
        methane_ch4=reading_in.methane_ch4,
        carbon_monoxide_co=reading_in.carbon_monoxide_co,
        temperature=reading_in.temperature,
        humidity=reading_in.humidity,
        pressure=reading_in.pressure,
        vibration=reading_in.vibration,
        source=reading_in.source or "hardware",
        risk_label=risk_label,
        created_at=datetime.now()
    )

    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)

    return db_reading

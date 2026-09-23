from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class SensorReadingBase(BaseModel):
    methane_ch4: float = Field(..., description="MQ-4 Methane gas concentration in % LEL", ge=0.0, le=10.0)
    carbon_monoxide_co: float = Field(..., description="MQ-7 Carbon Monoxide concentration in PPM", ge=0.0, le=1000.0)
    temperature: float = Field(..., description="BME280 Ambient temperature in °C", ge=-20.0, le=100.0)
    humidity: float = Field(..., description="BME280 Relative humidity in %", ge=0.0, le=100.0)
    pressure: float = Field(1013.25, description="BME280 Barometric pressure in hPa", ge=800.0, le=1200.0)
    vibration: float = Field(..., description="MPU6050 Accelerometer peak vibration in g", ge=0.0, le=10.0)
    mission_id: Optional[str] = "SHAFT-B4-EXP1"
    source: Optional[str] = "synthetic"

class SensorReadingCreate(SensorReadingBase):
    pass

class SensorReadingResponse(SensorReadingBase):
    id: int
    timestamp: datetime
    risk_label: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ModelPredictionDetail(BaseModel):
    risk_class: str # "LOW", "MODERATE", "HIGH", "CRITICAL"
    class_index: int # 0, 1, 2, 3
    confidence: float # Softmax probability (0.0 to 1.0)
    probabilities: Dict[str, float]

class FusedRiskAssessment(BaseModel):
    risk_class: str
    class_index: int
    risk_score: float # 0.0 to 100.0
    status_label: str # "LOW", "MODERATE", "HIGH", "CRITICAL"
    explanation: str

class PredictionResponse(BaseModel):
    input_reading: SensorReadingBase
    timestamp: datetime
    lstm: ModelPredictionDetail
    transformer: ModelPredictionDetail
    fused_risk: FusedRiskAssessment

class ModelMetricsResponse(BaseModel):
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]
    updated_at: Optional[datetime] = None

class PaginatedSensorResponse(BaseModel):
    total: int
    page: int
    page_size: int
    readings: List[SensorReadingResponse]

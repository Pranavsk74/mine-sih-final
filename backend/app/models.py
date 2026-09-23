from sqlalchemy import Column, Integer, Float, String, DateTime, Text, func
from .database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=func.now(), index=True)
    mission_id = Column(String(64), index=True, default="SHAFT-B4-EXP1")
    methane_ch4 = Column(Float, nullable=False)
    carbon_monoxide_co = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    pressure = Column(Float, nullable=False, default=1013.25)
    vibration = Column(Float, nullable=False)
    source = Column(String(32), default="synthetic") # "synthetic" | "hardware"
    risk_label = Column(Integer, nullable=True) # 0=LOW, 1=MODERATE, 2=HIGH, 3=CRITICAL
    created_at = Column(DateTime, default=func.now())

class ModelMetric(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(32), unique=True, index=True) # "lstm" | "transformer"
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    confusion_matrix = Column(Text, nullable=False) # JSON serialized string
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

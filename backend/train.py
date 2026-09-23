import os
import sys
import json
import pandas as pd
from sqlalchemy.orm import Session

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.database import engine, Base, SessionLocal
from app.models import SensorReading, ModelMetric
from ml.data_generator import generate_synthetic_telemetry
from ml.preprocessing import split_by_mission, fit_and_save_scaler, create_sequence_windows
from ml.train_lstm import train_lstm_model
from ml.train_transformer import train_transformer_model

def run_training_pipeline():
    print("==================================================")
    print("  BGY PROJECT — ML/DL MODEL TRAINING PIPELINE")
    print("==================================================")

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, "models")
    os.makedirs(MODELS_DIR, exist_ok=True)

    scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
    lstm_path = os.path.join(MODELS_DIR, "lstm.pt")
    transformer_path = os.path.join(MODELS_DIR, "transformer.pt")
    metrics_path = os.path.join(MODELS_DIR, "metrics.json")
    history_path = os.path.join(MODELS_DIR, "history.json")

    # 1. Initialize SQLite Database Tables
    print("\n[1/6] Initializing SQLite database tables...")
    Base.metadata.create_all(bind=engine)

    # 2. Generate Synthetic Telemetry Dataset
    print("[2/6] Generating synthetic subterranean time-series sensor readings...")
    df = generate_synthetic_telemetry(num_missions=15, timesteps_per_mission=1000, seed=42)
    print(f"      Generated {len(df)} sensor readings across {df['mission_id'].nunique()} missions.")

    # 3. Store Readings in SQLite Database
    print("[3/6] Storing generated readings into SQLite database...")
    db: Session = SessionLocal()
    try:
        # Clear old synthetic readings if any
        db.query(SensorReading).filter(SensorReading.source == "synthetic").delete()
        db.commit()

        # Bulk insert
        reading_objects = [
            SensorReading(
                timestamp=row["timestamp"],
                mission_id=row["mission_id"],
                methane_ch4=row["methane_ch4"],
                carbon_monoxide_co=row["carbon_monoxide_co"],
                temperature=row["temperature"],
                humidity=row["humidity"],
                pressure=row["pressure"],
                vibration=row["vibration"],
                source=row["source"],
                risk_label=row["risk_label"]
            )
            for _, row in df.iterrows()
        ]
        db.bulk_save_objects(reading_objects)
        db.commit()
        print(f"      Successfully inserted {len(reading_objects)} records into SQLite.")
    finally:
        db.close()

    # 4. Train / Val / Test Split & Scaler Fitting
    print("[4/6] Splitting data by mission sequences (70% Train, 15% Val, 15% Test)...")
    train_df, val_df, test_df = split_by_mission(df, train_ratio=0.70, val_ratio=0.15)
    print(f"      Train: {len(train_df)} rows | Val: {len(val_df)} rows | Test: {len(test_df)} rows")

    print("      Fitting StandardScaler strictly on Training set...")
    scaler = fit_and_save_scaler(train_df, scaler_path)

    seq_len = 20
    print(f"      Constructing {seq_len}-step sliding sequence windows...")
    X_train, y_train = create_sequence_windows(train_df, scaler, sequence_length=seq_len)
    X_val, y_val = create_sequence_windows(val_df, scaler, sequence_length=seq_len)
    X_test, y_test = create_sequence_windows(test_df, scaler, sequence_length=seq_len)
    print(f"      Sequences -> Train: {X_train.shape} | Val: {X_val.shape} | Test: {X_test.shape}")

    # 5. Train PyTorch LSTM Model
    print("\n[5/6] Training PyTorch LSTM Classifier...")
    lstm_model, lstm_metrics, lstm_history = train_lstm_model(
        X_train, y_train, X_val, y_val, X_test, y_test,
        save_path=lstm_path, epochs=25, batch_size=64, lr=0.001
    )
    print(f"      LSTM Test Accuracy: {lstm_metrics['accuracy']}% | F1: {lstm_metrics['f1_score']}")

    # 6. Train PyTorch Transformer Model
    print("\n[6/6] Training PyTorch Transformer Classifier...")
    trans_model, trans_metrics, trans_history = train_transformer_model(
        X_train, y_train, X_val, y_val, X_test, y_test,
        save_path=transformer_path, epochs=25, batch_size=64, lr=0.0008
    )
    print(f"      Transformer Test Accuracy: {trans_metrics['accuracy']}% | F1: {trans_metrics['f1_score']}")

    # Save metrics and history JSON files
    all_metrics = {
        "lstm": lstm_metrics,
        "transformer": trans_metrics
    }
    all_history = {
        "lstm": lstm_history,
        "transformer": trans_history
    }

    with open(metrics_path, "w") as f:
        json.dump(all_metrics, f, indent=2)

    with open(history_path, "w") as f:
        json.dump(all_history, f, indent=2)

    # Save metrics into SQLite ModelMetric table
    db = SessionLocal()
    try:
        db.query(ModelMetric).delete()
        db.commit()

        for m_name, m_data in all_metrics.items():
            db_metric = ModelMetric(
                model_name=m_name,
                accuracy=m_data["accuracy"],
                precision=m_data["precision"],
                recall=m_data["recall"],
                f1_score=m_data["f1_score"],
                confusion_matrix=json.dumps(m_data["confusion_matrix"])
            )
            db.add(db_metric)
        db.commit()
    finally:
        db.close()

    print("\n==================================================")
    print("  TRAINING COMPLETE — MODEL WEIGHTS & METRICS SAVED")
    print(f"  LSTM Model:        {lstm_path}")
    print(f"  Transformer Model: {transformer_path}")
    print(f"  Scaler:            {scaler_path}")
    print(f"  Metrics Summary:   {metrics_path}")
    print("==================================================")

if __name__ == "__main__":
    run_training_pipeline()

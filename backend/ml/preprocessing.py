import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from typing import Tuple, List, Dict

FEATURE_COLS = ["methane_ch4", "carbon_monoxide_co", "temperature", "humidity", "pressure", "vibration"]
LABEL_COL = "risk_label"

def split_by_mission(df: pd.DataFrame, train_ratio: float = 0.70, val_ratio: float = 0.15) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Splits DataFrame by mission IDs to prevent temporal leakage across adjacent sliding windows.
    """
    missions = df["mission_id"].unique()
    num_missions = len(missions)

    train_end = int(num_missions * train_ratio)
    val_end = int(num_missions * (train_ratio + val_ratio))

    train_missions = missions[:train_end]
    val_missions = missions[train_end:val_end]
    test_missions = missions[val_end:]

    train_df = df[df["mission_id"].isin(train_missions)].copy()
    val_df = df[df["mission_id"].isin(val_missions)].copy()
    test_df = df[df["mission_id"].isin(test_missions)].copy()

    return train_df, val_df, test_df

def fit_and_save_scaler(train_df: pd.DataFrame, scaler_path: str) -> StandardScaler:
    """
    Fits StandardScaler strictly on the training set features and saves to disk.
    """
    scaler = StandardScaler()
    scaler.fit(train_df[FEATURE_COLS].values)

    os.makedirs(os.path.dirname(scaler_path), exist_ok=True)
    joblib.dump(scaler, scaler_path)
    return scaler

def load_scaler(scaler_path: str) -> StandardScaler:
    """
    Loads saved StandardScaler from disk.
    """
    return joblib.load(scaler_path)

def create_sequence_windows(df: pd.DataFrame, scaler: StandardScaler, sequence_length: int = 20) -> Tuple[np.ndarray, np.ndarray]:
    """
    Creates 3D sequence arrays [N, sequence_length, num_features] and target labels [N]
    grouped per mission to prevent cross-mission boundary windowing.
    The target label for each sequence window is the risk_label of the LAST timestep in the window.
    """
    X_seqs = []
    y_seqs = []

    for mission_id, group in df.groupby("mission_id"):
        features = scaler.transform(group[FEATURE_COLS].values)
        labels = group[LABEL_COL].values

        n_samples = len(group)
        if n_samples < sequence_length:
            continue

        for i in range(n_samples - sequence_length + 1):
            X_seqs.append(features[i : i + sequence_length])
            y_seqs.append(labels[i + sequence_length - 1])

    return np.array(X_seqs, dtype=np.float32), np.array(y_seqs, dtype=np.int64)

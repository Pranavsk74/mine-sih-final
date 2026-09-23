import os
import json
import torch
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from .lstm_model import PyTorchLSTMClassifier
from .transformer_model import PyTorchTransformerClassifier
from .preprocessing import load_scaler, FEATURE_COLS

RISK_CLASS_MAP = {
    0: "LOW",
    1: "MODERATE",
    2: "HIGH",
    3: "CRITICAL"
}

class InferenceEngine:
    def __init__(self, models_dir: str):
        self.models_dir = models_dir
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.scaler_path = os.path.join(models_dir, "scaler.pkl")
        self.lstm_path = os.path.join(models_dir, "lstm.pt")
        self.transformer_path = os.path.join(models_dir, "transformer.pt")
        self.metrics_path = os.path.join(models_dir, "metrics.json")
        self.history_path = os.path.join(models_dir, "history.json")

        self.scaler = None
        self.lstm_model = None
        self.transformer_model = None
        self.metrics = {}
        self.history = {}

        self.load_artifacts()

    def load_artifacts(self):
        """
        Loads saved scaler, PyTorch LSTM weights, PyTorch Transformer weights, metrics, and training history.
        """
        if os.path.exists(self.scaler_path):
            self.scaler = load_scaler(self.scaler_path)

        input_size = len(FEATURE_COLS)

        if os.path.exists(self.lstm_path):
            self.lstm_model = PyTorchLSTMClassifier(input_size=input_size, hidden_size=64, num_layers=2, num_classes=4).to(self.device)
            self.lstm_model.load_state_dict(torch.load(self.lstm_path, map_location=self.device))
            self.lstm_model.eval()

        if os.path.exists(self.transformer_path):
            self.transformer_model = PyTorchTransformerClassifier(input_size=input_size, d_model=64, nhead=4, num_layers=3, num_classes=4).to(self.device)
            self.transformer_model.load_state_dict(torch.load(self.transformer_path, map_location=self.device))
            self.transformer_model.eval()

        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, "r") as f:
                self.metrics = json.load(f)

        if os.path.exists(self.history_path):
            with open(self.history_path, "r") as f:
                self.history = json.load(f)

    def is_ready(self) -> bool:
        return (self.scaler is not None) and (self.lstm_model is not None) and (self.transformer_model is not None)

    def predict_sequence(self, sequence_readings: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Takes a sequence of reading dicts (length >= 1), scales them, and runs inference.
        If sequence length < 20, repeats/pads the sequence to 20 timesteps.
        """
        if not self.is_ready():
            self.load_artifacts()
            if not self.is_ready():
                raise RuntimeError("PyTorch ML models or scaler not loaded. Run train.py first.")

        df_seq = pd.DataFrame(sequence_readings)[FEATURE_COLS]

        # Pad sequence if less than 20 timesteps by duplicating earliest row
        target_len = 20
        if len(df_seq) < target_len:
            pad_count = target_len - len(df_seq)
            first_row = df_seq.iloc[[0]]
            pad_df = pd.concat([first_row] * pad_count, ignore_index=True)
            df_seq = pd.concat([pad_df, df_seq], ignore_index=True)
        elif len(df_seq) > target_len:
            df_seq = df_seq.iloc[-target_len:]

        # Transform features using saved scaler
        scaled_features = self.scaler.transform(df_seq.values) # [20, 6]
        input_tensor = torch.tensor(scaled_features, dtype=torch.float32).unsqueeze(0).to(self.device) # [1, 20, 6]

        with torch.no_grad():
            lstm_logits = self.lstm_model(input_tensor)
            lstm_probs = torch.softmax(lstm_logits, dim=1).squeeze(0).cpu().numpy()

            trans_logits = self.transformer_model(input_tensor)
            trans_probs = torch.softmax(trans_logits, dim=1).squeeze(0).cpu().numpy()

        # Format LSTM results
        lstm_class_idx = int(np.argmax(lstm_probs))
        lstm_class = RISK_CLASS_MAP[lstm_class_idx]
        lstm_detail = {
            "risk_class": lstm_class,
            "class_index": lstm_class_idx,
            "confidence": round(float(lstm_probs[lstm_class_idx]), 4),
            "probabilities": {RISK_CLASS_MAP[i]: round(float(p), 4) for i, p in enumerate(lstm_probs)}
        }

        # Format Transformer results
        trans_class_idx = int(np.argmax(trans_probs))
        trans_class = RISK_CLASS_MAP[trans_class_idx]
        trans_detail = {
            "risk_class": trans_class,
            "class_index": trans_class_idx,
            "confidence": round(float(trans_probs[trans_class_idx]), 4),
            "probabilities": {RISK_CLASS_MAP[i]: round(float(p), 4) for i, p in enumerate(trans_probs)}
        }

        # Fused Ensemble Decision Strategy (60% LSTM + 40% Transformer)
        fused_probs = (lstm_probs * 0.6) + (trans_probs * 0.4)
        fused_class_idx = int(np.argmax(fused_probs))
        fused_class = RISK_CLASS_MAP[fused_class_idx]

        # Calculate BGY Demonstration Risk Score (0-100)
        # Expected risk index (0 to 3) scaled to 0-100 + softmax confidence weighting
        expected_risk = sum(i * p for i, p in enumerate(fused_probs)) # 0.0 to 3.0
        risk_score = min(100.0, max(0.0, round(float(expected_risk / 3.0 * 100.0), 1)))

        fused_detail = {
            "risk_class": fused_class,
            "class_index": fused_class_idx,
            "risk_score": risk_score,
            "status_label": fused_class,
            "explanation": f"Ensemble prediction: {lstm_class} (LSTM {round(float(lstm_probs[lstm_class_idx]*100),1)}%) and {trans_class} (Transformer {round(float(trans_probs[trans_class_idx]*100),1)}%). BGY Demonstration Risk Score: {risk_score}/100."
        }

        return {
            "lstm": lstm_detail,
            "transformer": trans_detail,
            "fused_risk": fused_detail
        }

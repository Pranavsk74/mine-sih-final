import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def compute_risk_label(ch4: float, co: float, temp: float, humidity: float, pressure: float, vib: float) -> int:
    """
    Computes a synthetic ground-truth risk class (0=LOW, 1=MODERATE, 2=HIGH, 3=CRITICAL)
    based on multi-parameter thresholds and severity combinations.
    Does NOT leak target labels into input features.
    """
    ch4_score = 0.0
    if ch4 > 2.2:
        ch4_score = 3.0
    elif ch4 > 1.4:
        ch4_score = 2.0
    elif ch4 > 0.85:
        ch4_score = 1.0

    co_score = 0.0
    if co > 120:
        co_score = 3.0
    elif co > 60:
        co_score = 2.0
    elif co > 28:
        co_score = 1.0

    vib_score = 0.0
    if vib > 0.55:
        vib_score = 3.0
    elif vib > 0.28:
        vib_score = 2.0
    elif vib > 0.12:
        vib_score = 1.0

    temp_score = 1.0 if temp > 35 else (2.0 if temp > 42 else 0.0)

    # Weighted combined severity score
    total_severity = (ch4_score * 1.2) + (co_score * 1.0) + (vib_score * 0.9) + (temp_score * 0.4)

    if total_severity >= 3.6 or ch4_score >= 3.0 or co_score >= 3.0 or vib_score >= 3.0:
        return 3 # CRITICAL
    elif total_severity >= 2.2 or (ch4_score >= 2.0 and co_score >= 1.0) or (vib_score >= 2.0 and ch4_score >= 1.0):
        return 2 # HIGH
    elif total_severity >= 0.9 or ch4_score >= 1.0 or co_score >= 1.0 or vib_score >= 1.0:
        return 1 # MODERATE
    else:
        return 0 # LOW

def generate_synthetic_telemetry(num_missions: int = 15, timesteps_per_mission: int = 1000, seed: int = 42) -> pd.DataFrame:
    """
    Generates a realistic time-series dataset of subterranean mine sensor readings
    with temporal autocorrelation, trend drifts, noise, and correlated anomalies.
    Returns a DataFrame with columns:
    [timestamp, mission_id, methane_ch4, carbon_monoxide_co, temperature, humidity, pressure, vibration, source, risk_label]
    """
    np.random.seed(seed)
    records = []
    start_time = datetime(2026, 9, 20, 8, 0, 0)

    for m in range(num_missions):
        mission_id = f"SHAFT-B4-MISSION-{m+1:02d}"
        mission_time = start_time + timedelta(hours=m * 4)

        # Base parameters for the mission
        ch4 = 0.6 + np.random.uniform(-0.1, 0.1)
        co = 14.0 + np.random.uniform(-2, 2)
        temp = 24.0 + np.random.uniform(-1, 1)
        humidity = 67.0 + np.random.uniform(-3, 3)
        pressure = 1013.25 + np.random.uniform(-5, 5)
        vib = 0.04 + np.random.uniform(-0.01, 0.01)

        # Determine mission hazard profile trajectory (e.g. progressive gas leak, seismic tremor)
        hazard_type = np.random.choice(["normal", "gas_leak", "seismic_shock", "compound_breach"], p=[0.3, 0.3, 0.2, 0.2])

        for t in range(timesteps_per_mission):
            current_time = mission_time + timedelta(seconds=t * 2)

            # Random walk drift
            ch4_drift = np.random.normal(0, 0.012)
            co_drift = np.random.normal(0, 0.4)
            temp_drift = np.random.normal(0, 0.03)
            humidity_drift = np.random.normal(0, 0.05)
            pressure_drift = np.random.normal(0, 0.08)
            vib_drift = np.random.normal(0, 0.005)

            # Inject trajectory trends based on mission hazard type
            progress = t / timesteps_per_mission

            if hazard_type == "gas_leak" and progress > 0.3:
                # Progressive exponential methane & CO accumulation
                ch4_drift += 0.003 * (progress ** 1.5)
                co_drift += 0.12 * (progress ** 1.5)
            elif hazard_type == "seismic_shock" and progress > 0.4:
                # Increasing structural micro-vibrations
                vib_drift += 0.002 * (progress ** 2.0)
                temp_drift += 0.01 * progress
            elif hazard_type == "compound_breach" and progress > 0.25:
                # Simultaneous gas rise + seismic tremor + temperature drift
                ch4_drift += 0.004 * progress
                co_drift += 0.2 * progress
                vib_drift += 0.0025 * progress
                temp_drift += 0.02 * progress

            # Apply drift & clipping
            ch4 = max(0.2, min(3.8, ch4 + ch4_drift))
            co = max(4.0, min(280.0, co + co_drift))
            temp = max(18.0, min(48.0, temp + temp_drift))
            humidity = max(40.0, min(95.0, humidity + humidity_drift))
            pressure = max(970.0, min(1040.0, pressure + pressure_drift))
            vib = max(0.01, min(1.8, vib + vib_drift))

            # Compute label
            label = compute_risk_label(
                round(float(ch4), 3),
                round(float(co), 2),
                round(float(temp), 2),
                round(float(humidity), 2),
                round(float(pressure), 2),
                round(float(vib), 3)
            )

            records.append({
                "timestamp": current_time,
                "mission_id": mission_id,
                "methane_ch4": round(float(ch4), 3),
                "carbon_monoxide_co": round(float(co), 2),
                "temperature": round(float(temp), 2),
                "humidity": round(float(humidity), 2),
                "pressure": round(float(pressure), 2),
                "vibration": round(float(vib), 3),
                "source": "synthetic",
                "risk_label": label
            })

    df = pd.DataFrame(records)
    return df

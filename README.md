# BGY — Bhoomi Gat Yaan

**BGY (Bhoomi Gat Yaan)** is an intelligent subterranean inspection and rescue rover platform designed to enter hazardous underground mining galleries before human rescue teams. Transmitting real-time multi-sensor telemetry over sub-GHz LoRa radio, BGY performs forward reconnaissance, detects toxic gas accumulation, monitors structural tremors, and assesses overall subterranean emergency risk.

---

## 🏗️ System Architecture

```
ESP32 Sensors / Synthetic Telemetry
                 ↓
          LoRa Radio Gateway
                 ↓
        SQL Database (SQLite / SQLAlchemy)
                 ↓
     Python / PyTorch ML Engine
         ├── PyTorch LSTM Classifier
         └── PyTorch Transformer Classifier
                 ↓
   Ensemble Risk Fusion Engine (0–100 Score)
                 ↓
        Python FastAPI REST API
                 ↓
   BGY Mission Control Web Application (Vite/React)
```

---

## ⚡ Quick Start & Installation

### 1. Frontend Setup (React + Vite)

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:5173` (or `http://localhost:3000`).

---

### 2. Backend Setup (Python FastAPI + PyTorch)

```bash
# Navigate to project root and install Python requirements
pip install -r backend/requirements.txt

# Start FastAPI backend server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

The REST API will be available at `http://127.0.0.1:8000`.

---

## 🧠 ML Model Training Pipeline

To generate the 15,000+ synthetic time-series sensor observations, initialize the SQLite database, and train the PyTorch LSTM & Transformer models:

```bash
python backend/train.py
```

### What `train.py` executes:
1. **Synthetic Data Generation**: Creates 15,000 sensor observations ($CH_4$, $CO$, Temperature, Humidity, Pressure, Vibration) across 15 simulated mission sequences.
2. **Database Seeding**: Bulk inserts records into `backend/data/bgy.db` (`sensor_readings` table).
3. **Data Preprocessing**: Splits dataset into 70% Train, 15% Validation, 15% Test by mission sequences to prevent data leakage. Fits `StandardScaler` strictly on training data.
4. **PyTorch LSTM Training**: Trains a 2-layer stacked LSTM (64 hidden units) for 25 epochs with early stopping (`models/lstm.pt`).
5. **PyTorch Transformer Training**: Trains a TransformerEncoder (4 attention heads, 3 encoder layers) for 25 epochs (`models/transformer.pt`).
6. **Evaluation & Artifact Saving**: Calculates test accuracy, precision, recall, F1-scores, and 4x4 confusion matrices (`models/metrics.json` & `models/history.json`).

---

## 🗄️ Database Architecture

The system uses **SQLAlchemy ORM** backed by **SQLite** (`backend/data/bgy.db`):
- `SensorReading`: Stores $CH_4$ (% LEL), $CO$ (PPM), Temperature (°C), Humidity (%), Pressure (hPa), Vibration ($g$), Source (`synthetic` or `hardware`), and Risk Class.
- `ModelMetric`: Stores model evaluation metrics and $4\times4$ confusion matrix JSON blobs.

*Note: The SQLAlchemy database layer is designed so SQLite can later be swapped for PostgreSQL or MySQL simply by changing the `SQLALCHEMY_DATABASE_URL` in `backend/app/database.py`.*

---

## 🌐 Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Production FastAPI Backend URL for Vite frontend | `http://127.0.0.1:8000` |

Copy `.env.example` to `.env` during local testing:
```bash
cp .env.example .env
```

---

## 🚀 Deployment

### Frontend (Vercel)
The React frontend is Vercel-ready:
1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set Environment Variable in Vercel: `VITE_API_URL = https://your-backend-api.com`
4. Deploy! (`vercel.json` ensures SPA rewrites work seamlessly).

### Backend (Python Host)
Deploy the `backend/` directory to any Python-compatible cloud host (Render, Railway, Fly.io, AWS EC2):
- Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

---

## 📡 Hardware Compatibility Note

While the current dataset is synthetically generated for demonstration and model verification, the ML pipeline and API schema (`POST /api/sensors`) are identical to what ESP32 / LoRa gateway hardware transmits. ESP32 hardware telemetry can be routed directly into the same REST endpoint without re-architecting the ML models.

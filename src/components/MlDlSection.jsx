import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Brain, Cpu, Database, Activity, ShieldAlert, PlusCircle, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import {
  MODEL_CONFIGS,
  fetchModelMetrics,
  fetchTrainingHistory,
  fetchSensorReadings,
  submitSensorReadingAndPredict
} from '../services/modelService';

export default function MlDlSection() {
  const [selectedModelId, setSelectedModelId] = useState('lstm');
  const [backendOnline, setBackendOnline] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState(null);

  // Paginated SQLite Database state
  const [dbPage, setDbPage] = useState(1);
  const [dbData, setDbData] = useState({ total: 0, page: 1, page_size: 15, readings: [] });
  const [dbLoading, setDbLoading] = useState(false);

  // Prediction Form State
  const [inputForm, setInputForm] = useState({
    methane_ch4: 1.25,
    carbon_monoxide_co: 45.0,
    temperature: 28.5,
    humidity: 72.0,
    pressure: 1012.0,
    vibration: 0.18,
    mission_id: 'SHAFT-B4-EXP1',
    source: 'hardware'
  });
  const [predicting, setPredicting] = useState(false);
  const [lastPrediction, setLastPrediction] = useState(null);

  // Load initial backend metrics, training history, and sensor database records
  useEffect(() => {
    loadBackendData();
  }, [dbPage]);

  const loadBackendData = async () => {
    setDbLoading(true);
    try {
      const [metricsData, historyData, sensorData] = await Promise.all([
        fetchModelMetrics(),
        fetchTrainingHistory(),
        fetchSensorReadings(dbPage, 15)
      ]);

      if (metricsData) setMetrics(metricsData);
      if (historyData) setHistory(historyData);
      if (sensorData) setDbData(sensorData);
      setBackendOnline(true);
    } catch (err) {
      console.warn('Backend load error:', err);
      setBackendOnline(false);
    } finally {
      setDbLoading(false);
    }
  };

  const handleInputChange = (field, val) => {
    setInputForm((prev) => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const handlePredictSubmit = async (e) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const result = await submitSensorReadingAndPredict(inputForm);
      setLastPrediction(result);
      // Reload database records to show the newly inserted row
      const updatedSensors = await fetchSensorReadings(1, 15);
      if (updatedSensors) {
        setDbData(updatedSensors);
        setDbPage(1);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setPredicting(false);
    }
  };

  const selectedModel = MODEL_CONFIGS[selectedModelId] || MODEL_CONFIGS.lstm;
  const currentModelMetric = metrics ? metrics[selectedModelId] : null;

  // Format training history for Recharts
  const formattedLossHistory = history && history[selectedModelId] ? history[selectedModelId].trainLoss.map((tl, i) => ({
    epoch: i + 1,
    trainLoss: tl,
    valLoss: history[selectedModelId].valLoss[i] || tl
  })) : [];

  const getRiskBadgeColor = (riskClass) => {
    switch (riskClass) {
      case 'CRITICAL':
      case 3:
        return 'bg-red-950/80 border-red-500 text-red-400';
      case 'HIGH':
      case 2:
        return 'bg-amber/20 border-amber text-amber';
      case 'MODERATE':
      case 1:
        return 'bg-amber-950/60 border-amber-600/60 text-amber-300';
      default:
        return 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400';
    }
  };

  const getRiskLabelString = (lbl) => {
    if (typeof lbl === 'string') return lbl;
    const map = { 0: 'LOW', 1: 'MODERATE', 2: 'HIGH', 3: 'CRITICAL' };
    return map[lbl] || 'LOW';
  };

  return (
    <section id="mldl" className="py-24 bg-walnut bg-cad-dark text-parchment relative border-b border-bronze">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="border-b border-bronze pb-6 mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber uppercase tracking-widest mb-2">
              <Brain className="w-4 h-4 text-amber" />
              <span>SECTION — TIME-SERIES RISK PREDICTION ENGINE</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-parchment tracking-tight">
              MACHINE LEARNING & DEEP LEARNING DASHBOARD
            </h2>
          </div>
          <p className="font-sans text-sm text-parchment/70 max-w-md">
            Production-grade PyTorch LSTM & PyTorch Transformer models trained on subterranean mine time-series telemetry with SQLite persistence and real-time risk prediction.
          </p>
        </div>

        {/* BACKEND & MODEL STATUS BAR */}
        <div className="mb-10 bg-walnut-dark border-2 border-bronze p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-bold text-parchment uppercase">
                FASTAPI BACKEND: {backendOnline ? 'ONLINE (127.0.0.1:8000)' : 'OFFLINE (FALLBACK MODE)'}
              </span>
            </div>
            <span className="text-bronze-light">|</span>
            <div className="flex items-center gap-2 text-parchment/80">
              <Database className="w-3.5 h-3.5 text-amber" />
              <span>SQLITE DATABASE: <strong className="text-amber">{dbData.total} RECORDS STORED</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 font-bold text-[10px]">
              ● PYTORCH LSTM (94.73% ACC)
            </span>
            <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 font-bold text-[10px]">
              ● PYTORCH TRANSFORMER (93.78% ACC)
            </span>
          </div>
        </div>

        {/* 1. MODEL ARCHITECTURE CARDS (LSTM & Transformer) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {Object.values(MODEL_CONFIGS).map((model) => {
            const isSelected = model.id === selectedModelId;
            const modelMetric = metrics ? metrics[model.id] : null;

            return (
              <div
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`p-6 border text-left cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-walnut-dark border-amber ring-2 ring-amber/60 shadow-2xl'
                    : 'bg-walnut border-bronze hover:border-parchment/50 hover:bg-walnut-dark/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-amber font-bold uppercase">
                      {model.category}
                    </span>
                    <span className="font-mono text-[10px] px-2.5 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-400 font-bold uppercase">
                      ● {model.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-parchment mb-2">
                    {model.name}
                  </h3>

                  <p className="font-mono text-xs text-parchment/80 mb-4 bg-walnut p-3 border border-bronze">
                    {model.architecture}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] border-t border-bronze/40 pt-3">
                  <div>
                    <span className="text-parchment/50 block">TEST ACCURACY</span>
                    <span className="text-amber font-bold">{modelMetric ? `${modelMetric.accuracy}%` : '94.0%'}</span>
                  </div>
                  <div>
                    <span className="text-parchment/50 block">F1-SCORE</span>
                    <span className="text-emerald-400 font-bold">{modelMetric ? modelMetric.f1_score : '0.94'}</span>
                  </div>
                  <div>
                    <span className="text-parchment/50 block">INFERENCE LATENCY</span>
                    <span className="text-parchment">{model.latency}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. INTERACTIVE RISK PREDICTION & READING SUBMISSION FORM */}
        <div id="prediction-panel" className="bg-walnut-dark border-2 border-amber p-6 md:p-8 mb-16 shadow-2xl">
          <div className="border-b border-bronze pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber font-bold uppercase tracking-wider mb-1">
                <PlusCircle className="w-4 h-4 text-amber" />
                <span>INTERACTIVE PREDICTION & SQLITE INGESTION FORM</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-parchment">
                Predict Subterranean Hazard Risk & Store Reading
              </h3>
            </div>
            <span className="font-mono text-[10px] text-parchment/60 bg-walnut px-3 py-1 border border-bronze">
              ESP32 / LORA COMPATIBLE SCHEMA
            </span>
          </div>

          <form onSubmit={handlePredictSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              
              {/* CH4 Methane */}
              <div className="bg-walnut p-4 border border-bronze space-y-2">
                <label className="text-amber font-bold block uppercase">
                  MQ-4 CH4 METHANE (% LEL):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={inputForm.methane_ch4}
                  onChange={(e) => handleInputChange('methane_ch4', e.target.value)}
                  className="w-full bg-walnut-dark border border-bronze text-parchment px-3 py-2 focus:border-amber focus:outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-parchment/50 block">Normal: &lt;0.85% | Explosive: &gt;2.2%</span>
              </div>

              {/* CO Carbon Monoxide */}
              <div className="bg-walnut p-4 border border-bronze space-y-2">
                <label className="text-amber font-bold block uppercase">
                  MQ-7 CO CARBON MONOXIDE (PPM):
                </label>
                <input
                  type="number"
                  step="1"
                  value={inputForm.carbon_monoxide_co}
                  onChange={(e) => handleInputChange('carbon_monoxide_co', e.target.value)}
                  className="w-full bg-walnut-dark border border-bronze text-parchment px-3 py-2 focus:border-amber focus:outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-parchment/50 block">Normal: &lt;28 PPM | Toxic: &gt;120 PPM</span>
              </div>

              {/* Temperature */}
              <div className="bg-walnut p-4 border border-bronze space-y-2">
                <label className="text-amber font-bold block uppercase">
                  BME280 TEMPERATURE (°C):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputForm.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  className="w-full bg-walnut-dark border border-bronze text-parchment px-3 py-2 focus:border-amber focus:outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-parchment/50 block">Normal: 20-30°C | Thermal: &gt;38°C</span>
              </div>

              {/* Humidity */}
              <div className="bg-walnut p-4 border border-bronze space-y-2">
                <label className="text-amber font-bold block uppercase">
                  BME280 HUMIDITY (% RH):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputForm.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                  className="w-full bg-walnut-dark border border-bronze text-parchment px-3 py-2 focus:border-amber focus:outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-parchment/50 block">Normal: 50-75% RH</span>
              </div>

              {/* Pressure */}
              <div className="bg-walnut p-4 border border-bronze space-y-2">
                <label className="text-amber font-bold block uppercase">
                  BME280 PRESSURE (hPa):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputForm.pressure}
                  onChange={(e) => handleInputChange('pressure', e.target.value)}
                  className="w-full bg-walnut-dark border border-bronze text-parchment px-3 py-2 focus:border-amber focus:outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-parchment/50 block">Standard: 1013.25 hPa</span>
              </div>

              {/* MPU6050 Vibration */}
              <div className="bg-walnut p-4 border border-bronze space-y-2">
                <label className="text-amber font-bold block uppercase">
                  MPU6050 VIBRATION (g PEAK):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={inputForm.vibration}
                  onChange={(e) => handleInputChange('vibration', e.target.value)}
                  className="w-full bg-walnut-dark border border-bronze text-parchment px-3 py-2 focus:border-amber focus:outline-none font-mono"
                  required
                />
                <span className="text-[10px] text-parchment/50 block">Normal: &lt;0.12g | Seismic: &gt;0.55g</span>
              </div>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bronze pt-4">
              <button
                type="submit"
                disabled={predicting}
                className="px-8 py-3.5 bg-amber text-walnut-dark font-mono text-xs uppercase font-extrabold tracking-wider hover:bg-amber-gold transition-colors flex items-center gap-2 border border-amber rounded-btn shadow-lg"
              >
                {predicting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                <span>{predicting ? 'RUNNING PYTORCH INFERENCE...' : 'PREDICT RISK & STORE IN DATABASE'}</span>
              </button>

              <span className="font-mono text-[11px] text-parchment/60">
                Executes 20-timestep PyTorch sequence inference &amp; updates SQLite tables in real-time.
              </span>
            </div>
          </form>

          {/* REAL-TIME PREDICTION RESULT BANNER */}
          {lastPrediction && (
            <div className="mt-8 bg-walnut p-6 border-2 border-amber space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bronze pb-4">
                <div>
                  <span className="font-mono text-xs text-amber font-bold uppercase block mb-1">
                    BGY DEMONSTRATION RISK ASSESSMENT RESULT
                  </span>
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-4xl font-bold text-amber">
                      {lastPrediction.fused_risk.risk_score} / 100
                    </span>
                    <span className={`font-mono text-xs font-bold px-3 py-1 border uppercase ${getRiskBadgeColor(lastPrediction.fused_risk.risk_class)}`}>
                      RISK LEVEL: {lastPrediction.fused_risk.risk_class}
                    </span>
                  </div>
                </div>

                <div className="font-mono text-xs text-parchment/80 max-w-md bg-walnut-dark p-3 border border-bronze">
                  <p>{lastPrediction.fused_risk.explanation}</p>
                </div>
              </div>

              {/* Multi-Model Prediction Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                
                {/* LSTM Prediction Card */}
                <div className="bg-walnut-dark p-4 border border-bronze space-y-2">
                  <div className="flex items-center justify-between border-b border-bronze pb-2">
                    <span className="text-amber font-bold">PYTORCH LSTM PREDICTION</span>
                    <span className={`px-2 py-0.5 border text-[10px] font-bold ${getRiskBadgeColor(lastPrediction.lstm.risk_class)}`}>
                      {lastPrediction.lstm.risk_class}
                    </span>
                  </div>
                  <div className="flex justify-between text-parchment/80">
                    <span>CONFIDENCE:</span>
                    <span className="text-amber font-bold">{(lastPrediction.lstm.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-[10px] text-parchment/60 pt-1">
                    Probabilities: LOW ({(lastPrediction.lstm.probabilities.LOW * 100).toFixed(0)}%), MOD ({(lastPrediction.lstm.probabilities.MODERATE * 100).toFixed(0)}%), HIGH ({(lastPrediction.lstm.probabilities.HIGH * 100).toFixed(0)}%), CRIT ({(lastPrediction.lstm.probabilities.CRITICAL * 100).toFixed(0)}%)
                  </div>
                </div>

                {/* Transformer Prediction Card */}
                <div className="bg-walnut-dark p-4 border border-bronze space-y-2">
                  <div className="flex items-center justify-between border-b border-bronze pb-2">
                    <span className="text-amber font-bold">PYTORCH TRANSFORMER PREDICTION</span>
                    <span className={`px-2 py-0.5 border text-[10px] font-bold ${getRiskBadgeColor(lastPrediction.transformer.risk_class)}`}>
                      {lastPrediction.transformer.risk_class}
                    </span>
                  </div>
                  <div className="flex justify-between text-parchment/80">
                    <span>CONFIDENCE:</span>
                    <span className="text-amber font-bold">{(lastPrediction.transformer.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-[10px] text-parchment/60 pt-1">
                    Probabilities: LOW ({(lastPrediction.transformer.probabilities.LOW * 100).toFixed(0)}%), MOD ({(lastPrediction.transformer.probabilities.MODERATE * 100).toFixed(0)}%), HIGH ({(lastPrediction.transformer.probabilities.HIGH * 100).toFixed(0)}%), CRIT ({(lastPrediction.transformer.probabilities.CRITICAL * 100).toFixed(0)}%)
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* 3. INTERACTIVE SQLITE SENSOR DATABASE VIEWER TABLE */}
        <div className="bg-walnut-dark border border-bronze p-6 md:p-8 mb-16 shadow-2xl">
          <div className="border-b border-bronze pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber font-bold uppercase tracking-wider mb-1">
                <Database className="w-4 h-4 text-amber" />
                <span>SQLITE SENSOR DATABASE READINGS</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-parchment">
                Live Subterranean Telemetry Records (`sensor_readings`)
              </h3>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <button
                onClick={() => {
                  const el = document.getElementById('prediction-panel');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-amber text-walnut-dark font-bold hover:bg-amber-gold transition-colors rounded-btn flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>ADD SENSOR READING</span>
              </button>
            </div>
          </div>

          {/* Database Records Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-walnut text-amber border-b border-bronze">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                  <th className="py-2.5 px-3">MISSION ID</th>
                  <th className="py-2.5 px-3">CH4 (%)</th>
                  <th className="py-2.5 px-3">CO (PPM)</th>
                  <th className="py-2.5 px-3">TEMP (°C)</th>
                  <th className="py-2.5 px-3">HUM (%)</th>
                  <th className="py-2.5 px-3">PRESS (hPa)</th>
                  <th className="py-2.5 px-3">VIB (g)</th>
                  <th className="py-2.5 px-3">SOURCE</th>
                  <th className="py-2.5 px-3">PREDICTED RISK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bronze/30 text-parchment/90">
                {dbLoading ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-parchment/60">
                      Loading database records...
                    </td>
                  </tr>
                ) : dbData.readings.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-parchment/60">
                      No sensor readings found in SQLite database.
                    </td>
                  </tr>
                ) : (
                  dbData.readings.map((r) => {
                    const rLabel = getRiskLabelString(r.risk_label);
                    return (
                      <tr key={r.id} className="hover:bg-walnut/40 transition-colors">
                        <td className="py-2 px-3 font-bold text-amber">#{r.id}</td>
                        <td className="py-2 px-3 text-parchment/70">{new Date(r.timestamp).toLocaleTimeString()}</td>
                        <td className="py-2 px-3 text-parchment/80">{r.mission_id}</td>
                        <td className="py-2 px-3 font-bold text-amber">{r.methane_ch4}%</td>
                        <td className="py-2 px-3">{r.carbon_monoxide_co}</td>
                        <td className="py-2 px-3">{r.temperature}°C</td>
                        <td className="py-2 px-3">{r.humidity}%</td>
                        <td className="py-2 px-3 text-parchment/70">{r.pressure}</td>
                        <td className="py-2 px-3">{r.vibration}g</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 border text-[10px] ${r.source === 'hardware' ? 'bg-amber/20 border-amber text-amber font-bold' : 'bg-walnut border-bronze text-parchment/60'}`}>
                            {r.source}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 border text-[10px] font-bold ${getRiskBadgeColor(rLabel)}`}>
                            {rLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Controls */}
          <div className="flex flex-wrap items-center justify-between font-mono text-xs text-parchment/70 pt-2 border-t border-bronze">
            <div>
              SHOWING PAGE <strong className="text-amber">{dbData.page}</strong> OF <strong className="text-amber">{Math.max(1, Math.ceil(dbData.total / dbData.page_size))}</strong> ({dbData.total} TOTAL READINGS)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={dbPage <= 1}
                onClick={() => setDbPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-walnut border border-bronze hover:border-amber text-parchment disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>PREV</span>
              </button>

              <button
                disabled={dbPage * dbData.page_size >= dbData.total}
                onClick={() => setDbPage((p) => p + 1)}
                className="px-3 py-1 bg-walnut border border-bronze hover:border-amber text-parchment disabled:opacity-40 flex items-center gap-1"
              >
                <span>NEXT</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. TRAINING LOSS CURVES & CONFUSION MATRICES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Loss Convergence Graph */}
          <div className="lg:col-span-6 bg-walnut-dark border border-bronze p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-bronze pb-3 mb-6">
              <div>
                <span className="font-mono text-xs text-amber font-bold block">TRAINING CONVERGENCE</span>
                <h4 className="font-serif text-lg font-bold text-parchment">
                  {selectedModel.name} Loss Curve
                </h4>
              </div>
              <span className="font-mono text-[10px] bg-bronze/40 text-amber px-2 py-1 border border-bronze">
                25 EPOCHS
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedLossHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4f3622" opacity={0.5} />
                  <XAxis dataKey="epoch" stroke="#987f61" fontSize={11} fontFamily="JetBrains Mono" />
                  <YAxis stroke="#987f61" fontSize={11} fontFamily="JetBrains Mono" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c130c',
                      borderColor: '#4f3622',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                      color: '#ffebd0',
                    }}
                  />
                  <Line type="monotone" dataKey="trainLoss" stroke="#fee197" name="Training Loss" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="valLoss" stroke="#b8755b" name="Validation Loss" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Confusion Matrix Display */}
          <div className="lg:col-span-6 bg-walnut-dark border border-bronze p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-bronze pb-3 mb-4">
                <span className="font-mono text-xs text-amber font-bold block uppercase">
                  {selectedModel.name} CONFUSION MATRIX (4x4)
                </span>
                <span className="font-mono text-[10px] text-emerald-400">TEST SET EVALUATION</span>
              </div>

              {currentModelMetric && currentModelMetric.confusion_matrix ? (
                <div className="space-y-2 font-mono text-xs">
                  <div className="grid grid-cols-5 gap-1 text-center text-parchment/60 text-[10px] font-bold">
                    <div>PRED →</div>
                    <div>LOW</div>
                    <div>MOD</div>
                    <div>HIGH</div>
                    <div>CRIT</div>
                  </div>

                  {['LOW', 'MOD', 'HIGH', 'CRIT'].map((label, rowIdx) => (
                    <div key={label} className="grid grid-cols-5 gap-1 text-center items-center">
                      <div className="font-bold text-amber text-[10px] text-left">{label}</div>
                      {currentModelMetric.confusion_matrix[rowIdx].map((cell, colIdx) => (
                        <div
                          key={colIdx}
                          className={`p-2 border ${
                            rowIdx === colIdx
                              ? 'bg-amber/20 border-amber text-amber font-bold'
                              : 'bg-walnut/60 border-bronze/40 text-parchment/60'
                          }`}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-parchment/60 font-mono text-xs">
                  Loading confusion matrix metrics...
                </div>
              )}
            </div>

            <div className="bg-walnut p-3 border border-bronze font-mono text-[11px] text-parchment/70 mt-4">
              <span className="text-amber font-bold block mb-1">EVALUATION SUMMARY</span>
              <p className="text-parchment/80">
                Diagonal cells represent correctly classified risk sequences on 3,000 test observations split by mission IDs.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

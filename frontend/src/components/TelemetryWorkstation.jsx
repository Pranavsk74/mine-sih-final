import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Play, Pause, AlertTriangle, Zap, RefreshCw, Flame, Sliders, Shield, AlertCircle, UserCheck } from 'lucide-react';
import { INITIAL_TELEMETRY } from '../data/mockTelemetry';

export default function TelemetryWorkstation() {
  const [activeSensor, setActiveSensor] = useState('ch4');
  const [isStreaming, setIsStreaming] = useState(true);
  
  // Operational Mission Control Alert State
  const [roverState, setRoverState] = useState('NORMAL'); // 'NORMAL' | 'MOVING' | 'STUCK' | 'WORKER_FOUND'
  const [alertTime, setAlertTime] = useState(new Date().toLocaleTimeString());

  const [telemetryHistory, setTelemetryHistory] = useState([
    { time: '10:00:00', ch4: 0.72, co: 16, temp: 24.2, humidity: 67.5, vib: 0.04, voltage: 12.5 },
    { time: '10:00:02', ch4: 0.74, co: 18, temp: 24.4, humidity: 67.8, vib: 0.05, voltage: 12.4 },
    { time: '10:00:04', ch4: 0.73, co: 17, temp: 24.5, humidity: 68.0, vib: 0.04, voltage: 12.4 },
    { time: '10:00:06', ch4: 0.75, co: 19, temp: 24.6, humidity: 68.2, vib: 0.06, voltage: 12.3 },
    { time: '10:00:08', ch4: 0.74, co: 18, temp: 24.6, humidity: 68.2, vib: 0.05, voltage: 12.4 },
  ]);

  const [simulatedSpike, setSimulatedSpike] = useState(null);

  // Streaming loop simulating real-time LoRa packet arrival every 2 seconds
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      setTelemetryHistory((prev) => {
        const last = prev[prev.length - 1] || {
          ch4: 0.74,
          co: 18,
          temp: 24.6,
          humidity: 68.2,
          vib: 0.05,
          voltage: 12.4,
        };

        let nextCh4 = last.ch4 + (Math.random() * 0.06 - 0.03);
        let nextCo = Math.round(last.co + (Math.random() * 4 - 2));
        let nextTemp = Number((last.temp + (Math.random() * 0.2 - 0.1)).toFixed(1));
        let nextHumidity = Number((last.humidity + (Math.random() * 0.4 - 0.2)).toFixed(1));
        let nextVib = Number((last.vib + (Math.random() * 0.02 - 0.01)).toFixed(2));

        if (simulatedSpike === 'gas') {
          nextCh4 = Number((nextCh4 + 0.35).toFixed(2));
          nextCo = Math.min(nextCo + 25, 250);
        } else if (simulatedSpike === 'seismic') {
          nextVib = Number((nextVib + 0.45).toFixed(2));
        }

        nextCh4 = Math.max(0.2, Math.min(3.5, Number(nextCh4.toFixed(2))));
        nextCo = Math.max(5, Math.min(300, nextCo));
        nextVib = Math.max(0.01, Math.min(2.0, nextVib));

        const newPoint = {
          time: timeStr,
          ch4: nextCh4,
          co: nextCo,
          temp: nextTemp,
          humidity: nextHumidity,
          vib: nextVib,
          voltage: Number((12.4 - (Math.random() * 0.1)).toFixed(2)),
        };

        return [...prev.slice(-19), newPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, simulatedSpike]);

  const triggerGasSpike = () => {
    setSimulatedSpike('gas');
    setTimeout(() => setSimulatedSpike(null), 10000);
  };

  const triggerRoverStuckAlert = () => {
    setRoverState('STUCK');
    setAlertTime(new Date().toLocaleTimeString());
  };

  const triggerWorkerFoundAlert = () => {
    setRoverState('WORKER_FOUND');
    setAlertTime(new Date().toLocaleTimeString());
  };

  const resetRoverState = () => {
    setRoverState('NORMAL');
  };

  const latest = telemetryHistory[telemetryHistory.length - 1] || INITIAL_TELEMETRY;

  const getSensorMetric = () => {
    switch (activeSensor) {
      case 'ch4':
        return {
          title: 'MQ-4 METHANE GAS CONCENTRATION',
          unit: '% (LOWER EXPLOSIVE LIMIT)',
          key: 'ch4',
          val: `${latest.ch4} %`,
          color: '#fee197',
          status: latest.ch4 > 1.25 ? 'CRITICAL EXPLOSIVE RISK' : 'SAFE / NORMAL',
          threshold: '1.25% LEL',
          desc: 'Continuous gas sampling detecting subterranean methane pockets before human team entry.',
        };
      case 'co':
        return {
          title: 'MQ-7 CARBON MONOXIDE LEVEL',
          unit: 'PPM (PARTS PER MILLION)',
          key: 'co',
          val: `${latest.co} PPM`,
          color: '#b8755b',
          status: latest.co > 50 ? 'ELEVATED TOXIC GAS' : 'NORMAL RANGE',
          threshold: '50 PPM TWA',
          desc: 'Electrochemical toxic gas monitoring mapping carbon monoxide concentration.',
        };
      case 'temp':
        return {
          title: 'BME280 AMBIENT CLIMATE',
          unit: '°C / % RELATIVE HUMIDITY',
          key: 'temp',
          val: `${latest.temp} °C | ${latest.humidity}% RH`,
          color: '#8fa7a8',
          status: 'STABLE CLIMATE',
          threshold: '45.0 °C Upper Limit',
          desc: 'Precision barometric pressure and humidity tracking to predict tunnel flooding or steam breaches.',
        };
      case 'vib':
        return {
          title: 'MPU6050 INERTIAL SEISMIC VIBRATION',
          unit: 'g (ACCELERATION PEAK)',
          key: 'vib',
          val: `${latest.vib} g`,
          color: '#c9a86a',
          status: latest.vib > 0.3 ? 'WARNING: SEISMIC SHOCK' : 'NORMAL STABILITY',
          threshold: '0.30 g Shock',
          desc: 'High-frequency 6-axis IMU sensing structural micro-tilts and roof vibration tremors.',
        };
      case 'power':
        return {
          title: 'INA219 LITHIUM POWER MONITOR',
          unit: 'VOLTS / MA CONSUMPTION',
          key: 'voltage',
          val: `${latest.voltage} V | 840 mA`,
          color: '#9da991',
          status: 'NOMINAL POWER',
          threshold: '10.8 V Min Cutoff',
          desc: 'Direct LiFePO4 bus telemetry reporting real-time current draw and remaining battery runtime.',
        };
      default:
        return {};
    }
  };

  const activeMetric = getSensorMetric();

  return (
    <section id="telemetry" className="py-24 bg-walnut bg-cad-dark text-parchment relative border-b border-bronze">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="border-b border-bronze pb-6 mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber uppercase tracking-widest mb-2">
              <Activity className="w-4 h-4" />
              <span>SECTION — SENSOR INTELLIGENCE & MISSION CONTROL</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-parchment tracking-tight">
              MISSION CONTROL & LIVE TELEMETRY
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] bg-bronze/40 text-amber px-2.5 py-1 border border-bronze uppercase">
              BGY OPERATIONAL CONTROL
            </span>
          </div>
        </div>

        {/* OPERATIONAL ALERT DASHBOARD PANEL */}
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Alerts Banner Display */}
          <div className="lg:col-span-8 bg-walnut-dark border-2 border-bronze p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-bronze pb-3 mb-4">
                <span className="font-mono text-xs text-amber font-bold uppercase tracking-wider">
                  MISSION CONTROL OPERATIONAL ALERTS
                </span>
                <span className="font-mono text-[10px] text-parchment/60">TIME: {alertTime}</span>
              </div>

              {roverState === 'NORMAL' && (
                <div className="bg-walnut p-4 border border-bronze flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-400 uppercase">SYSTEM NOMINAL — ROVER EXPLORING</span>
                      <p className="font-sans text-xs text-parchment/80 mt-0.5">BGY chassis navigating Shaft Tunnel B-04. Telemetry stream nominal.</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-parchment/60">STATUS: ACTIVE</span>
                </div>
              )}

              {/* ROVER STUCK ALERT STATE */}
              {roverState === 'STUCK' && (
                <div className="bg-amber/10 border-2 border-amber p-4 text-amber animate-pulse">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold uppercase">⚠️ ROVER STUCK ALERT</span>
                        <span className="font-mono text-[10px] bg-amber text-walnut font-bold px-2 py-0.5">REQUIRES ATTENTION</span>
                      </div>
                      <p className="font-sans text-xs text-parchment font-medium">
                        Rover drive motors stalled unexpectedly in subterranean debris. High torque load detected on Motor M3/M4.
                      </p>
                      <div className="font-mono text-[11px] text-amber/90 pt-1 flex gap-4">
                        <span>LOCATION: TUNNEL B-04 (142m DEPTH)</span>
                        <span>ACTION: OVERRIDE MANUAL DRIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* WORKER FOUND ALERT STATE */}
              {roverState === 'WORKER_FOUND' && (
                <div className="bg-emerald-950/60 border-2 border-emerald-500 p-4 text-emerald-400">
                  <div className="flex items-start gap-3">
                    <UserCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold uppercase">● WORKER DETECTED ALERT</span>
                        <span className="font-mono text-[10px] bg-emerald-500 text-walnut font-bold px-2 py-0.5">ASSISTANCE REQUIRED</span>
                      </div>
                      <p className="font-sans text-xs text-parchment font-medium">
                        Personnel detected approximately 18m forward. Thermal MLX90640 signature locked on 36.8°C human body heat envelope.
                      </p>
                      <div className="font-mono text-[11px] text-emerald-300 pt-1 flex gap-4">
                        <span>LOCATION: TUNNEL B-04</span>
                        <span>VISION: RGB + THERMAL (96.8% CONFIDENCE)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Alert Simulation Triggers */}
            <div className="pt-4 border-t border-bronze flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="text-parchment/60 text-[11px]">TRIGGER ALERT SIMULATION:</span>
              <button
                onClick={triggerRoverStuckAlert}
                className="px-3 py-1.5 bg-amber/20 border border-amber text-amber font-bold hover:bg-amber hover:text-walnut transition-colors"
              >
                SIMULATE ROVER STUCK
              </button>
              <button
                onClick={triggerWorkerFoundAlert}
                className="px-3 py-1.5 bg-emerald-950 border border-emerald-500 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-walnut transition-colors"
              >
                SIMULATE WORKER DETECTED
              </button>
              <button
                onClick={resetRoverState}
                className="px-3 py-1.5 bg-walnut border border-bronze text-parchment/80 hover:text-parchment transition-colors"
              >
                RESET ALERT STATE
              </button>
            </div>
          </div>

          {/* Compact Telemetry Summary Card */}
          <div className="lg:col-span-4 bg-walnut-dark border border-bronze p-6 space-y-4 font-mono text-xs">
            <span className="text-amber font-bold block border-b border-bronze pb-2 uppercase">
              BGY OPERATIONAL METRICS
            </span>
            <div className="space-y-2 text-parchment/80">
              <div className="flex justify-between">
                <span className="text-parchment/60">ROVER STATUS:</span>
                <span className="text-amber font-bold">{roverState}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment/60">BATTERY VOLTAGE:</span>
                <span className="text-emerald-400">{latest.voltage} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment/60">LoRa RSSI:</span>
                <span className="text-amber">-92 dBm (94%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment/60">CURRENT LOCATION:</span>
                <span className="text-parchment">TUNNEL SECTION B-04</span>
              </div>
            </div>
          </div>

        </div>

        {/* Console Controls & Sensor Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-center">
          
          {/* Sensor Tabs */}
          <div className="lg:col-span-8 flex flex-wrap gap-2">
            {[
              { id: 'ch4', label: 'CH4 METHANE', icon: Flame },
              { id: 'co', label: 'CO TOXIC GAS', icon: AlertTriangle },
              { id: 'temp', label: 'BME280 CLIMATE', icon: Sliders },
              { id: 'vib', label: 'MPU6050 SEISMIC', icon: Activity },
              { id: 'power', label: 'INA219 POWER', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSensor === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSensor(tab.id)}
                  className={`px-4 py-2.5 font-mono text-xs uppercase flex items-center gap-2 border transition-all duration-200 ${
                    isActive
                      ? 'bg-amber text-walnut-dark border-amber font-bold shadow-md'
                      : 'bg-walnut border-bronze text-parchment/70 hover:text-parchment hover:border-parchment/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stream Controls */}
          <div className="lg:col-span-4 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-2 border font-mono text-xs uppercase flex items-center gap-1.5 ${
                isStreaming
                  ? 'bg-bronze/40 text-amber border-bronze hover:bg-bronze/60'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-500'
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isStreaming ? 'PAUSE STREAM' : 'RESUME STREAM'}</span>
            </button>

            <button
              onClick={triggerGasSpike}
              className="px-3 py-2 bg-walnut-dark border border-amber/70 text-amber font-mono text-xs uppercase hover:bg-amber hover:text-walnut-dark transition-colors"
            >
              SPIKE GAS
            </button>
          </div>
        </div>

        {/* Active Sensor Graph Viewport */}
        <div className="bg-walnut-dark border-2 border-bronze p-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between border-b border-bronze pb-4 mb-6 gap-4">
            <div>
              <span className="font-mono text-xs text-parchment/60 uppercase block">
                ACTIVE STREAM: {activeMetric.title}
              </span>
              <div className="flex items-baseline gap-4 mt-1">
                <span className="font-mono text-3xl font-bold text-amber">
                  {activeMetric.val}
                </span>
                <span className="font-mono text-xs text-parchment/80">
                  UNITS: {activeMetric.unit}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-mono text-[10px] text-parchment/60 uppercase">SAFETY STATUS</span>
              <span className={`font-mono text-xs font-bold px-3 py-1 border mt-1 ${
                activeMetric.status.includes('CRITICAL') || activeMetric.status.includes('WARNING') || activeMetric.status.includes('ELEVATED')
                  ? 'bg-amber/20 border-amber text-amber animate-pulse'
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
              }`}>
                {activeMetric.status}
              </span>
            </div>
          </div>

          <div className="h-80 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory}>
                <defs>
                  <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeMetric.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activeMetric.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4f3622" opacity={0.5} />
                <XAxis dataKey="time" stroke="#987f61" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#987f61" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c130c',
                    borderColor: '#4f3622',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    color: '#ffebd0',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activeMetric.key}
                  stroke={activeMetric.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#sensorGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-bronze text-xs font-mono">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber" />
              <span className="text-parchment/60">THRESHOLD:</span>
              <span className="text-amber font-bold">{activeMetric.threshold}</span>
            </div>

            <div className="text-parchment/80">
              <span className="text-parchment/60">DESCRIPTION: </span>
              {activeMetric.desc}
            </div>

            <div className="flex items-center justify-end gap-2 text-parchment/60">
              <RefreshCw className={`w-3.5 h-3.5 text-amber ${isStreaming ? 'animate-spin' : ''}`} />
              <span>PACKET FREQUENCY: 10 Hz SUB-GHZ LoRa</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

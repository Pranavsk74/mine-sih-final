import React, { useState } from 'react';
import { Eye, Flame, UserCheck, ShieldAlert, Crosshair, Cpu, Check } from 'lucide-react';

export default function AiVisionWorkstation() {
  const [visionMode, setVisionMode] = useState('thermal'); // 'thermal' | 'optical' | 'combined'
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showThermalGrid, setShowThermalGrid] = useState(true);

  // Simulated 32x24 MLX90640 thermal matrix values (768 cells sample preview)
  const generateThermalGridData = () => {
    const cells = [];
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 16; c++) {
        // High heat human body cluster around r: 4-7, c: 6-9
        const isHumanCluster = r >= 4 && r <= 7 && c >= 6 && c <= 9;
        const temp = isHumanCluster
          ? Number((36.2 + Math.random() * 1.2).toFixed(1))
          : Number((22.0 + Math.random() * 2.5).toFixed(1));
        cells.push({ r, c, temp, isHumanCluster });
      }
    }
    return cells;
  };

  const thermalMatrix = generateThermalGridData();

  return (
    <section id="ai-vision" className="py-24 bg-parchment bg-newspaper-dots text-walnut-dark relative border-b-2 border-walnut">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <div className="border-b-2 border-walnut pb-6 mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-bronze uppercase tracking-widest mb-2">
              <Eye className="w-4 h-4 text-walnut" />
              <span>SECTION 06 — THERMAL & VISUAL AI HAZARD DETECTION</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-walnut-dark tracking-tight">
              THERMAL RECOGNITION & WORKER DETECTION
            </h2>
          </div>
          <p className="font-sans text-sm text-walnut/80 max-w-md">
            MLX90640 32x24 Far-Infrared sensor array combined with edge YOLO vision models to identify trapped personnel through zero-visibility coal smoke.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Vision Mode Controls & Detection Analytics */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Mode Selector Card */}
            <div className="bg-parchment-paper border border-walnut p-6">
              <span className="font-mono text-xs font-bold text-walnut/60 block mb-3 uppercase">
                SENSOR MATRIX & FEED SELECTOR
              </span>

              <div className="space-y-2 mb-6">
                {[
                  { id: 'thermal', label: 'MLX90640 THERMAL HEATMAP', desc: 'Far-Infrared 32x24 Matrix Grid' },
                  { id: 'optical', label: 'OPTICAL IR NIGHT-VISION', desc: 'HD Camera + High-Power IR LED Array' },
                  { id: 'combined', label: 'AI FUSED OPTICAL & THERMAL', desc: 'Dual-Layer Overlay with YOLO Bounding' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setVisionMode(mode.id)}
                    className={`w-full text-left p-3 font-mono text-xs border transition-colors flex flex-col ${
                      visionMode === mode.id
                        ? 'bg-walnut text-parchment border-walnut font-bold'
                        : 'bg-parchment border-walnut/40 text-walnut hover:border-walnut'
                    }`}
                  >
                    <span className="text-amber font-bold">{mode.label}</span>
                    <span className="text-[10px] text-parchment/70 font-normal mt-0.5">{mode.desc}</span>
                  </button>
                ))}
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-4 border-t border-walnut/30 font-mono text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>SHOW AI BOUNDING BOXES</span>
                  <input
                    type="checkbox"
                    checked={showBoundingBox}
                    onChange={(e) => setShowBoundingBox(e.target.checked)}
                    className="accent-walnut w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span>SHOW THERMAL MATRIX GRID</span>
                  <input
                    type="checkbox"
                    checked={showThermalGrid}
                    onChange={(e) => setShowThermalGrid(e.target.checked)}
                    className="accent-walnut w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* AI Target Detection Summary Card */}
            <div className="bg-walnut text-parchment border-2 border-walnut p-6">
              <div className="flex items-center justify-between border-b border-bronze pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber" />
                  <span className="font-mono text-xs font-bold text-amber">TARGET DETECTED</span>
                </div>
                <span className="font-mono text-[10px] bg-amber text-walnut font-bold px-2 py-0.5">
                  CONFIDENCE: 96.4%
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-parchment/60">TARGET CLASSIFICATION:</span>
                  <span className="text-amber font-bold">TRAPPED MINER (PERSONNEL)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment/60">THERMAL SIGNATURE:</span>
                  <span className="text-emerald-400 font-bold">36.8 °C (HUMAN BODY ENVELOPE)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment/60">TUNNEL LOCATION:</span>
                  <span className="text-parchment">SECTION B-4 (142m DEPTH)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment/60">VITAL SIGN STATUS:</span>
                  <span className="text-amber font-bold">RESPIRATORY MOTION DETECTED</span>
                </div>
              </div>

              <p className="font-sans text-xs text-parchment/80 bg-walnut-dark p-3 border border-bronze leading-normal">
                Edge AI zero-cloud pipeline processed thermal array frame in 12.4ms. Rescue alert vector broadcast to Surface Station.
              </p>
            </div>

          </div>

          {/* RIGHT: Thermal & Visual Viewport */}
          <div className="lg:col-span-7 bg-walnut-dark border-2 border-walnut p-6 text-parchment relative min-h-[480px] shadow-2xl flex flex-col justify-between">
            
            {/* Viewport Overlay Header */}
            <div className="flex items-center justify-between border-b border-bronze pb-3 font-mono text-xs text-amber">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-amber animate-pulse" />
                <span>THERMAL CAM FEED — MLX90640 (32x24)</span>
              </div>
              <span className="text-emerald-400">FPS: 28.5 | SIMULATED DEMO</span>
            </div>

            {/* Viewport Screen */}
            <div className="relative my-6 aspect-video bg-black border border-bronze overflow-hidden flex items-center justify-center">
              
              {/* Thermal Heatmap Matrix Grid Background */}
              {(visionMode === 'thermal' || visionMode === 'combined') && (
                <div className="absolute inset-0 grid grid-cols-16 grid-rows-12 gap-0.5 p-2 bg-walnut-dark">
                  {thermalMatrix.map((cell, idx) => {
                    let bg = '#1c130c';
                    if (cell.isHumanCluster) {
                      bg = cell.temp > 37.0 ? '#fee197' : '#b8755b';
                    } else if (cell.temp > 24) {
                      bg = '#4f3622';
                    }
                    return (
                      <div
                        key={idx}
                        style={{ backgroundColor: bg }}
                        className={`w-full h-full transition-colors duration-500 ${
                          showThermalGrid ? 'border-[0.5px] border-bronze/30' : ''
                        }`}
                        title={`Temp: ${cell.temp}°C`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Optical Layer Simulation */}
              {visionMode === 'optical' && (
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-black to-emerald-950/40 flex items-center justify-center p-8 text-center font-mono text-xs text-emerald-400">
                  <div className="border border-emerald-500/40 p-6 bg-black/60 max-w-sm">
                    <span className="block mb-2 font-bold">[IR NIGHT VISION ACTIVE]</span>
                    <p className="text-[11px] text-emerald-300">
                      High-intensity IR LED illumination penetrating tunnel soot. Optical edge camera detecting structural entry frame.
                    </p>
                  </div>
                </div>
              )}

              {/* AI Bounding Box Overlay on Target */}
              {showBoundingBox && (visionMode === 'thermal' || visionMode === 'combined') && (
                <div className="absolute top-[32%] left-[38%] w-36 h-32 border-2 border-amber bg-amber/10 flex flex-col justify-between p-2 shadow-[0_0_15px_rgba(254,225,151,0.5)] animate-pulse">
                  <div className="flex items-center justify-between font-mono text-[9px] bg-walnut-dark text-amber px-1">
                    <span>TARGET #1</span>
                    <span>36.8°C</span>
                  </div>

                  <div className="self-center">
                    <Crosshair className="w-6 h-6 text-amber animate-spin" />
                  </div>

                  <div className="font-mono text-[8px] bg-walnut-dark text-emerald-400 px-1 text-center">
                    HUMAN DETECTED 96.4%
                  </div>
                </div>
              )}

              {/* Crosshair Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                <div className="w-full h-[1px] bg-amber" />
                <div className="h-full w-[1px] bg-amber absolute" />
              </div>
            </div>

            {/* Viewport Footer Data Bar */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-bronze font-mono text-[10px] text-parchment/70">
              <div>HEATMAP RANGE: 20°C - 38°C</div>
              <div className="text-center text-amber">EDGE AI INFERENCE: 12.4ms</div>
              <div className="text-right">RESOLUTION: 768 INFRARED PIXELS</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

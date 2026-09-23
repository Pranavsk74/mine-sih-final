import React, { useState } from 'react';
import { Compass, Navigation, Radio, AlertTriangle, ShieldCheck, MapPin, UserCheck, Flame } from 'lucide-react';

const TACTICAL_MARKERS = [
  {
    id: 'rover-marker',
    type: 'rover',
    label: 'ROVER UNIT #1',
    x: '42%',
    y: '48%',
    depth: '142 meters',
    status: 'INSPECTION ACTIVE',
    details: 'Current position: Tunnel Junction B-4. Transmitting 10Hz telemetry via LoRa.'
  },
  {
    id: 'worker-1',
    type: 'worker',
    label: 'TRAPPED MINER #1',
    x: '48%',
    y: '52%',
    depth: '145 meters',
    status: 'THERMAL LCK 36.8°C',
    details: 'Thermal signature confirmed at 36.8°C. Vital sign respiratory motion detected.'
  },
  {
    id: 'worker-2',
    type: 'worker',
    label: 'TRAPPED MINER #2',
    x: '52%',
    y: '55%',
    depth: '148 meters',
    status: 'THERMAL LCK 36.5°C',
    details: 'Secondary thermal envelope detected near collapsed pillar support.'
  },
  {
    id: 'hazard-ch4',
    type: 'hazard',
    label: 'CH4 GAS POCKET',
    x: '72%',
    y: '30%',
    depth: '110 meters',
    status: 'HIGH EXPLOSIVE 1.85%',
    details: 'Methane accumulation exceeds 1.25% LEL threshold. Do not introduce open electrical arcs.'
  },
  {
    id: 'repeater-node',
    type: 'repeater',
    label: 'SURFACE LoRa GATEWAY',
    x: '15%',
    y: '20%',
    depth: 'Surface Ground Level',
    status: 'ACTIVE GATEWAY 94%',
    details: 'Sub-GHz receiver gateway forwarding packet streams to Surface Station Edge Computer.'
  }
];

export default function TacticalRescueMap() {
  const [selectedMarkerId, setSelectedMarkerId] = useState('rover-marker');

  const activeMarker = TACTICAL_MARKERS.find((m) => m.id === selectedMarkerId) || TACTICAL_MARKERS[0];

  return (
    <section id="tactical-map" className="py-24 bg-walnut bg-cad-dark text-parchment relative border-b border-bronze">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <div className="border-b border-bronze pb-6 mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber uppercase tracking-widest mb-2">
              <Compass className="w-4 h-4" />
              <span>SECTION 07 — MISSION CONTROL & RESCUE MAP</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-parchment tracking-tight">
              TACTICAL SUBTERRANEAN MAP
            </h2>
          </div>
          <p className="font-sans text-sm text-parchment/70 max-w-md">
            2D CAD blueprint map of underground shaft sections detailing live rover tracking, trapped miner heat signatures, and methane hazard zones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAP CANVAS (8 Cols) */}
          <div className="lg:col-span-8 bg-walnut-dark border-2 border-bronze p-6 relative min-h-[500px] flex flex-col justify-between shadow-2xl">
            
            {/* Map Blueprint Top Bar */}
            <div className="flex items-center justify-between border-b border-bronze pb-3 font-mono text-xs text-amber">
              <span>TUNNEL MAPPING GRID — SECTION A-4 TO C-12</span>
              <span className="text-emerald-400">STATUS: RECONNAISSANCE ACTIVE</span>
            </div>

            {/* Interactive Underground Blueprint Layer */}
            <div className="relative my-6 h-96 bg-walnut/90 border border-bronze/60 overflow-hidden flex items-center justify-center bg-cad-dark">
              
              {/* Tunnel Shaft Blueprint Lines */}
              <svg className="absolute inset-0 w-full h-full stroke-bronze/50" strokeWidth="2" fill="none">
                {/* Main Shaft Tunnel A */}
                <path d="M 50 100 L 250 100 L 500 200 L 750 200" strokeDasharray="4" />
                {/* Sub Shaft Tunnel B */}
                <path d="M 250 100 L 250 300 L 600 300" strokeDasharray="4" />
                {/* Shaft Branch C */}
                <path d="M 500 200 L 500 350 L 700 350" strokeDasharray="4" />
              </svg>

              {/* Tunnel Labels */}
              <div className="absolute top-16 left-20 font-mono text-[10px] text-parchment/40">MAIN ENTRY SHAFT A-1</div>
              <div className="absolute top-44 left-64 font-mono text-[10px] text-parchment/40">GALLERY JUNCTION B-4</div>
              <div className="absolute bottom-16 right-32 font-mono text-[10px] text-parchment/40">EXCAVATION DRIFT C-8</div>

              {/* Tactical Markers overlay */}
              {TACTICAL_MARKERS.map((m) => {
                const isActive = m.id === selectedMarkerId;
                let colorClass = 'bg-amber border-amber text-walnut';
                if (m.type === 'worker') colorClass = 'bg-emerald-500 border-emerald-400 text-walnut';
                if (m.type === 'hazard') colorClass = 'bg-rose-600 border-rose-500 text-white';

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMarkerId(m.id)}
                    style={{ left: m.x, top: m.y }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 px-2.5 py-1 font-mono text-[10px] font-bold border flex items-center gap-1.5 z-20 ${
                      isActive
                        ? 'ring-2 ring-amber scale-110 shadow-[0_0_15px_#fee197]'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    } ${colorClass}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>{m.label}</span>
                  </button>
                );
              })}

            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between border-t border-bronze pt-3 font-mono text-[11px] text-parchment/70 gap-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber inline-block" /> ROVER</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 inline-block" /> TRAPPED MINER</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-rose-600 inline-block" /> METHANE HAZARD</span>
              </div>
              <div>COORDINATES: LAT 23.84° N | LON 86.42° E</div>
            </div>

          </div>

          {/* RIGHT: Marker Inspector (4 Cols) */}
          <div className="lg:col-span-4 bg-walnut-dark border border-bronze p-6 space-y-6">
            <span className="font-mono text-xs font-bold text-amber block border-b border-bronze pb-2 uppercase">
              TACTICAL MARKER INSPECTOR
            </span>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl font-bold text-parchment">
                  {activeMarker.label}
                </h3>
                <span className="font-mono text-[10px] bg-bronze/50 text-amber px-2 py-0.5 border border-bronze">
                  {activeMarker.type.toUpperCase()}
                </span>
              </div>

              <span className="font-mono text-xs text-amber font-semibold block mb-4">
                STATUS: {activeMarker.status}
              </span>

              <p className="font-sans text-xs text-parchment/90 leading-relaxed bg-walnut p-3 border border-bronze mb-4">
                {activeMarker.details}
              </p>

              <div className="space-y-2 font-mono text-xs border-t border-bronze/40 pt-3">
                <div className="flex justify-between">
                  <span className="text-parchment/60">SUBTERRANEAN DEPTH:</span>
                  <span className="text-amber">{activeMarker.depth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment/60">RADIO SIGNAL RSSI:</span>
                  <span className="text-emerald-400">-92 dBm (EXCELLENT)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment/60">RECOMMENDED ACTION:</span>
                  <span className="text-parchment font-bold">DEPLOY RESCUE VECTOR</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Dispatching rescue alert packet for marker: ${activeMarker.label}`)}
              className="w-full py-2.5 border border-amber text-amber font-mono text-xs uppercase hover:bg-amber hover:text-walnut-dark transition-colors rounded-btn font-bold"
            >
              DISPATCH RESCUE ALERT
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

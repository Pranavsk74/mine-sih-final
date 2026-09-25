import React, { useState } from 'react';
import { PIPELINE_NODES } from '../data/mockTelemetry';
import { Cpu, Radio, Shield, HardDrive, Terminal, Activity, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

export default function ArchitecturePipeline() {
  const [selectedNodeId, setSelectedNodeId] = useState('rover');

  const selectedNode = PIPELINE_NODES.find((n) => n.id === selectedNodeId) || PIPELINE_NODES[0];

  return (
    <section id="architecture" className="py-24 bg-walnut bg-cad-dark text-parchment relative border-b border-bronze">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="border-b border-bronze pb-6 mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber uppercase tracking-widest mb-2">
              <Layers className="w-4 h-4" />
              <span>SECTION 03 — SYSTEM ARCHITECTURE PIPELINE</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-parchment tracking-tight">
              ROVER-TO-SURFACE EDGE PIPELINE
            </h2>
          </div>
          <p className="font-sans text-sm text-parchment/70 max-w-md">
            Click any schematic node in the 8-stage pipeline to inspect hardware pinouts, sensor data protocols, and edge compute execution.
          </p>
        </div>

        {/* Pipeline Architecture Flow (8 Nodes Grid Layout) */}
        <div className="mb-12">
          {/* Animated Dashed Pipeline Flow Bar */}
          <div className="hidden lg:block relative mb-6">
            <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
              <line
                x1="4%"
                y1="50%"
                x2="96%"
                y2="50%"
                stroke="#987f61"
                strokeWidth="2"
                className="cad-dash-line"
              />
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {PIPELINE_NODES.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3 border text-left transition-all duration-200 flex flex-col justify-between h-32 relative ${
                    isSelected
                      ? 'bg-walnut-dark border-amber ring-1 ring-amber text-amber shadow-lg'
                      : 'bg-walnut/80 border-bronze text-parchment/80 hover:border-parchment/50 hover:bg-walnut-dark/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[10px] opacity-70">
                      STEP {node.step}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber" />}
                  </div>

                  <div>
                    <h4 className="font-serif text-xs font-bold leading-tight mb-1">
                      {node.title}
                    </h4>
                    <span className="font-mono text-[9px] block text-parchment/60 truncate">
                      {node.category}
                    </span>
                  </div>

                  <div className="text-[9px] font-mono border-t border-bronze/40 pt-1 mt-1 text-amber/80 flex items-center justify-between">
                    <span>{node.status}</span>
                    <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Technical Inspector Panel */}
        <div className="bg-walnut-dark border border-bronze p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">
          {/* Left Inspector Info */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-bronze pb-6 lg:pb-0 lg:pr-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-walnut bg-amber font-bold px-2 py-0.5">
                  STAGE {selectedNode.step}
                </span>
                <span className="font-mono text-xs text-amber uppercase">
                  {selectedNode.category} COMPONENT
                </span>
              </div>
              <span className="font-mono text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5">
                STATUS: {selectedNode.status}
              </span>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl font-bold text-parchment mb-1">
              {selectedNode.title}
            </h3>
            <p className="font-mono text-xs text-amber mb-4">
              {selectedNode.subtitle}
            </p>

            <p className="font-sans text-sm text-parchment/90 leading-relaxed mb-6">
              {selectedNode.summary}
            </p>

            {/* Subsystem Technical Details */}
            <div className="space-y-3 font-mono text-xs">
              <span className="text-amber/90 font-bold block border-b border-bronze/40 pb-1 uppercase">
                HARDWARE & PROTOCOL SPECIFICATION:
              </span>
              {Object.entries(selectedNode.details).map(([key, val]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="text-parchment/50 uppercase min-w-[140px] text-[11px]">
                    {key}:
                  </span>
                  <span className="text-parchment font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Metrics Grid */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-amber uppercase tracking-wider block mb-4 border-b border-bronze/40 pb-1">
                KEY PERFORMANCE METRICS
              </span>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedNode.specs.map((spec, idx) => (
                  <div key={idx} className="bg-walnut p-3 border border-bronze">
                    <span className="font-mono text-[10px] text-parchment/60 uppercase block">
                      {spec.label}
                    </span>
                    <span className="font-mono text-sm font-bold text-amber mt-1 block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bronze/20 border border-bronze p-4 text-xs font-mono text-parchment/80">
              <div className="flex items-center gap-2 text-amber mb-1 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>COMMUNICATION PARADIGM</span>
              </div>
              <p className="text-[11px] leading-relaxed text-parchment/70">
                100% Subterranean LoRa packet transmission directly to surface station edge server. No cloud dependence ensures disaster continuity.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { Box, RotateCcw, ZoomIn, Eye, Layers, Compass, Cpu } from 'lucide-react';

export default function Rover3DViewer() {
  const [wireframe, setWireframe] = useState(false);
  const [activeLayer, setActiveLayer] = useState('all');

  return (
    <section id="rover-3d" className="py-24 bg-walnut bg-cad-dark text-parchment relative border-b border-bronze">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="border-b border-bronze pb-6 mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber uppercase tracking-widest mb-2">
              <Box className="w-4 h-4 text-amber" />
              <span>SECTION — 3D CAD MODEL VIEWPORT</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-parchment tracking-tight">
              ROVER 3D MODEL & CAD ENVIRONMENT
            </h2>
          </div>
          <p className="font-sans text-sm text-parchment/70 max-w-md">
            Dedicated Three.js / WebGL 3D viewport canvas configured for real-time GLTF/GLB model rendering and structural inspection.
          </p>
        </div>

        {/* 3D Viewport Workspace Container */}
        <div className="bg-walnut-dark border-2 border-bronze p-6 relative shadow-2xl">
          
          {/* Top Control Toolbar */}
          <div className="flex flex-wrap items-center justify-between border-b border-bronze pb-4 mb-6 gap-4 font-mono text-xs">
            <div className="flex items-center gap-4 text-amber">
              <span className="font-bold uppercase text-sm">BGY 3D VIEWPORT</span>
              <span className="text-parchment/50">|</span>
              <span className="text-parchment/70 text-[11px]">FORMAT: GLTF / GLB READY</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-3 py-1.5 border text-xs font-mono uppercase transition-colors ${
                  wireframe
                    ? 'bg-amber text-walnut-dark border-amber font-bold'
                    : 'bg-walnut border-bronze text-parchment/80 hover:text-parchment'
                }`}
              >
                {wireframe ? 'WIREFRAME: ON' : 'WIREFRAME: OFF'}
              </button>

              {['all', 'chassis', 'sensors', 'electronics'].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-3 py-1.5 border text-xs font-mono uppercase transition-colors ${
                    activeLayer === layer
                      ? 'bg-bronze text-amber border-amber font-bold'
                      : 'bg-walnut border-bronze text-parchment/70 hover:text-parchment'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Model Render Canvas Viewport */}
          <div className="relative h-[480px] w-full bg-[#140d08] border border-bronze/60 flex flex-col justify-between p-6 overflow-hidden bg-cad-dark">
            
            {/* Viewport Corner CAD Annotations */}
            <div className="flex justify-between font-mono text-[10px] text-parchment/50">
              <div>ORBIT CONTROLS: ROTATE / ZOOM / PAN</div>
              <div>VIEWPORT RESOLUTION: 1920x1080 WEBGL</div>
            </div>

            {/* Central 3D Placeholder Canvas Visual */}
            <div className="my-auto text-center space-y-4 relative z-10">
              <div className="w-48 h-48 mx-auto border-2 border-dashed border-amber/60 flex flex-col items-center justify-center p-6 bg-walnut/40 relative shadow-2xl">
                {/* Simulated 3D Axis Cube */}
                <Box className="w-16 h-16 text-amber animate-pulse mb-3 stroke-[1.5]" />
                <span className="font-mono text-xs font-bold text-amber uppercase">
                  3D MODEL CANVAS
                </span>
                <span className="font-mono text-[9px] text-parchment/60 mt-1">
                  READY FOR .GLB/.GLTF INGESTION
                </span>

                {/* Corner Axis Indicators */}
                <span className="absolute top-2 left-2 text-[9px] font-mono text-amber">X+</span>
                <span className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400">Y+</span>
                <span className="absolute bottom-2 left-2 text-[9px] font-mono text-amber-dark">Z+</span>
              </div>

              <div className="font-mono text-xs text-parchment/70 max-w-sm mx-auto">
                Interactive Three.js Canvas configured for BGY 4WD Chassis rendering with full orbit controls.
              </div>
            </div>

            {/* Bottom Viewport Status Line */}
            <div className="flex flex-wrap items-center justify-between border-t border-bronze/40 pt-3 font-mono text-[10px] text-parchment/60 gap-2">
              <div className="flex items-center gap-3">
                <span className="text-amber">LIGHTING: THREE.DIRECTIONAL</span>
                <span>SHADOWS: ENABLED</span>
                <span>AA: FXAA</span>
              </div>
              <div>BGY HARDWARE COMPONENT INTERFACE</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

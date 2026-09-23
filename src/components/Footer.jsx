import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ scrollToSection }) {
  return (
    <footer className="bg-walnut-dark bg-cad-dark text-parchment py-16 border-t-2 border-bronze relative print:hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-bronze">
          
          {/* Brand & Logo Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/logo.png"
                alt="Claude's Plan Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="font-serif font-bold text-2xl text-parchment tracking-wider">
                  BGY
                </h3>
                <span className="font-mono text-[10px] text-amber uppercase">
                  BHOOMI GAT YAAN
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-parchment/70 max-w-md leading-relaxed">
              An intelligent inspection rover designed to enter hazardous underground mines before human rescue teams. Transmitting real-time telemetry over sub-GHz LoRa radio to surface edge AI.
            </p>

            <div className="flex items-center gap-3 font-mono text-[11px] text-parchment/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SUBTERRANEAN LoRa LINK: ACTIVE (868/915 MHz)</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-mono text-xs text-amber uppercase block mb-3 font-bold">
              SYSTEM SECTIONS
            </span>
            <ul className="space-y-1.5 font-mono text-xs text-parchment/70">
              <li>
                <button onClick={() => scrollToSection('hero')} className="hover:text-parchment transition-colors">
                  Overview & Hero
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('problem')} className="hover:text-parchment transition-colors">
                  Subterranean Hazards
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('architecture')} className="hover:text-parchment transition-colors">
                  System Architecture Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('rover-3d')} className="hover:text-parchment transition-colors">
                  Rover 3D Viewport
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('telemetry')} className="hover:text-parchment transition-colors">
                  Sensors & Mission Control
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('mldl')} className="hover:text-parchment transition-colors">
                  ML / DL Inference Core
                </button>
              </li>
            </ul>
          </div>

          {/* Product Specification Column */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-amber uppercase block font-bold mb-3">
              PRODUCT SPECIFICATION
            </span>
            <div className="bg-walnut p-3 border border-bronze space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-parchment/60">VERSION:</span>
                <span className="text-amber">v4.5 PROTOTYPE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment/60">DEPLOYMENT:</span>
                <span className="text-parchment">LOCAL SURFACE EDGE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment/60">CLOUD REQ:</span>
                <span className="text-emerald-400">NONE (100% EDGE)</span>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('hero')}
              className="w-full py-2 border border-bronze text-parchment font-mono text-xs uppercase flex items-center justify-center gap-2 hover:border-amber hover:text-amber transition-colors rounded-btn"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Footer Bottom Legal */}
        <div className="pt-8 flex flex-wrap items-center justify-between font-mono text-[11px] text-parchment/50 gap-4">
          <div>
            © 2026 BGY — BHOOMI GAT YAAN. ALL RIGHTS RESERVED.
          </div>
          <div>
            ENGINEERING JOURNAL & CAD ARCHIVE BLUEPRINT
          </div>
        </div>

      </div>
    </footer>
  );
}

import React from 'react';
import { MINE_HAZARDS } from '../data/mockTelemetry';
import { AlertTriangle, Flame, ShieldOff, Waves, UserCheck } from 'lucide-react';

const HAZARD_ICONS = {
  ch4: Flame,
  co: AlertTriangle,
  structural: ShieldOff,
  flooding: Waves,
  trapped: UserCheck,
};

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-parchment bg-newspaper-dots text-walnut-dark relative border-t-2 border-b-2 border-walnut">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Primary Editorial Pull Quote */}
        <div className="mb-16 border-l-4 border-walnut pl-6 py-2 max-w-4xl">
          <span className="font-mono text-xs uppercase text-bronze font-bold block mb-2 tracking-widest">
            PRIMARY MISSION PHILOSOPHY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-walnut-dark leading-[1.15] tracking-tight">
            WHEN THE ENVIRONMENT IS TOO DANGEROUS FOR PEOPLE,{' '}
            <span className="text-bronze underline decoration-walnut underline-offset-8">
              SEND THE ROVER FIRST.
            </span>
          </h2>
        </div>

        {/* Section Header */}
        <div className="border-b-2 border-walnut pb-6 mb-12">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono uppercase text-walnut/70 mb-2">
            <span>SUBTERRANEAN HAZARD ANALYSIS</span>
            <span>BGY — BHOOMI GAT YAAN</span>
            <span>ISSUE REV 4.5</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-walnut-dark tracking-tight mb-4">
            UNDERGROUND MINING HAZARDS & EMERGENCY RISKS
          </h3>
          <p className="font-sans text-base md:text-lg text-walnut/90 max-w-3xl leading-relaxed">
            Underground mining galleries present hazardous conditions. Structural roof falls, water ingress, and explosive methane accumulation endanger human search teams. BGY conducts forward inspection to establish safety before personnel entry.
          </p>
        </div>

        {/* Hazard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINE_HAZARDS.map((hazard) => {
            const IconComponent = HAZARD_ICONS[hazard.id] || AlertTriangle;
            return (
              <div
                key={hazard.id}
                className="bg-parchment-paper border border-walnut p-6 flex flex-col justify-between hover:bg-parchment-elevated transition-colors shadow-none"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-walnut/40 pb-3 mb-4">
                    <span className="font-mono text-xs font-bold text-walnut/60">{hazard.code}</span>
                    <IconComponent className="w-5 h-5 text-walnut" />
                  </div>
                  
                  <h4 className="font-serif text-xl font-bold text-walnut-dark mb-2">
                    {hazard.title}
                  </h4>

                  <div className="mb-4">
                    <span className="font-mono text-[11px] bg-walnut/10 px-2 py-0.5 text-walnut border border-walnut/20 inline-block mb-2">
                      SENSOR: {hazard.sensor}
                    </span>
                    <p className="font-mono text-xs text-bronze font-semibold">
                      THRES: {hazard.threshold}
                    </p>
                  </div>

                  <p className="font-sans text-sm text-walnut/80 mb-4 leading-normal">
                    {hazard.impact}
                  </p>
                </div>

                <div className="pt-4 border-t border-walnut/20 bg-parchment/40 p-3 -mx-6 -mb-6 mt-4">
                  <span className="font-mono text-[10px] uppercase text-walnut/60 block mb-1">
                    BGY MITIGATION STRATEGY:
                  </span>
                  <p className="font-sans text-xs text-walnut-dark font-medium">
                    {hazard.mitigation}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Newspaper Pull-Quote Card */}
          <div className="bg-walnut text-parchment p-8 flex flex-col justify-between border border-walnut border-l-4 border-l-amber md:col-span-2 lg:col-span-1">
            <div>
              <span className="font-mono text-xs text-amber uppercase tracking-widest block mb-4">
                ENGINEERING RATIONALE
              </span>
              <blockquote className="font-serif text-xl italic leading-relaxed text-parchment mb-6">
                "Human rescue teams cannot see through dense methane clouds or predict localized roof collapses. BGY functions as the sacrificial forward sensor, eliminating human risk."
              </blockquote>
            </div>

            <div className="font-mono text-xs text-amber border-t border-bronze pt-4 flex items-center justify-between">
              <span>MINE SAFETY DISASTER LAB</span>
              <span>BGY PROJECT</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

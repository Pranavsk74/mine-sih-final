import React, { useState, useEffect } from 'react';
import { Activity, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'hero', label: 'OVERVIEW' },
  { id: 'problem', label: 'HAZARDS' },
  { id: 'architecture', label: 'ARCHITECTURE' },
  { id: 'rover-3d', label: 'ROVER 3D' },
  { id: 'telemetry', label: 'SENSORS' },
  { id: 'ai-vision', label: 'VISION' },
  { id: 'tactical-map', label: 'RESCUE MAP' },
  { id: 'mldl', label: 'ML / DL' },
  { id: 'report', label: 'REPORT' },
];

const LIGHT_SECTIONS = ['problem', 'rover-cad', 'ai-vision', 'report', 'specs'];

export default function Navbar({ activeSection, setActiveSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if current active section is light-surfaced
  const isLightState = LIGHT_SECTIONS.includes(activeSection);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full print:hidden">
      <header
        className="w-full transition-all duration-300 py-3.5 px-6 md:px-10 border-b shadow-md"
        style={{
          backgroundColor: isLightState
            ? 'rgba(255, 255, 255, 0.72)'
            : scrolled
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(255, 255, 255, 0.08)',
          borderColor: isLightState ? 'rgba(47, 33, 22, 0.18)' : 'rgba(255, 255, 255, 0.20)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          boxShadow: isLightState ? '0 4px 20px rgba(0,0,0,0.06)' : '0 10px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          
          {/* BGY Brand Logo & Project Name */}
          <div
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <img
              src="/assets/logo.png"
              alt="Claude's Plan Logo"
              className="h-13 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className={`font-serif font-bold text-2xl sm:text-3xl tracking-wider leading-none transition-colors duration-300 ${
              isLightState ? 'text-[#1c130c]' : 'text-parchment drop-shadow-md'
            }`}>
              BGY
            </span>
          </div>

          {/* Desktop Adaptive Glass Nav Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative py-1 text-[11.5px] font-mono uppercase tracking-wider transition-colors duration-300 whitespace-nowrap ${
                    isLightState
                      ? isActive
                        ? 'text-[#1c130c] font-bold'
                        : 'text-[#2f2116]/80 hover:text-[#000000] font-semibold'
                      : isActive
                      ? 'text-amber font-bold drop-shadow'
                      : 'text-parchment/85 hover:text-parchment font-medium drop-shadow'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className={`absolute bottom-0 left-0 right-0 h-[2px] transition-colors duration-300 ${
                      isLightState
                        ? 'bg-[#2f2116] shadow-[0_0_8px_rgba(47,33,22,0.4)]'
                        : 'bg-amber shadow-[0_0_10px_#fee197]'
                    }`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Adaptive Connection Status Indicator */}
          <div className={`hidden sm:flex items-center gap-2.5 font-mono text-[11px] px-3.5 py-1.5 border rounded-btn shrink-0 backdrop-blur-md transition-all duration-300 ${
            isLightState
              ? 'bg-white/80 border-[#4f3622]/25 text-[#171717] shadow-sm'
              : 'bg-black/50 border-white/20 text-parchment/80'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={isLightState ? 'text-[#4f3622] font-medium' : 'text-parchment/80'}>LoRa Link:</span>
            <span className={isLightState ? 'text-[#1c130c] font-bold' : 'text-amber font-bold'}>94% ONLINE</span>
          </div>

          {/* Mobile Dropdown Button */}
          <div className="xl:hidden relative shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex items-center gap-2 border px-3 py-1.5 text-xs font-mono rounded-btn transition-colors ${
                isLightState
                  ? 'bg-white/90 border-[#4f3622]/30 text-[#171717] shadow-sm'
                  : 'bg-black/60 border-white/20 text-parchment'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isLightState ? 'text-[#4f3622]' : 'text-amber'}`} />
              <span>NAVIGATE</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#1c130c] border border-bronze shadow-2xl p-2 z-50 rounded-lg">
                <div className="text-[10px] font-mono text-amber px-3 py-1 border-b border-bronze/60 mb-1">
                  SECTIONS
                </div>
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 text-xs font-mono uppercase transition-colors rounded ${
                      activeSection === item.id
                        ? 'bg-bronze/60 text-amber font-bold'
                        : 'text-parchment/80 hover:bg-bronze/30 hover:text-parchment'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </header>
    </div>
  );
}

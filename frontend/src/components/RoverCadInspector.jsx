import React, { useState } from 'react';
import { Cpu, Zap, Radio, Eye, Flame, ShieldAlert, Navigation, Sun, Volume2 } from 'lucide-react';

const HARDWARE_COMPONENTS = [
  {
    id: 'esp32',
    name: 'ESP32 DevKit MCU',
    x: '48%',
    y: '42%',
    role: 'Central Processing & LoRa Telemetry Packets',
    voltage: '3.3V DC',
    bus: 'I2C, SPI, ADC',
    pinout: 'GPIO 21 (SDA), GPIO 22 (SCL), GPIO 5 (SPI CS)',
    description: 'Executes FreeRTOS tasks to sample gas sensors at 10Hz and compile binary telemetry packets for LoRa transmission.'
  },
  {
    id: 'mq4',
    name: 'MQ-4 Methane (CH4) Sensor',
    x: '22%',
    y: '28%',
    role: 'Combustible Gas Detection',
    voltage: '5.0V DC (Heater Power)',
    bus: 'Analog ADC (Pin VP / GPIO 36)',
    pinout: 'VCC, GND, AOUT',
    description: 'Tin dioxide (SnO2) semiconductor sensor measuring CH4 concentration in mine air from 300 to 10,000 ppm.'
  },
  {
    id: 'mq7',
    name: 'MQ-7 Carbon Monoxide Sensor',
    x: '76%',
    y: '28%',
    role: 'Toxic CO Asphyxiant Detection',
    voltage: '5.0V / 1.4V Pulsed Heating',
    bus: 'Analog ADC (Pin VN / GPIO 39)',
    pinout: 'VCC, GND, AOUT',
    description: 'Cycles heater voltage to measure CO gas levels in high-temperature or smoldering subterranean shafts.'
  },
  {
    id: 'bme280',
    name: 'BME280 Climate Sensor',
    x: '35%',
    y: '65%',
    role: 'Barometric Pressure, Humidity & Temp',
    voltage: '3.3V DC',
    bus: 'I2C Address 0x76',
    pinout: 'VCC, GND, SCL, SDA',
    description: 'Provides calibrated atmospheric measurements to detect water table ingress or sudden tunnel pressure drops.'
  },
  {
    id: 'mpu6050',
    name: 'MPU6050 6-DOF IMU',
    x: '62%',
    y: '65%',
    role: 'Seismic Vibration & Structural Tilt',
    voltage: '3.3V DC',
    bus: 'I2C Address 0x68',
    pinout: 'VCC, GND, SCL, SDA, INT (GPIO 15)',
    description: 'Fuses 3-axis accelerometer and 3-axis gyroscope data to identify micro-tilt angles and roof fall vibrations.'
  },
  {
    id: 'mlx90640',
    name: 'MLX90640 Thermal Sensor',
    x: '50%',
    y: '18%',
    role: '32x24 Far-Infrared Heat Signature Array',
    voltage: '3.3V DC',
    bus: 'I2C Address 0x33 (400kHz)',
    pinout: 'VCC, GND, SCL, SDA',
    description: 'Captures 768 thermal data points to detect human body temperatures (36.5°C - 37.5°C) through dark smoke.'
  },
  {
    id: 'lora',
    name: 'SX1276 LoRa Module & Antenna',
    x: '85%',
    y: '15%',
    role: 'Sub-GHz Long-Range Radio Transmitter',
    voltage: '3.3V DC',
    bus: 'SPI Bus (SCK, MISO, MOSI)',
    pinout: 'NSS (GPIO 5), RST (GPIO 14), DIO0 (GPIO 2)',
    description: 'Transmits telemetry packets over 868MHz/915MHz chirp spread spectrum for subterranean penetration.'
  },
  {
    id: 'ina219',
    name: 'INA219 Power Monitor',
    x: '15%',
    y: '78%',
    role: 'LiFePO4 Voltage & Current Sensing',
    voltage: '3.3V - 26V Sense Range',
    bus: 'I2C Address 0x40',
    pinout: 'VIN+, VIN-, VCC, GND, SCL, SDA',
    description: 'Measures battery voltage, current draw, and power consumption to monitor remaining rover operational time.'
  }
];

export default function RoverCadInspector() {
  const [activeComponentId, setActiveComponentId] = useState('esp32');

  const activeComp = HARDWARE_COMPONENTS.find((c) => c.id === activeComponentId) || HARDWARE_COMPONENTS[0];

  return (
    <section id="rover-cad" className="py-24 bg-parchment bg-cad-light text-walnut-dark relative border-b-2 border-walnut">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="border-b-2 border-walnut pb-6 mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-bronze uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4 text-walnut" />
              <span>SECTION 04 — ROVER CAD & FIELD OBSERVATION</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-walnut-dark tracking-tight">
              RESCUE ROVER HARDWARE BLUEPRINT
            </h2>
          </div>
          <p className="font-sans text-sm text-walnut/80 max-w-md">
            Click any labeled CAD hotspot on the chassis schematic to inspect pinouts, operating voltages, and sensor responsibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Narrative & Engineering Rationale */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div className="bg-parchment-paper border border-walnut p-6">
              <span className="font-mono text-xs font-bold text-walnut/60 block mb-2">
                FIELD INSPECTION PROTOCOL
              </span>
              <h3 className="font-serif text-2xl font-bold text-walnut-dark mb-3">
                First Responder Inspection Unit
              </h3>
              <p className="font-sans text-sm text-walnut/90 leading-relaxed mb-4">
                The Mine Sense rover enters unstable mine galleries ahead of human teams. Equipped with 4 geared DC motors, an array of chemical gas sensors, precision climate tracking, and dual thermal vision, it generates a comprehensive risk map of the underground environment.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-walnut/30 font-mono text-xs">
                <div>
                  <span className="text-walnut/60 block text-[10px]">CHASSIS TYPE</span>
                  <span className="font-bold text-walnut-dark">4WD Heavy Polymer</span>
                </div>
                <div>
                  <span className="text-walnut/60 block text-[10px]">DRIVE SYSTEM</span>
                  <span className="font-bold text-walnut-dark">4x Geared Motors</span>
                </div>
                <div>
                  <span className="text-walnut/60 block text-[10px]">OPERATING RANGE</span>
                  <span className="font-bold text-walnut-dark">1.8 km LoRa</span>
                </div>
                <div>
                  <span className="text-walnut/60 block text-[10px]">POWER MONITOR</span>
                  <span className="font-bold text-walnut-dark">INA219 Integrated</span>
                </div>
              </div>
            </div>

            {/* Selected Component Technical Detail Card */}
            <div className="bg-walnut text-parchment border border-walnut p-6">
              <div className="flex items-center justify-between border-b border-bronze pb-2 mb-3">
                <span className="font-mono text-xs text-amber font-bold">
                  HOTSPOT INSPECTION
                </span>
                <span className="font-mono text-[10px] text-parchment/60 uppercase">
                  {activeComp.bus}
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-amber mb-1">
                {activeComp.name}
              </h4>
              <p className="font-mono text-xs text-parchment/80 mb-3">
                ROLE: {activeComp.role}
              </p>

              <p className="font-sans text-xs text-parchment/90 mb-4 leading-normal">
                {activeComp.description}
              </p>

              <div className="space-y-1 font-mono text-[11px] bg-walnut-dark p-3 border border-bronze">
                <div className="flex justify-between">
                  <span className="text-parchment/60">VOLTAGE:</span>
                  <span className="text-amber">{activeComp.voltage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-parchment/60">PINOUT:</span>
                  <span className="text-parchment truncate max-w-[200px]">{activeComp.pinout}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive CAD Rover Blueprint Grid */}
          <div className="lg:col-span-7 bg-walnut-dark border-2 border-walnut p-6 relative min-h-[480px] flex flex-col justify-between shadow-2xl">
            {/* Blueprint Header */}
            <div className="flex items-center justify-between border-b border-bronze pb-3 text-mono text-xs text-amber">
              <span>DRAWING NO: MS-ROVER-2026</span>
              <span>SCALE: 1:1 CAD</span>
              <span>SELECT HOTSPOT TO INSPECT</span>
            </div>

            {/* CAD Chassis Diagram Canvas */}
            <div className="relative my-8 h-80 bg-walnut/90 border border-bronze/60 flex items-center justify-center overflow-hidden">
              
              {/* Outer Rover Chassis Wireframe Box */}
              <div className="w-4/5 h-3/4 border-2 border-dashed border-bronze/80 relative flex items-center justify-center bg-walnut-dark/60">
                {/* Wheels */}
                <div className="absolute -left-5 -top-4 w-6 h-16 border-2 border-amber bg-walnut text-[9px] font-mono text-amber flex items-center justify-center rotate-12">M1</div>
                <div className="absolute -right-5 -top-4 w-6 h-16 border-2 border-amber bg-walnut text-[9px] font-mono text-amber flex items-center justify-center -rotate-12">M2</div>
                <div className="absolute -left-5 -bottom-4 w-6 h-16 border-2 border-amber bg-walnut text-[9px] font-mono text-amber flex items-center justify-center -rotate-12">M3</div>
                <div className="absolute -right-5 -bottom-4 w-6 h-16 border-2 border-amber bg-walnut text-[9px] font-mono text-amber flex items-center justify-center rotate-12">M4</div>

                {/* Center Core Plate Label */}
                <div className="text-center font-mono text-xs text-parchment/30 uppercase tracking-widest pointer-events-none">
                  MINE SENSE ROVER CHASSIS PLACEMENT
                </div>

                {/* Hotspot Buttons overlay */}
                {HARDWARE_COMPONENTS.map((comp) => {
                  const isActive = comp.id === activeComponentId;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setActiveComponentId(comp.id)}
                      style={{ left: comp.x, top: comp.y }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 px-2 py-1 font-mono text-[10px] font-bold border flex items-center gap-1.5 z-20 ${
                        isActive
                          ? 'bg-amber text-walnut-dark border-amber shadow-[0_0_12px_#fee197] scale-110'
                          : 'bg-walnut/90 text-parchment border-bronze hover:border-amber hover:text-amber'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-walnut-dark' : 'bg-amber'}`} />
                      <span>{comp.id.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hotspot Selection Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-bronze">
              <span className="font-mono text-[11px] text-parchment/60 mr-2">QUICK HOTSPOTS:</span>
              {HARDWARE_COMPONENTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveComponentId(c.id)}
                  className={`px-2 py-1 font-mono text-[10px] uppercase border ${
                    activeComponentId === c.id
                      ? 'bg-amber text-walnut-dark border-amber font-bold'
                      : 'bg-walnut border-bronze text-parchment/70 hover:text-parchment'
                  }`}
                >
                  {c.id}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

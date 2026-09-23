import React from 'react';
import { MOCK_HARDWARE_SPECS } from '../data/mockTelemetry';
import { FileText, Cpu, Battery, Radio, Shield, Wrench } from 'lucide-react';

const SPEC_SECTIONS = [
  {
    category: 'MICROCONTROLLER & COMPUTE',
    specs: [
      { name: 'Primary Processor', detail: 'Espressif Systems ESP32-WROOM-32U Dual-Core Xtensa LX6 @ 240MHz' },
      { name: 'SRAM & Flash Memory', detail: '520 KB Internal SRAM / 4 MB External Quad-SPI Flash' },
      { name: 'Embedded OS / Firmware', detail: 'FreeRTOS Real-Time Kernel (Dual-Core Task Pinning)' },
      { name: 'Hardware Bus Interfaces', detail: 'I2C Bus (400kHz Fast-Mode), SPI Master, 12-Bit SAR ADC' },
    ]
  },
  {
    category: 'SENSING & VISION MATRIX',
    specs: [
      { name: 'Combustible Gas Sensor', detail: 'MQ-4 SnO2 Semiconductor (300 - 10,000 ppm CH4 Methane)' },
      { name: 'Toxic Gas Sensor', detail: 'MQ-7 Electrochemical Sensor (20 - 2,000 ppm Carbon Monoxide CO)' },
      { name: 'Environmental Baro/Climate', detail: 'Bosch BME280 (300-1100 hPa, 0-100% RH, -40 to +85°C)' },
      { name: 'Inertial Motion Tracking', detail: 'InvenSense MPU6050 6-Axis Accelerometer & Gyroscope' },
      { name: 'Infrared Thermal Grid', detail: 'Melexis MLX90640 32x24 Far-Infrared Matrix (768 Pixels, ±1.0°C)' },
    ]
  },
  {
    category: 'SUBTERRANEAN COMMUNICATIONS',
    specs: [
      { name: 'LoRa Radio Transceiver', detail: 'Semtech SX1276 SPI Module (@ 868 MHz / 915 MHz ISM Frequency)' },
      { name: 'Wireless Modulation', detail: 'LoRa Chirp Spread Spectrum (CSS), SF9, BW 125 kHz, CR 4/5' },
      { name: 'Subterranean Line-of-Sight', detail: '1.8 km Tested Range through Dense Rock Tunnels' },
      { name: 'RF Output Power', detail: '+20 dBm (100 mW Transmit Power) with 5dBi High-Gain Dipole' },
    ]
  },
  {
    category: 'CHASSIS, POWER & SAFETY',
    specs: [
      { name: 'Chassis Frame Material', detail: 'Heavy-Duty Reinforced Polymer & Aluminum Alloy Armor Plate' },
      { name: 'Drive Motors', detail: '4x Geared DC Motors with High-Torque All-Metal Gearboxes' },
      { name: 'Power Bus & Monitoring', detail: 'Texas Instruments INA219 I2C High-Side Current & Voltage Monitor' },
      { name: 'Safety Systems', detail: 'Manual Emergency Cut-Off Switch + High-Decibel Piezo Buzzer + Searchlight' },
    ]
  }
];

export default function TechSpecsTable() {
  return (
    <section id="specs" className="py-24 bg-parchment bg-newspaper-dots text-walnut-dark relative border-b-2 border-walnut">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <div className="border-b-2 border-walnut pb-6 mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-bronze uppercase tracking-widest mb-2">
              <FileText className="w-4 h-4 text-walnut" />
              <span>SECTION 08 — ENGINEERING SPECIFICATIONS</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-walnut-dark tracking-tight">
              TECHNICAL HARDWARE INVENTORY
            </h2>
          </div>
          <p className="font-sans text-sm text-walnut/80 max-w-md">
            Authoritative technical parameters and hardware component listings for the Mine Sense inspection rover system.
          </p>
        </div>

        {/* Technical Specification Tables */}
        <div className="space-y-8">
          {SPEC_SECTIONS.map((sec, idx) => (
            <div key={idx} className="bg-parchment-paper border border-walnut p-6 shadow-none">
              <h3 className="font-mono text-xs font-bold text-walnut bg-parchment-elevated px-3 py-1.5 border border-walnut/30 inline-block mb-4 uppercase tracking-wider">
                {sec.category}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-walnut text-walnut/70">
                      <th className="py-2 px-3 w-1/3 uppercase font-bold">COMPONENT / PARAMETER</th>
                      <th className="py-2 px-3 w-2/3 uppercase font-bold">ENGINEERING SPECIFICATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sec.specs.map((sp, sIdx) => (
                      <tr key={sIdx} className="border-b border-walnut/20 hover:bg-parchment/60 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-walnut-dark">{sp.name}</td>
                        <td className="py-2.5 px-3 text-bronze">{sp.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import ArchitecturePipeline from './components/ArchitecturePipeline';
import RoverCadInspector from './components/RoverCadInspector';
import Rover3DViewer from './components/Rover3DViewer';
import TelemetryWorkstation from './components/TelemetryWorkstation';
import AiVisionWorkstation from './components/AiVisionWorkstation';
import TacticalRescueMap from './components/TacticalRescueMap';
import MlDlSection from './components/MlDlSection';
import ReportSection from './components/ReportSection';
import TechSpecsTable from './components/TechSpecsTable';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'problem', 'architecture', 'rover-cad', 'rover-3d', 'telemetry', 'ai-vision', 'tactical-map', 'mldl', 'report', 'specs'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sections[i]);
        if (elem && elem.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-walnut text-parchment font-sans selection:bg-amber selection:text-walnut-dark">
      {/* Full-Width Transparent Glass Navbar */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <ProblemSection />
        <ArchitecturePipeline />
        <RoverCadInspector />
        <Rover3DViewer />
        <TelemetryWorkstation />
        <AiVisionWorkstation />
        <TacticalRescueMap />
        <MlDlSection />
        <ReportSection />
        <TechSpecsTable />
      </main>

      {/* Footer */}
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}

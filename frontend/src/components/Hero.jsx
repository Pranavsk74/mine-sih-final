import React from 'react';

export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen min-h-[640px] flex items-end justify-start overflow-hidden bg-[#1c130c] print:hidden">
      
      {/* 1. BACKGROUND VIDEO (100vw x 100vh FULL-SCREEN HERO CANVAS) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 transform scale-105 transition-transform duration-1000"
      >
        <source src="/assets/truck_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. TRANSLUCENT BROWN WALNUT TONAL TREATMENT (rgba(47, 33, 22, 0.35)) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#2f2116]/35 via-[#1c130c]/30 to-[#2f2116]/65 pointer-events-none" />

      {/* 3. EXTREMELY SUBTLE BACKGROUND ENGINEERING GRID (Opacity ~0.04) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(152, 127, 97, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(152, 127, 97, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        }}
      />

      {/* 4. SANS-SERIF HELVETICA HERO (Positioned Lower-Left with Generous Space & Perfect Vertical Alignment) */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-10 pb-16 md:pb-24 w-full">
        <div 
          className="flex flex-col items-start justify-start text-left space-y-3 m-0 p-0 max-w-3xl"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          
          {/* Main Title - Helvetica Bold BGY */}
          <h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-parchment tracking-tight leading-none drop-shadow-lg m-0 p-0 text-left"
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 800, 
              marginLeft: 0, 
              paddingLeft: 0 
            }}
          >
            BGY
          </h1>

          {/* Subtitle - Helvetica Bold Subtitle BHOOMI GAT YAAN (Aligned to visible B edge) */}
          <p 
            className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest text-amber drop-shadow m-0 text-left pl-[4px] sm:pl-[5px] md:pl-[6.5px] lg:pl-[7.5px]"
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 700
            }}
          >
            BHOOMI GAT YAAN
          </p>

        </div>
      </div>

    </section>
  );
}

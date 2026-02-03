import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { QRPreview } from './components/QRPreview';
import { QRConfig } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<QRConfig>({
    text: 'https://eagleon.dev',
    size: 256,
    fgColor: '#7bbbff',
    bgColor: '#01080f',
    glowEffect: true,
    style: 'square',
    logo: null,
  });

  return (
    <div className="min-h-screen w-full bg-[#01080f] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#050f2a] via-[#01080f] to-black text-white flex items-center justify-center p-4 sm:p-8">
      
      {/* Main Glassmorphic Card */}
      <main className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-eagleon-primary/20 rounded-2xl shadow-[0_0_50px_-12px_rgba(123,187,255,0.1)] overflow-hidden">
        
        {/* Header */}
        <header className="border-b border-white/5 p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-eagleon-primary rounded-full shadow-[0_0_15px_#7bbbff]"></div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
              Eagleon <span className="text-eagleon-primary">QR Studio</span>
            </h1>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-mono text-eagleon-secondary/70 border border-eagleon-secondary/20 px-3 py-1 rounded-full">
              V2.1 // LOGO INJECTION
            </span>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-white/5">
          
          {/* Controls Column */}
          <section className="lg:col-span-4 h-full">
            <ControlPanel config={config} setConfig={setConfig} />
          </section>

          {/* Preview Column */}
          <section className="lg:col-span-8 p-8 md:p-12 flex flex-col items-center justify-center bg-black/20 min-h-[500px]">
            <QRPreview config={config} />
          </section>

        </div>
      </main>
      
      {/* Sticky footer for mobile branding if needed, or background accents */}
      <div className="fixed -bottom-20 -right-20 w-96 h-96 bg-eagleon-primary/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-eagleon-secondary/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
};

export default App;
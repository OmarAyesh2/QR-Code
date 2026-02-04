import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { QRPreview } from './components/QRPreview';
import { LinkTreeControls } from './components/LinkTreeControls';
import { LinkTreePreview } from './components/LinkTreePreview';
import { QRConfig, LinkTreeConfig } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qr' | 'linktree'>('qr');

  // QR State
  const [qrConfig, setQrConfig] = useState<QRConfig>({
    text: 'https://eagleon.dev',
    size: 256,
    fgColor: '#7bbbff',
    bgColor: '#01080f',
    glowEffect: true,
    style: 'square',
    logo: null,
  });

  // Link Tree State
  const [treeConfig, setTreeConfig] = useState<LinkTreeConfig>({
    name: 'Eagleon User',
    bio: 'Digital explorer navigating the neon grid.',
    profileImage: null,
    links: [
        { id: '1', label: 'My Website', url: 'https://eagleon.dev', icon: 'globe' },
        { id: '2', label: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
        { id: '3', label: 'Contact', url: 'mailto:hello@eagleon.dev', icon: 'email' }
    ],
    theme: {
        bgGradientStart: '#0f172a', // Slate 900
        bgGradientEnd: '#312e81',   // Indigo 900
        textColor: '#ffffff',
        buttonColor: '#ffffff',     // White base for glass
        buttonTextColor: '#ffffff'
    }
  });

  return (
    <div className="min-h-screen w-full bg-[#01080f] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#050f2a] via-[#01080f] to-black text-white flex items-center justify-center p-4 sm:p-8">
      
      {/* Main Glassmorphic Card */}
      <main className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-eagleon-primary/20 rounded-2xl shadow-[0_0_50px_-12px_rgba(123,187,255,0.1)] overflow-hidden flex flex-col h-[90vh] lg:h-auto lg:min-h-[700px]">
        
        {/* Header with Navigation */}
        <header className="border-b border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-eagleon-primary rounded-full shadow-[0_0_15px_#7bbbff]"></div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
              Eagleon <span className="text-eagleon-primary">Hub</span>
            </h1>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5">
            <button 
                onClick={() => setActiveTab('qr')}
                className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'qr' 
                    ? 'bg-eagleon-primary text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                QR Engine
            </button>
            <button 
                onClick={() => setActiveTab('linktree')}
                className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'linktree' 
                    ? 'bg-eagleon-primary text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                Link Nexus
            </button>
          </nav>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-white/5 flex-1 overflow-hidden">
          
          {/* Controls Column */}
          <section className="lg:col-span-4 h-full overflow-y-auto custom-scrollbar border-b lg:border-b-0 border-white/5">
            {activeTab === 'qr' ? (
                <ControlPanel config={qrConfig} setConfig={setQrConfig} />
            ) : (
                <LinkTreeControls config={treeConfig} setConfig={setTreeConfig} />
            )}
          </section>

          {/* Preview Column */}
          <section className="lg:col-span-8 p-8 md:p-12 flex flex-col items-center justify-center bg-black/20 h-full overflow-y-auto">
            {activeTab === 'qr' ? (
                <QRPreview config={qrConfig} />
            ) : (
                <LinkTreePreview config={treeConfig} />
            )}
          </section>

        </div>
      </main>
      
      {/* Background Accents */}
      <div className="fixed -bottom-20 -right-20 w-96 h-96 bg-eagleon-primary/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-eagleon-secondary/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
};

export default App;
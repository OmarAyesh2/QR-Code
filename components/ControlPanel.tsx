import React, { useRef } from 'react';
import { QRConfig, QRStyleType } from '../types';

interface ControlPanelProps {
  config: QRConfig;
  setConfig: React.Dispatch<React.SetStateAction<QRConfig>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (key: keyof QRConfig, value: string | number | boolean | QRStyleType | null) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          handleChange('logo', event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const styles: { id: QRStyleType; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'square', 
      label: 'Classic', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <rect x="2" y="2" width="9" height="9" />
          <rect x="13" y="2" width="9" height="9" />
          <rect x="2" y="13" width="9" height="9" />
          <rect x="14" y="14" width="7" height="7" opacity="0.5" />
        </svg>
      )
    },
    { 
      id: 'dots', 
      label: 'Dots', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <circle cx="6.5" cy="6.5" r="4.5" />
          <circle cx="17.5" cy="6.5" r="4.5" />
          <circle cx="6.5" cy="17.5" r="4.5" />
          <circle cx="17.5" cy="17.5" r="3.5" opacity="0.5" />
        </svg>
      )
    },
    { 
      id: 'rounded', 
      label: 'Soft', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <rect x="2" y="2" width="9" height="9" rx="2" />
          <rect x="13" y="2" width="9" height="9" rx="2" />
          <rect x="2" y="13" width="9" height="9" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" opacity="0.5" />
        </svg>
      )
    },
    { 
      id: 'extra-rounded', 
      label: 'Liquid', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M7 2H6C3.79086 2 2 3.79086 2 6V7C2 9.20914 3.79086 11 6 11H7C9.20914 11 11 9.20914 11 7V6C11 3.79086 9.20914 2 7 2Z" />
          <path d="M18 2h-1c-2.2091 0-4 1.79086-4 4v1c0 2.20914 1.7909 4 4 4h1c2.2091 0 4-1.79086 4-4V6c0-2.20914-1.7909-4-4-4Z" />
          <path d="M7 13H6c-2.20914 0-4 1.7909-4 4v1c0 2.2091 1.79086 4 4 4h1c2.20914 0 4-1.7909 4-4v-1c0-2.2091-1.79086-4-4-4Z" />
        </svg>
      )
    },
    { 
      id: 'classy', 
      label: 'Classy', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <rect x="2" y="2" width="9" height="9" rx="0" />
          <rect x="13" y="2" width="9" height="4" rx="0" />
          <rect x="13" y="7" width="9" height="4" rx="0" />
          <rect x="2" y="13" width="4" height="9" rx="0" />
          <rect x="7" y="13" width="4" height="9" rx="0" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      
      {/* Text Input */}
      <div className="flex flex-col gap-2">
        <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Content</label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="ENTER URL OR TEXT"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-eagleon-primary focus:ring-1 focus:ring-eagleon-primary transition-all backdrop-blur-md"
        />
      </div>

      {/* Style Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Pattern Style</label>
        <div className="grid grid-cols-5 gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleChange('style', style.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300 gap-1
                ${config.style === style.id 
                  ? 'bg-eagleon-primary/20 border-eagleon-primary text-eagleon-primary shadow-[0_0_15px_rgba(123,187,255,0.2)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}
              `}
              title={style.label}
            >
              {style.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Foreground</label>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-md">
            <input
              type="color"
              value={config.fgColor}
              onChange={(e) => handleChange('fgColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
            />
            <span className="text-sm font-mono text-gray-300 uppercase">{config.fgColor}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Background</label>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-md">
            <input
              type="color"
              value={config.bgColor}
              onChange={(e) => handleChange('bgColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
            />
            <span className="text-sm font-mono text-gray-300 uppercase">{config.bgColor}</span>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Brand Logo</label>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/svg+xml"
          onChange={handleLogoUpload}
          className="hidden"
        />
        
        {!config.logo ? (
          <button 
            onClick={triggerFileUpload}
            className="w-full py-4 border border-dashed border-white/20 rounded-lg text-sm text-gray-400 hover:border-eagleon-primary hover:text-eagleon-primary hover:bg-eagleon-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload PNG / SVG
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-md">
            <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
              <img src={config.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-xs text-white font-medium">Logo Uploaded</span>
              <span className="text-[10px] text-gray-400">Center placement</span>
            </div>
            <button 
              onClick={() => handleChange('logo', null)}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Remove Logo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Size Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Size</label>
          <span className="text-xs font-mono text-eagleon-secondary">{config.size}PX</span>
        </div>
        <input
          type="range"
          min="128"
          max="512"
          step="8"
          value={config.size}
          onChange={(e) => handleChange('size', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-eagleon-primary"
        />
      </div>

      {/* Eagleon Edge Toggle */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-eagleon-primary font-bold text-sm uppercase">Eagleon Glow</span>
          <span className="text-xs text-gray-400">Inject brand identity</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={config.glowEffect} 
            onChange={(e) => handleChange('glowEffect', e.target.checked)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eagleon-primary"></div>
        </label>
      </div>
    </div>
  );
};
import React, { useRef, useState, useEffect } from 'react';
import { LinkTreeConfig, LinkItem } from '../types';
import { ICONS } from '../constants';

interface LinkTreeControlsProps {
  config: LinkTreeConfig;
  setConfig: React.Dispatch<React.SetStateAction<LinkTreeConfig>>;
}

export const LinkTreeControls: React.FC<LinkTreeControlsProps> = ({ config, setConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openIconPicker, setOpenIconPicker] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setOpenIconPicker(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileChange = (key: keyof LinkTreeConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (key: keyof LinkTreeConfig['theme'], value: string) => {
    setConfig(prev => ({
      ...prev,
      theme: { ...prev.theme, [key]: value }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          handleProfileChange('profileImage', event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      label: 'New Link',
      url: 'https://',
      icon: 'link'
    };
    setConfig(prev => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const updateLink = (id: string, key: keyof LinkItem, value: string) => {
    setConfig(prev => ({
      ...prev,
      links: prev.links.map(link => link.id === id ? { ...link, [key]: value } : link)
    }));
  };

  const removeLink = (id: string) => {
    setConfig(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }));
  };

  const handleIconSelect = (linkId: string, iconKey: string) => {
    setConfig(prev => ({
      ...prev,
      links: prev.links.map(link => {
        if (link.id !== linkId) return link;

        let newUrl = link.url;
        // Automatically adjust protocol for specific types
        if (iconKey === 'phone') {
          if (!newUrl || newUrl === 'https://') {
            newUrl = 'tel:';
          } else if (!newUrl.startsWith('tel:')) {
            newUrl = `tel:${newUrl.replace(/^(https?:\/\/|mailto:)/, '')}`;
          }
        } else if (iconKey === 'email') {
           if (!newUrl || newUrl === 'https://') {
            newUrl = 'mailto:';
          } else if (!newUrl.startsWith('mailto:')) {
            newUrl = `mailto:${newUrl.replace(/^(https?:\/\/|tel:)/, '')}`;
          }
        }

        return { ...link, icon: iconKey, url: newUrl };
      })
    }));
    setOpenIconPicker(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
      
      {/* Profile Section */}
      <div className="flex flex-col gap-4">
        <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Profile Identity</label>
        
        <div className="flex items-start gap-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-eagleon-primary transition-all overflow-hidden shrink-0 group relative"
          >
            {config.profileImage ? (
              <img src={config.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 group-hover:text-eagleon-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] uppercase font-bold text-white transition-opacity">Edit</div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          
          <div className="flex flex-col gap-2 flex-1">
            <input
              type="text"
              value={config.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              placeholder="Display Name"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-eagleon-primary text-sm"
            />
            <textarea
              value={config.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              placeholder="Short bio..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-eagleon-primary text-sm h-16 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Link Nexus</label>
          <button 
            onClick={addLink}
            className="text-xs bg-eagleon-primary/10 text-eagleon-primary px-2 py-1 rounded hover:bg-eagleon-primary hover:text-black transition-colors"
          >
            + ADD LINK
          </button>
        </div>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 pb-20">
          {config.links.map((link) => (
            <div key={link.id} className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-2 group hover:border-white/20 transition-all relative">
              
              <div className="flex items-center gap-2">
                
                {/* Icon Trigger */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenIconPicker(openIconPicker === link.id ? null : link.id);
                    }}
                    className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white hover:bg-eagleon-primary hover:text-black transition-colors"
                  >
                     <svg 
                        viewBox={ICONS[link.icon || 'link'].viewBox} 
                        className="w-4 h-4"
                        dangerouslySetInnerHTML={{ __html: ICONS[link.icon || 'link'].path }} 
                     />
                  </button>

                  {/* Dropdown Picker */}
                  {openIconPicker === link.id && (
                    <div ref={pickerRef} className="absolute top-10 left-0 z-50 w-64 bg-[#0a1525] border border-white/10 rounded-xl shadow-2xl p-3 grid grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {Object.keys(ICONS).map((iconKey) => (
                        <button
                          key={iconKey}
                          onClick={() => handleIconSelect(link.id, iconKey)}
                          className={`
                            w-10 h-10 rounded flex items-center justify-center transition-all
                            ${link.icon === iconKey ? 'bg-eagleon-primary text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
                          `}
                          title={ICONS[iconKey].label}
                        >
                           <svg 
                              viewBox={ICONS[iconKey].viewBox} 
                              className="w-5 h-5"
                              dangerouslySetInnerHTML={{ __html: ICONS[iconKey].path }} 
                           />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                  className="bg-transparent border-b border-white/10 w-full text-sm py-1 focus:outline-none focus:border-eagleon-primary text-white font-medium"
                  placeholder="Link Label"
                />
                
                <button 
                  onClick={() => removeLink(link.id)}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                className="bg-transparent text-xs text-gray-400 focus:outline-none focus:text-eagleon-secondary w-full pl-10"
                placeholder="https://..."
              />
            </div>
          ))}
          {config.links.length === 0 && (
            <div className="text-center text-xs text-gray-500 py-4 italic">No links added to the nexus yet.</div>
          )}
        </div>
      </div>

      {/* Styling Section */}
      <div className="flex flex-col gap-4">
        <label className="text-eagleon-primary text-xs font-bold tracking-widest uppercase">Theme Matrix</label>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Gradient Start</span>
            <div className="flex items-center gap-2 bg-white/5 rounded p-1 border border-white/10">
              <input 
                type="color" 
                value={config.theme.bgGradientStart}
                onChange={(e) => handleThemeChange('bgGradientStart', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" 
              />
              <span className="text-xs font-mono text-gray-400">{config.theme.bgGradientStart}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Gradient End</span>
            <div className="flex items-center gap-2 bg-white/5 rounded p-1 border border-white/10">
              <input 
                type="color" 
                value={config.theme.bgGradientEnd}
                onChange={(e) => handleThemeChange('bgGradientEnd', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" 
              />
              <span className="text-xs font-mono text-gray-400">{config.theme.bgGradientEnd}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Text</span>
            <div className="flex items-center gap-2 bg-white/5 rounded p-1 border border-white/10">
              <input 
                type="color" 
                value={config.theme.textColor}
                onChange={(e) => handleThemeChange('textColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" 
              />
              <span className="text-xs font-mono text-gray-400">{config.theme.textColor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Buttons</span>
            <div className="flex items-center gap-2 bg-white/5 rounded p-1 border border-white/10">
              <input 
                type="color" 
                value={config.theme.buttonColor}
                onChange={(e) => handleThemeChange('buttonColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" 
              />
              <span className="text-xs font-mono text-gray-400">{config.theme.buttonColor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Btn Text</span>
            <div className="flex items-center gap-2 bg-white/5 rounded p-1 border border-white/10">
              <input 
                type="color" 
                value={config.theme.buttonTextColor}
                onChange={(e) => handleThemeChange('buttonTextColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" 
              />
              <span className="text-xs font-mono text-gray-400">{config.theme.buttonTextColor}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
import React from 'react';
import { LinkTreeConfig } from '../types';
import { ICONS } from '../constants';
import { GlassButton } from './ui/glass-button';

interface LinkTreePreviewProps {
  config: LinkTreeConfig;
}

export const LinkTreePreview: React.FC<LinkTreePreviewProps> = ({ config }) => {

  // Helper for generating the HTML export
  const generateHTML = () => {
    // Generate CSS for the specific button color to use in the glow
    const buttonGlowColor = config.theme.buttonColor; // Simplified for now, assuming hex
    
    // Helper to convert hex to rgba for glow if needed, but css var handles it
    // We will inject the CSS for the glass button manually in the export
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name} | Link Nexus</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              custom: {
                text: '${config.theme.textColor}',
                btn: '${config.theme.buttonColor}',
                btnText: '${config.theme.buttonTextColor}',
              }
            }
          }
        }
      }
    </script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
      
      body {
        background: linear-gradient(-45deg, ${config.theme.bgGradientStart}, ${config.theme.bgGradientEnd}, ${config.theme.bgGradientStart});
        background-size: 400% 400%;
        animation: gradient-animation 15s ease infinite;
        color: ${config.theme.textColor};
        font-family: 'Inter', sans-serif;
        margin: 0;
      }
      @keyframes gradient-animation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Glass Button Export CSS */
      .glass-button-wrap {
        position: relative;
        z-index: 10;
        border-radius: 9999px;
        transition: transform 0.2s;
        cursor: pointer;
        display: block; /* ensure anchor wraps properly */
        text-decoration: none; /* remove underline from anchor */
        --glow-color: ${config.theme.buttonColor};
      }
      .glass-button-wrap:active {
        transform: scale(0.98);
      }
      .glass-button-wrap:hover {
        transform: scale(1.02);
      }
      
      .glass-button {
        all: unset; /* Match the react component styles */
        position: relative;
        z-index: 20;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: all 0.3s ease;
        width: 100%;
        box-sizing: border-box;
        border-radius: 9999px;
        display: flex; /* Flex to center content */
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      
      .glass-button:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.4);
      }
      
      .glass-button-text {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 30;
        padding: 1rem 2rem;
        color: ${config.theme.buttonTextColor};
        font-weight: 500;
        letter-spacing: -0.025em;
      }
      
      .glass-button-shadow {
        position: absolute;
        inset: -2px;
        border-radius: 9999px;
        background: inherit;
        opacity: 0;
        z-index: 0;
        transition: opacity 0.3s ease;
        filter: blur(10px);
        background: radial-gradient(circle at center, var(--glow-color), transparent 70%);
      }
      
      .glass-button-wrap:hover .glass-button-shadow {
        opacity: 0.6;
      }

      /* SVG Icon fill */
      .icon-svg path {
        fill: currentColor;
      }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center py-12 px-4">
    <main class="w-full max-w-md flex flex-col items-center gap-8">
        
        <!-- Profile -->
        <div class="flex flex-col items-center gap-4 text-center">
            ${config.profileImage ? `<div class="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl">
                <img src="${config.profileImage}" alt="${config.name}" class="w-full h-full object-cover" />
            </div>` : ''}
            <div>
                <h1 class="text-2xl font-bold tracking-tight">${config.name}</h1>
                <p class="mt-2 text-sm opacity-80 max-w-xs leading-relaxed">${config.bio}</p>
            </div>
        </div>

        <!-- Links -->
        <div class="w-full flex flex-col gap-4 mt-4">
            ${config.links.map(link => {
              const iconDef = ICONS[link.icon || 'link'];
              // NOTE: replicating the structure of GlassButton component manually for HTML export
              return `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="glass-button-wrap">
               <button class="glass-button">
                  <span class="glass-button-text">
                     <svg viewBox="${iconDef.viewBox}" class="w-5 h-5 icon-svg">${iconDef.path}</svg>
                     ${link.label}
                  </span>
               </button>
               <div class="glass-button-shadow"></div>
            </a>
            `}).join('')}
        </div>

        <!-- Footer -->
        <footer class="mt-12 text-xs opacity-40 font-mono uppercase tracking-widest">
            Powered by Eagleon
        </footer>

    </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.name.replace(/\s+/g, '-').toLowerCase()}-links.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
      <style>{`
        @keyframes preview-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
      `}</style>
      
      {/* Mobile Preview Frame */}
      <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden shrink-0">
        {/* Dynamic content inside frame */}
        <div 
            className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center py-12 px-4 scrollbar-hide"
            style={{ 
                background: `linear-gradient(-45deg, ${config.theme.bgGradientStart}, ${config.theme.bgGradientEnd}, ${config.theme.bgGradientStart})`,
                backgroundSize: '400% 400%',
                animation: 'preview-gradient 10s ease infinite',
                color: config.theme.textColor 
            }}
        >
             {/* Profile */}
             <div className="flex flex-col items-center gap-4 text-center w-full mt-4">
                {config.profileImage && (
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white/10 shadow-lg">
                        <img src={config.profileImage} alt={config.name} className="w-full h-full object-cover" />
                    </div>
                )}
                <div>
                    <h1 className="text-xl font-bold tracking-tight">{config.name || 'Your Name'}</h1>
                    <p className="mt-2 text-xs opacity-80 max-w-[200px] leading-relaxed mx-auto">{config.bio || 'Your bio goes here...'}</p>
                </div>
            </div>

            {/* Links */}
            <div className="w-full flex flex-col gap-3 mt-8">
                {config.links.map(link => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full block no-underline"
                    >
                      <GlassButton
                        className="w-full"
                        style={{ '--glow-color': config.theme.buttonColor } as React.CSSProperties}
                        // Pass styles to the inner button if needed via style prop (GlassButton forwards ...props to button)
                        // But wrapper style is handled via className
                      >
                         <div className="flex items-center gap-3 w-full justify-center" style={{ color: config.theme.buttonTextColor }}>
                             <svg 
                                viewBox={ICONS[link.icon || 'link'].viewBox} 
                                className="w-4 h-4 opacity-80"
                                dangerouslySetInnerHTML={{ __html: ICONS[link.icon || 'link'].path }} 
                             />
                            {link.label}
                         </div>
                      </GlassButton>
                    </a>
                ))}
            </div>

             <footer className="mt-auto pt-12 pb-8 text-[10px] opacity-40 font-mono uppercase tracking-widest">
                Eagleon Preview
            </footer>
        </div>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
      </div>

      <button
        onClick={generateHTML}
        className="
            py-3 px-8 rounded-lg font-bold uppercase tracking-wider text-sm
            bg-eagleon-primary text-eagleon-black 
            transition-all duration-300 transform
            hover:scale-105 hover:brightness-110 hover:shadow-[0_0_20px_rgba(123,187,255,0.4)]
        "
      >
        Download HTML Page
      </button>
    </div>
  );
};
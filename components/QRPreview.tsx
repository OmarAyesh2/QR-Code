import React, { useEffect, useRef, useState } from 'react';
import { QRConfig } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface QRPreviewProps {
  config: QRConfig;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ config }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);
  const debouncedConfig = useDebounce(config, 150);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize QR Code Instance once
  useEffect(() => {
    if (!qrCodeInstance.current && typeof window.QRCodeStyling !== 'undefined') {
      qrCodeInstance.current = new window.QRCodeStyling({
        width: config.size,
        height: config.size,
        type: 'canvas',
        data: config.text,
        dotsOptions: { color: config.fgColor, type: 'square' },
        backgroundOptions: { color: config.bgColor },
      });
      if (qrRef.current) {
        qrCodeInstance.current.append(qrRef.current);
      }
    }
  }, []);

  // Update QR Code on config change
  useEffect(() => {
    if (!qrCodeInstance.current) return;

    // Map style to library options
    const styleOptions = getStyleOptions(debouncedConfig.style);

    qrCodeInstance.current.update({
      width: debouncedConfig.size,
      height: debouncedConfig.size,
      data: debouncedConfig.text,
      image: debouncedConfig.logo || '',
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: 0.4,
        hideBackgroundDots: true
      },
      dotsOptions: {
        color: debouncedConfig.fgColor,
        type: styleOptions.dotsType as any
      },
      cornersSquareOptions: {
        color: debouncedConfig.fgColor,
        type: styleOptions.cornersType as any
      },
      cornersDotOptions: {
        color: debouncedConfig.fgColor,
        type: styleOptions.cornersDotType as any
      },
      backgroundOptions: {
        color: debouncedConfig.bgColor,
      }
    });
  }, [debouncedConfig]);

  // Helper to map our style ID to qr-code-styling types
  const getStyleOptions = (style: string) => {
    switch (style) {
      case 'dots':
        return { dotsType: 'dots', cornersType: 'dot', cornersDotType: 'dot' };
      case 'rounded':
        return { dotsType: 'rounded', cornersType: 'extra-rounded', cornersDotType: 'dot' };
      case 'extra-rounded':
        return { dotsType: 'extra-rounded', cornersType: 'extra-rounded', cornersDotType: 'dot' };
      case 'classy':
        return { dotsType: 'classy', cornersType: 'extra-rounded', cornersDotType: 'square' };
      case 'square':
      default:
        return { dotsType: 'square', cornersType: 'square', cornersDotType: 'square' };
    }
  };

  const handleDownload = async () => {
    if (!qrCodeInstance.current) return;
    try {
        await qrCodeInstance.current.getRawData('png'); // Trigger internal download logic or buffer
        
        const blob = await qrCodeInstance.current.getRawData('png');
        if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `eagleon-qr-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (err) {
        console.error("Download failed", err);
    }
  };

  const handleCopy = async () => {
    if (!qrCodeInstance.current) return;
    try {
      const blob = await qrCodeInstance.current.getRawData('png');
      if (blob) {
        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full">
      {/* Preview Container */}
      <div 
        className={`
          relative p-6 rounded-xl transition-all duration-500 ease-out
          ${config.glowEffect ? 'shadow-[0_0_80px_-20px_var(--glow-color)] border-eagleon-primary/40' : 'shadow-2xl border-white/10'}
          bg-white/5 border backdrop-blur-sm
        `}
        style={{ '--glow-color': config.fgColor } as React.CSSProperties}
      >
        <div 
          ref={qrRef} 
          className="overflow-hidden rounded-lg transition-all duration-300 flex items-center justify-center bg-transparent"
        >
          {/* Canvas is injected here by library */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full gap-4 max-w-md">
        <button
          onClick={handleCopy}
          disabled={!config.text}
          className={`
            flex-1 py-3 px-6 rounded-lg font-bold uppercase tracking-wider text-sm transition-all
            border border-eagleon-secondary/30 text-eagleon-secondary hover:bg-eagleon-secondary/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isCopied ? 'bg-green-500/10 text-green-400 border-green-500/30' : ''}
          `}
        >
          {isCopied ? 'Copied!' : 'Copy Img'}
        </button>
        
        <button
          onClick={handleDownload}
          disabled={!config.text}
          className="
            flex-1 py-3 px-6 rounded-lg font-bold uppercase tracking-wider text-sm
            bg-eagleon-primary text-eagleon-black 
            transition-all duration-300 transform
            hover:scale-105 hover:brightness-110 hover:shadow-[0_0_20px_rgba(123,187,255,0.4)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
          "
        >
          Download PNG
        </button>
      </div>
    </div>
  );
};
export type QRStyleType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy';

export interface QRConfig {
  text: string;
  size: number;
  fgColor: string;
  bgColor: string;
  glowEffect: boolean;
  style: QRStyleType;
  logo: string | null;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface LinkTreeConfig {
  profileImage: string | null;
  name: string;
  bio: string;
  links: LinkItem[];
  theme: {
    bgGradientStart: string;
    bgGradientEnd: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
  };
}

// Declaration for the global QRCodeStyling object provided by the CDN script
declare global {
  class QRCodeStyling {
    constructor(options: any);
    append(element: HTMLElement): void;
    update(options: any): void;
    getRawData(extension: string): Promise<Blob | null>;
  }

  interface Window {
    QRCodeStyling: typeof QRCodeStyling;
  }
}
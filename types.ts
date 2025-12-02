export enum ArtStyle {
  TRADITIONAL = 'Tranh Đông Hồ (Traditional Folk)',
  MODERN_VECTOR = 'Modern Vector Flat Art',
  THREE_D_CUTE = '3D Cute Animation Style',
  WATERCOLOR = 'Watercolor & Ink',
  LUXURY_GOLD = 'Luxury Gold & Red Realistic',
  CYBERPUNK = 'Cyberpunk Neon Tet'
}

export interface CardData {
  senderName: string;
  wishText: string;
  style: ArtStyle;
}

export interface GeneratedImageResult {
  imageUrl: string;
  promptUsed: string;
}

// Global declaration for the AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
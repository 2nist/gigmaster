// Feature flags for experimental features
// Use env var VITE_USE_PHASER_AVATARS=true to enable, or set window.__USE_PHASER_AVATARS__ = true in the console
// By default enable in development mode for easy testing
export const usePhaserAvatars = (typeof window !== 'undefined' && window.__USE_PHASER_AVATARS__ === true) || (typeof process !== 'undefined' && process.env && (process.env.VITE_USE_PHASER_AVATARS === 'true' || process.env.NODE_ENV === 'development'));


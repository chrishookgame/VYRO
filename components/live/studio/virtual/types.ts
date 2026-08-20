export type VyroVirtualEffect =
  | "none"
  | "vyro-aura"
  | "vyro-prism"
  | "vyro-dream"
  | "vyro-night";

export type VyroVirtualBackgroundMode =
  | "original"
  | "blur"
  | "image";

export type VyroVirtualBackgroundPreset =
  | "original"
  | "blur"
  | "vyro-neon"
  | "vyro-arena"
  | "vyro-galaxy"
  | "vyro-smoke-stage"
  | "vyro-laser-club"
  | "vyro-cyber-tunnel"
  | "vyro-fire-stage"
  | "vyro-aurora"
  | "vyro-matrix"
  | "vyro-lightning"
  | "vyro-luxury-gold"
  | "vyro-ocean-view"
  | "vyro-jungle"
  | "vyro-ice-studio";

export type VyroVirtualBackgroundPlayback = "static" | "motion";

export interface VyroVirtualVideoOptions {
  width?: number;
  height?: number;
  frameRate?: number;
  effect?: VyroVirtualEffect;
  backgroundMode?: VyroVirtualBackgroundMode;
  backgroundPreset?: VyroVirtualBackgroundPreset;
  backgroundPlayback?: VyroVirtualBackgroundPlayback;
}

export interface VyroVirtualVideoState {
  running: boolean;
  effect: VyroVirtualEffect;
  width: number;
  height: number;
  frameRate: number;
  segmentationReady: boolean;
}

export interface VyroVirtualVideoOutput {
  stream: MediaStream;
  track: MediaStreamTrack;
}

export type VoiceStyle =
  | "professional"
  | "energetic"
  | "cinematic"
  | "motivational"
  | "calm";

export type VoiceConfig = {
  name: string;
  gender: string;
  language: string;
  speed: number;
  pitch: number;
};

const voices: Record<VoiceStyle, VoiceConfig> = {
  professional: {
    name: "Professional AI",
    gender: "Neutral",
    language: "en-US",
    speed: 1,
    pitch: 1,
  },

  energetic: {
    name: "Energetic AI",
    gender: "Neutral",
    language: "en-US",
    speed: 1.15,
    pitch: 1.1,
  },

  cinematic: {
    name: "Cinema AI",
    gender: "Male",
    language: "en-US",
    speed: 0.9,
    pitch: 0.95,
  },

  motivational: {
    name: "Motivation AI",
    gender: "Female",
    language: "en-US",
    speed: 1.05,
    pitch: 1,
  },

  calm: {
    name: "Calm AI",
    gender: "Female",
    language: "en-US",
    speed: 0.85,
    pitch: 0.95,
  },
};

export function getVoice(style: VoiceStyle): VoiceConfig {
  return voices[style];
}

export function getAllVoices(): VoiceConfig[] {
  return Object.values(voices);
}
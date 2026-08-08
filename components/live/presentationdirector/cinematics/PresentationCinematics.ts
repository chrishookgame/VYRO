import type {
  PresentationEventType,
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export type PresentationCinematicLevel =
  | "STANDARD"
  | "IMPACT"
  | "EPIC"
  | "WORLD";

export interface PresentationCinematic {
  level: PresentationCinematicLevel;
  scale: number;
  blurPx: number;
  glow: number;
  backdropOpacity: number;
  enterMs: number;
  exitMs: number;
}

const CINEMATIC_BY_TYPE: Record<
  PresentationEventType,
  PresentationCinematic
> = {
  WORLD_CHAMPION: {
    level: "WORLD",
    scale: 1.04,
    blurPx: 8,
    glow: 1,
    backdropOpacity: 0.72,
    enterMs: 500,
    exitMs: 500,
  },

  CHAMPION: {
    level: "EPIC",
    scale: 1.03,
    blurPx: 6,
    glow: 0.9,
    backdropOpacity: 0.6,
    enterMs: 420,
    exitMs: 420,
  },

  MVP: {
    level: "EPIC",
    scale: 1.02,
    blurPx: 4,
    glow: 0.8,
    backdropOpacity: 0.45,
    enterMs: 350,
    exitMs: 350,
  },

  TOP_RANK: {
    level: "IMPACT",
    scale: 1.015,
    blurPx: 3,
    glow: 0.7,
    backdropOpacity: 0.35,
    enterMs: 320,
    exitMs: 320,
  },

  WIN_STREAK: {
    level: "IMPACT",
    scale: 1.01,
    blurPx: 2,
    glow: 0.6,
    backdropOpacity: 0.28,
    enterMs: 300,
    exitMs: 300,
  },

  SPOTLIGHT: {
    level: "STANDARD",
    scale: 1,
    blurPx: 1,
    glow: 0.4,
    backdropOpacity: 0.18,
    enterMs: 260,
    exitMs: 260,
  },

  BANNER: {
    level: "STANDARD",
    scale: 1,
    blurPx: 0,
    glow: 0.25,
    backdropOpacity: 0,
    enterMs: 220,
    exitMs: 220,
  },
};

export function getPresentationCinematic(
  event:
    ScheduledPresentationEvent | null,
): PresentationCinematic {
  if(!event){
    return CINEMATIC_BY_TYPE.BANNER;
  }

  return CINEMATIC_BY_TYPE[
    event.type
  ];
}

export function isWorldCinematic(
  event:
    ScheduledPresentationEvent | null,
): boolean {
  return (
    event?.type ===
    "WORLD_CHAMPION"
  );
}

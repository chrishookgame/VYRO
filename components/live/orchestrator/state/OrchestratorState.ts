export type LiveOrchestratorMode =
  | "IDLE"
  | "ACTIVE"
  | "HYPE"
  | "EPIC"
  | "WORLD";

export type LiveOverlayChannel =
  | "NONE"
  | "GIFT"
  | "COMBO"
  | "STORYLINE"
  | "PRESENTATION"
  | "WORLD_EVENT";

export interface OrchestratorState {
  mode:LiveOrchestratorMode;

  intensity:number;

  overlayChannel:
    LiveOverlayChannel;

  cinematic:boolean;

  worldMoment:boolean;

  runtimePriority:number;
}

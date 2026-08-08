import type {
  LiveOverlayChannel,
} from "../state/OrchestratorState";

export interface OverlayCoordinatorInput {
  selectedChannel:
    LiveOverlayChannel;

  worldEventActive:boolean;

  presentationActive:boolean;

  storylineActive:boolean;
}

export interface OverlayCoordinatorState {
  primary:
    LiveOverlayChannel;

  showUniverse:boolean;
  showPresentation:boolean;
  showStoryline:boolean;
  suppressAmbient:boolean;
}

export function createOverlayCoordinatorState(
  input:OverlayCoordinatorInput,
):OverlayCoordinatorState{
  const primary=
    input.worldEventActive
      ? "WORLD_EVENT"
      : input.presentationActive
        ? "PRESENTATION"
        : input.storylineActive
          ? "STORYLINE"
          : input.selectedChannel;

  return {
    primary,

    showUniverse:
      primary === "WORLD_EVENT",

    showPresentation:
      primary === "PRESENTATION",

    showStoryline:
      primary === "STORYLINE",

    suppressAmbient:
      primary === "WORLD_EVENT" ||
      primary === "PRESENTATION",
  };
}

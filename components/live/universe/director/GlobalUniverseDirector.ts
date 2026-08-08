import {
  createArenaEvolutionState,
} from "../arena/ArenaEvolutionEngine";

import {
  createWorldLiveEventState,
} from "../events/WorldLiveEvents";

import {
  createCreatorLegacyState,
} from "../legacy/CreatorLegacyEngine";

import {
  createAudienceMomentumState,
} from "../momentum/AudienceMomentumEngine";

import type {
  ReturnTypeGlobalSpectacle,
} from "../UniverseEngine";

export interface GlobalUniverseDirectorInput {
  spectacle:ReturnTypeGlobalSpectacle;

  hypeScore:number;

  heatScore:number;

  creatorName?:string;
  creatorRank?:number;
  creatorScore?:number;

  legendaryMoment:boolean;
}

export function createGlobalUniverseDirectorState(
  input:GlobalUniverseDirectorInput,
){
  const momentum=
    createAudienceMomentumState({
      hypeScore:
        input.hypeScore,

      heatScore:
        input.heatScore,

      crowdPower:
        input.spectacle.crowd.crowdPower,

      viral:
        input.spectacle.worldMoment,
    });

  const arena=
    createArenaEvolutionState({
      atmosphereIntensity:
        input.spectacle.atmosphere.intensity,

      momentum:
        momentum.momentum,

      worldMoment:
        input.spectacle.worldMoment,
    });

  const legacy=
    createCreatorLegacyState({
      creatorName:
        input.creatorName,

      creatorRank:
        input.creatorRank,

      creatorScore:
        input.creatorScore,

      legendaryMoment:
        input.legendaryMoment,

      worldMoment:
        input.spectacle.worldMoment,
    });

  const worldEvent=
    createWorldLiveEventState({
      momentumLevel:
        momentum.level,

      arenaStage:
        arena.stage,

      worldMoment:
        input.spectacle.worldMoment,

      legendaryMoment:
        input.legendaryMoment,
    });

  return {
    momentum,
    arena,
    legacy,
    worldEvent,

    universeLevel:
      worldEvent.event ===
        "LEGENDARY_EVENT"
        ? "LEGENDARY"
        : worldEvent.event ===
            "WORLD_EVENT"
          ? "WORLD"
          : worldEvent.event ===
              "GLOBAL_SURGE"
            ? "GLOBAL"
            : "NORMAL",
  } as const;
}

import {
  createArenaAtmosphereState,
} from "./atmosphere/ArenaAtmosphereEngine";

import {
  createWorldCelebrationState,
} from "./celebration/WorldCelebrationDirector";

import {
  createLiveCrowdState,
} from "./crowd/LiveCrowdSynchronization";

import {
  createCreatorSpotlightState,
} from "./spotlight/CreatorSpotlightAmplifier";

import type {
  GlobalGiftEventState,
} from "@/components/live/gifts/events/GlobalGiftEventEngine";

export interface GlobalSpectacleInput {
  globalEvents:GlobalGiftEventState;

  hypeScore:number;

  creatorName?:string;
  creatorRank?:number;
  creatorScore?:number;

  legendaryMoment:boolean;
}

export function createGlobalSpectacleState(
  input:GlobalSpectacleInput,
){
  const atmosphere=
    createArenaAtmosphereState({
      hypeScore:
        input.hypeScore,

      heatScore:
        input.globalEvents.heat.heat,

      viral:
        input.globalEvents.viral.viral,

      stormIntensity:
        input.globalEvents.storm.intensity,
    });

  const crowd=
    createLiveCrowdState({
      activeSenders:
        input.globalEvents.storm.activeSenders,

      giftCount:
        input.globalEvents.storm.totalGifts,

      hypeScore:
        input.hypeScore,
    });

  const spotlight=
    createCreatorSpotlightState({
      creatorName:
        input.creatorName,

      rank:
        input.creatorRank,

      score:
        input.creatorScore,

      viral:
        input.globalEvents.viral.viral,

      legendaryMoment:
        input.legendaryMoment,
    });

  const celebration=
    createWorldCelebrationState({
      atmosphereLevel:
        atmosphere.level,

      crowdReaction:
        crowd.reaction,

      viral:
        input.globalEvents.viral.viral,

      legendaryMoment:
        input.legendaryMoment,
    });

  return {
    atmosphere,
    crowd,
    spotlight,
    celebration,

    worldMoment:
      celebration.celebration ===
        "WORLD_EVENT",
  };
}

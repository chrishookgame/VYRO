import {
  createGlobalGiftEventState,
} from "../../events/GlobalGiftEventEngine";

import {
  calculateGiftComboFusion,
} from "../fusion/GiftComboFusion";

import {
  calculateComboHype,
} from "../hype/ComboHypeMeter";

import {
  createGlobalComboRanking,
} from "../ranking/GlobalComboRanking";

import type {
  GiftComboState,
} from "../types";

export interface GiftComboDirectorState {
  activeCombos:GiftComboState[];

  fusion:
    ReturnType<
      typeof calculateGiftComboFusion
    >;

  hype:
    ReturnType<
      typeof calculateComboHype
    >;

  ranking:
    ReturnType<
      typeof createGlobalComboRanking
    >;

  leader:
    ReturnType<
      typeof createGlobalComboRanking
    >[number] | null;

  globalEvents:
    ReturnType<
      typeof createGlobalGiftEventState
    >;

  legendaryMoment:boolean;
}

export function createGiftComboDirectorState(
  combos:GiftComboState[],
):GiftComboDirectorState{
  const fusion=
    calculateGiftComboFusion(
      combos,
    );

  const hype=
    calculateComboHype(
      combos,
    );

  const ranking=
    createGlobalComboRanking(
      combos,
    );

  const globalEvents=
    createGlobalGiftEventState(
      combos,
    );

  return {
    activeCombos:
      combos,

    fusion,

    hype,

    ranking,

    leader:
      ranking[0] ??
      null,

    globalEvents,

    legendaryMoment:
      hype.level ===
        "LEGENDARY" ||
      fusion.fusionMultiplier >=
        2.5 ||
      globalEvents.globalMoment ===
        "GLOBAL_VIRAL",
  };
}

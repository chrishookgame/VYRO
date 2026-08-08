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

  return {
    activeCombos:
      combos,

    fusion,

    hype,

    ranking,

    leader:
      ranking[0] ??
      null,

    legendaryMoment:
      hype.level ===
        "LEGENDARY" ||
      fusion.fusionMultiplier >=
        2.5,
  };
}

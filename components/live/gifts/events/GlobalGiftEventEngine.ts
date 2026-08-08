import {
  calculateGiftComboFusion,
} from "../combo/fusion/GiftComboFusion";

import {
  calculateComboHype,
} from "../combo/hype/ComboHypeMeter";

import {
  createGlobalComboRanking,
} from "../combo/ranking/GlobalComboRanking";

import {
  calculateAudienceHeat,
} from "./heat/AudienceHeatEngine";

import {
  calculateGiftStorm,
} from "./storm/GiftStormEngine";

import {
  detectViralGiftMoment,
} from "./viral/ViralGiftDetector";

import {
  createWorldGiftLeaderboard,
} from "./world/WorldGiftLeaderboard";

import type {
  GiftComboState,
} from "../combo/types";

export interface GlobalGiftEventState {
  storm:
    ReturnType<
      typeof calculateGiftStorm
    >;

  viral:
    ReturnType<
      typeof detectViralGiftMoment
    >;

  heat:
    ReturnType<
      typeof calculateAudienceHeat
    >;

  worldLeaderboard:
    ReturnType<
      typeof createWorldGiftLeaderboard
    >;

  globalMoment:
    | "NONE"
    | "GIFT_STORM"
    | "VIRAL"
    | "GLOBAL_VIRAL";
}

export function createGlobalGiftEventState(
  combos:GiftComboState[],
):GlobalGiftEventState{
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

  const storm=
    calculateGiftStorm(
      combos,
    );

  const viral=
    detectViralGiftMoment(
      hype,
      fusion,
    );

  const heat=
    calculateAudienceHeat(
      combos,
    );

  const worldLeaderboard=
    createWorldGiftLeaderboard(
      ranking,
    );

  const globalMoment=
    viral.level === "GLOBAL_VIRAL"
      ? "GLOBAL_VIRAL"
      : viral.viral
        ? "VIRAL"
        : storm.level === "STORM" ||
          storm.level === "MEGA_STORM"
          ? "GIFT_STORM"
          : "NONE";

  return {
    storm,
    viral,
    heat,
    worldLeaderboard,
    globalMoment,
  };
}

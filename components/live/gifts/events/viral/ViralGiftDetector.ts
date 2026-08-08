import type {
  GiftComboFusionResult,
} from "../../combo/fusion/GiftComboFusion";

import type {
  ComboHypeState,
} from "../../combo/hype/ComboHypeMeter";

export interface ViralGiftState {
  viral:boolean;

  score:number;

  level:
    | "NORMAL"
    | "TRENDING"
    | "VIRAL"
    | "GLOBAL_VIRAL";
}

export function detectViralGiftMoment(
  hype:ComboHypeState,
  fusion:GiftComboFusionResult,
):ViralGiftState{
  const score=
    Math.min(
      100,
      Math.round(
        hype.score * 0.65 +
        fusion.fusionMultiplier * 12 +
        Math.min(
          20,
          fusion.uniqueGifts * 4,
        ),
      ),
    );

  return {
    viral:
      score >= 70,

    score,

    level:
      score >= 90
        ? "GLOBAL_VIRAL"
        : score >= 70
          ? "VIRAL"
          : score >= 45
            ? "TRENDING"
            : "NORMAL",
  };
}

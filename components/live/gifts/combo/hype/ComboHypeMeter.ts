import type {
  GiftComboState,
} from "../types";

export interface ComboHypeState {
  score:number;

  level:
    | "CALM"
    | "RISING"
    | "HYPE"
    | "FRENZY"
    | "LEGENDARY";

  viral:boolean;
}

export function calculateComboHype(
  combos:GiftComboState[],
):ComboHypeState{
  let score=0;

  for(const combo of combos){
    score +=
      combo.count * 1.5;

    score +=
      combo.multiplier * 8;

    score +=
      Math.min(
        25,
        combo.totalAmount / 500,
      );

    score +=
      Math.min(
        15,
        combo.totalEnergy / 250,
      );
  }

  const normalized=
    Math.min(
      100,
      Math.round(
        score,
      ),
    );

  return {
    score:
      normalized,

    level:
      normalized >= 90
        ? "LEGENDARY"
        : normalized >= 75
          ? "FRENZY"
          : normalized >= 55
            ? "HYPE"
            : normalized >= 25
              ? "RISING"
              : "CALM",

    viral:
      normalized >= 80,
  };
}

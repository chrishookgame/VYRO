import type {
  GiftComboState,
} from "../../combo/types";

export interface AudienceHeatState {
  heat:number;

  level:
    | "COOL"
    | "WARM"
    | "HOT"
    | "BURNING"
    | "MAXIMUM";
}

export function calculateAudienceHeat(
  combos:GiftComboState[],
):AudienceHeatState{
  const rawHeat=
    combos.reduce(
      (total,combo) =>
        total +
        combo.count * 1.2 +
        combo.multiplier * 7 +
        Math.min(
          12,
          combo.totalEnergy / 300,
        ),
      0,
    );

  const heat=
    Math.min(
      100,
      Math.round(
        rawHeat,
      ),
    );

  return {
    heat,

    level:
      heat >= 90
        ? "MAXIMUM"
        : heat >= 70
          ? "BURNING"
          : heat >= 50
            ? "HOT"
            : heat >= 25
              ? "WARM"
              : "COOL",
  };
}

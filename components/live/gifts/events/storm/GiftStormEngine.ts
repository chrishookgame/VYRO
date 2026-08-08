import type {
  GiftComboState,
} from "../../combo/types";

export interface GiftStormState {
  active:boolean;

  level:
    | "NONE"
    | "SURGE"
    | "STORM"
    | "MEGA_STORM";

  totalGifts:number;
  activeSenders:number;
  intensity:number;
}

export function calculateGiftStorm(
  combos:GiftComboState[],
):GiftStormState{
  const totalGifts=
    combos.reduce(
      (total,combo) =>
        total + combo.count,
      0,
    );

  const activeSenders=
    new Set(
      combos.map(
        combo =>
          combo.senderId ??
          combo.comboKey,
      ),
    ).size;

  const intensity=
    Math.min(
      100,
      Math.round(
        totalGifts * 1.5 +
        activeSenders * 8,
      ),
    );

  const level=
    intensity >= 85
      ? "MEGA_STORM"
      : intensity >= 60
        ? "STORM"
        : intensity >= 30
          ? "SURGE"
          : "NONE";

  return {
    active:
      level !== "NONE",

    level,

    totalGifts,
    activeSenders,
    intensity,
  };
}

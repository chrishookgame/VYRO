import type {
  GiftComboState,
} from "../types";

export interface GlobalComboRankingEntry {
  senderId:string | null;
  comboKey:string;
  count:number;
  multiplier:number;
  totalAmount:number;
  totalEnergy:number;
  score:number;
}

export function createGlobalComboRanking(
  combos:GiftComboState[],
):GlobalComboRankingEntry[]{
  return combos
    .map(
      combo => {
        const score=
          Math.round(
            combo.count * 10 +
            combo.totalAmount +
            combo.totalEnergy +
            combo.multiplier * 100,
          );

        return {
          senderId:
            combo.senderId,

          comboKey:
            combo.comboKey,

          count:
            combo.count,

          multiplier:
            combo.multiplier,

          totalAmount:
            combo.totalAmount,

          totalEnergy:
            combo.totalEnergy,

          score,
        };
      },
    )
    .sort(
      (a,b) =>
        b.score -
        a.score,
    );
}

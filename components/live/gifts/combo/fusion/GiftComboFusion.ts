import type {
  GiftComboState,
} from "../types";

export interface GiftComboFusionResult {
  totalCount:number;
  totalAmount:number;
  totalEnergy:number;
  uniqueGifts:number;
  fusionMultiplier:number;
}

export function calculateGiftComboFusion(
  combos:GiftComboState[],
):GiftComboFusionResult{
  const giftCodes=
    new Set<string>();

  let totalCount=0;
  let totalAmount=0;
  let totalEnergy=0;

  for(const combo of combos){
    totalCount +=
      combo.count;

    totalAmount +=
      combo.totalAmount;

    totalEnergy +=
      combo.totalEnergy;

    giftCodes.add(
      combo.giftCode,
    );
  }

  const uniqueGifts=
    giftCodes.size;

  const fusionMultiplier=
    Math.min(
      3,
      1 +
      Math.max(
        0,
        uniqueGifts - 1,
      ) * 0.15 +
      Math.min(
        0.75,
        totalCount / 100,
      ),
    );

  return {
    totalCount,
    totalAmount,
    totalEnergy,
    uniqueGifts,
    fusionMultiplier:
      Number(
        fusionMultiplier.toFixed(2),
      ),
  };
}

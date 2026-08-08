import type {
  LiveGiftRarity,
} from "@/lib/live";

export interface GiftPredictionInput {
  rarity:LiveGiftRarity;
  queuedGifts:number;
  excitementScore:number;
  chainLevel:number;
}

export interface GiftPredictionResult {
  probability:number;

  prediction:
    | "NORMAL_FLOW"
    | "COMBO_LIKELY"
    | "LEGENDARY_MOMENT"
    | "VIRAL_MOMENT";
}

export function predictGiftMoment(
  input:GiftPredictionInput,
):GiftPredictionResult{
  const rarityBase:Record<
    LiveGiftRarity,
    number
  >={
    common:8,
    rare:18,
    epic:30,
    legendary:48,
    mythic:62,
  };

  const probability=
    Math.min(
      100,
      Math.round(
        rarityBase[
          input.rarity
        ] +
        Math.max(
          0,
          input.queuedGifts,
        ) * 5 +
        input.excitementScore * 0.25 +
        Math.max(
          0,
          input.chainLevel,
        ) * 8,
      ),
    );

  return {
    probability,

    prediction:
      probability >= 85
        ? "VIRAL_MOMENT"
        : probability >= 65
          ? "LEGENDARY_MOMENT"
          : probability >= 40
            ? "COMBO_LIKELY"
            : "NORMAL_FLOW",
  };
}

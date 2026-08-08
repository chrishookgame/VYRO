import type {
  LiveGiftRarity,
} from "@/lib/live";

export function predictGiftMoment(
  rarity:LiveGiftRarity,
  queuedGifts:number,
  excitementScore:number,
  chainLevel:number,
){
  const base:Record<
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
        base[rarity] +
        Math.max(0,queuedGifts)*5 +
        excitementScore*0.25 +
        Math.max(0,chainLevel)*8,
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
  } as const;
}

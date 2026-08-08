import type {
  LiveGiftRarity,
} from "@/lib/live";

export function calculateAudienceExcitement(
  rarity:LiveGiftRarity,
  amount:number,
  energy:number,
  queuedGifts:number,
  multiplier:number,
){
  const rarityScore:Record<
    LiveGiftRarity,
    number
  >={
    common:8,
    rare:18,
    epic:32,
    legendary:52,
    mythic:72,
  };

  const score=
    Math.min(
      100,
      Math.round(
        rarityScore[rarity] +
        Math.min(12,Math.max(0,amount)/500) +
        Math.min(8,Math.max(0,energy)/250) +
        Math.min(8,Math.max(0,queuedGifts)*1.5) +
        Math.min(10,Math.max(0,multiplier-1)*8),
      ),
    );

  return {
    score,
    level:
      score >= 80
        ? "EXPLOSIVE"
        : score >= 55
          ? "HYPE"
          : score >= 25
            ? "RISING"
            : "CALM",
    shouldTriggerMoment:
      score >= 70,
  } as const;
}

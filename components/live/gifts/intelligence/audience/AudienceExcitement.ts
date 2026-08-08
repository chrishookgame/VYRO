import type {
  LiveGiftRarity,
} from "@/lib/live";

export interface AudienceExcitementInput {
  rarity:LiveGiftRarity;
  amount:number;
  energy:number;
  queuedGifts:number;
  multiplier:number;
}

export interface AudienceExcitementState {
  score:number;

  level:
    | "CALM"
    | "RISING"
    | "HYPE"
    | "EXPLOSIVE";

  shouldTriggerMoment:boolean;
}

export function calculateAudienceExcitement(
  input:AudienceExcitementInput,
):AudienceExcitementState{
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

  const amountScore=
    Math.min(
      12,
      Math.max(
        0,
        input.amount,
      ) / 500,
    );

  const energyScore=
    Math.min(
      8,
      Math.max(
        0,
        input.energy,
      ) / 250,
    );

  const queueScore=
    Math.min(
      8,
      Math.max(
        0,
        input.queuedGifts,
      ) * 1.5,
    );

  const multiplierScore=
    Math.min(
      10,
      Math.max(
        0,
        input.multiplier - 1,
      ) * 8,
    );

  const score=
    Math.min(
      100,
      Math.round(
        rarityScore[
          input.rarity
        ] +
        amountScore +
        energyScore +
        queueScore +
        multiplierScore,
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
  };
}

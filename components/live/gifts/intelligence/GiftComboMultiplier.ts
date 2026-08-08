import type {
  LiveGiftRarity,
} from "@/lib/live";

export interface GiftComboMultiplierInput {
  rarity:LiveGiftRarity;
  amount:number;
  energy:number;
  queuedGifts:number;
}

export interface GiftComboMultiplierResult {
  multiplier:number;
  tier:
    | "NORMAL"
    | "SURGE"
    | "EPIC"
    | "LEGENDARY"
    | "MYTHIC";
}

function safePositive(
  value:number,
):number{
  if(!Number.isFinite(value)){
    return 0;
  }

  return Math.max(
    0,
    value,
  );
}

export function calculateGiftComboMultiplier(
  input:GiftComboMultiplierInput,
):GiftComboMultiplierResult{
  const amount=
    safePositive(
      input.amount,
    );

  const energy=
    safePositive(
      input.energy,
    );

  const queued=
    Math.max(
      0,
      Math.floor(
        safePositive(
          input.queuedGifts,
        ),
      ),
    );

  const rarityWeight:Record<
    LiveGiftRarity,
    number
  >={
    common:1,
    rare:1.08,
    epic:1.18,
    legendary:1.35,
    mythic:1.6,
  };

  const activityBoost=
    Math.min(
      0.45,
      queued * 0.03,
    );

  const valueBoost=
    Math.min(
      0.35,
      amount / 10000,
    );

  const energyBoost=
    Math.min(
      0.2,
      energy / 5000,
    );

  const multiplier=
    Math.min(
      3,
      rarityWeight[
        input.rarity
      ] +
      activityBoost +
      valueBoost +
      energyBoost,
    );

  const tier=
    multiplier >= 2.2
      ? "MYTHIC"
      : multiplier >= 1.75
        ? "LEGENDARY"
        : multiplier >= 1.4
          ? "EPIC"
          : multiplier >= 1.15
            ? "SURGE"
            : "NORMAL";

  return {
    multiplier:
      Number(
        multiplier.toFixed(2),
      ),

    tier,
  };
}

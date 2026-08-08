import type {
  LiveGiftRarity,
} from "@/lib/live";

export interface LegendaryGiftChainInput {
  rarity:LiveGiftRarity;
  queuedGifts:number;
  amount:number;
}

export interface LegendaryGiftChainResult {
  active:boolean;

  level:
    | 0
    | 1
    | 2
    | 3;

  label:
    | "NONE"
    | "LEGENDARY_CHAIN"
    | "WORLD_CHAIN"
    | "MYTHIC_STORM";
}

export function resolveLegendaryGiftChain(
  input:LegendaryGiftChainInput,
):LegendaryGiftChainResult{
  const queue=
    Math.max(
      0,
      Math.floor(
        input.queuedGifts,
      ),
    );

  const amount=
    Number.isFinite(
      input.amount,
    )
      ? Math.max(
          0,
          input.amount,
        )
      : 0;

  if(
    input.rarity === "mythic" &&
    (
      queue >= 4 ||
      amount >= 5000
    )
  ){
    return {
      active:true,
      level:3,
      label:"MYTHIC_STORM",
    };
  }

  if(
    (
      input.rarity === "legendary" ||
      input.rarity === "mythic"
    ) &&
    queue >= 3
  ){
    return {
      active:true,
      level:2,
      label:"WORLD_CHAIN",
    };
  }

  if(
    input.rarity === "legendary" ||
    input.rarity === "mythic"
  ){
    return {
      active:true,
      level:1,
      label:"LEGENDARY_CHAIN",
    };
  }

  return {
    active:false,
    level:0,
    label:"NONE",
  };
}

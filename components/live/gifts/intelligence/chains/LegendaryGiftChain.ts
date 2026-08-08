import type {
  LiveGiftRarity,
} from "@/lib/live";

export interface LegendaryGiftChainResult {
  active:boolean;
  level:0|1|2|3;
  label:
    | "NONE"
    | "LEGENDARY_CHAIN"
    | "WORLD_CHAIN"
    | "MYTHIC_STORM";
}

export function resolveLegendaryGiftChain(
  rarity:LiveGiftRarity,
  queuedGifts:number,
  amount:number,
):LegendaryGiftChainResult{
  if(
    rarity === "mythic" &&
    (
      queuedGifts >= 4 ||
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
      rarity === "legendary" ||
      rarity === "mythic"
    ) &&
    queuedGifts >= 3
  ){
    return {
      active:true,
      level:2,
      label:"WORLD_CHAIN",
    };
  }

  if(
    rarity === "legendary" ||
    rarity === "mythic"
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

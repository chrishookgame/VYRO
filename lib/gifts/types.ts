export type GiftRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "divine";

export interface Gift {

  id: string;
  name: string;
  rarity: GiftRarity;

  price: number;

  energy: number;

  animation: string;

  icon: string;

  enabled: boolean;

}

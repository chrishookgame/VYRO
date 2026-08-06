export type LiveGiftRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export interface LiveGiftCategory {
  code: string;
  name: string;
  icon: string;
  description: string | null;
  displayOrder: number;
  active: boolean;
}

export interface LiveGiftCatalogItem {
  code: string;
  categoryCode: string;
  name: string;
  icon: string;
  price: number;
  energyValue: number;
  creatorSharePercent: number;
  rarity: LiveGiftRarity;
  animationKey: string;
  displayOrder: number;
  active: boolean;
}

export interface LiveGiftCategoryRow {
  code: string;
  name: string;
  icon: string;
  description: string | null;
  display_order: number;
  active: boolean;
}

export interface LiveGiftCatalogRow {
  code: string;
  category_code: string;
  name: string;
  icon: string;
  price: number | string;
  energy_value: number;
  creator_share_percent: number | string;
  rarity: LiveGiftRarity;
  animation_key: string;
  display_order: number;
  active: boolean;
}

export interface LiveGiftSendResult {
  giftId: string;
  roomId: string;
  senderId: string;
  receiverId: string;
  giftType: string;
  giftName: string;
  giftIcon: string;
  grossAmount: number;
  creatorEarnings: number;
  energyAdded: number;
  senderBalance: number;
}

export interface LiveGiftSendRow {
  gift_id: string;
  room_id: string;
  sender_id: string;
  receiver_id: string;
  gift_type: string;
  gift_name: string;
  gift_icon: string;
  gross_amount: number | string;
  creator_earnings: number | string;
  energy_added: number;
  sender_balance: number | string;
}

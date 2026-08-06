import { supabase } from "@/lib/supabase";

import type {
  LiveGiftCatalogItem,
  LiveGiftCatalogRow,
  LiveGiftCategory,
  LiveGiftCategoryRow,
  LiveGiftSendResult,
  LiveGiftSendRow,
} from "./types";

function mapCategory(
  row: LiveGiftCategoryRow,
): LiveGiftCategory {
  return {
    code: row.code,
    name: row.name,
    icon: row.icon,
    description: row.description,
    displayOrder: row.display_order,
    active: row.active,
  };
}

function mapGift(
  row: LiveGiftCatalogRow,
): LiveGiftCatalogItem {
  return {
    code: row.code,
    categoryCode: row.category_code,
    name: row.name,
    icon: row.icon,
    price: Number(row.price),
    energyValue: row.energy_value,
    creatorSharePercent:
      Number(row.creator_share_percent),
    rarity: row.rarity,
    animationKey: row.animation_key,
    displayOrder: row.display_order,
    active: row.active,
  };
}

function mapSendResult(
  row: LiveGiftSendRow,
): LiveGiftSendResult {
  return {
    giftId: row.gift_id,
    roomId: row.room_id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    giftType: row.gift_type,
    giftName: row.gift_name,
    giftIcon: row.gift_icon,
    grossAmount: Number(row.gross_amount),
    creatorEarnings: Number(
      row.creator_earnings,
    ),
    energyAdded: row.energy_added,
    senderBalance: Number(
      row.sender_balance,
    ),
  };
}

export async function getLiveGiftCategories(): Promise<
  LiveGiftCategory[]
> {
  const { data, error } = await supabase
    .from("live_gift_categories")
    .select(
      [
        "code",
        "name",
        "icon",
        "description",
        "display_order",
        "active",
      ].join(","),
    )
    .eq("active", true)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `No se pudieron cargar las categorías de regalos: ${error.message}`,
    );
  }

  return (
    (data ?? []) as unknown as LiveGiftCategoryRow[]
  ).map(mapCategory);
}

export async function getLiveGiftCatalog(): Promise<
  LiveGiftCatalogItem[]
> {
  const { data, error } = await supabase
    .from("live_gift_catalog")
    .select(
      [
        "code",
        "category_code",
        "name",
        "icon",
        "price",
        "energy_value",
        "creator_share_percent",
        "rarity",
        "animation_key",
        "display_order",
        "active",
      ].join(","),
    )
    .eq("active", true)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `No se pudo cargar el catálogo de regalos: ${error.message}`,
    );
  }

  return (
    (data ?? []) as unknown as LiveGiftCatalogRow[]
  ).map(mapGift);
}

export async function getCurrentWalletBalance(): Promise<number> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      `No se pudo verificar el usuario: ${authError.message}`,
    );
  }

  if (!user) {
    throw new Error(
      "Debes iniciar sesión para consultar tu saldo.",
    );
  }

  const { data, error } = await supabase
    .from("wallets")
    .select("available_balance")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar el saldo: ${error.message}`,
    );
  }

  return Number(
    data?.available_balance ?? 0,
  );
}

export async function sendLiveGiftRecord(
  roomId: string,
  giftCode: string,
): Promise<LiveGiftSendResult> {
  const { data, error } = await supabase.rpc(
    "send_live_gift",
    {
      target_room_id: roomId,
      target_gift_code: giftCode,
    },
  );

  if (error) {
    throw new Error(
      `No se pudo enviar el regalo: ${error.message}`,
    );
  }

  const row =
    (
      data ?? []
    )[0] as LiveGiftSendRow | undefined;

  if (!row) {
    throw new Error(
      "El Gift Engine no devolvió información del envío.",
    );
  }

  return mapSendResult(row);
}

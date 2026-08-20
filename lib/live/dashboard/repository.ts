import { supabase } from "@/lib/supabase";

import type {
  LiveDashboardData,
  LiveEnergyStateRow,
  LiveRoomCounterRow,
} from "./types";

export async function getLiveDashboardData(
  roomId: string,
): Promise<LiveDashboardData> {
  const [
    counterResult,
    energyResult,
    messagesResult,
    giftsResult,
  ] = await Promise.all([
    supabase
      .from("live_room_counters")
      .select(
        [
          "room_id",
          "active_viewers",
          "peak_viewers",
          "total_joins",
          "total_reactions",
          "total_gifts",
          "updated_at",
        ].join(","),
      )
      .eq("room_id", roomId)
      .maybeSingle(),

    supabase
      .from("live_energy_states")
      .select(
        "room_id,current_energy",
      )
      .eq("room_id", roomId)
      .maybeSingle(),

    supabase
      .from("live_messages")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("room_id", roomId),

    supabase
      .from("live_gifts")
      .select("id,amount")
      .eq("room_id", roomId),
  ]);

  if (counterResult.error) {
    throw new Error(
      `No se pudieron cargar los contadores LIVE: ${counterResult.error.message}`,
    );
  }

  if (energyResult.error) {
    throw new Error(
      `No se pudo cargar la energía LIVE: ${energyResult.error.message}`,
    );
  }

  if (messagesResult.error) {
    throw new Error(
      `No se pudieron cargar los mensajes LIVE: ${messagesResult.error.message}`,
    );
  }

  if (giftsResult.error) {
    throw new Error(
      `No se pudieron cargar los regalos LIVE: ${giftsResult.error.message}`,
    );
  }

  const counters = counterResult.data
    ? (
        counterResult.data as unknown as LiveRoomCounterRow
      )
    : null;

  const energy = energyResult.data
    ? (
        energyResult.data as unknown as LiveEnergyStateRow
      )
    : null;

  const giftRows =
    (
      giftsResult.data ?? []
    ) as unknown as Array<{
      id: string;
      amount: number | string | null;
    }>;

  const grossRevenue = giftRows.reduce(
    (total, gift) => {
      const amount = Number(gift.amount ?? 0);

      return Number.isFinite(amount)
        ? total + amount
        : total;
    },
    0,
  );

  const giftIds = giftRows.map(
    (gift) => gift.id,
  );

  let creatorRevenue = 0;

  if (giftIds.length > 0) {
    const creatorTransactions =
      [] as Array<{
        amount: number | string | null;
      }>;

    const chunkSize = 100;

    for (
      let index = 0;
      index < giftIds.length;
      index += chunkSize
    ) {
      const giftIdChunk = giftIds.slice(
        index,
        index + chunkSize,
      );

      const { data, error } =
        await supabase
          .from("wallet_transactions")
          .select("amount")
          .eq("type", "live_gift_credit")
          .in("reference", giftIdChunk);

      if (error) {
        throw new Error(
          `No se pudo cargar el revenue del creador: ${error.message}`,
        );
      }

      creatorTransactions.push(
        ...(
          (data ?? []) as unknown as Array<{
            amount: number | string | null;
          }>
        ),
      );
    }

    creatorRevenue =
      creatorTransactions.reduce(
        (total, transaction) => {
          const amount = Number(
            transaction.amount ?? 0,
          );

          return Number.isFinite(amount)
            ? total + amount
            : total;
        },
        0,
      );
  }

  return {
    roomId,
    activeViewers:
      counters?.active_viewers ?? 0,
    peakViewers:
      counters?.peak_viewers ?? 0,
    totalJoins:
      counters?.total_joins ?? 0,
    reactions:
      counters?.total_reactions ?? 0,
    gifts:
      counters?.total_gifts ??
      giftRows.length,
    energy:
      energy?.current_energy ?? 0,
    messages:
      messagesResult.count ?? 0,
    grossRevenue,
    creatorRevenue,
    updatedAt:
      counters?.updated_at ?? null,
  };
}

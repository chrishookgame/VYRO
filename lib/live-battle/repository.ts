import { supabase } from "@/lib/supabase";

import type {
  LiveBattleDetails,
  LiveBattleProfileRow,
  LiveBattleRow,
  LiveBattleScoreRow,
} from "./types";

async function getProfile(
  userId: string,
): Promise<LiveBattleProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar el creador de la batalla: ${error.message}`,
    );
  }

  return data as LiveBattleProfileRow | null;
}

async function getBattleScores(
  battleId: string,
): Promise<LiveBattleScoreRow> {
  const { data, error } = await supabase
    .from("live_battle_scores")
    .select("*")
    .eq("battle_id", battleId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar la puntuación de la batalla: ${error.message}`,
    );
  }

  if (data) {
    return data as LiveBattleScoreRow;
  }

  return {
    id: "",
    battle_id: battleId,
    left_score: 0,
    right_score: 0,
    left_energy: 0,
    right_energy: 0,
    left_gift_count: 0,
    right_gift_count: 0,
    last_gift_id: null,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}

export async function getLiveBattleByRoom(
  roomId: string,
): Promise<LiveBattleDetails | null> {
  const { data, error } = await supabase
    .from("live_battles")
    .select("*")
    .eq("room_id", roomId)
    .in("status", [
      "scheduled",
      "waiting",
      "active",
    ])
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar la batalla LIVE: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const battle = data as LiveBattleRow;

  const [
    scores,
    leftCreator,
    rightCreator,
  ] = await Promise.all([
    getBattleScores(battle.id),
    getProfile(battle.left_creator_id),
    getProfile(battle.right_creator_id),
  ]);

  return {
    battle,
    scores,
    leftCreator,
    rightCreator,
  };
}

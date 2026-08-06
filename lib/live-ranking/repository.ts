import { supabase } from "@/lib/supabase";
import type {
  LiveRankingPeriod,
  LiveRankingType,
} from "./types";

export interface LiveRankingRow {
  id: string;
  room_id: string;
  user_id: string;
  ranking_type: LiveRankingType;
  ranking_period: LiveRankingPeriod;
  score: number;
  gifts_sent: number;
  gift_value: number;
  energy_contributed: number;
  watch_seconds: number;
  reactions_sent: number;
  period_started_at: string;
  period_ended_at: string | null;
}

export async function getLiveRanking(
  roomId: string | undefined,
  rankingType: LiveRankingType,
  rankingPeriod: LiveRankingPeriod,
  limit = 20,
): Promise<LiveRankingRow[]> {
  let query = supabase
    .from("live_ranking_scores")
    .select("*")
    .eq("ranking_type", rankingType)
    .eq("ranking_period", rankingPeriod);

  if (roomId) {
    query = query.eq("room_id", roomId);
  }

  const { data, error } = await query
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(
      `No se pudo cargar el ranking LIVE: ${error.message}`,
    );
  }

  return (data ?? []) as unknown as LiveRankingRow[];
}

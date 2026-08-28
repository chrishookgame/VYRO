import type {
  BattleSeriesRound,
  BattleSeriesState,
} from "@/components/live/battle";

import { supabase } from "@/lib/supabase";

import type {
  CreateLiveBattleSeriesInput,
  LiveBattleSeriesDetails,
  LiveBattleSeriesRow,
} from "./types";

function createRounds(
  row: LiveBattleSeriesRow,
): BattleSeriesRound[] {
  return Array.from(
    {
      length: row.total_battles,
    },
    (_, index) => ({
      position: index + 1,
      battleId: null,
      status:
        index + 1 <
        row.current_position
          ? "finished"
          : index + 1 ===
              row.current_position &&
            row.status === "active"
            ? "active"
            : row.status ===
                "cancelled"
              ? "cancelled"
              : "pending",
      winnerId: null,
      startedAt: null,
      finishedAt: null,
    }),
  );
}

function mapRowToState(
  row: LiveBattleSeriesRow,
): BattleSeriesState {
  return {
    id: row.id,
    roomId: row.room_id,
    status: row.status,
    config: {
      totalBattles:
        row.total_battles,
      battleDurationSeconds:
        row.battle_duration_seconds,
      breakDurationSeconds:
        row.break_duration_seconds,
      autoStartNext:
        row.auto_start_next,
    },
    currentPosition:
      row.current_position,
    leftWins: row.left_wins,
    rightWins: row.right_wins,
    draws: row.draws,
    rounds: createRounds(row),
    nextBattleAt:
      row.next_battle_at,
    winnerId:
      row.winner_id,
  };
}

function mapDetails(
  row: LiveBattleSeriesRow,
): LiveBattleSeriesDetails {
  return {
    row,
    state: mapRowToState(row),
  };
}

interface CreateLiveBattleSeriesRpcRow {
  series_id: string;
  battle_id: string;
}

export async function createLiveBattleSeries(
  input: CreateLiveBattleSeriesInput,
): Promise<LiveBattleSeriesDetails> {
  const { data, error } = await supabase.rpc(
    "create_live_battle_series",
    {
      p_room_id: input.roomId,
      p_left_creator_id:
        input.leftCreatorId,
      p_right_creator_id:
        input.rightCreatorId,
      p_invitation_id:
        input.invitationId ?? null,
      p_total_battles:
        input.config.totalBattles,
      p_battle_duration_seconds:
        input.config
          .battleDurationSeconds,
      p_break_duration_seconds:
        input.config
          .breakDurationSeconds,
      p_auto_start_next:
        input.config.autoStartNext,
      p_scheduled_at:
        input.scheduledAt ?? null,
    },
  );

  if (error) {
    throw new Error(
      `No se pudo crear la Battle Series: ${error.message}`,
    );
  }

  const rpcRows =
    data as CreateLiveBattleSeriesRpcRow[] | null;

  const createdIds = rpcRows?.[0];

  if (
    !createdIds?.series_id ||
    !createdIds.battle_id
  ) {
    throw new Error(
      "La Battle Series se creó, pero Supabase no devolvió sus identificadores.",
    );
  }

  const createdSeries =
    await getLiveBattleSeriesById(
      createdIds.series_id,
    );

  if (!createdSeries) {
    throw new Error(
      "La Battle Series se creó, pero no pudo recuperarse desde Supabase.",
    );
  }

  return createdSeries;
}
export async function getLiveBattleSeriesById(
  seriesId: string,
): Promise<LiveBattleSeriesDetails | null> {
  const { data, error } = await supabase
    .from("live_battle_series")
    .select("*")
    .eq("id", seriesId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar la Battle Series: ${error.message}`,
    );
  }

  return data
    ? mapDetails(
        data as LiveBattleSeriesRow,
      )
    : null;
}

export async function getActiveLiveBattleSeries(
  roomId: string,
): Promise<LiveBattleSeriesDetails | null> {
  const { data, error } = await supabase
    .from("live_battle_series")
    .select("*")
    .eq("room_id", roomId)
    .in("status", [
      "scheduled",
      "waiting",
      "active",
      "intermission",
    ])
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar la serie activa: ${error.message}`,
    );
  }

  return data
    ? mapDetails(
        data as LiveBattleSeriesRow,
      )
    : null;
}

interface StartLiveBattleRoundRpcRow {
  series_id: string;
  battle_id: string;
  battle_status: "active";
  started_at: string;
  ends_at: string;
}

export async function startLiveBattleRound(
  seriesId: string,
  battleId: string,
): Promise<LiveBattleSeriesDetails> {
  const { data, error } = await supabase.rpc(
    "start_live_battle_round",
    {
      p_series_id: seriesId,
      p_battle_id: battleId,
    },
  );

  if (error) {
    throw new Error(
      `No se pudo iniciar la ronda de batalla: ${error.message}`,
    );
  }

  const rpcRows =
    data as StartLiveBattleRoundRpcRow[] | null;

  const result = rpcRows?.[0];

  if (
    !result?.series_id ||
    !result.battle_id ||
    result.battle_status !== "active"
  ) {
    throw new Error(
      "La ronda se inició, pero Supabase no devolvió el resultado esperado.",
    );
  }

  const updatedSeries =
    await getLiveBattleSeriesById(
      result.series_id,
    );

  if (!updatedSeries) {
    throw new Error(
      "La ronda se inició, pero la Battle Series no pudo recuperarse.",
    );
  }

  return updatedSeries;
}
interface AdvanceLiveBattleSeriesRpcRow {
  series_id: string;
  finished_battle_id: string;
  next_battle_id: string | null;
  series_status:
    LiveBattleSeriesDetails["row"]["status"];
  series_winner_id: string | null;
}

export async function advanceBattleSeriesRound(
  seriesId: string,
  battleId: string,
): Promise<LiveBattleSeriesDetails> {
  const { data, error } = await supabase.rpc(
    "advance_live_battle_series",
    {
      p_series_id: seriesId,
      p_battle_id: battleId,
    },
  );

  if (error) {
    throw new Error(
      `No se pudo avanzar la Battle Series: ${error.message}`,
    );
  }

  const rpcRows =
    data as AdvanceLiveBattleSeriesRpcRow[] | null;

  const result = rpcRows?.[0];

  if (
    !result?.series_id ||
    !result.finished_battle_id
  ) {
    throw new Error(
      "La Battle Series avanzó, pero Supabase no devolvió el resultado esperado.",
    );
  }

  const updatedSeries =
    await getLiveBattleSeriesById(
      result.series_id,
    );

  if (!updatedSeries) {
    throw new Error(
      "La Battle Series avanzó, pero no pudo recuperarse desde Supabase.",
    );
  }

  return updatedSeries;
}

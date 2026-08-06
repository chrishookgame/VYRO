import {
  battleScheduler,
  type BattleSeriesRound,
  type BattleSeriesState,
} from "@/components/live/battle";

import { supabase } from "@/lib/supabase";

import type {
  CreateLiveBattleSeriesInput,
  LiveBattleSeriesDetails,
  LiveBattleSeriesRow,
  UpdateLiveBattleSeriesInput,
} from "./types";

async function requireCurrentUserId(): Promise<string> {
  const {
    data: {
      user,
    },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `No se pudo identificar al usuario: ${error.message}`,
    );
  }

  if (!user) {
    throw new Error(
      "Debes iniciar sesión para gestionar Battle Series.",
    );
  }

  return user.id;
}

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

export async function createLiveBattleSeries(
  input: CreateLiveBattleSeriesInput,
): Promise<LiveBattleSeriesDetails> {
  const createdBy =
    await requireCurrentUserId();

  const initialState =
    battleScheduler.createSeries(
      crypto.randomUUID(),
      input.roomId,
      input.config,
    );

  const { data, error } = await supabase
    .from("live_battle_series")
    .insert({
      room_id: input.roomId,
      left_creator_id:
        input.leftCreatorId,
      right_creator_id:
        input.rightCreatorId,
      created_by: createdBy,
      invitation_id:
        input.invitationId ?? null,
      status: initialState.status,
      total_battles:
        initialState.config
          .totalBattles,
      battle_duration_seconds:
        initialState.config
          .battleDurationSeconds,
      break_duration_seconds:
        initialState.config
          .breakDurationSeconds,
      auto_start_next:
        initialState.config
          .autoStartNext,
      current_position:
        initialState.currentPosition,
      left_wins:
        initialState.leftWins,
      right_wins:
        initialState.rightWins,
      draws:
        initialState.draws,
      winner_id:
        initialState.winnerId,
      scheduled_at:
        input.scheduledAt ?? null,
      next_battle_at:
        initialState.nextBattleAt,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo crear la Battle Series: ${error.message}`,
    );
  }

  return mapDetails(
    data as LiveBattleSeriesRow,
  );
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

export async function updateLiveBattleSeries(
  seriesId: string,
  input: UpdateLiveBattleSeriesInput,
): Promise<LiveBattleSeriesDetails> {
  const values: Record<
    string,
    unknown
  > = {};

  if (input.status !== undefined) {
    values.status = input.status;
  }

  if (
    input.currentPosition !==
    undefined
  ) {
    values.current_position =
      input.currentPosition;
  }

  if (input.leftWins !== undefined) {
    values.left_wins =
      input.leftWins;
  }

  if (input.rightWins !== undefined) {
    values.right_wins =
      input.rightWins;
  }

  if (input.draws !== undefined) {
    values.draws =
      input.draws;
  }

  if (input.winnerId !== undefined) {
    values.winner_id =
      input.winnerId;
  }

  if (input.startedAt !== undefined) {
    values.started_at =
      input.startedAt;
  }

  if (
    input.nextBattleAt !==
    undefined
  ) {
    values.next_battle_at =
      input.nextBattleAt;
  }

  if (input.finishedAt !== undefined) {
    values.finished_at =
      input.finishedAt;
  }

  if (
    input.cancelledAt !==
    undefined
  ) {
    values.cancelled_at =
      input.cancelledAt;
  }

  const { data, error } = await supabase
    .from("live_battle_series")
    .update(values)
    .eq("id", seriesId)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo actualizar la Battle Series: ${error.message}`,
    );
  }

  return mapDetails(
    data as LiveBattleSeriesRow,
  );
}

export function advanceBattleSeriesRound(
  seriesId: string,
  currentPosition: number,
  nextBattleAt: string | null,
): Promise<LiveBattleSeriesDetails> {
  return updateLiveBattleSeries(
    seriesId,
    {
      status: "active",
      currentPosition:
        currentPosition + 1,
      nextBattleAt,
    },
  );
}

export function finishLiveBattleSeries(
  seriesId: string,
  winnerId: string | null,
  leftWins: number,
  rightWins: number,
  draws: number,
): Promise<LiveBattleSeriesDetails> {
  return updateLiveBattleSeries(
    seriesId,
    {
      status: "finished",
      winnerId,
      leftWins,
      rightWins,
      draws,
      nextBattleAt: null,
      finishedAt:
        new Date().toISOString(),
    },
  );
}

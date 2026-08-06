import type {
  BattleSeriesConfig,
  BattleSeriesState,
} from "@/components/live/battle";

export type LiveBattleSeriesStatus =
  | "scheduled"
  | "waiting"
  | "active"
  | "intermission"
  | "finished"
  | "cancelled";

export interface LiveBattleSeriesRow {
  id: string;
  room_id: string;
  left_creator_id: string;
  right_creator_id: string;
  created_by: string;
  invitation_id: string | null;
  status: LiveBattleSeriesStatus;
  total_battles: number;
  battle_duration_seconds: number;
  break_duration_seconds: number;
  auto_start_next: boolean;
  current_position: number;
  left_wins: number;
  right_wins: number;
  draws: number;
  winner_id: string | null;
  scheduled_at: string | null;
  started_at: string | null;
  next_battle_at: string | null;
  finished_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLiveBattleSeriesInput {
  roomId: string;
  leftCreatorId: string;
  rightCreatorId: string;
  invitationId?: string | null;
  config: BattleSeriesConfig;
  scheduledAt?: string | null;
}

export interface UpdateLiveBattleSeriesInput {
  status?: LiveBattleSeriesStatus;
  currentPosition?: number;
  leftWins?: number;
  rightWins?: number;
  draws?: number;
  winnerId?: string | null;
  startedAt?: string | null;
  nextBattleAt?: string | null;
  finishedAt?: string | null;
  cancelledAt?: string | null;
}

export interface LiveBattleSeriesDetails {
  row: LiveBattleSeriesRow;
  state: BattleSeriesState;
}

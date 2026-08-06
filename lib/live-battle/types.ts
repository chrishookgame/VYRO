export type LiveBattleStatus =
  | "scheduled"
  | "waiting"
  | "active"
  | "finished"
  | "cancelled";

export type LiveBattleMode =
  | "one_vs_one"
  | "team"
  | "series"
  | "tournament";

export interface LiveBattleRow {
  id: string;
  room_id: string;
  left_creator_id: string;
  right_creator_id: string;
  status: LiveBattleStatus;
  mode: LiveBattleMode;
  duration_seconds: number;
  scheduled_at: string | null;
  started_at: string | null;
  ends_at: string | null;
  finished_at: string | null;
  winner_id: string | null;
  series_id: string | null;
  series_position: number | null;
  auto_start_next: boolean;
  break_duration_seconds: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface LiveBattleScoreRow {
  id: string;
  battle_id: string;
  left_score: number;
  right_score: number;
  left_energy: number;
  right_energy: number;
  left_gift_count: number;
  right_gift_count: number;
  last_gift_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveBattleProfileRow {
  id: string;
  full_name: string | null;
  username: string | null;
}

export interface LiveBattleDetails {
  battle: LiveBattleRow;
  scores: LiveBattleScoreRow;
  leftCreator: LiveBattleProfileRow | null;
  rightCreator: LiveBattleProfileRow | null;
}

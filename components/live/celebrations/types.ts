export type VyroCelebrationType =
  | "LEVEL_UP"
  | "WIN_STREAK"
  | "TITLE_GAINED"
  | "RECORD";

export type VyroCelebrationIntensity =
  | "standard"
  | "epic"
  | "legendary";

export interface VyroLiveCelebrationEvent {
  id: string;

  type: VyroCelebrationType;
  intensity: VyroCelebrationIntensity;

  creatorId: string;
  creatorName: string;

  title: string;
  message: string;

  levelName: string | null;
  streak: number | null;

  visible: boolean;
}

export interface VyroLiveCelebrationState {
  active: VyroLiveCelebrationEvent | null;
  queue: VyroLiveCelebrationEvent[];
}

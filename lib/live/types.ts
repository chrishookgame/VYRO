export interface LiveViewer {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
}

export interface LiveReaction {
  id: string;
  room_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface EnergyCoreState {
  room_id: string;
  energy: number;
  level: number;
}

export interface LiveDashboardData {
  roomId: string;
  activeViewers: number;
  peakViewers: number;
  totalJoins: number;
  reactions: number;
  gifts: number;
  energy: number;
  messages: number;
  grossRevenue: number;
  creatorRevenue: number;
  updatedAt: string | null;
}

export interface LiveRoomCounterRow {
  room_id: string;
  active_viewers: number;
  peak_viewers: number;
  total_joins: number;
  total_reactions: number;
  total_gifts: number;
  updated_at: string;
}

export interface LiveEnergyStateRow {
  room_id: string;
  current_energy: number;
}

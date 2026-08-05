export interface LivePresenceCounterResult {
  roomId: string;
  activeViewers: number;
  peakViewers: number;
  totalJoins: number;
}

export interface LivePresenceCounterRow {
  room_id: string;
  active_viewers: number;
  peak_viewers: number;
  total_joins: number;
}

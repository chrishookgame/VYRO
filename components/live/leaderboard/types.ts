export interface LiveLeaderboardGiftEvent {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string | null;
  senderAvatarUrl: string | null;
  giftCode: string;
  giftName: string;
  amount: number;
  energy: number;
  createdAt: number;
}

export interface LiveLeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalAmount: number;
  totalEnergy: number;
  giftCount: number;
  lastGiftAt: number;
  rank: number;
}

export interface LiveLeaderboardState {
  roomId: string;
  entries: Record<
    string,
    LiveLeaderboardEntry
  >;
  processedEventIds: string[];
  updatedAt: number;
}

export interface LiveLeaderboardConfiguration {
  maximumEntries: number;
  maximumProcessedEvents: number;
}

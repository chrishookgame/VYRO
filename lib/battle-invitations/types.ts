import type {
  BattleSeriesConfig,
} from "@/components/live/battle";

export type BattleInvitationStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired"
  | "cancelled";

export interface BattleInvitationRow {
  id: string;
  room_id: string;
  sender_id: string;
  receiver_id: string;
  status: BattleInvitationStatus;
  series_config: BattleSeriesConfig;
  message: string | null;
  expires_at: string;
  responded_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BattleInvitationProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

export interface BattleInvitation {
  id: string;
  roomId: string;
  senderId: string;
  receiverId: string;
  status: BattleInvitationStatus;
  seriesConfig: BattleSeriesConfig;
  message: string | null;
  expiresAt: string;
  respondedAt: string | null;
  acceptedAt: string | null;
  declinedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  sender: BattleInvitationProfile | null;
  receiver: BattleInvitationProfile | null;
}

export interface CreateBattleInvitationInput {
  roomId: string;
  receiverId: string;
  seriesConfig: BattleSeriesConfig;
  message?: string;
  expiresInSeconds?: number;
}

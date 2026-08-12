export type LiveGuestInvitationStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired"
  | "cancelled"
  | "revoked";

export interface LiveGuestPermissions {
  canPublishCamera: boolean;
  canPublishMicrophone: boolean;
  canShareScreen: boolean;
}

export interface LiveGuestInvitationRow {
  id: string;
  room_id: string;
  inviter_id: string;
  guest_id: string;
  status: LiveGuestInvitationStatus;
  message: string | null;
  permissions: LiveGuestPermissions;
  expires_at: string;
  responded_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  cancelled_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveGuestInvitationProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

export interface LiveGuestInvitation {
  id: string;
  roomId: string;
  inviterId: string;
  guestId: string;
  status: LiveGuestInvitationStatus;
  message: string | null;
  permissions: LiveGuestPermissions;
  expiresAt: string;
  respondedAt: string | null;
  acceptedAt: string | null;
  declinedAt: string | null;
  cancelledAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
  inviter: LiveGuestInvitationProfile | null;
  guest: LiveGuestInvitationProfile | null;
}

export interface CreateLiveGuestInvitationInput {
  roomId: string;
  guestId: string;
  message?: string;
  permissions?: Partial<LiveGuestPermissions>;
  expiresInSeconds?: number;
}

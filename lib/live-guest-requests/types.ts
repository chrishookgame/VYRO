export type LiveGuestRequestStatus =
  | "pending"
  | "approved"
  | "declined"
  | "cancelled"
  | "expired";

export type LiveGuestRequest = {
  id: string;
  roomId: string;
  requesterId: string;
  requesterUsername: string | null;
  requesterFullName: string | null;
  requesterAvatarUrl: string | null;
  status: LiveGuestRequestStatus;
  message: string | null;
  resolvedBy: string | null;
  invitationId: string | null;
  expiresAt: string;
  resolvedAt: string | null;
  cancelledAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateLiveGuestRequestInput = {
  roomId: string;
  message?: string | null;
};
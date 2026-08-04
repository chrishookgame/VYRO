export type MemberStatus =
  | "active"
  | "suspended"
  | "pending";

export type MemberLevel =
  | "Starter"
  | "Silver"
  | "Gold"
  | "Diamond"
  | "Elite";

export interface MemberIdentity {

  memberId: string;

  userId: string;

  fullName: string;

  username: string;

  email: string;

  avatarUrl?: string;

  level: MemberLevel;

  trustScore: number;

  reputation: number;

  verified: boolean;

  status: MemberStatus;

  joinedAt: string;

  badges: string[];

  qrCodeUrl: string;

}

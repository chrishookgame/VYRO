export type MemberLevel =
  | "Starter"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Diamond"
  | "Legend";

export type MemberCard = {
  memberId: string;
  userId: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  level: MemberLevel;
  joinedAt: string;
  verified: boolean;
};

export function generateMemberId() {
  const year =
    new Date().getFullYear();

  const random =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  return `VYR-${year}-${random}`;
}

export function createMemberCard(
  userId: string,
  fullName: string,
  username: string,
  avatarUrl: string,
): MemberCard {
  return {
    memberId:
      generateMemberId(),
    userId,
    fullName,
    username,
    avatarUrl,
    level: "Starter",
    joinedAt:
      new Date().toISOString(),
    verified: false,
  };
}

export * from "./verification";

export * from "./level";

export * from "./card";

export * from "./theme";

export * from "./avatar";

export * from "./qr";

export * from "./pdf";

export * from "./png";

export * from "./export";

export * from "./verification-status";

export * from "./trust";

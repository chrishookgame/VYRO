import type { MemberIdentity } from "./identity";

export function createMemberIdentity(
  member: MemberIdentity,
): MemberIdentity {
  return {
    ...member,
  };
}

export function isVerifiedMember(
  member: MemberIdentity,
): boolean {
  return (
    member.verified &&
    member.status === "active"
  );
}

export function canUseVyroCard(
  member: MemberIdentity,
): boolean {
  return (
    member.status === "active" &&
    member.verified
  );
}

export function getDisplayName(
  member: MemberIdentity,
): string {
  return member.fullName.trim();
}

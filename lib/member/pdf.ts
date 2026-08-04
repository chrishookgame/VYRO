import type {
  MemberCard,
} from "./index";

export function createMemberPdfData(
  card: MemberCard,
) {
  return {
    title:
      "VYRO Member ID",
    memberId:
      card.memberId,
    fullName:
      card.fullName,
    username:
      card.username,
    level:
      card.level,
    joinedAt:
      card.joinedAt,
    verified:
      card.verified,
  };
}

import type {
  MemberCard,
} from "./index";

export type MemberImageData = {
  fileName: string;
  title: string;
  memberId: string;
  fullName: string;
  username: string;
  level: string;
  avatarUrl: string;
  verified: boolean;
};

export function createMemberImageData(
  card: MemberCard,
): MemberImageData {

  return {
    fileName:
      `${card.memberId}.png`,
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
    avatarUrl:
      card.avatarUrl,
    verified:
      card.verified,
  };

}

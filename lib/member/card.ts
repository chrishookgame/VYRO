import {
  getMemberLevel,
} from "./level";
import {
  createMemberCard,
  type MemberCard,
} from "./index";

export function createMemberCardFromXp(
  userId: string,
  fullName: string,
  username: string,
  avatarUrl: string,
  xp: number,
): MemberCard {

  const card =
    createMemberCard(
      userId,
      fullName,
      username,
      avatarUrl,
    );

  return {
    ...card,
    level:
      getMemberLevel(xp),
  };
}

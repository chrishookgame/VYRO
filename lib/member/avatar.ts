import type {
  MemberCard,
} from "./index";

export function updateMemberAvatar(
  card: MemberCard,
  avatarUrl: string,
): MemberCard {

  return {
    ...card,
    avatarUrl:
      avatarUrl.trim(),
  };
}

export function hasAvatar(
  card: MemberCard,
) {

  return (
    card.avatarUrl.length > 0
  );

}

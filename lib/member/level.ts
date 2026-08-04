import type {
  MemberLevel,
} from "./index";

export function getMemberLevel(
  xp: number,
): MemberLevel {

  if (xp >= 100000) {
    return "Legend";
  }

  if (xp >= 50000) {
    return "Diamond";
  }

  if (xp >= 20000) {
    return "Gold";
  }

  if (xp >= 5000) {
    return "Silver";
  }

  if (xp >= 1000) {
    return "Bronze";
  }

  return "Starter";
}

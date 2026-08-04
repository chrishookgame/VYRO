import type {
  MemberCard,
} from "./index";

import {
  calculateTrustScore,
} from "@/lib/trust";

export type MemberCardWithTrust =
  MemberCard & {
    trustScore: number;
    trustLevel: string;
  };

export function addTrustToMemberCard(
  card: MemberCard,
  score: number,
): MemberCardWithTrust {

  const trust =
    calculateTrustScore(score);

  return {
    ...card,
    trustScore:
      trust.score,
    trustLevel:
      trust.level,
  };

}

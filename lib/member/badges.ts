export type MemberBadge = {
  id: string;
  title: string;
  icon: string;
};

export function getMemberBadges(
  member: {
    verified: boolean;
    level: string;
    reputation: number;
    trustScore: number;
  },
): MemberBadge[] {

  const badges: MemberBadge[] = [];

  if (member.verified) {
    badges.push({
      id: "verified",
      title: "Verified",
      icon: "✅",
    });
  }

  if (member.level === "Diamond") {
    badges.push({
      id: "diamond",
      title: "Diamond",
      icon: "💎",
    });
  }

  if (member.level === "Elite") {
    badges.push({
      id: "elite",
      title: "Elite",
      icon: "👑",
    });
  }

  if (member.trustScore >= 900) {
    badges.push({
      id: "trusted",
      title: "Trusted",
      icon: "🛡️",
    });
  }

  if (member.reputation >= 1000) {
    badges.push({
      id: "reputation",
      title: "Top Reputation",
      icon: "🌟",
    });
  }

  return badges;

}

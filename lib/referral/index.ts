export type ReferralProfile = {
  userId: string;
  referralCode: string;
  referralLink: string;
};

export function generateReferralCode(
  userId: string,
): string {
  return userId
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8);
}

export function createReferralProfile(
  userId: string,
  baseUrl: string,
): ReferralProfile {
  const referralCode =
    generateReferralCode(userId);

  return {
    userId,
    referralCode,
    referralLink:
      `${baseUrl}/register?ref=${referralCode}`,
  };
}

export * from "./tracking";
export * from "./database";export * from "./database";

export type RewardEventType =
  | "academy"
  | "referral"
  | "live"
  | "marketplace"
  | "ai";

export type Reward = {
  type: RewardEventType;
  reason: string;
  xp: number;
  coins: number;
};

export const rewardCatalog = {
  referralRegistered: {
    type: "referral",
    reason: "Nuevo referido registrado",
    xp: 200,
    coins: 0,
  },

  academyCourseCompleted: {
    type: "academy",
    reason: "Curso completado",
    xp: 100,
    coins: 0,
  },
} as const;
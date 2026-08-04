export type VyroPrestigeRank =
  | "vyro_seed"
  | "vyro_spark"
  | "vyro_nova"
  | "vyro_titan"
  | "vyro_orbit"
  | "vyro_legend"
  | "vyro_cosmos"
  | "vyro_infinity";

export interface PrestigeRankDefinition {
  id: VyroPrestigeRank;
  name: string;
  description: string;
  minimumXp: number;
  icon: string;
  priority: number;
}

export interface UserPrestige {
  userId: string;
  xp: number;
  rank: VyroPrestigeRank;
  nextRank: VyroPrestigeRank | null;
  progress: number;
}

export interface RaidMVPPlayer {
  creatorId: string;
  creatorName: string;

  damage: number;
  support: number;
  criticalHits: number;
}

export function resolveRaidMVP(
  players: RaidMVPPlayer[],
) {
  return [...players]
    .sort(
      (a, b) => {
        const aScore =
          a.damage +
          a.support +
          a.criticalHits * 250;

        const bScore =
          b.damage +
          b.support +
          b.criticalHits * 250;

        return bScore - aScore;
      },
    )[0] ?? null;
}

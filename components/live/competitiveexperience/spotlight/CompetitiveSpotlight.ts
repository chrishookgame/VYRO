import type {
  LiveCompetitivePlayer,
} from "../types/LiveCompetitiveTypes";

export function selectCompetitiveSpotlight(
  players: LiveCompetitivePlayer[],
) {
  return [...players]
    .sort(
      (a,b) => {
        const aScore =
          a.competitivePower +
          a.streak * 1000 +
          a.championships * 10000;

        const bScore =
          b.competitivePower +
          b.streak * 1000 +
          b.championships * 10000;

        return bScore - aScore;
      },
    )[0] ?? null;
}

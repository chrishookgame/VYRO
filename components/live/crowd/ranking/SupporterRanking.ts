import type {
  VyroFanSupporter,
} from "../types";

export function createSupporterRanking(
  supporters: VyroFanSupporter[],
) {
  return [...supporters]
    .sort(
      (a,b) => {
        const aPower =
          a.supportPoints +
          a.reactions * 5 +
          a.completedMissions * 250 +
          a.streak * 50;

        const bPower =
          b.supportPoints +
          b.reactions * 5 +
          b.completedMissions * 250 +
          b.streak * 50;

        return bPower -
          aPower;
      },
    )
    .map(
      (supporter,index) => ({
        ...supporter,

        rank:
          index + 1,
      }),
    );
}

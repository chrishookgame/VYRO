import type {
  VyroWar,
  VyroWarState,
  VyroWarTeam,
} from "./types";

export function createGlobalWarState(
  wars: VyroWar[],
): VyroWarState {
  const teams: VyroWarTeam[] =
    wars.flatMap(
      war => [
        war.left,
        war.right,
      ],
    );

  const strongestTeam =
    [...teams]
      .sort(
        (a,b) =>
          (
            b.score +
            b.wins * 100 +
            b.streak * 50
          ) -
          (
            a.score +
            a.wins * 100 +
            a.streak * 50
          ),
      )[0] ?? null;

  return {
    wars,

    activeWars:
      wars.filter(
        war => war.active,
      ).length,

    completedWars:
      wars.filter(
        war => !war.active,
      ).length,

    strongestTeam,
  };
}

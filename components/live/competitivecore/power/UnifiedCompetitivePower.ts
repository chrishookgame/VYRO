import type {
  CompetitivePlayer,
} from "../types/CompetitiveCoreTypes";

export function calculateUnifiedCompetitivePower(
  player: CompetitivePlayer,
) {
  return Math.max(
    0,
    Math.round(
      Math.max(
        0,
        player.leaguePoints,
      ) * 1.5 +
      Math.max(
        0,
        player.circuitPoints,
      ) * 1.25 +
      Math.max(
        0,
        player.tournamentPoints,
      ) +
      Math.max(
        0,
        player.guildWarPoints,
      ) +
      Math.max(
        0,
        player.alliancePoints,
      ) +
      Math.max(
        0,
        player.raidPoints,
      ) +
      Math.max(
        0,
        player.seasonPoints,
      ) +
      Math.max(
        0,
        player.wins,
      ) * 500 +
      Math.max(
        0,
        player.championships,
      ) * 10000 -
      Math.max(
        0,
        player.losses,
      ) * 100,
    ),
  );
}

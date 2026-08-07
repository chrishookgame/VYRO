import type {
  WorldCircuitCompetitor,
} from "../types/WorldCircuitTypes";

export function calculateGlobalCircuitPoints(
  competitor: WorldCircuitCompetitor,
) {
  return (
    Math.max(
      0,
      competitor.tournamentPoints,
    ) +
    Math.max(
      0,
      competitor.guildWarPoints,
    ) +
    Math.max(
      0,
      competitor.alliancePoints,
    ) +
    Math.max(
      0,
      competitor.raidPoints,
    ) +
    Math.max(
      0,
      competitor.seasonPoints,
    ) +
    Math.max(
      0,
      competitor.victories,
    ) * 500 +
    Math.max(
      0,
      competitor.championships,
    ) * 5000
  );
}

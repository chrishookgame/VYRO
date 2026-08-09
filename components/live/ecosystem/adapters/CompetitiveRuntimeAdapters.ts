import type {
  CompetitivePlayer,
} from "@/components/live/competitivecore/types/CompetitiveCoreTypes";

import type {
  SeasonPlayer,
} from "@/components/live/seasons/types";

import type {
  WorldLeagueDivision,
  WorldLeaguePlayer,
} from "@/components/live/worldleague/types/WorldLeagueTypes";

import type {
  WorldTournamentPlayer,
} from "@/components/live/worldtournaments/types/WorldTournamentTypes";

import type {
  WorldCircuitCompetitor,
} from "@/components/live/worldcircuit/types/WorldCircuitTypes";

function resolveWorldLeagueDivision(
  leaguePoints: number,
): WorldLeagueDivision {
  if (leaguePoints >= 6000) {
    return "INFINITY";
  }

  if (leaguePoints >= 4500) {
    return "ROYAL";
  }

  if (leaguePoints >= 3000) {
    return "DIAMOND";
  }

  if (leaguePoints >= 1800) {
    return "GOLD";
  }

  if (leaguePoints >= 900) {
    return "SILVER";
  }

  return "BRONZE";
}

export function competitivePlayersToSeasonPlayers(
  players: readonly CompetitivePlayer[],
): SeasonPlayer[] {
  return players.map(
    (player) => ({
      creatorId:
        player.creatorId,

      creatorName:
        player.creatorName,

      score:
        player.seasonPoints,

      wins:
        player.wins,
    }),
  );
}

export function competitivePlayersToWorldLeaguePlayers(
  players: readonly CompetitivePlayer[],
): WorldLeaguePlayer[] {
  return players.map(
    (player) => ({
      creatorId:
        player.creatorId,

      creatorName:
        player.creatorName,

      countryCode:
        player.countryCode,

      division:
        resolveWorldLeagueDivision(
          player.leaguePoints,
        ),

      leaguePoints:
        player.leaguePoints,

      circuitPoints:
        player.circuitPoints,

      wins:
        player.wins,

      losses:
        player.losses,

      streak:
        Math.max(
          0,
          player.wins -
            player.losses,
        ),

      championships:
        player.championships,
    }),
  );
}

export function competitivePlayersToWorldTournamentPlayers(
  players: readonly CompetitivePlayer[],
): WorldTournamentPlayer[] {
  const ordered =
    [...players].sort(
      (left, right) =>
        right.tournamentPoints -
          left.tournamentPoints ||
        right.wins -
          left.wins ||
        left.creatorId.localeCompare(
          right.creatorId,
        ),
    );

  return ordered.map(
    (player, index) => ({
      creatorId:
        player.creatorId,

      creatorName:
        player.creatorName,

      countryCode:
        player.countryCode,

      score:
        player.tournamentPoints,

      wins:
        player.wins,

      losses:
        player.losses,

      seed:
        index + 1,

      eliminated:
        false,
    }),
  );
}

export function competitivePlayersToWorldCircuitCompetitors(
  players: readonly CompetitivePlayer[],
): WorldCircuitCompetitor[] {
  return players.map(
    (player) => ({
      creatorId:
        player.creatorId,

      creatorName:
        player.creatorName,

      countryCode:
        player.countryCode,

      tournamentPoints:
        player.tournamentPoints,

      guildWarPoints:
        player.guildWarPoints,

      alliancePoints:
        player.alliancePoints,

      raidPoints:
        player.raidPoints,

      seasonPoints:
        player.seasonPoints,

      victories:
        player.wins,

      championships:
        player.championships,
    }),
  );
}

export interface LiveCompetitiveSeasonPlayer {
  creatorId: string;
  creatorName: string;
  wins: number;
  competitivePower: number;
}

export function competitiveOrchestratorPlayersToSeasonPlayers(
  players: readonly LiveCompetitiveSeasonPlayer[],
): SeasonPlayer[] {
  return players.map(
    (player) => ({
      creatorId:
        player.creatorId,

      creatorName:
        player.creatorName,

      score:
        player.competitivePower,

      wins:
        player.wins,
    }),
  );
}
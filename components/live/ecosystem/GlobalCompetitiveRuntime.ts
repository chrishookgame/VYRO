import {
  createGlobalCompetitiveEcosystem,
  type GlobalCompetitiveEcosystemState,
} from "./GlobalCompetitiveEcosystem";

export interface GlobalCompetitiveRuntimeInput {
  battleActive: boolean;

  season?: {
    active: boolean;
  } | null;

  leagueActive?: boolean;

  tournament?: {
    active: boolean;
  } | null;

  worldCircuit?: {
    active: boolean;
  } | null;

  worldLeague?: {
    active: boolean;
  } | null;

  raid?: {
    boss: {
      alive: boolean;
    };
  } | null;

  guildRaid?: {
    active: boolean;
  } | null;

  guildWar?: {
    activeBattles: number;
  } | null;

  allianceWars?: ReadonlyArray<{
    active: boolean;
  }> | null;
}

export interface GlobalCompetitiveRuntimeState {
  ecosystem: GlobalCompetitiveEcosystemState;

  battleActive: boolean;
  seasonActive: boolean;
  leagueActive: boolean;
  tournamentActive: boolean;
  worldCircuitActive: boolean;
  worldLeagueActive: boolean;
  raidActive: boolean;
  guildRaidActive: boolean;
  guildWarActive: boolean;
  allianceWarActive: boolean;
}

export function createGlobalCompetitiveRuntime(
  input: GlobalCompetitiveRuntimeInput,
): GlobalCompetitiveRuntimeState {
  const battleActive =
    input.battleActive;

  const seasonActive =
    input.season?.active ?? false;

  const leagueActive =
    input.leagueActive ?? false;

  const tournamentActive =
    input.tournament?.active ?? false;

  const worldCircuitActive =
    input.worldCircuit?.active ?? false;

  const worldLeagueActive =
    input.worldLeague?.active ?? false;

  const raidActive =
    input.raid?.boss.alive ?? false;

  const guildRaidActive =
    input.guildRaid?.active ?? false;

  const guildWarActive =
    (input.guildWar?.activeBattles ?? 0) > 0;

  const allianceWarActive =
    input.allianceWars?.some(
      (war) => war.active,
    ) ?? false;

  const ecosystem =
    createGlobalCompetitiveEcosystem({
      battleActive,
      seasonActive,
      leagueActive,
      tournamentActive,
      worldCircuitActive,
      worldLeagueActive,
      raidActive:
        raidActive ||
        guildRaidActive,
      guildWarActive,
      allianceWarActive,
    });

  return {
    ecosystem,

    battleActive,
    seasonActive,
    leagueActive,
    tournamentActive,
    worldCircuitActive,
    worldLeagueActive,
    raidActive,
    guildRaidActive,
    guildWarActive,
    allianceWarActive,
  };
}
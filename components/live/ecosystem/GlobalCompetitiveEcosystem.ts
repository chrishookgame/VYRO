export interface GlobalCompetitiveEcosystemInput {
  battleActive: boolean;
  seasonActive: boolean;
  leagueActive: boolean;
  tournamentActive: boolean;
  worldCircuitActive: boolean;
  worldLeagueActive: boolean;
  raidActive: boolean;
  guildWarActive: boolean;
  allianceWarActive: boolean;
}

export interface GlobalCompetitiveEcosystemState {
  activeSystems: number;
  totalSystems: number;
  intensity: number;

  battleActive: boolean;
  seasonActive: boolean;
  leagueActive: boolean;
  tournamentActive: boolean;
  worldCircuitActive: boolean;
  worldLeagueActive: boolean;
  raidActive: boolean;
  guildWarActive: boolean;
  allianceWarActive: boolean;

  globalCompetitionActive: boolean;
  worldCompetitionActive: boolean;
  socialCompetitionActive: boolean;

  status:
    | "IDLE"
    | "ACTIVE"
    | "INTENSE"
    | "GLOBAL";
}

export function createGlobalCompetitiveEcosystem(
  input: GlobalCompetitiveEcosystemInput,
): GlobalCompetitiveEcosystemState {
  const systems = [
    input.battleActive,
    input.seasonActive,
    input.leagueActive,
    input.tournamentActive,
    input.worldCircuitActive,
    input.worldLeagueActive,
    input.raidActive,
    input.guildWarActive,
    input.allianceWarActive,
  ];

  const activeSystems =
    systems.filter(Boolean).length;

  const totalSystems =
    systems.length;

  const intensity =
    totalSystems === 0
      ? 0
      : Math.round(
          (activeSystems / totalSystems) * 100,
        );

  const worldCompetitionActive =
    input.worldCircuitActive ||
    input.worldLeagueActive ||
    input.tournamentActive;

  const socialCompetitionActive =
    input.guildWarActive ||
    input.allianceWarActive ||
    input.raidActive;

  const globalCompetitionActive =
    activeSystems >= 3;

  let status:
    GlobalCompetitiveEcosystemState["status"] =
      "IDLE";

  if (activeSystems >= 1) {
    status = "ACTIVE";
  }

  if (activeSystems >= 4) {
    status = "INTENSE";
  }

  if (
    activeSystems >= 6 ||
    (
      worldCompetitionActive &&
      socialCompetitionActive &&
      input.battleActive
    )
  ) {
    status = "GLOBAL";
  }

  return {
    activeSystems,
    totalSystems,
    intensity,

    battleActive:
      input.battleActive,

    seasonActive:
      input.seasonActive,

    leagueActive:
      input.leagueActive,

    tournamentActive:
      input.tournamentActive,

    worldCircuitActive:
      input.worldCircuitActive,

    worldLeagueActive:
      input.worldLeagueActive,

    raidActive:
      input.raidActive,

    guildWarActive:
      input.guildWarActive,

    allianceWarActive:
      input.allianceWarActive,

    globalCompetitionActive,
    worldCompetitionActive,
    socialCompetitionActive,

    status,
  };
}

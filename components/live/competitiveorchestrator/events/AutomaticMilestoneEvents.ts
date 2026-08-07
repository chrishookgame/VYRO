import {
  detectRankChange,
} from "../detectors/RankChangeDetector";

import {
  detectWinStreak,
} from "../detectors/WinStreakDetector";

import {
  detectChampionStatus,
} from "../detectors/ChampionDetector";

import {
  detectQualificationStatus,
} from "../detectors/QualificationDetector";

import type {
  CompetitiveOrchestratorEvent,
  CompetitiveOrchestratorPlayer,
} from "../types/CompetitiveOrchestratorTypes";

export function createAutomaticMilestoneEvents(
  player: CompetitiveOrchestratorPlayer,
  now: number,
): CompetitiveOrchestratorEvent[] {
  const events:CompetitiveOrchestratorEvent[]=[];

  const rank =
    detectRankChange(
      player,
    );

  const streak =
    detectWinStreak(
      player,
    );

  const champion =
    detectChampionStatus(
      player,
    );

  const qualification =
    detectQualificationStatus(
      player,
    );

  if(rank.becameNumberOne){
    events.push({
      id:
        `${player.creatorId}-rank-1-${now}`,

      type:"RANK_UP",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} reached #1 in VYRO!`,

      priority:100,

      createdAt:now,
    });
  }else if(rank.enteredTop3){
    events.push({
      id:
        `${player.creatorId}-top-3-${now}`,

      type:"RANK_UP",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} entered the Global Top 3!`,

      priority:95,

      createdAt:now,
    });
  }else if(rank.enteredTop10){
    events.push({
      id:
        `${player.creatorId}-top-10-${now}`,

      type:"RANK_UP",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} entered the Global Top 10!`,

      priority:90,

      createdAt:now,
    });
  }

  if(streak.legendary){
    events.push({
      id:
        `${player.creatorId}-streak-${now}`,

      type:"WIN_STREAK",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} reached a legendary ${player.streak}-win streak!`,

      priority:95,

      createdAt:now,
    });
  }else if(streak.elite){
    events.push({
      id:
        `${player.creatorId}-streak-${now}`,

      type:"WIN_STREAK",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} reached a ${player.streak}-win streak!`,

      priority:85,

      createdAt:now,
    });
  }

  if(champion.legendaryChampion){
    events.push({
      id:
        `${player.creatorId}-champion-${now}`,

      type:"CHAMPION",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} became a legendary VYRO champion!`,

      priority:100,

      createdAt:now,
    });
  }else if(champion.champion){
    events.push({
      id:
        `${player.creatorId}-champion-${now}`,

      type:"CHAMPION",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} is a VYRO champion!`,

      priority:100,

      createdAt:now,
    });
  }

  if(qualification.worldQualified){
    events.push({
      id:
        `${player.creatorId}-qualified-${now}`,

      type:"QUALIFIED",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} qualified for VYRO World competition!`,

      priority:95,

      createdAt:now,
    });
  }else if(qualification.qualified){
    events.push({
      id:
        `${player.creatorId}-qualified-${now}`,

      type:"QUALIFIED",

      creatorId:player.creatorId,
      creatorName:player.creatorName,

      message:
        `${player.creatorName} qualified for elite competition!`,

      priority:85,

      createdAt:now,
    });
  }

  return events;
}

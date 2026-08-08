import type {
  CompetitiveOrchestratorEvent,
  CompetitiveOrchestratorPlayer,
} from "../types/CompetitiveOrchestratorTypes";

import type {
  PresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

function createPresentationTitle(
  event: CompetitiveOrchestratorEvent,
): string {
  switch (event.type) {
    case "RANK_UP":
      return event.rank === 1
        ? "Nuevo #1"
        : "VYRO Rank Up";

    case "WIN_STREAK":
      return "Win Streak";

    case "CHAMPION":
      return "VYRO Champion";

    case "QUALIFIED":
      return "VYRO Qualification";

    default:
      return "VYRO Competitive Moment";
  }
}

function resolvePresentationType(
  event: CompetitiveOrchestratorEvent,
): PresentationEvent["type"] | null {
  switch (event.type) {
    case "RANK_UP":
      return "TOP_RANK";

    case "WIN_STREAK":
      return "WIN_STREAK";

    case "CHAMPION":
      return "CHAMPION";

    case "QUALIFIED":
      return "BANNER";

    default:
      return null;
  }
}

export function bridgeCompetitivePresentationEvents(
  events: CompetitiveOrchestratorEvent[],
): PresentationEvent[] {
  return events.flatMap(
    (event) => {
      const type =
        resolvePresentationType(event);

      if (!type) {
        return [];
      }

      return [
        {
          id:
            `competitive-presentation-${event.id}`,

          type,

          creatorId:
            event.creatorId,

          creatorName:
            event.creatorName,

          rank:
            event.rank,

          streak:
            event.streak,

          wins:
            event.wins,

          championships:
            event.championships,

          competitivePower:
            event.competitivePower,

          title:
            createPresentationTitle(event),

          message:
            event.message,

          createdAt:
            event.createdAt,

          priorityBoost:
            Math.max(
              0,
              event.priority - 80,
            ),

          allowPreemption:
            event.priority >= 95,
        },
      ];
    },
  );
}
export function createWinLeaderPresentation(
  players: CompetitiveOrchestratorPlayer[],
  now: number,
): PresentationEvent | null {
  if (players.length < 2) {
    return null;
  }

  const ranking =
    [...players].sort(
      (a, b) =>
        b.wins - a.wins ||
        a.rank - b.rank,
    );

  const leader = ranking[0];
  const challenger = ranking[1];

  if (
    !leader ||
    leader.wins <= 0 ||
    (
      challenger &&
      challenger.wins === leader.wins
    )
  ) {
    return null;
  }

  return {
    id:
      `competitive-win-leader-${leader.creatorId}-${leader.wins}`,

    type:
      "SPOTLIGHT",

    creatorId:
      leader.creatorId,

    creatorName:
      leader.creatorName,

    rank:
      leader.rank,

    streak:
      leader.streak,

    wins:
      leader.wins,

    championships:
      leader.championships,

    competitivePower:
      leader.competitivePower,

    title:
      "VYRO Win Leader",

    message:
      `${leader.creatorName} leads the battle with ${leader.wins} wins.`,

    createdAt:
      now,

    priorityBoost:
      35,

    allowPreemption:
      false,
  };
}

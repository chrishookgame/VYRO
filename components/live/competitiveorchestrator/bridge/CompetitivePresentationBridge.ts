import type {
  CompetitiveOrchestratorEvent,
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
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
    case "CHAMPION":
      return "VYRO Champion";

    case "QUALIFIED":
      return "VYRO Qualification";

    default:
      return "VYRO Competitive Moment";
  }
}

export function bridgeCompetitivePresentationEvents(
  events: CompetitiveOrchestratorEvent[],
): PresentationEvent[] {
  return events.flatMap(
    event => {
      if (
        event.type !== "CHAMPION" &&
        event.type !== "QUALIFIED"
      ) {
        return [];
      }

      const type: PresentationEvent["type"] =
        event.type === "CHAMPION"
          ? "CHAMPION"
          : "BANNER";

      return [
        {
          id: `competitive-presentation-${event.id}`,

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
            createPresentationTitle(
              event,
            ),

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

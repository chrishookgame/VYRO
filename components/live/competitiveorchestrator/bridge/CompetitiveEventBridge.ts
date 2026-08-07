import type {
  CompetitiveOrchestratorEvent,
} from "../types/CompetitiveOrchestratorTypes";

import type {
  LiveCompetitiveEvent,
} from "@/components/live/competitiveexperience/types/LiveCompetitiveTypes";

export function bridgeCompetitiveEvents(
  events: CompetitiveOrchestratorEvent[],
): LiveCompetitiveEvent[] {
  return events.map(
    event => ({
      id:event.id,

      type:event.type,

      creatorId:event.creatorId,
      creatorName:event.creatorName,

      message:event.message,

      priority:event.priority,

      createdAt:event.createdAt,
    }),
  );
}

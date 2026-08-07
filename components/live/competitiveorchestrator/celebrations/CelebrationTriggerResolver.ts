import {
  resolveCompetitiveCelebration,
} from "@/components/live/competitiveexperience/celebrations/CompetitiveCelebrations";

import type {
  CompetitiveOrchestratorEvent,
} from "../types/CompetitiveOrchestratorTypes";

export function resolveCelebrationTrigger(
  event: CompetitiveOrchestratorEvent | null,
) {
  if(!event){
    return {
      event:null,
      celebration:null,
    };
  }

  return {
    event,

    celebration:
      resolveCompetitiveCelebration(
        event.type,
      ),
  };
}

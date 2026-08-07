import type {
  CompetitiveOrchestratorEvent,
} from "../types/CompetitiveOrchestratorTypes";

export function resolveCompetitiveEventPriority(
  events: CompetitiveOrchestratorEvent[],
) {
  return [...events]
    .sort(
      (a,b) => {
        if(
          b.priority !==
          a.priority
        ){
          return (
            b.priority -
            a.priority
          );
        }

        return (
          b.createdAt -
          a.createdAt
        );
      },
    );
}

export function selectPrimaryCompetitiveEvent(
  events: CompetitiveOrchestratorEvent[],
) {
  return (
    resolveCompetitiveEventPriority(
      events,
    )[0] ?? null
  );
}

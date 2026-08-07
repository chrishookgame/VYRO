import type {
  LiveCompetitiveEvent,
} from "../types/LiveCompetitiveTypes";

export function createCompetitiveEventFeed(
  events: LiveCompetitiveEvent[],
  limit: number,
) {
  const safeLimit =
    Math.max(
      0,
      Math.floor(
        limit,
      ),
    );

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
    )
    .slice(
      0,
      safeLimit,
    );
}

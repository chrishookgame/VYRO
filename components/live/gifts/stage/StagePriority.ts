import type {
  StageEvent,
  StagePriorityLevel,
} from "./types";

const stagePriorityWeights: Record<
  StagePriorityLevel,
  number
> = {
  low: 10,
  normal: 20,
  high: 30,
  critical: 40,
};

export function getStagePriorityWeight(
  priority: StagePriorityLevel,
): number {
  return stagePriorityWeights[priority];
}

export function sortStageEventsByPriority(
  events: StageEvent[],
): StageEvent[] {
  return [...events].sort(
    (
      firstEvent,
      secondEvent,
    ) => {
      const priorityDifference =
        getStagePriorityWeight(
          secondEvent.priority,
        ) -
        getStagePriorityWeight(
          firstEvent.priority,
        );

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        firstEvent.createdAt -
        secondEvent.createdAt
      );
    },
  );
}

export function canInterruptStageEvent(
  activeEvent: StageEvent | null,
  incomingEvent: StageEvent,
): boolean {
  if (!activeEvent) {
    return false;
  }

  if (!activeEvent.interruptible) {
    return false;
  }

  return (
    getStagePriorityWeight(
      incomingEvent.priority,
    ) >
    getStagePriorityWeight(
      activeEvent.priority,
    )
  );
}

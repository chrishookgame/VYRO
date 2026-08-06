import type {
  AnimationPriority,
  AnimationQueueItem,
} from "./types";

const priorityWeights: Record<
  AnimationPriority,
  number
> = {
  normal: 10,
  rare: 20,
  epic: 30,
  legendary: 40,
  mythic: 50,
};

export function getAnimationPriorityWeight(
  priority: AnimationPriority,
): number {
  return priorityWeights[priority];
}

export function sortAnimationsByPriority(
  queue: AnimationQueueItem[],
): AnimationQueueItem[] {
  return [...queue].sort(
    (
      firstItem,
      secondItem,
    ) => {
      const priorityDifference =
        getAnimationPriorityWeight(
          secondItem.priority,
        ) -
        getAnimationPriorityWeight(
          firstItem.priority,
        );

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        firstItem.createdAt -
        secondItem.createdAt
      );
    },
  );
}

export function shouldInterruptAnimation(
  current: AnimationQueueItem | null,
  incoming: AnimationQueueItem,
): boolean {
  if (!current) {
    return false;
  }

  return (
    getAnimationPriorityWeight(
      incoming.priority,
    ) >
    getAnimationPriorityWeight(
      current.priority,
    )
  );
}

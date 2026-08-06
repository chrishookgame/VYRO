import type {
  AnimationQueueItem,
  QueueOperationResult,
} from "./types";

export function enqueueAnimation(
  queue: AnimationQueueItem[],
  item: AnimationQueueItem,
): {
  queue: AnimationQueueItem[];
  result: QueueOperationResult;
} {
  const alreadyExists =
    queue.some(
      (queueItem) =>
        queueItem.id === item.id,
    );

  if (alreadyExists) {
    return {
      queue,
      result: {
        success: false,
        queueLength: queue.length,
      },
    };
  }

  const nextQueue = [
    ...queue,
    item,
  ];

  return {
    queue: nextQueue,
    result: {
      success: true,
      queueLength: nextQueue.length,
    },
  };
}

export function dequeueAnimation(
  queue: AnimationQueueItem[],
): {
  item: AnimationQueueItem | null;
  queue: AnimationQueueItem[];
} {
  const [
    firstItem,
    ...remainingQueue
  ] = queue;

  return {
    item: firstItem ?? null,
    queue: remainingQueue,
  };
}

export function removeAnimation(
  queue: AnimationQueueItem[],
  animationId: string,
): {
  queue: AnimationQueueItem[];
  result: QueueOperationResult;
} {
  const nextQueue =
    queue.filter(
      (item) =>
        item.id !== animationId,
    );

  return {
    queue: nextQueue,
    result: {
      success:
        nextQueue.length !==
        queue.length,
      queueLength:
        nextQueue.length,
    },
  };
}

export function clearAnimationQueue(): {
  queue: AnimationQueueItem[];
  result: QueueOperationResult;
} {
  return {
    queue: [],
    result: {
      success: true,
      queueLength: 0,
    },
  };
}

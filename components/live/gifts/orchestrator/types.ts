export type AnimationPriority =
  | "normal"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export interface AnimationQueueItem {

  id: string;

  animationKey: string;

  priority: AnimationPriority;

  createdAt: number;

  durationMs: number;

}

export interface AnimationOrchestratorState {

  current:
    | AnimationQueueItem
    | null;

  queue:
    AnimationQueueItem[];

  playing: boolean;

}

export interface QueueOperationResult {

  success: boolean;

  queueLength: number;

}

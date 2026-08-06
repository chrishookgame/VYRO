"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  LiveGiftOverlayItem,
} from "@/hooks";

import {
  AnimationEngine,
  getGiftAnimationConfiguration,
} from "../animations";

import {
  getAnimationPriorityWeight,
} from "./PriorityManager";

import type {
  AnimationPriority,
  AnimationQueueItem,
} from "./types";

interface AnimationOrchestratorProps {
  gift: LiveGiftOverlayItem | null;
}

interface OrchestratedGift {
  gift: LiveGiftOverlayItem;
  queueItem: AnimationQueueItem;
}

interface OrchestratorState {
  active: OrchestratedGift | null;
  queue: OrchestratedGift[];
}

function mapGiftPriority(
  gift: LiveGiftOverlayItem,
): AnimationPriority {
  if (gift.rarity === "mythic") {
    return "mythic";
  }

  if (gift.rarity === "legendary") {
    return "legendary";
  }

  if (gift.rarity === "epic") {
    return "epic";
  }

  if (gift.rarity === "rare") {
    return "rare";
  }

  return "normal";
}

function createOrchestratedGift(
  gift: LiveGiftOverlayItem,
): OrchestratedGift {
  const configuration =
    getGiftAnimationConfiguration(
      gift.animationKey,
    );

  return {
    gift,
    queueItem: {
      id: gift.id,
      animationKey: gift.animationKey,
      priority: mapGiftPriority(gift),
      createdAt: Date.now(),
      durationMs:
        configuration.durationMs,
    },
  };
}

function sortOrchestratedGifts(
  queue: OrchestratedGift[],
): OrchestratedGift[] {
  return [...queue].sort(
    (
      firstEntry,
      secondEntry,
    ) => {
      const priorityDifference =
        getAnimationPriorityWeight(
          secondEntry.queueItem.priority,
        ) -
        getAnimationPriorityWeight(
          firstEntry.queueItem.priority,
        );

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        firstEntry.queueItem.createdAt -
        secondEntry.queueItem.createdAt
      );
    },
  );
}

function containsGift(
  state: OrchestratorState,
  giftId: string,
): boolean {
  if (
    state.active?.gift.id === giftId
  ) {
    return true;
  }

  return state.queue.some(
    (entry) =>
      entry.gift.id === giftId,
  );
}

export default function AnimationOrchestrator({
  gift,
}: AnimationOrchestratorProps) {
  const [
    orchestratorState,
    setOrchestratorState,
  ] = useState<OrchestratorState>({
    active: null,
    queue: [],
  });

  useEffect(() => {
    if (!gift) {
      return;
    }

    setOrchestratorState(
      (currentState) => {
        if (
          containsGift(
            currentState,
            gift.id,
          )
        ) {
          return currentState;
        }

        const incoming =
          createOrchestratedGift(gift);

        if (!currentState.active) {
          return {
            active: incoming,
            queue: currentState.queue,
          };
        }

        const incomingWeight =
          getAnimationPriorityWeight(
            incoming.queueItem.priority,
          );

        const activeWeight =
          getAnimationPriorityWeight(
            currentState.active.queueItem
              .priority,
          );

        if (
          incomingWeight >
          activeWeight
        ) {
          return {
            active: incoming,
            queue:
              sortOrchestratedGifts([
                ...currentState.queue,
                currentState.active,
              ]),
          };
        }

        return {
          active: currentState.active,
          queue:
            sortOrchestratedGifts([
              ...currentState.queue,
              incoming,
            ]),
        };
      },
    );
  }, [gift]);

  useEffect(() => {
    const active =
      orchestratorState.active;

    if (!active) {
      return;
    }

    const timeout =
      window.setTimeout(
        () => {
          setOrchestratorState(
            (currentState) => {
              const [
                nextGift,
                ...remainingQueue
              ] = currentState.queue;

              return {
                active:
                  nextGift ?? null,
                queue:
                  remainingQueue,
              };
            },
          );
        },
        active.queueItem.durationMs,
      );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [orchestratorState.active]);

  return (
    <div
      data-vyro-animation-queue={
        orchestratorState.queue.length
      }
    >
      <AnimationEngine
        gift={
          orchestratorState.active?.gift ??
          null
        }
      />
    </div>
  );
}

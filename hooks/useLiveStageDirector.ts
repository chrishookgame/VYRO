"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  LiveGiftOverlayItem,
} from "./useLiveGiftOverlay";

import {
  completeActiveStageEvent,
  createStageDirectorState,
  getGiftAnimationConfiguration,
  submitStageEvent,
  type GiftComboState,
  type StageDirectorState,
  type StageEvent,
  type StagePriorityLevel,
} from "@/components/live/gifts";

export interface LiveStageGiftPayload {
  kind: "gift";
  gift: LiveGiftOverlayItem;
}

export interface LiveStageComboPayload {
  kind: "combo";
  combo: GiftComboState;
}

export type LiveStagePayload =
  | LiveStageGiftPayload
  | LiveStageComboPayload;

export interface UseLiveStageDirectorResult {
  activeEvent: StageEvent | null;
  activeGift: LiveGiftOverlayItem | null;
  activeCombo: GiftComboState | null;
  queueLength: number;
  locked: boolean;
}

function mapGiftPriority(
  gift: LiveGiftOverlayItem,
): StagePriorityLevel {
  if (gift.rarity === "mythic") {
    return "critical";
  }

  if (gift.rarity === "legendary") {
    return "high";
  }

  if (
    gift.rarity === "epic" ||
    gift.rarity === "rare"
  ) {
    return "normal";
  }

  return "low";
}

function mapComboPriority(
  combo: GiftComboState,
): StagePriorityLevel {
  if (
    combo.tier === "mythic" ||
    combo.tier === "ultra"
  ) {
    return "critical";
  }

  if (
    combo.tier === "mega" ||
    combo.tier === "super"
  ) {
    return "high";
  }

  if (combo.tier === "boost") {
    return "normal";
  }

  return "low";
}

function getComboStageDuration(
  combo: GiftComboState,
): number {
  if (combo.tier === "mythic") {
    return 3200;
  }

  if (combo.tier === "ultra") {
    return 2800;
  }

  if (combo.tier === "mega") {
    return 2400;
  }

  if (combo.tier === "super") {
    return 2200;
  }

  return 1800;
}

function createGiftStageEvent(
  gift: LiveGiftOverlayItem,
): StageEvent {
  const configuration =
    getGiftAnimationConfiguration(
      gift.animationKey,
    );

  const payload: LiveStageGiftPayload = {
    kind: "gift",
    gift,
  };

  return {
    id: `gift:${gift.id}`,
    type: "gift",
    priority: mapGiftPriority(gift),
    createdAt: Date.now(),
    durationMs:
      configuration.durationMs,
    interruptible:
      gift.rarity !== "mythic",
    payload,
  };
}

function createComboStageEvent(
  combo: GiftComboState,
): StageEvent {
  const payload: LiveStageComboPayload = {
    kind: "combo",
    combo,
  };

  return {
    id:
      `combo:${combo.comboKey}:${combo.count}`,
    type: "combo",
    priority: mapComboPriority(combo),
    createdAt: combo.updatedAt,
    durationMs:
      getComboStageDuration(combo),
    interruptible:
      combo.tier !== "mythic",
    payload,
  };
}

function readStagePayload(
  event: StageEvent | null,
): LiveStagePayload | null {
  if (!event) {
    return null;
  }

  const payload =
    event.payload as Partial<LiveStagePayload>;

  if (
    payload.kind === "gift" &&
    "gift" in payload
  ) {
    return payload as LiveStageGiftPayload;
  }

  if (
    payload.kind === "combo" &&
    "combo" in payload
  ) {
    return payload as LiveStageComboPayload;
  }

  return null;
}

export function useLiveStageDirector(
  gift: LiveGiftOverlayItem | null,
  combo: GiftComboState | null,
): UseLiveStageDirectorResult {
  const [
    directorState,
    setDirectorState,
  ] = useState<StageDirectorState>(
    createStageDirectorState,
  );

  useEffect(() => {
    if (!gift) {
      return;
    }

    setDirectorState(
      (currentState) =>
        submitStageEvent(
          currentState,
          createGiftStageEvent(gift),
        ).state,
    );
  }, [gift]);

  useEffect(() => {
    if (!combo || combo.count < 2) {
      return;
    }

    setDirectorState(
      (currentState) =>
        submitStageEvent(
          currentState,
          createComboStageEvent(combo),
        ).state,
    );
  }, [combo]);

  useEffect(() => {
    const activeEvent =
      directorState.activeEvent;

    if (!activeEvent) {
      return;
    }

    const timeout =
      window.setTimeout(
        () => {
          setDirectorState(
            (currentState) =>
              completeActiveStageEvent(
                currentState,
              ),
          );
        },
        Math.max(
          activeEvent.durationMs,
          0,
        ),
      );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [directorState.activeEvent]);

  const activePayload = useMemo(
    () =>
      readStagePayload(
        directorState.activeEvent,
      ),
    [directorState.activeEvent],
  );

  return {
    activeEvent:
      directorState.activeEvent,

    activeGift:
      activePayload?.kind === "gift"
        ? activePayload.gift
        : null,

    activeCombo:
      activePayload?.kind === "combo"
        ? activePayload.combo
        : null,

    queueLength:
      directorState.queue.length,

    locked:
      directorState.locked,
  };
}

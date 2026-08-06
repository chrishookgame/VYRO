"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  LiveGiftOverlayItem,
} from "@/hooks";

import {
  createGiftComboEngineState,
  processGiftCombo,
  removeExpiredGiftCombos,
  type GiftComboEngineState,
  type GiftComboState,
} from "@/components/live/gifts/combo";

export interface UseGiftComboEngineResult {
  activeCombo: GiftComboState | null;
  comboCount: number;
  engineState: GiftComboEngineState;
  clearCombos: () => void;
}

function selectMostRecentCombo(
  state: GiftComboEngineState,
): GiftComboState | null {
  return (
    Object.values(state.combos)
      .sort(
        (
          firstCombo,
          secondCombo,
        ) =>
          secondCombo.updatedAt -
          firstCombo.updatedAt,
      )[0] ??
    null
  );
}

export function useGiftComboEngine(
  gift: LiveGiftOverlayItem | null,
): UseGiftComboEngineResult {
  const [
    engineState,
    setEngineState,
  ] = useState<GiftComboEngineState>(
    createGiftComboEngineState,
  );

  useEffect(() => {
    if (!gift) {
      return;
    }

    setEngineState(
      (currentState) =>
        processGiftCombo(
          currentState,
          gift,
        ).state,
    );
  }, [gift]);

  useEffect(() => {
    const interval =
      window.setInterval(
        () => {
          setEngineState(
            (currentState) =>
              removeExpiredGiftCombos(
                currentState,
              ),
          );
        },
        500,
      );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const activeCombo = useMemo(
    () =>
      selectMostRecentCombo(
        engineState,
      ),
    [engineState],
  );

  function clearCombos() {
    setEngineState(
      createGiftComboEngineState(),
    );
  }

  return {
    activeCombo,
    comboCount:
      Object.keys(
        engineState.combos,
      ).length,
    engineState,
    clearCombos,
  };
}

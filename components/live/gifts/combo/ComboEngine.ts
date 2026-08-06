import type {
  LiveGiftOverlayItem,
} from "@/hooks";

import {
  updateGiftCombo,
} from "./ComboManager";

import {
  defaultGiftComboConfiguration,
  isGiftComboExpired,
} from "./ComboTimer";

import type {
  GiftComboConfiguration,
  GiftComboState,
  GiftComboUpdateResult,
} from "./types";

export interface GiftComboEngineState {
  combos: Record<
    string,
    GiftComboState
  >;
}

export function createGiftComboEngineState(): GiftComboEngineState {
  return {
    combos: {},
  };
}

export function processGiftCombo(
  state: GiftComboEngineState,
  gift: LiveGiftOverlayItem,
  configuration: GiftComboConfiguration =
    defaultGiftComboConfiguration,
  currentTime = Date.now(),
): {
  state: GiftComboEngineState;
  result: GiftComboUpdateResult;
} {
  const comboKey = [
    gift.senderId ?? "anonymous",
    gift.code,
  ].join(":");

  const currentCombo =
    state.combos[comboKey] ??
    null;

  const result =
    updateGiftCombo(
      currentCombo,
      gift,
      configuration,
      currentTime,
    );

  return {
    state: {
      combos: {
        ...state.combos,
        [comboKey]: result.combo,
      },
    },
    result,
  };
}

export function removeExpiredGiftCombos(
  state: GiftComboEngineState,
  currentTime = Date.now(),
): GiftComboEngineState {
  const activeEntries =
    Object.entries(
      state.combos,
    ).filter(
      ([, combo]) =>
        !isGiftComboExpired(
          combo,
          currentTime,
        ),
    );

  return {
    combos:
      Object.fromEntries(
        activeEntries,
      ),
  };
}

export function clearGiftComboEngine(): GiftComboEngineState {
  return createGiftComboEngineState();
}

"use client";

import {
  useMemo,
} from "react";

import {
  createGiftComboDirectorState,
} from "@/components/live/gifts/combo/director/GiftComboDirector";

import type {
  GiftComboEngineState,
} from "@/components/live/gifts/combo/ComboEngine";

export function useGiftComboDirector(
  engineState:GiftComboEngineState,
){
  return useMemo(
    () =>
      createGiftComboDirectorState(
        Object.values(
          engineState.combos,
        ),
      ),
    [
      engineState,
    ],
  );
}

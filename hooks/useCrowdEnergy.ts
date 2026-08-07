"use client";

import {
  useMemo,
} from "react";

import {
  createCrowdState,
} from "@/components/live/crowd/CrowdEnergyEngine";

import type {
  VyroBattleCrowdInput,
} from "@/components/live/crowd/types";

export function useCrowdEnergy(
  input: VyroBattleCrowdInput,
) {
  return useMemo(
    () =>
      createCrowdState(
        input,
      ),
    [input],
  );
}

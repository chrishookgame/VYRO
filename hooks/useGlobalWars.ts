"use client";

import {
  useMemo,
} from "react";

import {
  createGlobalWarState,
} from "@/components/live/wars/WarEngine";

import type {
  VyroWar,
} from "@/components/live/wars/types";

export function useGlobalWars(
  wars: VyroWar[],
) {
  return useMemo(
    () =>
      createGlobalWarState(
        wars,
      ),
    [wars],
  );
}

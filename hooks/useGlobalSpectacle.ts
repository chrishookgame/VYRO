"use client";

import {
  useMemo,
} from "react";

import {
  createGlobalSpectacleState,
  type GlobalSpectacleInput,
} from "@/components/live/spectacle/GlobalSpectacleEngine";

export function useGlobalSpectacle(
  input:GlobalSpectacleInput,
){
  return useMemo(
    () =>
      createGlobalSpectacleState(
        input,
      ),
    [
      input,
    ],
  );
}

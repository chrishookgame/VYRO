"use client";

import {
  useMemo,
} from "react";

import {
  createUniverseEngineState,
  type UniverseEngineInput,
} from "@/components/live/universe/UniverseEngine";

export function useUniverseEngine(
  input:UniverseEngineInput,
){
  return useMemo(
    () =>
      createUniverseEngineState(
        input,
      ),
    [
      input,
    ],
  );
}

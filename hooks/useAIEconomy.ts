"use client";

import {
  useMemo,
} from "react";

import {
  createGlobalAIEconomyState,
  type AIEconomyInput,
} from "@/components/live/economy/ai/GlobalAIEconomyEngine";

export function useAIEconomy(
  input:AIEconomyInput,
){
  return useMemo(
    () =>
      createGlobalAIEconomyState(
        input,
      ),
    [
      input,
    ],
  );
}

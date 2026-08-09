"use client";

import {
  useMemo,
} from "react";

import {
  createGlobalCompetitiveEcosystem,
  type GlobalCompetitiveEcosystemInput,
} from "@/components/live/ecosystem/GlobalCompetitiveEcosystem";

export function useGlobalCompetitiveEcosystem(
  input: GlobalCompetitiveEcosystemInput,
) {
  return useMemo(
    () =>
      createGlobalCompetitiveEcosystem(
        input,
      ),
    [
      input,
    ],
  );
}

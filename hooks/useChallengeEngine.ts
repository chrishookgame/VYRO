"use client";

import {
  useMemo,
} from "react";

import {
  createChallengeState,
} from "@/components/live/challenges/ChallengeEngine";

import type {
  VyroChallenge,
} from "@/components/live/challenges/types";

export function useChallengeEngine(
  challenges: VyroChallenge[],
) {
  return useMemo(
    () =>
      createChallengeState(
        challenges,
      ),
    [challenges],
  );
}

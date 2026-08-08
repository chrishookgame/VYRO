"use client";

import {
  useMemo,
} from "react";

import {
  createAIGiftIntelligence,
} from "@/components/live/gifts/intelligence/AIGiftIntelligenceEngine";

import type {
  LiveGiftOverlayItem,
} from "@/hooks/useLiveGiftOverlay";

export function useAIGiftIntelligence(
  gift:LiveGiftOverlayItem | null,
  queuedGifts:number,
){
  return useMemo(
    () =>
      gift
        ? createAIGiftIntelligence(
            gift,
            queuedGifts,
          )
        : null,
    [
      gift,
      queuedGifts,
    ],
  );
}

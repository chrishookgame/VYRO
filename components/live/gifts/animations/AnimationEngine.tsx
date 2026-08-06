"use client";

import type {
  LiveGiftOverlayItem,
} from "@/hooks";

import AnimationRenderer from "./AnimationRenderer";

interface AnimationEngineProps {
  gift: LiveGiftOverlayItem | null;
}

export default function AnimationEngine({
  gift,
}: AnimationEngineProps) {
  if (!gift) {
    return null;
  }

  return (
    <AnimationRenderer gift={gift} />
  );
}

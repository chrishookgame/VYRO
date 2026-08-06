"use client";

import type {
  LiveGiftOverlayItem,
} from "@/hooks";

import {
  renderGiftAnimation,
} from "./AnimationRegistry";

interface AnimationRendererProps {
  gift: LiveGiftOverlayItem;
}

export default function AnimationRenderer({
  gift,
}: AnimationRendererProps) {
  return renderGiftAnimation(
    gift.animationKey,
    {
      gift,
    },
  );
}

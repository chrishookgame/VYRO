import type {
  ComponentType,
} from "react";

import type {
  LiveGiftOverlayItem,
} from "@/hooks";

export interface GiftAnimationComponentProps {
  gift: LiveGiftOverlayItem;
}

export type GiftAnimationComponent =
  ComponentType<GiftAnimationComponentProps>;

export interface AnimationRegistryEntry {
  component: GiftAnimationComponent;
  soundKey: string;
}

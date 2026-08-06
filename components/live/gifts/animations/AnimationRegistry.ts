import {
  createElement,
  type ReactElement,
} from "react";

import {
  DefaultGiftAnimation,
  DiamondAnimation,
  HeartAnimation,
  RoseAnimation,
} from "./basic";
import type {
  GiftAnimationComponent,
  GiftAnimationComponentProps,
} from "./types";

export const animationRegistry: Record<
  string,
  GiftAnimationComponent
> = {
  rose: RoseAnimation,
  heart: HeartAnimation,
  diamond: DiamondAnimation,
};

export function renderGiftAnimation(
  animationKey: string,
  props: GiftAnimationComponentProps,
): ReactElement {
  const AnimationComponent =
    animationRegistry[animationKey] ??
    DefaultGiftAnimation;

  return createElement(
    AnimationComponent,
    props,
  );
}

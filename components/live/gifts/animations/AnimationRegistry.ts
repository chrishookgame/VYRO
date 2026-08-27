import {
  createElement,
  type ReactElement,
} from "react";

import {
  DefaultGiftAnimation,
  DiamondAnimation,
  HeartAnimation,
  PhoenixAnimation,
  RoseAnimation,
} from "./basic";

import type {
  GiftAnimationComponent,
  GiftAnimationComponentProps,
} from "./types";

import {
  CrownAnimation,
  DragonAnimation,
  GoldenPalaceAnimation,
} from "./premium";

import {
  GalaxyAnimation,
  SpaceShuttleAnimation,
  VyroUniverseAnimation,
} from "./legendary";

export const animationRegistry: Record<
  string,
  GiftAnimationComponent
> = {
  rose: RoseAnimation,
  eternal_rose: RoseAnimation,
  heart: HeartAnimation,
  love_letter: HeartAnimation,
  diamond: DiamondAnimation,
  phoenix: PhoenixAnimation,
  galaxy: GalaxyAnimation,
  vyro_galaxy: GalaxyAnimation,
  crown: CrownAnimation,

  dragon: DragonAnimation,
  golden_palace: GoldenPalaceAnimation,
  space_shuttle: SpaceShuttleAnimation,

  universe: VyroUniverseAnimation,
  vyro_universe: VyroUniverseAnimation,
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
import {
  commonGiftConfigurations,
  defaultGiftConfiguration,
} from "./common";
import {
  premiumGiftConfigurations,
} from "./premium";
import {
  extendedGiftConfigurations,
} from "./effects";
import type {
  GiftAnimationConfiguration,
} from "./types";

export const giftAnimationConfigurations: Record<
  string,
  GiftAnimationConfiguration
> = {
  ...commonGiftConfigurations,
  ...premiumGiftConfigurations,
  ...extendedGiftConfigurations,
};

export function getGiftAnimationConfiguration(
  animationKey: string,
): GiftAnimationConfiguration {
  return (
    giftAnimationConfigurations[
      animationKey
    ] ??
    {
      ...defaultGiftConfiguration,
      animationKey,
    }
  );
}

export * from "./types";
export * from "./common";
export * from "./premium";
export * from "./effects";
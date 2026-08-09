export const VYRO_LIVE_VISUAL_LAYER = {
  competitiveAmbient: 35,
  competitiveOverlay: 40,

  supportingMoment: 50,
  presentationSurface: 55,

  championMoment: 60,
  worldChampionMoment: 70,

  universeOverlay: 74,
  giftOverlay: 75,
  orchestratorBase:52,
  orchestratorOverlay: 76,

  giftAnimation: 90,
  giftComboOverlay: 95,
  giftComboEffect: 96,
  giftComboBurst: 97,

  battleVS: 100,
  battleCelebrationFX: 105,
  battleWinner: 110,
} as const;

export type VyroLiveVisualLayer =
  keyof typeof VYRO_LIVE_VISUAL_LAYER;

export function getVyroLiveVisualLayer(
  layer: VyroLiveVisualLayer,
): number {
  return VYRO_LIVE_VISUAL_LAYER[layer];
}

export function isHigherVisualLayer(
  candidate: VyroLiveVisualLayer,
  current: VyroLiveVisualLayer,
): boolean {
  return (
    VYRO_LIVE_VISUAL_LAYER[candidate] >
    VYRO_LIVE_VISUAL_LAYER[current]
  );
}

export function compareVisualLayers(
  left: VyroLiveVisualLayer,
  right: VyroLiveVisualLayer,
): number {
  return (
    VYRO_LIVE_VISUAL_LAYER[right] -
    VYRO_LIVE_VISUAL_LAYER[left]
  );
}
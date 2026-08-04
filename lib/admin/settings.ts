export type PlatformSettings = {
  liveCommission: number;
  marketplaceCommission: number;
  referralBonus: number;
  academyReward: number;
  minimumWithdraw: number;
};

export const defaultPlatformSettings: PlatformSettings = {
  liveCommission: 20,
  marketplaceCommission: 10,
  referralBonus: 5,
  academyReward: 100,
  minimumWithdraw: 50,
};

let currentSettings: PlatformSettings = {
  ...defaultPlatformSettings,
};

export function getPlatformSettings(): PlatformSettings {
  return currentSettings;
}

export function updatePlatformSettings(
  settings: Partial<PlatformSettings>,
): PlatformSettings {

  currentSettings = {
    ...currentSettings,
    ...settings,
  };

  return currentSettings;
}

export function resetPlatformSettings(): PlatformSettings {

  currentSettings = {
    ...defaultPlatformSettings,
  };

  return currentSettings;
}

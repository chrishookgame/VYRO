import type {
  EnergyConfiguration,
  EnergyEvent,
  EnergyLevel,
} from "./energy.types";

export class EnergyCoreService {

  getLevel(energy: number): EnergyLevel {

    if (energy >= 1000) return "overdrive";
    if (energy >= 750) return "hyper";
    if (energy >= 500) return "electric";
    if (energy >= 250) return "rising";

    return "dormant";
  }

  calculateProgress(
    energy: number,
    maxEnergy: number,
  ): number {

    if (maxEnergy <= 0) return 0;

    return Math.min(
      100,
      Math.round((energy / maxEnergy) * 100),
    );
  }

  async registerEvent(
    event: EnergyEvent,
  ): Promise<void> {

    void event;
  }

  getDefaultConfiguration(): EnergyConfiguration {

    return {
      maxEnergy: 1000,
      overdriveThreshold: 1000,
      comboWindowSeconds: 15,
      comboMultiplier: 2,
    };
  }

}

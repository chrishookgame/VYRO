export type EnergyLevel =
  | "dormant"
  | "rising"
  | "electric"
  | "hyper"
  | "overdrive";

export interface EnergyEvent {
  id: string;
  room_id: string;
  energy_before: number;
  energy_after: number;
  source:
    | "reaction"
    | "gift"
    | "chat"
    | "system";
  created_at: string;
}

export interface EnergyConfiguration {
  maxEnergy: number;
  overdriveThreshold: number;
  comboWindowSeconds: number;
  comboMultiplier: number;
}

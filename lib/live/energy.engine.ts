export interface EnergySnapshot {
  roomId: string;
  currentEnergy: number;
  maxEnergy: number;
  level: "dormant" | "rising" | "electric" | "hyper" | "overdrive";
  progress: number;
  combo: number;
  multiplier: number;
}

export interface EnergyContribution {
  type: "reaction" | "gift" | "chat" | "system";
  value: number;
}

export class EnergyEngine {

  private snapshot: EnergySnapshot = {
    roomId: "",
    currentEnergy: 0,
    maxEnergy: 1000,
    level: "dormant",
    progress: 0,
    combo: 0,
    multiplier: 1,
  };

  initialize(roomId: string) {
    this.snapshot.roomId = roomId;
  }

  add(contribution: EnergyContribution) {

    this.snapshot.currentEnergy += contribution.value;

    if (this.snapshot.currentEnergy > this.snapshot.maxEnergy) {
      this.snapshot.currentEnergy = this.snapshot.maxEnergy;
    }

    this.snapshot.progress =
      Math.round(
        (this.snapshot.currentEnergy /
          this.snapshot.maxEnergy) * 100,
      );

    if (this.snapshot.progress >= 100)
      this.snapshot.level = "overdrive";
    else if (this.snapshot.progress >= 75)
      this.snapshot.level = "hyper";
    else if (this.snapshot.progress >= 50)
      this.snapshot.level = "electric";
    else if (this.snapshot.progress >= 25)
      this.snapshot.level = "rising";
    else
      this.snapshot.level = "dormant";

    return this.snapshot;
  }

  reset() {

    this.snapshot.currentEnergy = 0;
    this.snapshot.progress = 0;
    this.snapshot.combo = 0;
    this.snapshot.multiplier = 1;
    this.snapshot.level = "dormant";

  }

  getSnapshot() {
    return this.snapshot;
  }

}

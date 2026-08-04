import type {
  EnergyCoreState,
  LiveReaction,
  LiveViewer,
} from "./types";

export class LiveEngineService {

  async getViewers(): Promise<LiveViewer[]> {
    return [];
  }

  async getReactions(): Promise<LiveReaction[]> {
    return [];
  }

  async getEnergyCore(): Promise<EnergyCoreState | null> {
    return null;
  }

}

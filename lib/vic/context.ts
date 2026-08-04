import type { VICModule } from "./core";

export type VICContext = {
  module: VICModule;
  language: string;
  platform: "vyro";
  version: string;
};

export type VICContextOptions = {
  module: VICModule;
};

export function buildVICContext({
  module,
}: VICContextOptions): VICContext {
  return {
    module,
    language: "es",
    platform: "vyro",
    version: "3090",
  };
}
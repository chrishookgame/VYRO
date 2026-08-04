import type { VICModule } from "./core";
import { getVICModule } from "./modules";

export type VICCapabilityCheck = {
  module: VICModule;
  capability: string;
};

export function getVICCapabilities(
  module: VICModule,
): string[] {
  return [...getVICModule(module).capabilities];
}

export function hasVICCapability({
  module,
  capability,
}: VICCapabilityCheck): boolean {
  const normalizedCapability =
    capability.trim().toLowerCase();

  if (!normalizedCapability) {
    return false;
  }

  return getVICModule(module).capabilities.some(
    (registeredCapability) =>
      registeredCapability.toLowerCase() ===
      normalizedCapability,
  );
}

export function assertVICCapability({
  module,
  capability,
}: VICCapabilityCheck): void {
  if (
    hasVICCapability({
      module,
      capability,
    })
  ) {
    return;
  }

  throw new Error(
    `El módulo "${module}" no tiene registrada la capacidad "${capability}".`,
  );
}
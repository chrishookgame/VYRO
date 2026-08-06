export type FusionEventKind =
  | "gift"
  | "combo"
  | "stage";

export type FusionIntensity =
  | "low"
  | "medium"
  | "high"
  | "extreme";

export interface FusionSourceEvent {
  id: string;
  kind: FusionEventKind;
  fusionKey: string;
  createdAt: number;
  amount: number;
  energy: number;
  senderId: string | null;
  payload: unknown;
}

export interface FusedEvent {
  id: string;
  fusionKey: string;
  kind: FusionEventKind;
  sourceEventIds: string[];
  senderIds: string[];
  count: number;
  totalAmount: number;
  totalEnergy: number;
  intensity: FusionIntensity;
  startedAt: number;
  updatedAt: number;
  expiresAt: number;
  payloads: unknown[];
}

export interface FusionConfiguration {
  windowMs: number;
  maximumEvents: number;
}

export interface FusionUpdateResult {
  fusedEvent: FusedEvent;
  created: boolean;
  upgraded: boolean;
}

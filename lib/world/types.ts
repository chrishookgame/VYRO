export type WorldEventType =
  | "holiday"
  | "vyro"
  | "birthday"
  | "campaign"
  | "special";

export interface WorldEvent {
  id: string;
  title: string;
  description: string;
  type: WorldEventType;
  startsAt: string;
  endsAt: string;
  enabled: boolean;
}

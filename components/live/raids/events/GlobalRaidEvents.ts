export interface GlobalRaidEvent {
  id: string;

  bossId: string;

  title: string;

  active: boolean;

  participants: number;

  startedAt: number;

  endsAt: number;
}

export function getGlobalRaidEventStatus(
  event: GlobalRaidEvent,
  now: number,
) {
  if (!event.active) {
    return "INACTIVE";
  }

  if (now < event.startedAt) {
    return "UPCOMING";
  }

  if (now >= event.endsAt) {
    return "FINISHED";
  }

  return "LIVE";
}

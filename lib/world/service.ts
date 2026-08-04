import type { WorldEvent } from "./types";

export class WorldEngine {

  private events: WorldEvent[] = [];

  getEvents(): WorldEvent[] {
    return this.events;
  }

  addEvent(event: WorldEvent): void {
    this.events.push(event);
  }

  getActiveEvents(now: Date = new Date()): WorldEvent[] {
    return this.events.filter(event => {
      const start = new Date(event.startsAt);
      const end = new Date(event.endsAt);
      return event.enabled && start <= now && end >= now;
    });
  }

}

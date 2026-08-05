import type { PlatformMoment } from "./types";

export interface MomentContext {
  locale: string;
  country?: string;
  liveCategory?: string;
  now?: Date;
}

export class PlatformMomentEngine {
  isActive(
    moment: PlatformMoment,
    context: MomentContext,
  ): boolean {
    if (!moment.enabled) {
      return false;
    }

    const now = context.now ?? new Date();
    const startsAt = moment.starts_at
      ? new Date(moment.starts_at)
      : null;
    const endsAt = moment.ends_at
      ? new Date(moment.ends_at)
      : null;

    if (startsAt && startsAt > now) {
      return false;
    }

    if (endsAt && endsAt < now) {
      return false;
    }

    if (
      moment.countries.length > 0 &&
      (
        !context.country ||
        !moment.countries.includes(context.country)
      )
    ) {
      return false;
    }

    if (
      moment.live_categories.length > 0 &&
      (
        !context.liveCategory ||
        !moment.live_categories.includes(context.liveCategory)
      )
    ) {
      return false;
    }

    return (
      moment.locale === context.locale ||
      moment.locale === "all"
    );
  }

  selectMoment(
    moments: PlatformMoment[],
    context: MomentContext,
  ): PlatformMoment | null {
    return (
      moments
        .filter((moment) => this.isActive(moment, context))
        .sort((a, b) => b.priority - a.priority)[0] ?? null
    );
  }
}

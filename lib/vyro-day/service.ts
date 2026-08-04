import type {
  VyroDayProfile,
  VyroDayStatus,
} from "./types";

const DAY_IN_MS = 86_400_000;

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getCalendarDate(date: Date, timezone: string): CalendarDate {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const values = Object.fromEntries(
      parts
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    );

    return {
      year: values.year,
      month: values.month,
      day: values.day,
    };
  } catch {
    return getCalendarDate(date, "UTC");
  }
}

function parseBirthDate(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    year < 1900 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return { year, month, day };
}

function normalizeBirthday(
  birthDate: CalendarDate,
  targetYear: number,
): CalendarDate {
  if (
    birthDate.month === 2 &&
    birthDate.day === 29 &&
    !isLeapYear(targetYear)
  ) {
    return {
      year: targetYear,
      month: 2,
      day: 28,
    };
  }

  return {
    year: targetYear,
    month: birthDate.month,
    day: birthDate.day,
  };
}

function toUtcTimestamp(value: CalendarDate): number {
  return Date.UTC(value.year, value.month - 1, value.day);
}

export class VyroDayEngine {
  getStatus(
    profile: VyroDayProfile,
    now: Date = new Date(),
  ): VyroDayStatus | null {
    if (!profile.birthDate) {
      return null;
    }

    const birthDate = parseBirthDate(profile.birthDate);

    if (!birthDate) {
      return null;
    }

    const today = getCalendarDate(now, profile.timezone || "UTC");
    let nextBirthday = normalizeBirthday(birthDate, today.year);

    const todayTimestamp = toUtcTimestamp(today);
    let birthdayTimestamp = toUtcTimestamp(nextBirthday);

    const isBirthday =
      today.month === nextBirthday.month &&
      today.day === nextBirthday.day;

    if (birthdayTimestamp < todayTimestamp && !isBirthday) {
      nextBirthday = normalizeBirthday(birthDate, today.year + 1);
      birthdayTimestamp = toUtcTimestamp(nextBirthday);
    }

    return {
      isBirthday,
      celebrationYear: isBirthday
        ? today.year
        : nextBirthday.year,
      daysUntilBirthday: isBirthday
        ? 0
        : Math.ceil(
            (birthdayTimestamp - todayTimestamp) /
              DAY_IN_MS,
          ),
    };
  }

  shouldCelebrate(
    profile: VyroDayProfile,
    now: Date = new Date(),
  ): boolean {
    const status = this.getStatus(profile, now);

    return Boolean(
      profile.greetingsEnabled &&
      status?.isBirthday,
    );
  }
}

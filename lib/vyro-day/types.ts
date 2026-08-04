export type BirthdayVisibility =
  | "private"
  | "friends"
  | "followers"
  | "public";

export interface VyroDayProfile {
  userId: string;
  birthDate: string | null;
  timezone: string;
  visibility: BirthdayVisibility;
  greetingsEnabled: boolean;
  liveExperienceEnabled: boolean;
  giftsEnabled: boolean;
}

export interface VyroDayStatus {
  isBirthday: boolean;
  celebrationYear: number;
  daysUntilBirthday: number;
}

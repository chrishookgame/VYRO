export type PlatformMomentType =
  | "platform"
  | "faith"
  | "world_event"
  | "celebration"
  | "safety"
  | "campaign";

export type PlatformMomentStyle =
  | "banner"
  | "toast"
  | "overlay"
  | "card";

export interface PlatformMoment {
  id: string;
  internal_name: string;
  moment_type: PlatformMomentType;
  title: string;
  message: string;
  locale: string;
  official_label: string;
  action_label: string | null;
  action_url: string | null;
  display_style: PlatformMomentStyle;
  frequency_minutes: number;
  duration_seconds: number;
  dismissible: boolean;
  enabled: boolean;
  starts_at: string | null;
  ends_at: string | null;
  countries: string[];
  live_categories: string[];
  priority: number;
  metadata: Record<string, unknown>;
}

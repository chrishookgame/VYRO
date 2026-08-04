export type NotificationType =
  | "like"
  | "comment"
  | "follow"
  | "message"
  | "withdraw"
  | "academy"
  | "system"
  | "ai";

export interface Notification {
  id: string;
  user_id: string;
  actor_id?: string | null;

  type: NotificationType;

  title: string;
  message: string;

  action_url?: string | null;
  image?: string | null;

  metadata: Record<string, unknown>;

  read_at?: string | null;

  created_at: string;
}

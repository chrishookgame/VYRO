import type {
  VyroLivePresentationState,
} from "@/lib/live/presentation/protocol";
export type LiveSessionStatus =
  | "scheduled"
  | "live"
  | "active"
  | "ended"
  | "cancelled";

export interface LiveSession {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  status: LiveSessionStatus;
  streamKey: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  presentationState: VyroLivePresentationState | null;
}

export interface CreateLiveSessionInput {
  title: string;
  description?: string | null;
}

export interface LiveSessionRow {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  status: LiveSessionStatus;
  stream_key: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  presentation_state: unknown;
}

export interface LiveChatProfile {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  verified: boolean;
}

export interface LiveChatMessage {
  id: string;
  roomId: string;
  userId: string;
  message: string;
  createdAt: string;
  profile: LiveChatProfile | null;
}

export interface LiveChatMessageRow {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export interface LiveChatProfileRow {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  verified: boolean;
}

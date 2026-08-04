/* ==========================================================
   VYRO AI ENGINE
========================================================== */

export type AIProvider =
  | "openai"
  | "gemini"
  | "claude"
  | "deepseek"
  | "llama";

export type AIModule =
  | "academy"
  | "creator"
  | "live"
  | "business"
  | "marketplace";

export interface AIRequest {
  module: AIModule;
  provider: AIProvider;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  success: boolean;
  content: string;
  provider: AIProvider;

  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };

  error?: string;
}

/* ==========================================================
   VYRO AI DIRECTOR — MISSION CONTROL
========================================================== */

export type VyroModule =
  | "mission"
  | "creator"
  | "live"
  | "feed"
  | "connect"
  | "academy"
  | "business"
  | "marketplace";

export type AIRecommendationPriority =
  | "low"
  | "medium"
  | "high";

export type AIRecommendationAction = {
  label: string;
  href: string;
};

export type AIRecommendation = {
  id: string;
  title: string;
  description: string;
  module: VyroModule;
  priority: AIRecommendationPriority;
  reason: string;
  action: AIRecommendationAction;
};

export type VyroUpcomingEvent = {
  id: string;
  title: string;
  date?: string;
  time?: string;
  module?: VyroModule;
};

export type VyroUserContext = {
  userId: string;
  displayName: string;
  activeModule: VyroModule;

  activeProjects: number;
  pendingVideos: number;
  scheduledLives: number;
  unfinishedCourses: number;
  unreadMessages: number;
  weeklyGrowthPercent: number;

  lastPublishedAt?: string;
  upcomingEvents: VyroUpcomingEvent[];
};

export type AIDirectorResponse = {
  greeting: string;
  summary: string;
  primaryRecommendation: AIRecommendation | null;
  recommendations: AIRecommendation[];
};
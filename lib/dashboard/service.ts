export type DashboardMetrics = {
  videos: number;
  views: number;
  followers: number;
  aiScore: number;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // TODO:
  // Obtener datos reales desde Supabase.
  return {
    videos: 0,
    views: 0,
    followers: 0,
    aiScore: 0,
  };
}

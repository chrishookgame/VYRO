import { supabase } from "@/lib/supabase";

export type DashboardMetrics = {
  videos: number;
  views: number;
  followers: number;
  aiScore: number;
};

type VideoMetricRow = {
  views: number | null;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      `No se pudo cargar el usuario del dashboard: ${userError.message}`,
    );
  }

  if (!user) {
    return {
      videos: 0,
      views: 0,
      followers: 0,
      aiScore: 0,
    };
  }

  const [
    videosResult,
    followersResult,
  ] = await Promise.all([
    supabase
      .from("videos")
      .select("views", {
        count: "exact",
      })
      .eq("user_id", user.id),

    supabase
      .from("followers")
      .select("follower_id", {
        count: "exact",
        head: true,
      })
      .eq(
        "following_id",
        user.id,
      ),
  ]);

  if (videosResult.error) {
    throw new Error(
      `No se pudieron cargar los videos del dashboard: ${videosResult.error.message}`,
    );
  }

  if (followersResult.error) {
    throw new Error(
      `No se pudieron cargar los seguidores del dashboard: ${followersResult.error.message}`,
    );
  }

  const videos =
    (videosResult.data ?? []) as VideoMetricRow[];

  const views =
    videos.reduce(
      (total, video) =>
        total + (video.views ?? 0),
      0,
    );

  return {
    videos:
      videosResult.count ??
      videos.length,
    views,
    followers:
      followersResult.count ??
      0,

    // AI Score necesita su propio contrato
    // antes de convertirse en una métrica real.
    aiScore: 0,
  };
}

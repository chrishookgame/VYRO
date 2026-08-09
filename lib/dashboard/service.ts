import { supabase } from "@/lib/supabase";

export type DashboardMetrics = {
  videos: number;
  views: number;
  followers: number;
  aiScore: number;
};

export type DashboardActivity = {
  id: string;
  title: string;
  detail: string;
  status: string;
  createdAt: string;
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
export async function getDashboardRecentActivity(
  limit = 5,
): Promise<DashboardActivity[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      `No se pudo cargar el usuario de actividad: ${userError.message}`,
    );
  }

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id,title,message,type,read_at,created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    throw new Error(
      `No se pudo cargar la actividad reciente: ${error.message}`,
    );
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    detail: item.message,
    status:
      item.read_at === null
        ? "Nuevo"
        : "Visto",
    createdAt: item.created_at,
  }));
}

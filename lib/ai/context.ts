import { supabase } from "@/lib/supabase";

import type { VyroUserContext } from "./types";

function createEmptyContext(
  userId = "guest",
  displayName = "Usuario VYRO",
): VyroUserContext {
  return {
    userId,
    displayName,
    activeModule: "mission",
    activeProjects: 0,
    pendingVideos: 0,
    scheduledLives: 0,
    unfinishedCourses: 0,
    unreadMessages: 0,
    weeklyGrowthPercent: 0,
    upcomingEvents: [],
  };
}

export async function getUserContext(): Promise<VyroUserContext> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("VYRO could not load the authenticated user:", userError);
    return createEmptyContext();
  }

  if (!user) {
    return createEmptyContext();
  }

  const [
    { data: profile, error: profileError },
    { count: activeProjects, error: projectsError },
    { data: latestPost, error: postError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", user.id)
      .maybeSingle(),

    supabase
      .from("projects")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .in("status", ["draft", "active"]),

    supabase
      .from("posts")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle(),
  ]);

  if (profileError) {
    console.error("VYRO could not load the user profile:", profileError);
  }

  if (projectsError) {
    console.error("VYRO could not load projects:", projectsError);
  }

  if (postError) {
    console.error("VYRO could not load the latest post:", postError);
  }

  const fallbackName =
    user.email?.split("@")[0] ?? "Usuario VYRO";

  const displayName =
    profile?.full_name?.trim() ||
    profile?.username?.trim() ||
    fallbackName;

  return {
    userId: user.id,
    displayName,
    activeModule: "mission",
    activeProjects: activeProjects ?? 0,

    // Estas métricas permanecerán en cero hasta crear
    // sus tablas correspondientes en Supabase.
    pendingVideos: 0,
    scheduledLives: 0,
    unfinishedCourses: 0,
    unreadMessages: 0,
    weeklyGrowthPercent: 0,

    lastPublishedAt: latestPost?.created_at ?? undefined,
    upcomingEvents: [],
  };
}
import { supabase } from "@/lib/supabase";

export type FeedVideo = {
  id: string;
  creatorId: string;
  creatorName: string;
  description: string;
  videoUrl: string;
  likes: number;
  createdAt: string;
  priorityBoost: number;
};

type RankedPostRow = {
  id: string;
  user_id: string;
  caption: string | null;
  video_url: string;
  likes: number | null;
  created_at: string;
  priority_boost: number | null;
};

type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
};

export async function getFeed(): Promise<FeedVideo[]> {
  const {
    data: posts,
    error: postsError,
  } = await supabase.rpc(
    "get_ranked_feed",
  );

  if (postsError) {
    throw new Error(postsError.message);
  }

  const postRows =
    (posts ?? []) as RankedPostRow[];

  if (postRows.length === 0) {
    return [];
  }

  const userIds = [
    ...new Set(
      postRows.map(
        (post) => post.user_id,
      ),
    ),
  ];

  const { data: profiles } =
    await supabase
      .from("profiles")
      .select(
        "id, username, full_name",
      )
      .in("id", userIds);

  const profileMap =
    new Map<string, ProfileRow>(
      (
        (profiles ?? []) as ProfileRow[]
      ).map((profile) => [
        profile.id,
        profile,
      ]),
    );

  return postRows.map((post) => {
    const profile =
      profileMap.get(post.user_id);

    return {
      id: post.id,
      creatorId: post.user_id,
      creatorName:
        profile?.username ??
        profile?.full_name ??
        "Miembro VYRO",
      description:
        post.caption ?? "",
      videoUrl: post.video_url,
      likes: post.likes ?? 0,
      createdAt: post.created_at,
      priorityBoost:
        post.priority_boost ?? 0,
    };
  });
}
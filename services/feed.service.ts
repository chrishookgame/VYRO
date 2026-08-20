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

export async function getPostById(
  postId: string,
): Promise<FeedVideo | null> {
  const { data: post, error: postError } =
    await supabase
      .from("posts")
      .select(
        "id, user_id, caption, video_url, likes, created_at, priority_boost",
      )
      .eq("id", postId)
      .maybeSingle();

  if (postError) {
    throw new Error(postError.message);
  }

  if (!post) {
    return null;
  }

  const postRow = post as RankedPostRow;

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("id, username, full_name")
      .eq("id", postRow.user_id)
      .maybeSingle();

  const profileRow =
    profile as ProfileRow | null;

  return {
    id: postRow.id,
    creatorId: postRow.user_id,
    creatorName:
      profileRow?.username ??
      profileRow?.full_name ??
      "Miembro VYRO",
    description:
      postRow.caption ?? "",
    videoUrl: postRow.video_url,
    likes: postRow.likes ?? 0,
    createdAt: postRow.created_at,
    priorityBoost:
      postRow.priority_boost ?? 0,
  };
}

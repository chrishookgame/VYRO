export type Platform =
  | "youtube"
  | "tiktok"
  | "instagram";

const hashtags = {
  youtube: [
    "#YouTube",
    "#Creator",
    "#Video",
    "#AI",
    "#VYRO",
    "#ContentCreator",
    "#Tutorial",
    "#Viral",
  ],

  tiktok: [
    "#TikTok",
    "#FYP",
    "#ForYou",
    "#AI",
    "#Trending",
    "#Viral",
    "#Video",
    "#Creator",
  ],

  instagram: [
    "#Instagram",
    "#Reels",
    "#Explore",
    "#AI",
    "#Creator",
    "#Content",
    "#Marketing",
    "#Viral",
  ],
};

export function generateHashtags(
  platform: Platform,
  topic: string
): string[] {
  return [
    `#${topic.replace(/\s+/g, "")}`,
    ...hashtags[platform],
  ];
}
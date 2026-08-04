export type VideoPrompt = {
  topic: string;
  platform: "youtube" | "tiktok" | "instagram";
  duration: number;
};

export function buildPrompt({
  topic,
  platform,
  duration,
}: VideoPrompt): string {
  return `
You are the world's best AI Film Director.

Create a complete ${platform} video.

TOPIC:
${topic}

DURATION:
${duration} seconds

Generate:

1. Viral Hook
2. Full Script
3. Storyboard
4. Camera Angles
5. Voice Style
6. Background Music
7. Visual Effects
8. Thumbnail Idea
9. SEO Title
10. SEO Description
11. Hashtags

Output JSON.
`;
}
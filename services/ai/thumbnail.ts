export type ThumbnailData = {
  topic: string;
  emotion: "excited" | "shocked" | "professional";
};

export function createThumbnailPrompt({
  topic,
  emotion,
}: ThumbnailData): string {
  return `
Create an ultra viral YouTube thumbnail.

Topic:
${topic}

Emotion:
${emotion}

Requirements:

• Ultra realistic
• 8K quality
• Cinematic lighting
• High contrast
• Vibrant colors
• Eye contact
• Professional composition
• Clickable style
• Trending YouTube design
• Clean background
• Sharp details

No watermark.

`.trim();
}
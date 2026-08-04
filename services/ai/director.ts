import { buildPrompt, type VideoPrompt } from "./prompts";

export type DirectorResult = {
  prompt: string;
  createdAt: string;
  status: "ready";
};

export async function runDirector(
  config: VideoPrompt
): Promise<DirectorResult> {
  const prompt = buildPrompt(config);

  return {
    prompt,
    createdAt: new Date().toISOString(),
    status: "ready",
  };
}
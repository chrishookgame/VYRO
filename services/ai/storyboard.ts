import { ProductionPlan } from "./planner";

export type StoryboardFrame = {
  scene: number;
  title: string;
  imagePrompt: string;
  camera: string;
  voice: string;
  effect: string;
};

export function createStoryboard(
  plan: ProductionPlan
): StoryboardFrame[] {
  return plan.scenes.map((scene) => ({
    scene: scene.id,
    title: scene.title,

    imagePrompt: `
Create a cinematic scene about "${scene.title}"
using professional lighting,
ultra realistic,
8K,
high detail,
movie composition.
`.trim(),

    camera: scene.camera,
    voice: scene.voice,
    effect: scene.effect,
  }));
}
export type Scene = {
  id: number;
  title: string;
  duration: number;
  camera: string;
  voice: string;
  effect: string;
};

export type ProductionPlan = {
  totalDuration: number;
  scenes: Scene[];
};

export function createProductionPlan(
  totalDuration: number
): ProductionPlan {
  const sceneDuration = Math.floor(totalDuration / 3);

  return {
    totalDuration,
    scenes: [
      {
        id: 1,
        title: "Hook",
        duration: sceneDuration,
        camera: "Close Up",
        voice: "Energetic",
        effect: "Flash Transition",
      },
      {
        id: 2,
        title: "Main Content",
        duration: sceneDuration,
        camera: "Medium Shot",
        voice: "Professional",
        effect: "Dynamic Zoom",
      },
      {
        id: 3,
        title: "Call To Action",
        duration: totalDuration - sceneDuration * 2,
        camera: "Wide Shot",
        voice: "Confident",
        effect: "Glow Finish",
      },
    ],
  };
}
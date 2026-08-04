export type Scene = {
  id: number;
  title: string;
  camera: string;
  narration: string;
};

export type DirectorProject = {
  title: string;
  script: string;
  scenes: Scene[];
};

export function generateProject(prompt: string): DirectorProject {
  return {
    title: prompt,

    script: `Video generado para:
${prompt}

Introducción.

Desarrollo.

Llamado a la acción.`,

    scenes: [
      {
        id: 1,
        title: "Hook",
        camera: "Wide Shot",
        narration: "Captar la atención."
      },
      {
        id: 2,
        title: "Contenido",
        camera: "Medium Shot",
        narration: "Explicar la idea principal."
      },
      {
        id: 3,
        title: "Final",
        camera: "Close Up",
        narration: "Llamado a la acción."
      }
    ]
  };
}
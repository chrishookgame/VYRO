export const VYRO_PRESENTATION_TOPIC =
  "vyro.presentation";

export type VyroLiveScene =
  | "focus"
  | "cinema"
  | "portrait"
  | "spotlight";

export type VyroLivePresentationState = {
  version: 1;
  type: "vyro.presentation";
  scene: VyroLiveScene;
  overlay: {
    visible: boolean;
    eyebrow: string;
    title: string;
    message: string;
    cta: string;
  };
  sentAt: number;
};

export const DEFAULT_VYRO_PRESENTATION_STATE:
  VyroLivePresentationState = {
    version: 1,
    type: "vyro.presentation",
    scene: "focus",
    overlay: {
      visible: false,
      eyebrow: "",
      title: "",
      message: "",
      cta: "",
    },
    sentAt: 0,
  };

const scenes = new Set<VyroLiveScene>([
  "focus",
  "cinema",
  "portrait",
  "spotlight",
]);

export function encodeVyroPresentation(
  state: VyroLivePresentationState,
) {
  return new TextEncoder().encode(
    JSON.stringify(state),
  );
}

export function decodeVyroPresentation(
  payload: Uint8Array,
): VyroLivePresentationState | null {
  try {
    const raw = JSON.parse(
      new TextDecoder().decode(payload),
    ) as Partial<VyroLivePresentationState>;

    if (
      raw.version !== 1 ||
      raw.type !== "vyro.presentation" ||
      typeof raw.scene !== "string" ||
      !scenes.has(raw.scene as VyroLiveScene) ||
      !raw.overlay ||
      typeof raw.overlay.visible !== "boolean"
    ) {
      return null;
    }

    return {
      version: 1,
      type: "vyro.presentation",
      scene: raw.scene as VyroLiveScene,
      overlay: {
        visible: raw.overlay.visible,
        eyebrow:
          typeof raw.overlay.eyebrow === "string"
            ? raw.overlay.eyebrow
            : "",
        title:
          typeof raw.overlay.title === "string"
            ? raw.overlay.title
            : "",
        message:
          typeof raw.overlay.message === "string"
            ? raw.overlay.message
            : "",
        cta:
          typeof raw.overlay.cta === "string"
            ? raw.overlay.cta
            : "",
      },
      sentAt:
        typeof raw.sentAt === "number"
          ? raw.sentAt
          : Date.now(),
    };
  }
  catch {
    return null;
  }
}
export const VYRO_PRESENTATION_TOPIC =
  "vyro.presentation";

export type VyroLiveScene =
  | "focus"
  | "cinema"
  | "portrait"
  | "spotlight";

export type VyroStageLayout =
  | "auto"
  | "grid"
  | "spotlight";

export type VyroHostStageMode =
  | "fullscreen"
  | "window"
  | "pip";

export type VyroStageState = {
  enabled: boolean;
  maxGuests: number;
  layout: VyroStageLayout;
  hostMode: VyroHostStageMode;
};

export const DEFAULT_VYRO_STAGE_STATE:
  VyroStageState = {
    enabled: false,
    maxGuests: 1,
    layout: "auto",
    hostMode: "fullscreen",
  };
export type VyroFreeCameraState = {
  enabled: boolean;
  x: number;
  y: number;
  zoom: number;
};

export const DEFAULT_VYRO_FREE_CAMERA_STATE:
  VyroFreeCameraState = {
    enabled: false,
    x: 0,
    y: 0,
    zoom: 1,
  };

export type VyroLivePresentationState = {
  version: 1;
  type: "vyro.presentation";
  scene: VyroLiveScene;
  stage: VyroStageState;
  freeCamera: VyroFreeCameraState;
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
    stage: {
      ...DEFAULT_VYRO_STAGE_STATE,
    },
    freeCamera: {
      ...DEFAULT_VYRO_FREE_CAMERA_STATE,
    },
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

function finiteNumberOrDefault(
  value: unknown,
  fallback: number,
) {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : fallback;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

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

    const rawStage =
      raw.stage &&
      typeof raw.stage === "object"
        ? raw.stage
        : DEFAULT_VYRO_STAGE_STATE;
    const rawFreeCamera =
      raw.freeCamera &&
      typeof raw.freeCamera === "object"
        ? raw.freeCamera
        : DEFAULT_VYRO_FREE_CAMERA_STATE;

    return {
      version: 1,
      type: "vyro.presentation",
      scene: raw.scene as VyroLiveScene,
      stage: {
        enabled:
          typeof rawStage.enabled === "boolean"
            ? rawStage.enabled
            : false,
        maxGuests: clamp(
          Math.round(
            finiteNumberOrDefault(
              rawStage.maxGuests,
              1,
            ),
          ),
          1,
          10,
        ),
        layout:
          rawStage.layout === "grid" ||
          rawStage.layout === "spotlight"
            ? rawStage.layout
            : "auto",
        hostMode:
          rawStage.hostMode === "window" ||
          rawStage.hostMode === "pip"
            ? rawStage.hostMode
            : "fullscreen",
      },
      freeCamera: {
        enabled:
          typeof rawFreeCamera.enabled === "boolean"
            ? rawFreeCamera.enabled
            : false,
        x: clamp(
          finiteNumberOrDefault(
            rawFreeCamera.x,
            0,
          ),
          -100,
          100,
        ),
        y: clamp(
          finiteNumberOrDefault(
            rawFreeCamera.y,
            0,
          ),
          -100,
          100,
        ),
        zoom: clamp(
          finiteNumberOrDefault(
            rawFreeCamera.zoom,
            1,
          ),
          1,
          3,
        ),
      },
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

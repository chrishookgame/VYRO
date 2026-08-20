import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const VYRO_MEDIAPIPE_WASM_PATH =
  "/mediapipe/wasm";

const VYRO_FACE_MODEL_PATH =
  "/models/mediapipe/face_landmarker.task";

export type VyroFacePoint = {
  x: number;
  y: number;
  z: number;
};

export type VyroFaceFrame = {
  timestampMs: number;
  landmarks: VyroFacePoint[];
};

export class VyroFaceLandmarker {
  private faceLandmarker: FaceLandmarker | null =
    null;

  private initializationPromise:
    Promise<void> | null = null;

  public async initialize(): Promise<void> {
    if (this.faceLandmarker) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise =
      this.initializeInternal();

    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async initializeInternal(): Promise<void> {
    const vision =
      await FilesetResolver.forVisionTasks(
        VYRO_MEDIAPIPE_WASM_PATH,
      );

    this.faceLandmarker =
      await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              VYRO_FACE_MODEL_PATH,
          },

          runningMode: "VIDEO",

          numFaces: 1,

          minFaceDetectionConfidence: 0.5,

          minFacePresenceConfidence: 0.5,

          minTrackingConfidence: 0.5,

          outputFaceBlendshapes: false,

          outputFacialTransformationMatrixes:
            false,
        },
      );
  }

  public detect(
    video: HTMLVideoElement,
    timestampMs: number,
  ): VyroFaceFrame | null {
    if (!this.faceLandmarker) {
      return null;
    }

    const result =
      this.faceLandmarker.detectForVideo(
        video,
        timestampMs,
      );

    const face =
      result.faceLandmarks?.[0];

    if (!face || face.length === 0) {
      return null;
    }

    return {
      timestampMs,

      landmarks:
        face.map((point) => ({
          x: point.x,
          y: point.y,
          z: point.z,
        })),
    };
  }

  public close(): void {
    this.faceLandmarker?.close();

    this.faceLandmarker = null;
    this.initializationPromise = null;
  }
}
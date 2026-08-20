import {
  FilesetResolver,
  ImageSegmenter,
  type MPMask,
} from "@mediapipe/tasks-vision";

const VYRO_MEDIAPIPE_WASM_PATH =
  "/mediapipe/wasm";

const VYRO_PERSON_MODEL_PATH =
  "/models/mediapipe/selfie_segmenter.tflite";

export type VyroPersonMask = {
  width: number;
  height: number;
  data: Float32Array;
};

export class VyroPersonSegmenter {
  private segmenter: ImageSegmenter | null = null;

  private initializationPromise:
    Promise<void> | null = null;

  public async initialize(): Promise<void> {
    if (this.segmenter) {
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

    this.segmenter =
      await ImageSegmenter.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              VYRO_PERSON_MODEL_PATH,
          },
          runningMode: "VIDEO",
          outputCategoryMask: false,
          outputConfidenceMasks: true,
        },
      );
  }

  public segment(
    video: HTMLVideoElement,
    timestampMs: number,
  ): VyroPersonMask | null {
    if (!this.segmenter) {
      return null;
    }

    const result =
      this.segmenter.segmentForVideo(
        video,
        timestampMs,
      );

    const confidenceMasks =
      result.confidenceMasks;

    if (
      !confidenceMasks ||
      confidenceMasks.length === 0
    ) {
      this.closeResultMasks(
        result.categoryMask,
        confidenceMasks,
      );

      return null;
    }

    const personMask =
      confidenceMasks[
        confidenceMasks.length - 1
      ];

    const data =
      new Float32Array(
        personMask.getAsFloat32Array(),
      );

    const output: VyroPersonMask = {
      width: personMask.width,
      height: personMask.height,
      data,
    };

    this.closeResultMasks(
      result.categoryMask,
      confidenceMasks,
    );

    return output;
  }

  private closeResultMasks(
    categoryMask: MPMask | undefined,
    confidenceMasks:
      MPMask[] | undefined,
  ): void {
    categoryMask?.close();

    confidenceMasks?.forEach(
      (mask) => mask.close(),
    );
  }

  public close(): void {
    this.segmenter?.close();
    this.segmenter = null;
    this.initializationPromise = null;
  }
}

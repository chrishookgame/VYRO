import {
  FaceLandmarker,
} from "@mediapipe/tasks-vision";

import type {
  VyroFaceFrame,
  VyroFacePoint,
} from "./VyroFaceLandmarker";

type VyroBeautyConnection = {
  start: number;
  end: number;
};

type VyroBeautyPoint = {
  x: number;
  y: number;
};

export type VyroBeautyRenderInput = {
  context: CanvasRenderingContext2D;
  faceFrame: VyroFaceFrame | null;
  offsetX: number;
  offsetY: number;
  drawWidth: number;
  drawHeight: number;
};

export type VyroBeautyIntensity =
  | "natural"
  | "medium"
  | "strong";

type VyroBeautyIntensityProfile = {
  minBlur: number;
  maxBlur: number;
  blurFactor: number;
  alpha: number;
};

const BEAUTY_INTENSITY_PROFILES: Record<
  VyroBeautyIntensity,
  VyroBeautyIntensityProfile
> = {
  natural: {
    minBlur: 1.5,
    maxBlur: 5,
    blurFactor: 0.012,
    alpha: 0.32,
  },
  medium: {
    minBlur: 2.5,
    maxBlur: 7,
    blurFactor: 0.017,
    alpha: 0.48,
  },
  strong: {
    minBlur: 3.5,
    maxBlur: 9,
    blurFactor: 0.022,
    alpha: 0.62,
  },
};

const FACE_OVAL =
  FaceLandmarker.FACE_LANDMARKS_FACE_OVAL;

const LEFT_EYE =
  FaceLandmarker.FACE_LANDMARKS_LEFT_EYE;

const RIGHT_EYE =
  FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE;

const LIPS =
  FaceLandmarker.FACE_LANDMARKS_LIPS;

function splitIntoChains(
  connections: VyroBeautyConnection[],
): VyroBeautyConnection[][] {
  if (connections.length === 0) {
    return [];
  }

  const chains: VyroBeautyConnection[][] = [];

  let current: VyroBeautyConnection[] = [
    connections[0],
  ];

  for (
    let index = 1;
    index < connections.length;
    index += 1
  ) {
    const previous =
      connections[index - 1];

    const connection =
      connections[index];

    if (previous.end === connection.start) {
      current.push(connection);
      continue;
    }

    chains.push(current);

    current = [
      connection,
    ];
  }

  chains.push(current);

  return chains;
}

function chainIndexes(
  chain: VyroBeautyConnection[],
): number[] {
  if (chain.length === 0) {
    return [];
  }

  return [
    chain[0].start,
    ...chain.map(
      (connection) => connection.end,
    ),
  ];
}

function buildCompositeIndexes(
  chainA: VyroBeautyConnection[],
  chainB: VyroBeautyConnection[],
): number[] {
  const a =
    chainIndexes(chainA);

  const b =
    chainIndexes(chainB);

  if (
    a.length === 0 ||
    b.length === 0 ||
    a[0] !== b[0] ||
    a[a.length - 1] !== b[b.length - 1]
  ) {
    return [];
  }

  return [
    ...a,
    ...b
      .slice(0, -1)
      .reverse(),
  ];
}

const LEFT_EYE_CHAINS =
  splitIntoChains(LEFT_EYE);

const RIGHT_EYE_CHAINS =
  splitIntoChains(RIGHT_EYE);

const LIP_CHAINS =
  splitIntoChains(LIPS);

const LEFT_EYE_POLYGON =
  LEFT_EYE_CHAINS.length >= 2
    ? buildCompositeIndexes(
        LEFT_EYE_CHAINS[0],
        LEFT_EYE_CHAINS[1],
      )
    : [];

const RIGHT_EYE_POLYGON =
  RIGHT_EYE_CHAINS.length >= 2
    ? buildCompositeIndexes(
        RIGHT_EYE_CHAINS[0],
        RIGHT_EYE_CHAINS[1],
      )
    : [];

const OUTER_LIP_POLYGON =
  LIP_CHAINS.length >= 2
    ? buildCompositeIndexes(
        LIP_CHAINS[0],
        LIP_CHAINS[1],
      )
    : [];

export class VyroBeautyEngine {
  private intensity: VyroBeautyIntensity = "natural";

  private readonly smoothCanvas =
    document.createElement("canvas");

  private readonly smoothContext =
    this.smoothCanvas.getContext("2d");

  public setIntensity(
    intensity: VyroBeautyIntensity,
  ): void {
    this.intensity = intensity;
  }

  public getIntensity(): VyroBeautyIntensity {
    return this.intensity;
  }

  public render(
    input: VyroBeautyRenderInput,
  ): void {
    const {
      context,
      faceFrame,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
    } = input;

    if (
      !faceFrame ||
      drawWidth <= 0 ||
      drawHeight <= 0 ||
      !this.smoothContext
    ) {
      return;
    }

    if (faceFrame.landmarks.length === 0) {
      return;
    }

    const width =
      context.canvas.width;

    const height =
      context.canvas.height;

    if (
      width <= 0 ||
      height <= 0
    ) {
      return;
    }

    if (
      this.smoothCanvas.width !== width ||
      this.smoothCanvas.height !== height
    ) {
      this.smoothCanvas.width = width;
      this.smoothCanvas.height = height;
    }

    const ovalIndexes =
      this.connectionIndexes(FACE_OVAL);

    if (ovalIndexes.length < 3) {
      return;
    }

    const ovalPoints =
      this.projectIndexes(
        ovalIndexes,
        faceFrame,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );

    if (ovalPoints.length < 3) {
      return;
    }

    const faceWidth =
      this.measureWidth(ovalPoints);

    if (faceWidth <= 0) {
      return;
    }

    const profile =
      BEAUTY_INTENSITY_PROFILES[
        this.intensity
      ];

    const blurRadius =
      Math.max(
        profile.minBlur,
        Math.min(
          profile.maxBlur,
          faceWidth * profile.blurFactor,
        ),
      );

    this.smoothContext.save();

    this.smoothContext.setTransform(
      1,
      0,
      0,
      1,
      0,
      0,
    );

    this.smoothContext.globalAlpha = 1;
    this.smoothContext.globalCompositeOperation =
      "source-over";

    this.smoothContext.filter =
      `blur(${blurRadius.toFixed(2)}px)`;

    this.smoothContext.clearRect(
      0,
      0,
      width,
      height,
    );

    this.smoothContext.drawImage(
      context.canvas,
      0,
      0,
      width,
      height,
    );

    this.smoothContext.restore();

    const beautyPath =
      new Path2D();

    this.appendPolygon(
      beautyPath,
      ovalPoints,
    );

    this.appendLandmarkPolygon(
      beautyPath,
      LEFT_EYE_POLYGON,
      faceFrame,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
    );

    this.appendLandmarkPolygon(
      beautyPath,
      RIGHT_EYE_POLYGON,
      faceFrame,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
    );

    this.appendLandmarkPolygon(
      beautyPath,
      OUTER_LIP_POLYGON,
      faceFrame,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
    );

    context.save();

    context.setTransform(
      1,
      0,
      0,
      1,
      0,
      0,
    );

    context.filter = "none";
    context.globalAlpha = profile.alpha;
    context.globalCompositeOperation =
      "source-over";

    context.clip(
      beautyPath,
      "evenodd",
    );

    context.drawImage(
      this.smoothCanvas,
      0,
      0,
      width,
      height,
    );

    context.restore();
  }

  public projectPoint(
    point: VyroFacePoint,
    offsetX: number,
    offsetY: number,
    drawWidth: number,
    drawHeight: number,
  ): VyroBeautyPoint {
    return {
      x:
        offsetX +
        point.x * drawWidth,

      y:
        offsetY +
        point.y * drawHeight,
    };
  }

  private connectionIndexes(
    connections: VyroBeautyConnection[],
  ): number[] {
    if (connections.length === 0) {
      return [];
    }

    return [
      connections[0].start,
      ...connections.map(
        (connection) => connection.end,
      ),
    ];
  }

  private projectIndexes(
    indexes: number[],
    faceFrame: VyroFaceFrame,
    offsetX: number,
    offsetY: number,
    drawWidth: number,
    drawHeight: number,
  ): VyroBeautyPoint[] {
    const points: VyroBeautyPoint[] = [];

    for (const index of indexes) {
      const landmark =
        faceFrame.landmarks[index];

      if (!landmark) {
        return [];
      }

      points.push(
        this.projectPoint(
          landmark,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight,
        ),
      );
    }

    return points;
  }

  private appendLandmarkPolygon(
    path: Path2D,
    indexes: number[],
    faceFrame: VyroFaceFrame,
    offsetX: number,
    offsetY: number,
    drawWidth: number,
    drawHeight: number,
  ): void {
    if (indexes.length < 3) {
      return;
    }

    const points =
      this.projectIndexes(
        indexes,
        faceFrame,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );

    this.appendPolygon(
      path,
      points,
    );
  }

  private appendPolygon(
    path: Path2D,
    points: VyroBeautyPoint[],
  ): void {
    if (points.length < 3) {
      return;
    }

    path.moveTo(
      points[0].x,
      points[0].y,
    );

    for (
      let index = 1;
      index < points.length;
      index += 1
    ) {
      path.lineTo(
        points[index].x,
        points[index].y,
      );
    }

    path.closePath();
  }

  private measureWidth(
    points: VyroBeautyPoint[],
  ): number {
    let minX =
      Number.POSITIVE_INFINITY;

    let maxX =
      Number.NEGATIVE_INFINITY;

    for (const point of points) {
      minX =
        Math.min(
          minX,
          point.x,
        );

      maxX =
        Math.max(
          maxX,
          point.x,
        );
    }

    if (
      !Number.isFinite(minX) ||
      !Number.isFinite(maxX)
    ) {
      return 0;
    }

    return Math.max(
      0,
      maxX - minX,
    );
  }
}

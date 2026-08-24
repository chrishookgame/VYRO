import type {
  VyroVirtualBackgroundMode,
  VyroVirtualBackgroundPlayback,
  VyroVirtualBackgroundPreset,
  VyroVirtualEffect,
  VyroVirtualVideoOptions,
  VyroVirtualVideoOutput,
  VyroVirtualVideoState,
} from "./types";

import {
  VyroPersonSegmenter,
  type VyroPersonMask,
} from "./VyroPersonSegmenter";

import {
  VyroFaceLandmarker,
  type VyroFaceFrame,
} from "./VyroFaceLandmarker";

import {
  VyroBeautyEngine,
  type VyroBeautyIntensity,
} from "./VyroBeautyEngine";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
const DEFAULT_FRAME_RATE = 30;

export class VyroVirtualVideoEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly video: HTMLVideoElement;

  private animationFrameId: number | null = null;

  private outputStream: MediaStream | null = null;
  private outputTrack: MediaStreamTrack | null = null;

  private effect: VyroVirtualEffect;

  private backgroundMode: VyroVirtualBackgroundMode;

  private backgroundPreset: VyroVirtualBackgroundPreset;

  private backgroundPlayback: VyroVirtualBackgroundPlayback;

  private readonly personSegmenter =
    new VyroPersonSegmenter();

  private readonly faceLandmarker =
    new VyroFaceLandmarker();


  private readonly beautyEngine =
    new VyroBeautyEngine();

  private beautyEnabled = false;
  private faceFrame: VyroFaceFrame | null =
    null;

  private faceLandmarkerReady = false;

  private personMask: VyroPersonMask | null =
    null;

  private segmentationReady = false;

  private readonly maskCanvas =
    document.createElement("canvas");

  private readonly maskContext =
    this.maskCanvas.getContext("2d");

  private readonly personCanvas =
    document.createElement("canvas");

  private readonly personContext =
    this.personCanvas.getContext("2d");

  private readonly width: number;
  private readonly height: number;
  private readonly frameRate: number;

  constructor(
    options: VyroVirtualVideoOptions = {},
  ) {
    this.width =
      options.width ?? DEFAULT_WIDTH;

    this.height =
      options.height ?? DEFAULT_HEIGHT;

    this.frameRate =
      options.frameRate ?? DEFAULT_FRAME_RATE;

    this.effect =
      options.effect ?? "none";

    this.backgroundMode =
      options.backgroundMode ?? "original";

    this.backgroundPreset =
      options.backgroundPreset ?? "original";

    this.backgroundPlayback =
      options.backgroundPlayback ?? "motion";

    this.canvas =
      document.createElement("canvas");

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    const context =
      this.canvas.getContext("2d", {
        alpha: false,
      });

    if (!context) {
      throw new Error(
        "VYRO Virtual Video Engine no pudo crear Canvas 2D.",
      );
    }

    this.context = context;

    this.video =
      document.createElement("video");

    this.video.autoplay = true;
    this.video.muted = true;
    this.video.playsInline = true;
  }

  public getState(): VyroVirtualVideoState {
    return {
      running:
        this.animationFrameId !== null,
      effect: this.effect,
      width: this.width,
      height: this.height,
      frameRate: this.frameRate,
      segmentationReady: this.segmentationReady,
    };
  }

  public setBeautyEnabled(
    enabled: boolean,
  ): void {
    this.beautyEnabled = enabled;
  }

  public getBeautyEnabled(): boolean {
    return this.beautyEnabled;
  }

  public setBeautyIntensity(
    intensity: VyroBeautyIntensity,
  ): void {
    this.beautyEngine.setIntensity(intensity);
  }

  public getBeautyIntensity(): VyroBeautyIntensity {
    return this.beautyEngine.getIntensity();
  }

  public setEffect(
    effect: VyroVirtualEffect,
  ): void {
    this.effect = effect;
  }

  public setBackgroundMode(
    backgroundMode: VyroVirtualBackgroundMode,
  ): void {
    this.backgroundMode = backgroundMode;
  }

  public setBackgroundPreset(
    backgroundPreset: VyroVirtualBackgroundPreset,
  ): void {
    this.backgroundPreset = backgroundPreset;
  }
  public setBackgroundPlayback(
    backgroundPlayback: VyroVirtualBackgroundPlayback,
  ): void {
    this.backgroundPlayback = backgroundPlayback;
  }


  public async start(
    inputTrack: MediaStreamTrack,
  ): Promise<VyroVirtualVideoOutput> {
    if (inputTrack.kind !== "video") {
      throw new Error(
        "VYRO Virtual Video Engine necesita una pista de video.",
      );
    }

    this.stop();

    const inputStream =
      new MediaStream([
        inputTrack,
      ]);

    this.video.srcObject =
      inputStream;

    await this.video.play();

    await this.personSegmenter.initialize();
    this.segmentationReady = true;

    try {
      await this.faceLandmarker.initialize();
      this.faceLandmarkerReady = true;
      console.info("VYRO FACE READY");
    } catch (error) {
      console.error("VYRO FACE INIT ERROR:", error);
      this.faceLandmarkerReady = false;
      this.faceFrame = null;
    }

    this.render();

    const outputStream =
      this.canvas.captureStream(
        this.frameRate,
      );

    const outputTrack =
      outputStream
        .getVideoTracks()[0];

    if (!outputTrack) {
      this.stop();

      throw new Error(
        "VYRO Virtual Video Engine no pudo crear la pista procesada.",
      );
    }

    this.outputStream =
      outputStream;

    this.outputTrack =
      outputTrack;

    return {
      stream: outputStream,
      track: outputTrack,
    };
  }

  public stop(): void {
    if (
      this.animationFrameId !== null
    ) {
      window.cancelAnimationFrame(
        this.animationFrameId,
      );

      this.animationFrameId = null;
    }

    this.outputTrack?.stop();

    this.outputStream
      ?.getTracks()
      .forEach((track) => {
        track.stop();
      });

    this.outputTrack = null;
    this.outputStream = null;

    this.video.pause();
    this.video.srcObject = null;

    this.personMask = null;
    this.segmentationReady = false;
    this.personSegmenter.close();

    this.faceFrame = null;
    this.faceLandmarkerReady = false;
    this.faceLandmarker.close();

    this.context.setTransform(
      1,
      0,
      0,
      1,
      0,
      0,
    );

    this.context.clearRect(
      0,
      0,
      this.width,
      this.height,
    );
  }

  private render =
    (): void => {
      if (
        !this.video.videoWidth ||
        !this.video.videoHeight
      ) {
        this.animationFrameId =
          window.requestAnimationFrame(
            this.render,
          );

        return;
      }

      this.drawFrame();

      this.animationFrameId =
        window.requestAnimationFrame(
          this.render,
        );
    };

  private drawFrame(): void {
    const sourceWidth =
      this.video.videoWidth;

    const sourceHeight =
      this.video.videoHeight;

    const sourceRatio =
      sourceWidth / sourceHeight;

    const targetRatio =
      this.width / this.height;

    let drawWidth = this.width;
    let drawHeight = this.height;
    let offsetX = 0;
    let offsetY = 0;

    if (sourceRatio > targetRatio) {
      drawHeight = this.height;
      drawWidth =
        drawHeight * sourceRatio;

      offsetX =
        (this.width - drawWidth) / 2;
    }
    else {
      drawWidth = this.width;
      drawHeight =
        drawWidth / sourceRatio;

      offsetY =
        (this.height - drawHeight) / 2;
    }

    this.context.save();

    this.context.clearRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.applyEffect();

    if (this.faceLandmarkerReady) {
      this.faceFrame =
        this.faceLandmarker.detect(
          this.video,
          performance.now(),
        );

    } else {
      this.faceFrame = null;
    }

    if (this.segmentationReady) {
      this.personMask =
        this.personSegmenter.segment(
          this.video,
          performance.now(),
        );
    }
    else {
      this.personMask = null;
    }

    if (
      this.backgroundMode !== "original" &&
      this.personMask
    ) {
      this.drawDynamicBackground(
        performance.now(),
      );

      this.drawPersonWithMask(
        this.personMask,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );
    }
    else {
      this.context.drawImage(
        this.video,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );
    }

    if (this.beautyEnabled) {
      this.beautyEngine.render({
        context: this.context,
        faceFrame: this.faceFrame,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      });
    }

    this.context.restore();

    this.drawVyroEffectLayer();
  }

  private updatePersonMaskCanvas(
    mask: VyroPersonMask,
  ): boolean {
    if (
      !this.maskContext ||
      mask.width <= 0 ||
      mask.height <= 0 ||
      mask.data.length !== mask.width * mask.height
    ) {
      return false;
    }

    if (
      this.maskCanvas.width !== mask.width ||
      this.maskCanvas.height !== mask.height
    ) {
      this.maskCanvas.width =
        mask.width;

      this.maskCanvas.height =
        mask.height;
    }

    const imageData =
      this.maskContext.createImageData(
        mask.width,
        mask.height,
      );

    for (
      let index = 0;
      index < mask.data.length;
      index += 1
    ) {
      const confidence =
        Math.max(
          0,
          Math.min(
            1,
            mask.data[index],
          ),
        );

      const pixel =
        index * 4;

      imageData.data[pixel] = 255;
      imageData.data[pixel + 1] = 255;
      imageData.data[pixel + 2] = 255;
      imageData.data[pixel + 3] =
        Math.round(
          confidence * 255,
        );
    }

    this.maskContext.putImageData(
      imageData,
      0,
      0,
    );

    return true;
  }

  private drawPersonWithMask(
    mask: VyroPersonMask,
    offsetX: number,
    offsetY: number,
    drawWidth: number,
    drawHeight: number,
  ): void {
    if (
      !this.personContext ||
      !this.updatePersonMaskCanvas(mask)
    ) {
      this.context.drawImage(
        this.video,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );

      return;
    }

    if (
      this.personCanvas.width !== this.width ||
      this.personCanvas.height !== this.height
    ) {
      this.personCanvas.width =
        this.width;

      this.personCanvas.height =
        this.height;
    }

    this.personContext.clearRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.personContext.save();

    this.personContext.drawImage(
      this.maskCanvas,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
    );

    this.personContext.globalCompositeOperation =
      "source-in";

    this.personContext.drawImage(
      this.video,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
    );

    this.personContext.restore();

    this.context.drawImage(
      this.personCanvas,
      0,
      0,
      this.width,
      this.height,
    );
  }

  private drawDynamicBackground(
    now: number,
  ): void {
    const backgroundNow =
      this.backgroundPlayback === "motion"
        ? now
        : 0;

    switch (this.backgroundPreset) {
      case "vyro-neon":
        this.drawNeonBackground(backgroundNow);
        return;

      case "vyro-arena":
        this.drawArenaBackground(backgroundNow);
        return;

      case "vyro-galaxy":
        this.drawGalaxyBackground(backgroundNow);
        return;

      case "vyro-smoke-stage":
        this.drawSmokeStageBackground(backgroundNow);
        return;
      case "vyro-laser-club":
        this.drawLaserClubBackground(backgroundNow);
        return;

      case "vyro-cyber-tunnel":
        this.drawCyberTunnelBackground(backgroundNow);
        return;

      case "vyro-fire-stage":
        this.drawFireStageBackground(backgroundNow);
        return;

      case "vyro-aurora":
        this.drawAuroraBackground(backgroundNow);
        return;

      case "vyro-matrix":
        this.drawMatrixBackground(backgroundNow);
        return;

      case "vyro-lightning":
        this.drawLightningBackground(backgroundNow);
        return;

      case "vyro-luxury-gold":
        this.drawLuxuryGoldBackground(backgroundNow);
        return;

      case "vyro-ocean-view":
        this.drawOceanViewBackground(backgroundNow);
        return;

      case "vyro-jungle":
        this.drawJungleBackground(backgroundNow);
        return;

      case "vyro-ice-studio":
        this.drawIceStudioBackground(backgroundNow);
        return;


      case "blur":
        this.context.save();

        this.context.filter =
          "blur(24px) brightness(0.72) saturate(1.12)";

        this.context.drawImage(
          this.video,
          -40,
          -40,
          this.width + 80,
          this.height + 80,
        );

        this.context.restore();
        return;

      default:
        this.context.fillStyle =
          "#05070d";

        this.context.fillRect(
          0,
          0,
          this.width,
          this.height,
        );
    }
  }

  private drawNeonBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    const background =
      this.context.createLinearGradient(
        0,
        0,
        this.width,
        this.height,
      );

    background.addColorStop(
      0,
      "#020711",
    );

    background.addColorStop(
      0.5,
      "#07182a",
    );

    background.addColorStop(
      1,
      "#17051f",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.context.save();

    this.context.globalCompositeOperation =
      "screen";

    for (
      let index = 0;
      index < 7;
      index += 1
    ) {
      const phase =
        time * 0.55 +
        index * 0.9;

      const x =
        this.width *
        (
          0.5 +
          Math.sin(phase) * 0.46
        );

      const glow =
        this.context.createRadialGradient(
          x,
          this.height * 0.42,
          0,
          x,
          this.height * 0.42,
          this.width * 0.24,
        );

      glow.addColorStop(
        0,
        index % 2 === 0
          ? "rgba(0, 240, 255, 0.18)"
          : "rgba(255, 40, 220, 0.16)",
      );

      glow.addColorStop(
        1,
        "rgba(0, 0, 0, 0)",
      );

      this.context.fillStyle =
        glow;

      this.context.fillRect(
        0,
        0,
        this.width,
        this.height,
      );
    }

    this.context.restore();

    const horizon =
      this.height * 0.67;

    this.context.save();

    this.context.strokeStyle =
      "rgba(0, 230, 255, 0.18)";

    this.context.lineWidth = 1;

    for (
      let index = 0;
      index < 13;
      index += 1
    ) {
      const progress =
        index / 12;

      const y =
        horizon +
        Math.pow(progress, 1.7) *
          (this.height - horizon);

      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(
        this.width,
        y,
      );
      this.context.stroke();
    }

    const center =
      this.width * 0.5;

    for (
      let index = -12;
      index <= 12;
      index += 1
    ) {
      this.context.beginPath();

      this.context.moveTo(
        center,
        horizon,
      );

      this.context.lineTo(
        center +
          index *
            this.width *
            0.09,
        this.height,
      );

      this.context.stroke();
    }

    this.context.restore();
  }

  private drawArenaBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    const background =
      this.context.createRadialGradient(
        this.width * 0.5,
        this.height * 0.38,
        0,
        this.width * 0.5,
        this.height * 0.48,
        this.width * 0.72,
      );

    background.addColorStop(
      0,
      "#1b3158",
    );

    background.addColorStop(
      0.48,
      "#080e1c",
    );

    background.addColorStop(
      1,
      "#020306",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.context.save();

    this.context.globalCompositeOperation =
      "screen";

    for (
      let index = 0;
      index < 9;
      index += 1
    ) {
      const x =
        this.width *
        (
          0.08 +
          (index / 8) * 0.84
        );

      const pulse =
        0.5 +
        0.5 *
          Math.sin(
            time * 2 +
            index * 0.8,
          );

      const radius =
        45 +
        pulse * 38;

      const light =
        this.context.createRadialGradient(
          x,
          this.height * 0.13,
          0,
          x,
          this.height * 0.13,
          radius,
        );

      light.addColorStop(
        0,
        `rgba(220, 245, 255, ${
          0.32 + pulse * 0.22
        })`,
      );

      light.addColorStop(
        1,
        "rgba(50, 150, 255, 0)",
      );

      this.context.fillStyle =
        light;

      this.context.fillRect(
        x - radius,
        this.height * 0.13 - radius,
        radius * 2,
        radius * 2,
      );
    }

    this.context.restore();

    this.context.fillStyle =
      "rgba(0, 0, 0, 0.42)";

    this.context.fillRect(
      0,
      this.height * 0.7,
      this.width,
      this.height * 0.3,
    );
  }

  private drawSmokeStageBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    const background =
      this.context.createLinearGradient(
        0,
        0,
        0,
        this.height,
      );

    background.addColorStop(
      0,
      "#02040a",
    );

    background.addColorStop(
      0.5,
      "#07111d",
    );

    background.addColorStop(
      1,
      "#010204",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.context.save();

    this.context.globalCompositeOperation =
      "screen";

    /*
     * MOVING HEAD LIGHTS
     */
    for (
      let index = 0;
      index < 6;
      index += 1
    ) {
      const originX =
        this.width *
        (
          0.08 +
          index * 0.168
        );

      const phase =
        time * 0.82 +
        index * 1.12;

      const targetX =
        this.width *
        (
          0.5 +
          Math.sin(phase) * 0.43
        );

      const targetY =
        this.height *
        (
          0.58 +
          Math.cos(
            phase * 0.71,
          ) * 0.13
        );

      const beam =
        this.context.createLinearGradient(
          originX,
          0,
          targetX,
          targetY,
        );

      const beamColor =
        index % 3 === 0
          ? "rgba(20, 235, 255, 0.34)"
          : index % 3 === 1
            ? "rgba(255, 55, 215, 0.30)"
            : "rgba(125, 90, 255, 0.30)";

      beam.addColorStop(
        0,
        beamColor,
      );

      beam.addColorStop(
        1,
        "rgba(10, 20, 35, 0)",
      );

      this.context.fillStyle =
        beam;

      this.context.beginPath();

      this.context.moveTo(
        originX - 8,
        0,
      );

      this.context.lineTo(
        originX + 8,
        0,
      );

      this.context.lineTo(
        targetX + this.width * 0.07,
        targetY,
      );

      this.context.lineTo(
        targetX - this.width * 0.07,
        targetY,
      );

      this.context.closePath();
      this.context.fill();
    }

    /*
     * PULSATING LIGHT SOURCES
     */
    for (
      let index = 0;
      index < 8;
      index += 1
    ) {
      const x =
        this.width *
        (
          0.06 +
          index * 0.126
        );

      const pulse =
        0.5 +
        0.5 *
          Math.sin(
            time * 2.5 +
            index * 0.75,
          );

      const radius =
        34 +
        pulse * 32;

      const glow =
        this.context.createRadialGradient(
          x,
          this.height * 0.1,
          0,
          x,
          this.height * 0.1,
          radius,
        );

      glow.addColorStop(
        0,
        `rgba(220, 245, 255, ${
          0.30 + pulse * 0.32
        })`,
      );

      glow.addColorStop(
        1,
        "rgba(40, 150, 255, 0)",
      );

      this.context.fillStyle =
        glow;

      this.context.fillRect(
        x - radius,
        this.height * 0.1 - radius,
        radius * 2,
        radius * 2,
      );
    }

    this.context.restore();

    /*
     * ANIMATED SMOKE
     */
    this.context.save();

    this.context.globalCompositeOperation =
      "screen";

    for (
      let layer = 0;
      layer < 20;
      layer += 1
    ) {
      const seed =
        layer * 1.731;

      const drift =
        Math.sin(
          time *
            (0.13 + layer * 0.004) +
          seed,
        );

      const rise =
        (
          time *
            (
              15 +
              (layer % 5) * 4
            ) +
          layer * 79
        ) %
        (this.height * 0.75);

      const x =
        this.width *
        (
          0.04 +
          ((layer * 0.139) % 0.92)
        ) +
        drift * 95;

      const y =
        this.height -
        rise;

      const radiusX =
        105 +
        (layer % 6) * 30;

      const radiusY =
        42 +
        (layer % 5) * 20;

      this.context.save();

      this.context.translate(
        x,
        y,
      );

      this.context.scale(
        1,
        radiusY / radiusX,
      );

      const smoke =
        this.context.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          radiusX,
        );

      smoke.addColorStop(
        0,
        layer % 3 === 0
          ? "rgba(190, 225, 255, 0.085)"
          : "rgba(220, 230, 245, 0.060)",
      );

      smoke.addColorStop(
        0.45,
        "rgba(145, 175, 210, 0.040)",
      );

      smoke.addColorStop(
        1,
        "rgba(35, 45, 65, 0)",
      );

      this.context.fillStyle =
        smoke;

      this.context.beginPath();

      this.context.arc(
        0,
        0,
        radiusX,
        0,
        Math.PI * 2,
      );

      this.context.fill();

      this.context.restore();
    }

    this.context.restore();

    /*
     * STAGE FLOOR
     */
    const floorY =
      this.height * 0.76;

    const floor =
      this.context.createLinearGradient(
        0,
        floorY,
        0,
        this.height,
      );

    floor.addColorStop(
      0,
      "rgba(18, 32, 52, 0.32)",
    );

    floor.addColorStop(
      1,
      "rgba(0, 0, 0, 0.86)",
    );

    this.context.fillStyle =
      floor;

    this.context.fillRect(
      0,
      floorY,
      this.width,
      this.height - floorY,
    );

    /*
     * MOVING FLOOR REFLECTIONS
     */
    this.context.save();

    this.context.globalCompositeOperation =
      "screen";

    for (
      let index = 0;
      index < 4;
      index += 1
    ) {
      const x =
        this.width *
        (
          0.5 +
          Math.sin(
            time * 0.65 +
            index * 1.7,
          ) * 0.44
        );

      const reflection =
        this.context.createRadialGradient(
          x,
          floorY,
          0,
          x,
          floorY,
          this.width * 0.22,
        );

      reflection.addColorStop(
        0,
        index % 2 === 0
          ? "rgba(0, 215, 255, 0.11)"
          : "rgba(255, 55, 215, 0.09)",
      );

      reflection.addColorStop(
        1,
        "rgba(0, 0, 0, 0)",
      );

      this.context.fillStyle =
        reflection;

      this.context.fillRect(
        0,
        floorY,
        this.width,
        this.height - floorY,
      );
    }

    this.context.restore();
  }

  private drawLaserClubBackground(
    now: number,
  ): void {
    const time = now * 0.001;
    const centerX = this.width * 0.5;
    const floorY = this.height * 0.78;

    const background =
      this.context.createLinearGradient(
        0,
        0,
        0,
        this.height,
      );

    background.addColorStop(
      0,
      "rgb(2, 3, 12)",
    );

    background.addColorStop(
      0.55,
      "rgb(8, 3, 28)",
    );

    background.addColorStop(
      1,
      "rgb(1, 1, 7)",
    );

    this.context.fillStyle = background;
    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    const ambient =
      this.context.createRadialGradient(
        centerX,
        this.height * 0.38,
        0,
        centerX,
        this.height * 0.38,
        this.width * 0.72,
      );

    ambient.addColorStop(
      0,
      "rgba(120, 35, 255, 0.24)",
    );

    ambient.addColorStop(
      0.42,
      "rgba(0, 220, 255, 0.10)",
    );

    ambient.addColorStop(
      1,
      "rgba(0, 0, 0, 0)",
    );

    this.context.fillStyle = ambient;
    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.context.save();
    this.context.globalCompositeOperation = "screen";
    this.context.lineCap = "round";

    for (
      let index = 0;
      index < 12;
      index += 1
    ) {
      const direction =
        index % 2 === 0
          ? 1
          : -1;

      const phase =
        time *
          (0.55 +
            (index % 4) * 0.13) *
          direction +
        index * 0.62;

      const originX =
        centerX +
        Math.sin(phase) *
          this.width * 0.28;

      const targetX =
        centerX +
        Math.sin(
          phase * 1.35 +
            index * 0.81,
        ) *
          this.width * 0.64;

      const targetY =
        this.height *
        (
          0.05 +
          (index % 6) * 0.09
        );

      const cyan =
        index % 2 === 0;

      this.context.strokeStyle =
        cyan
          ? "rgba(0, 235, 255, 0.42)"
          : "rgba(255, 50, 225, 0.38)";

      this.context.shadowColor =
        cyan
          ? "rgba(0, 235, 255, 0.95)"
          : "rgba(255, 50, 225, 0.90)";

      this.context.shadowBlur = 24;
      this.context.lineWidth =
        1.5 +
        (index % 3);

      this.context.beginPath();
      this.context.moveTo(
        originX,
        floorY,
      );
      this.context.lineTo(
        targetX,
        targetY,
      );
      this.context.stroke();
    }

    const pulse =
      0.5 +
      Math.sin(time * 3.5) *
        0.5;

    const pulseGlow =
      this.context.createRadialGradient(
        centerX,
        floorY,
        0,
        centerX,
        floorY,
        this.width * 0.42,
      );

    pulseGlow.addColorStop(
      0,
      `rgba(135, 55, 255, ${
        0.17 + pulse * 0.12
      })`,
    );

    pulseGlow.addColorStop(
      0.45,
      `rgba(0, 220, 255, ${
        0.06 + pulse * 0.07
      })`,
    );

    pulseGlow.addColorStop(
      1,
      "rgba(0, 0, 0, 0)",
    );

    this.context.fillStyle = pulseGlow;
    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    for (
      let index = 0;
      index < 34;
      index += 1
    ) {
      const seed = index * 91.713;

      const x =
        (
          Math.sin(seed) * 0.5 +
          0.5
        ) *
        this.width;

      const travel =
        (
          time *
            (
              22 +
              (index % 5) * 6
            ) +
          seed * 9
        ) %
        this.height;

      const y =
        this.height - travel;

      const radius =
        1 +
        (index % 3) * 0.75;

      this.context.fillStyle =
        index % 2 === 0
          ? "rgba(0, 235, 255, 0.52)"
          : "rgba(255, 65, 230, 0.46)";

      this.context.shadowColor =
        this.context.fillStyle;
      this.context.shadowBlur = 10;

      this.context.beginPath();
      this.context.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2,
      );
      this.context.fill();
    }

    this.context.restore();

    const floor =
      this.context.createLinearGradient(
        0,
        floorY,
        0,
        this.height,
      );

    floor.addColorStop(
      0,
      "rgba(12, 5, 32, 0.34)",
    );

    floor.addColorStop(
      1,
      "rgba(0, 0, 0, 0.92)",
    );

    this.context.fillStyle = floor;
    this.context.fillRect(
      0,
      floorY,
      this.width,
      this.height - floorY,
    );

    this.context.save();
    this.context.globalAlpha = 0.20;
    this.context.strokeStyle =
      "rgba(0, 225, 255, 0.58)";
    this.context.lineWidth = 1;

    const gridOffset =
      (time * 44) % 46;

    for (
      let y = floorY + gridOffset;
      y < this.height;
      y += 46
    ) {
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(
        this.width,
        y,
      );
      this.context.stroke();
    }

    for (
      let index = -9;
      index <= 9;
      index += 1
    ) {
      this.context.beginPath();
      this.context.moveTo(
        centerX,
        floorY,
      );
      this.context.lineTo(
        centerX +
          index *
            this.width *
            0.095,
        this.height,
      );
      this.context.stroke();
    }

    this.context.restore();
  }


  private drawCyberTunnelBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    const centerX =
      this.width * 0.5;

    const centerY =
      this.height * 0.46;

    const background =
      this.context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(this.width, this.height) * 0.8,
      );

    background.addColorStop(
      0,
      "rgba(12, 42, 78, 1)",
    );

    background.addColorStop(
      0.48,
      "rgba(5, 12, 30, 1)",
    );

    background.addColorStop(
      1,
      "rgba(1, 3, 12, 1)",
    );

    this.context.save();

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    const pulse =
      (Math.sin(time * 2.2) + 1) * 0.5;

    this.context.lineWidth =
      Math.max(1, this.width * 0.002);

    for (let ring = 0; ring < 13; ring += 1) {
      const phase =
        (ring / 13 + time * 0.18) % 1;

      const scale =
        0.08 + phase * 1.15;

      const halfW =
        this.width * 0.46 * scale;

      const halfH =
        this.height * 0.38 * scale;

      this.context.strokeStyle =
        ring % 2 === 0
          ? `rgba(0, 220, 255, ${0.14 + pulse * 0.18})`
          : `rgba(180, 45, 255, ${0.10 + pulse * 0.16})`;

      this.context.strokeRect(
        centerX - halfW,
        centerY - halfH,
        halfW * 2,
        halfH * 2,
      );
    }

    for (let index = -8; index <= 8; index += 1) {
      const x =
        centerX +
        index * this.width * 0.07;

      this.context.beginPath();

      this.context.moveTo(
        centerX,
        centerY,
      );

      this.context.lineTo(
        x,
        this.height,
      );

      this.context.strokeStyle =
        index % 2 === 0
          ? "rgba(0, 220, 255, 0.18)"
          : "rgba(205, 40, 255, 0.12)";

      this.context.stroke();
    }

    this.context.restore();
  }

  private drawFireStageBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    const background =
      this.context.createLinearGradient(
        0,
        0,
        0,
        this.height,
      );

    background.addColorStop(
      0,
      "#090305",
    );

    background.addColorStop(
      0.55,
      "#260606",
    );

    background.addColorStop(
      1,
      "#050202",
    );

    this.context.save();

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    const floorY =
      this.height * 0.82;

    for (let index = 0; index < 24; index += 1) {
      const seed =
        index * 19.37;

      const x =
        ((index + 0.5) / 24) *
        this.width;

      const wave =
        Math.sin(
          time * (2.2 + (index % 4) * 0.25) +
          seed,
        );

      const flameHeight =
        this.height *
        (0.10 +
          ((index * 7) % 11) * 0.008 +
          (wave + 1) * 0.035);

      const radius =
        this.width *
        (0.025 + (index % 3) * 0.006);

      const flame =
        this.context.createRadialGradient(
          x,
          floorY - flameHeight * 0.35,
          0,
          x,
          floorY - flameHeight * 0.35,
          Math.max(radius, flameHeight),
        );

      flame.addColorStop(
        0,
        "rgba(255, 235, 120, 0.70)",
      );

      flame.addColorStop(
        0.22,
        "rgba(255, 110, 20, 0.58)",
      );

      flame.addColorStop(
        0.62,
        "rgba(220, 20, 8, 0.26)",
      );

      flame.addColorStop(
        1,
        "rgba(0, 0, 0, 0)",
      );

      this.context.fillStyle =
        flame;

      this.context.fillRect(
        x - radius * 2,
        floorY - flameHeight,
        radius * 4,
        flameHeight * 1.25,
      );
    }

    const stageGlow =
      this.context.createRadialGradient(
        this.width * 0.5,
        floorY,
        0,
        this.width * 0.5,
        floorY,
        this.width * 0.6,
      );

    stageGlow.addColorStop(
      0,
      "rgba(255, 80, 15, 0.25)",
    );

    stageGlow.addColorStop(
      1,
      "rgba(0, 0, 0, 0)",
    );

    this.context.fillStyle =
      stageGlow;

    this.context.fillRect(
      0,
      this.height * 0.48,
      this.width,
      this.height * 0.52,
    );

    this.context.restore();
  }

  private drawAuroraBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    const background =
      this.context.createLinearGradient(
        0,
        0,
        0,
        this.height,
      );

    background.addColorStop(
      0,
      "#02091a",
    );

    background.addColorStop(
      0.58,
      "#071329",
    );

    background.addColorStop(
      1,
      "#02040d",
    );

    this.context.save();

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.context.globalCompositeOperation =
      "screen";

    for (let band = 0; band < 6; band += 1) {
      const baseY =
        this.height *
        (0.20 + band * 0.075);

      const gradient =
        this.context.createLinearGradient(
          0,
          baseY,
          this.width,
          baseY + this.height * 0.2,
        );

      if (band % 2 === 0) {
        gradient.addColorStop(
          0,
          "rgba(0, 255, 195, 0)",
        );

        gradient.addColorStop(
          0.5,
          "rgba(0, 255, 195, 0.20)",
        );

        gradient.addColorStop(
          1,
          "rgba(70, 80, 255, 0)",
        );
      } else {
        gradient.addColorStop(
          0,
          "rgba(60, 90, 255, 0)",
        );

        gradient.addColorStop(
          0.5,
          "rgba(165, 70, 255, 0.18)",
        );

        gradient.addColorStop(
          1,
          "rgba(0, 240, 210, 0)",
        );
      }

      this.context.beginPath();

      for (let step = 0; step <= 48; step += 1) {
        const ratio =
          step / 48;

        const x =
          ratio * this.width;

        const y =
          baseY +
          Math.sin(
            ratio * Math.PI * 3 +
            time * (0.65 + band * 0.07) +
            band,
          ) *
            this.height *
            (0.035 + band * 0.004);

        if (step === 0) {
          this.context.moveTo(
            x,
            y,
          );
        } else {
          this.context.lineTo(
            x,
            y,
          );
        }
      }

      this.context.lineWidth =
        this.height *
        (0.035 + band * 0.006);

      this.context.strokeStyle =
        gradient;

      this.context.stroke();
    }

    this.context.restore();
  }

  private drawMatrixBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    this.context.save();

    const background =
      this.context.createLinearGradient(
        0,
        0,
        0,
        this.height,
      );

    background.addColorStop(
      0,
      "#010805",
    );

    background.addColorStop(
      0.55,
      "#03140b",
    );

    background.addColorStop(
      1,
      "#010302",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    const columns = 34;

    this.context.font =
      `${Math.max(
        11,
        this.height * 0.024,
      )}px monospace`;

    this.context.textAlign =
      "center";

    for (
      let column = 0;
      column < columns;
      column += 1
    ) {
      const x =
        ((column + 0.5) / columns) *
        this.width;

      const speed =
        0.20 +
        (column % 7) * 0.028;

      const offset =
        (
          time * speed +
          column * 0.137
        ) % 1.35;

      for (
        let row = 0;
        row < 18;
        row += 1
      ) {
        const yRatio =
          offset -
          row * 0.065;

        const wrapped =
          (
            yRatio +
            1.35
          ) % 1.35;

        const y =
          wrapped *
          this.height;

        const symbol =
          String.fromCharCode(
            48 +
            (
              column * 7 +
              row * 11 +
              Math.floor(time * 4)
            ) % 43,
          );

        const alpha =
          Math.max(
            0.04,
            0.48 -
              row * 0.022,
          );

        this.context.fillStyle =
          row === 0
            ? "rgba(205, 255, 220, 0.88)"
            : `rgba(30, 255, 110, ${alpha})`;

        this.context.fillText(
          symbol,
          x,
          y,
        );
      }
    }

    const glow =
      this.context.createRadialGradient(
        this.width * 0.5,
        this.height * 0.48,
        0,
        this.width * 0.5,
        this.height * 0.48,
        this.width * 0.55,
      );

    glow.addColorStop(
      0,
      "rgba(20, 255, 110, 0.08)",
    );

    glow.addColorStop(
      1,
      "rgba(0, 0, 0, 0)",
    );

    this.context.fillStyle =
      glow;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.context.restore();
  }

  private drawLightningBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    this.context.save();

    const background =
      this.context.createRadialGradient(
        this.width * 0.5,
        this.height * 0.38,
        0,
        this.width * 0.5,
        this.height * 0.38,
        Math.max(
          this.width,
          this.height,
        ) * 0.8,
      );

    background.addColorStop(
      0,
      "#10173d",
    );

    background.addColorStop(
      0.48,
      "#070b20",
    );

    background.addColorStop(
      1,
      "#02030b",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    const flash =
      Math.pow(
        Math.max(
          0,
          Math.sin(time * 4.7),
        ),
        12,
      );

    if (flash > 0.02) {
      this.context.fillStyle =
        `rgba(120, 170, 255, ${
          flash * 0.16
        })`;

      this.context.fillRect(
        0,
        0,
        this.width,
        this.height,
      );
    }

    const bolts = 7;

    for (
      let bolt = 0;
      bolt < bolts;
      bolt += 1
    ) {
      const phase =
        time *
          (
            0.9 +
            bolt * 0.07
          ) +
        bolt * 2.17;

      const startX =
        this.width *
        (
          0.10 +
          bolt *
            (
              0.80 /
              (bolts - 1)
            )
        );

      const endY =
        this.height *
        (
          0.60 +
          (
            Math.sin(
              phase * 1.3,
            ) +
            1
          ) *
            0.12
        );

      this.context.beginPath();

      this.context.moveTo(
        startX,
        -10,
      );

      const segments = 11;

      for (
        let segment = 1;
        segment <= segments;
        segment += 1
      ) {
        const ratio =
          segment / segments;

        const jitter =
          Math.sin(
            phase * 7 +
            segment * 12.91,
          ) *
          this.width *
          0.018;

        this.context.lineTo(
          startX + jitter,
          endY * ratio,
        );
      }

      this.context.lineWidth =
        Math.max(
          1.2,
          this.width * 0.002,
        );

      this.context.strokeStyle =
        bolt % 2 === 0
          ? "rgba(90, 180, 255, 0.48)"
          : "rgba(185, 100, 255, 0.38)";

      this.context.shadowBlur =
        this.width * 0.025;

      this.context.shadowColor =
        bolt % 2 === 0
          ? "rgba(70, 170, 255, 0.8)"
          : "rgba(180, 80, 255, 0.7)";

      this.context.stroke();
    }

    this.context.restore();
  }

  private drawLuxuryGoldBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    this.context.save();

    const background =
      this.context.createRadialGradient(
        this.width * 0.5,
        this.height * 0.42,
        0,
        this.width * 0.5,
        this.height * 0.42,
        this.width * 0.78,
      );

    background.addColorStop(
      0,
      "#34260d",
    );

    background.addColorStop(
      0.38,
      "#151007",
    );

    background.addColorStop(
      1,
      "#050403",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    const pulse =
      (
        Math.sin(
          time * 1.35,
        ) +
        1
      ) *
      0.5;

    for (
      let ring = 0;
      ring < 7;
      ring += 1
    ) {
      const radius =
        this.width *
        (
          0.10 +
          ring * 0.075 +
          pulse * 0.008
        );

      this.context.beginPath();

      this.context.ellipse(
        this.width * 0.5,
        this.height * 0.44,
        radius,
        radius * 0.48,
        0,
        0,
        Math.PI * 2,
      );

      this.context.lineWidth =
        Math.max(
          1,
          this.width *
            (
              0.0015 +
              ring * 0.00025
            ),
        );

      this.context.strokeStyle =
        `rgba(255, 205, 80, ${
          0.22 -
          ring * 0.018
        })`;

      this.context.stroke();
    }

    for (
      let particle = 0;
      particle < 32;
      particle += 1
    ) {
      const phase =
        time *
          (
            0.16 +
            (particle % 5) *
              0.025
          ) +
        particle * 0.91;

      const x =
        (
          (
            particle * 0.173 +
            time * 0.018
          ) %
          1
        ) *
        this.width;

      const y =
        (
          (
            particle * 0.097 +
            Math.sin(phase) *
              0.04 +
            1
          ) %
          1
        ) *
        this.height;

      const radius =
        Math.max(
          1,
          this.width *
            (
              0.0012 +
              (particle % 4) *
                0.00045
            ),
        );

      this.context.beginPath();

      this.context.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2,
      );

      this.context.fillStyle =
        particle % 3 === 0
          ? "rgba(255, 244, 190, 0.62)"
          : "rgba(255, 190, 55, 0.38)";

      this.context.fill();
    }

    const floorY =
      this.height * 0.78;

    const floor =
      this.context.createLinearGradient(
        0,
        floorY,
        0,
        this.height,
      );

    floor.addColorStop(
      0,
      "rgba(255, 190, 45, 0.12)",
    );

    floor.addColorStop(
      1,
      "rgba(0, 0, 0, 0)",
    );

    this.context.fillStyle =
      floor;

    this.context.fillRect(
      0,
      floorY,
      this.width,
      this.height - floorY,
    );

    this.context.restore();
  }

  private drawOceanViewBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    this.context.save();

    const horizon =
      this.height * 0.48;

    const sky =
      this.context.createLinearGradient(
        0,
        0,
        0,
        horizon,
      );

    sky.addColorStop(
      0,
      "#061d38",
    );

    sky.addColorStop(
      0.55,
      "#0b5680",
    );

    sky.addColorStop(
      1,
      "#43b8ce",
    );

    this.context.fillStyle =
      sky;

    this.context.fillRect(
      0,
      0,
      this.width,
      horizon,
    );

    const ocean =
      this.context.createLinearGradient(
        0,
        horizon,
        0,
        this.height,
      );

    ocean.addColorStop(
      0,
      "#087a9c",
    );

    ocean.addColorStop(
      0.45,
      "#064963",
    );

    ocean.addColorStop(
      1,
      "#021a29",
    );

    this.context.fillStyle =
      ocean;

    this.context.fillRect(
      0,
      horizon,
      this.width,
      this.height - horizon,
    );

    const sunX =
      this.width * 0.72;

    const sunY =
      horizon * 0.52;

    const sun =
      this.context.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        this.width * 0.16,
      );

    sun.addColorStop(
      0,
      "rgba(255, 245, 190, 0.75)",
    );

    sun.addColorStop(
      0.25,
      "rgba(255, 210, 120, 0.30)",
    );

    sun.addColorStop(
      1,
      "rgba(255, 180, 80, 0)",
    );

    this.context.fillStyle =
      sun;

    this.context.fillRect(
      0,
      0,
      this.width,
      horizon,
    );

    for (
      let wave = 0;
      wave < 18;
      wave += 1
    ) {
      const baseY =
        horizon +
        (
          (wave + 1) / 19
        ) *
          (
            this.height -
            horizon
          );

      this.context.beginPath();

      for (
        let x = 0;
        x <= this.width;
        x += Math.max(
          12,
          this.width / 70,
        )
      ) {
        const y =
          baseY +
          Math.sin(
            x * 0.018 +
            time *
              (
                1.1 +
                wave * 0.035
              ) +
            wave * 0.7,
          ) *
            (
              2 +
              wave * 0.22
            );

        if (x === 0) {
          this.context.moveTo(
            x,
            y,
          );
        } else {
          this.context.lineTo(
            x,
            y,
          );
        }
      }

      this.context.lineWidth =
        Math.max(
          0.7,
          this.width * 0.001,
        );

      this.context.strokeStyle =
        `rgba(120, 225, 245, ${
          0.15 +
          (wave % 4) * 0.025
        })`;

      this.context.stroke();
    }

    this.context.restore();
  }

  private drawJungleBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    this.context.save();

    const background =
      this.context.createRadialGradient(
        this.width * 0.5,
        this.height * 0.42,
        0,
        this.width * 0.5,
        this.height * 0.42,
        this.width * 0.75,
      );

    background.addColorStop(
      0,
      "#164b2b",
    );

    background.addColorStop(
      0.45,
      "#092d1b",
    );

    background.addColorStop(
      1,
      "#02130c",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    const light =
      this.context.createLinearGradient(
        this.width * 0.5,
        0,
        this.width * 0.5,
        this.height,
      );

    light.addColorStop(
      0,
      "rgba(170, 255, 180, 0.16)",
    );

    light.addColorStop(
      0.5,
      "rgba(70, 210, 120, 0.04)",
    );

    light.addColorStop(
      1,
      "rgba(0, 0, 0, 0)",
    );

    this.context.fillStyle =
      light;

    this.context.fillRect(
      this.width * 0.22,
      0,
      this.width * 0.56,
      this.height,
    );

    for (
      let vine = 0;
      vine < 14;
      vine += 1
    ) {
      const x =
        (
          vine /
          13
        ) *
        this.width;

      const sway =
        Math.sin(
          time * 0.65 +
          vine * 1.37,
        ) *
        this.width *
        0.012;

      this.context.beginPath();

      this.context.moveTo(
        x,
        -20,
      );

      this.context.bezierCurveTo(
        x + sway * 2,
        this.height * 0.25,
        x - sway,
        this.height * 0.48,
        x + sway * 1.5,
        this.height * 0.72,
      );

      this.context.lineWidth =
        Math.max(
          2,
          this.width *
            (
              0.002 +
              (vine % 4) *
                0.0006
            ),
        );

      this.context.strokeStyle =
        vine % 2 === 0
          ? "rgba(25, 105, 55, 0.62)"
          : "rgba(15, 75, 40, 0.72)";

      this.context.stroke();
    }

    for (
      let leaf = 0;
      leaf < 38;
      leaf += 1
    ) {
      const phase =
        time *
          (
            0.18 +
            (leaf % 5) *
              0.018
          ) +
        leaf * 0.81;

      const x =
        (
          (
            leaf * 0.217 +
            Math.sin(phase) *
              0.018
          ) %
          1
        ) *
        this.width;

      const y =
        (
          (
            leaf * 0.139 +
            1
          ) %
          1
        ) *
        this.height;

      const radius =
        this.width *
        (
          0.012 +
          (leaf % 4) *
            0.004
        );

      this.context.save();

      this.context.translate(
        x,
        y,
      );

      this.context.rotate(
        Math.sin(phase) * 0.45,
      );

      this.context.beginPath();

      this.context.ellipse(
        0,
        0,
        radius,
        radius * 0.38,
        0,
        0,
        Math.PI * 2,
      );

      this.context.fillStyle =
        leaf % 3 === 0
          ? "rgba(65, 170, 85, 0.34)"
          : "rgba(25, 120, 60, 0.30)";

      this.context.fill();

      this.context.restore();
    }

    this.context.restore();
  }

  private drawIceStudioBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    this.context.save();

    const background =
      this.context.createLinearGradient(
        0,
        0,
        0,
        this.height,
      );

    background.addColorStop(
      0,
      "#102b48",
    );

    background.addColorStop(
      0.52,
      "#0a1b31",
    );

    background.addColorStop(
      1,
      "#030914",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    const centerX =
      this.width * 0.5;

    const centerY =
      this.height * 0.42;

    const glow =
      this.context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        this.width * 0.58,
      );

    glow.addColorStop(
      0,
      "rgba(145, 225, 255, 0.20)",
    );

    glow.addColorStop(
      0.48,
      "rgba(65, 155, 225, 0.07)",
    );

    glow.addColorStop(
      1,
      "rgba(0, 0, 0, 0)",
    );

    this.context.fillStyle =
      glow;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    for (
      let crystal = 0;
      crystal < 22;
      crystal += 1
    ) {
      const phase =
        time *
          (
            0.10 +
            (crystal % 5) *
              0.014
          ) +
        crystal * 1.17;

      const x =
        (
          (
            crystal * 0.183 +
            Math.sin(phase) *
              0.012 +
            1
          ) %
          1
        ) *
        this.width;

      const y =
        (
          (
            crystal * 0.127 +
            Math.cos(phase * 0.8) *
              0.018 +
            1
          ) %
          1
        ) *
        this.height;

      const radius =
        this.width *
        (
          0.010 +
          (crystal % 5) *
            0.0035
        );

      this.context.beginPath();

      for (
        let point = 0;
        point < 6;
        point += 1
      ) {
        const angle =
          (
            Math.PI * 2 *
            point
          ) /
            6 +
          phase * 0.05;

        const px =
          x +
          Math.cos(angle) *
            radius;

        const py =
          y +
          Math.sin(angle) *
            radius *
            1.55;

        if (point === 0) {
          this.context.moveTo(
            px,
            py,
          );
        } else {
          this.context.lineTo(
            px,
            py,
          );
        }
      }

      this.context.closePath();

      this.context.fillStyle =
        crystal % 3 === 0
          ? "rgba(180, 235, 255, 0.12)"
          : "rgba(80, 170, 235, 0.09)";

      this.context.fill();

      this.context.strokeStyle =
        "rgba(185, 235, 255, 0.20)";

      this.context.lineWidth =
        Math.max(
          0.7,
          this.width * 0.0008,
        );

      this.context.stroke();
    }

    const floorY =
      this.height * 0.76;

    const floor =
      this.context.createLinearGradient(
        0,
        floorY,
        0,
        this.height,
      );

    floor.addColorStop(
      0,
      "rgba(120, 210, 255, 0.13)",
    );

    floor.addColorStop(
      1,
      "rgba(10, 35, 60, 0.03)",
    );

    this.context.fillStyle =
      floor;

    this.context.fillRect(
      0,
      floorY,
      this.width,
      this.height - floorY,
    );

    for (
      let line = -8;
      line <= 8;
      line += 1
    ) {
      this.context.beginPath();

      this.context.moveTo(
        centerX,
        floorY,
      );

      this.context.lineTo(
        centerX +
          line *
            this.width *
            0.10,
        this.height,
      );

      this.context.strokeStyle =
        "rgba(130, 215, 255, 0.10)";

      this.context.lineWidth =
        1;

      this.context.stroke();
    }

    this.context.restore();
  }
  private drawGalaxyBackground(
    now: number,
  ): void {
    const time =
      now * 0.001;

    const background =
      this.context.createRadialGradient(
        this.width * 0.55,
        this.height * 0.42,
        0,
        this.width * 0.5,
        this.height * 0.5,
        this.width * 0.82,
      );

    background.addColorStop(
      0,
      "#24145f",
    );

    background.addColorStop(
      0.38,
      "#0a1b3d",
    );

    background.addColorStop(
      0.72,
      "#050914",
    );

    background.addColorStop(
      1,
      "#010205",
    );

    this.context.fillStyle =
      background;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    this.context.save();

    this.context.globalCompositeOperation =
      "screen";

    const nebulaX =
      this.width *
      (
        0.5 +
        Math.sin(time * 0.2) * 0.08
      );

    const nebula =
      this.context.createRadialGradient(
        nebulaX,
        this.height * 0.45,
        0,
        nebulaX,
        this.height * 0.45,
        this.width * 0.52,
      );

    nebula.addColorStop(
      0,
      "rgba(130, 70, 255, 0.22)",
    );

    nebula.addColorStop(
      0.45,
      "rgba(0, 190, 255, 0.10)",
    );

    nebula.addColorStop(
      1,
      "rgba(0, 0, 0, 0)",
    );

    this.context.fillStyle =
      nebula;

    this.context.fillRect(
      0,
      0,
      this.width,
      this.height,
    );

    for (
      let index = 0;
      index < 65;
      index += 1
    ) {
      const x =
        (
          Math.abs(
            Math.sin(
              index * 12.9898,
            ) * 43758.5453,
          ) %
          1
        ) *
        this.width;

      const y =
        (
          Math.abs(
            Math.sin(
              index * 78.233,
            ) * 12345.6789,
          ) %
          1
        ) *
        this.height;

      const alpha =
        0.35 +
        0.65 *
          (
            0.5 +
            0.5 *
              Math.sin(
                time * 1.7 +
                index * 1.31,
              )
          );

      this.context.beginPath();

      this.context.arc(
        x,
        y,
        index % 10 === 0
          ? 2.2
          : 1.1,
        0,
        Math.PI * 2,
      );

      this.context.fillStyle =
        `rgba(225, 242, 255, ${alpha})`;

      this.context.fill();
    }

    this.context.restore();
  }

  private applyEffect(): void {
    switch (this.effect) {
      case "vyro-aura":
        this.context.filter =
          "contrast(1.08) saturate(1.18) brightness(1.05)";
        break;

      case "vyro-prism":
        this.context.filter =
          "contrast(1.10) saturate(1.28) brightness(1.03) hue-rotate(8deg)";
        break;

      case "vyro-dream":
        this.context.filter =
          "contrast(0.98) saturate(1.12) brightness(1.08)";
        break;

      case "vyro-night":
        this.context.filter =
          "contrast(1.18) saturate(1.08) brightness(0.86)";
        break;

      default:
        this.context.filter =
          "none";
    }
  }

  private drawVyroEffectLayer(): void {
    this.context.save();

    switch (this.effect) {
      case "vyro-aura": {
        const gradient =
          this.context.createRadialGradient(
            this.width * 0.5,
            this.height * 0.45,
            this.width * 0.08,
            this.width * 0.5,
            this.height * 0.5,
            this.width * 0.72,
          );

        gradient.addColorStop(
          0,
          "rgba(120, 255, 255, 0.04)",
        );
        gradient.addColorStop(
          0.58,
          "rgba(0, 220, 255, 0.08)",
        );
        gradient.addColorStop(
          1,
          "rgba(120, 70, 255, 0.16)",
        );

        this.context.globalCompositeOperation =
          "screen";
        this.context.fillStyle = gradient;
        this.context.fillRect(
          0,
          0,
          this.width,
          this.height,
        );
        break;
      }

      case "vyro-prism": {
        const gradient =
          this.context.createLinearGradient(
            0,
            0,
            this.width,
            this.height,
          );

        gradient.addColorStop(
          0,
          "rgba(0, 240, 255, 0.11)",
        );
        gradient.addColorStop(
          0.48,
          "rgba(130, 90, 255, 0.035)",
        );
        gradient.addColorStop(
          1,
          "rgba(255, 70, 210, 0.10)",
        );

        this.context.globalCompositeOperation =
          "screen";
        this.context.fillStyle = gradient;
        this.context.fillRect(
          0,
          0,
          this.width,
          this.height,
        );
        break;
      }

      case "vyro-dream": {
        const gradient =
          this.context.createRadialGradient(
            this.width * 0.5,
            this.height * 0.38,
            0,
            this.width * 0.5,
            this.height * 0.5,
            this.width * 0.78,
          );

        gradient.addColorStop(
          0,
          "rgba(255, 255, 255, 0.10)",
        );
        gradient.addColorStop(
          0.62,
          "rgba(100, 230, 255, 0.055)",
        );
        gradient.addColorStop(
          1,
          "rgba(80, 80, 180, 0.07)",
        );

        this.context.globalCompositeOperation =
          "screen";
        this.context.fillStyle = gradient;
        this.context.fillRect(
          0,
          0,
          this.width,
          this.height,
        );
        break;
      }

      case "vyro-night": {
        const vignette =
          this.context.createRadialGradient(
            this.width * 0.5,
            this.height * 0.48,
            this.width * 0.18,
            this.width * 0.5,
            this.height * 0.5,
            this.width * 0.76,
          );

        vignette.addColorStop(
          0,
          "rgba(0, 10, 30, 0)",
        );
        vignette.addColorStop(
          0.7,
          "rgba(0, 16, 40, 0.10)",
        );
        vignette.addColorStop(
          1,
          "rgba(0, 5, 20, 0.42)",
        );

        this.context.globalCompositeOperation =
          "source-over";
        this.context.fillStyle = vignette;
        this.context.fillRect(
          0,
          0,
          this.width,
          this.height,
        );
        break;
      }

      default:
        break;
    }

    this.context.restore();
  }
}

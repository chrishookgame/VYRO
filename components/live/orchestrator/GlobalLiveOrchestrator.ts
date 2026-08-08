import {
  createLivePerformanceState,
} from "./analytics/LivePerformanceMonitor";

import {
  createOverlayCoordinatorState,
} from "./overlays/OverlayCoordinator";

import {
  createLiveRuntimeState,
} from "./runtime/LiveRuntime";

import {
  createLiveSchedulerState,
} from "./scheduler/LiveScheduler";

import {
  createPrioritySchedulerState,
} from "./scheduler/PriorityScheduler";

import {
  createTransitionDirectorState,
} from "./transitions/TransitionDirector";

import type {
  createGlobalLiveDirectorAIState,
} from "@/components/live/directorai/GlobalLiveDirectorAI";

import type {
  createGlobalUniverseDirectorState,
} from "@/components/live/universe/director/GlobalUniverseDirector";

export interface GlobalLiveOrchestratorInput {
  directorAI:
    ReturnType<
      typeof createGlobalLiveDirectorAIState
    >;

  universe:
    ReturnType<
      typeof createGlobalUniverseDirectorState
    >;
}

export function createGlobalLiveOrchestratorState(
  input:GlobalLiveOrchestratorInput,
){
  const worldMoment=
    input.universe.worldEvent.active ||
    input.directorAI.eventDirector.priority ===
      "CRITICAL";

  const cinematic=
    input.directorAI.camera.mode ===
      "CINEMATIC" ||
    input.directorAI.camera.mode ===
      "WORLD";

  const runtime=
    createLiveRuntimeState({
      excitementScore:
        input.directorAI.excitement.score,

      worldMoment,

      cinematic,
    });

  const priority=
    createPrioritySchedulerState({
      excitementScore:
        input.directorAI.excitement.score,

      eventPriority:
        input.directorAI.eventDirector.priority,

      worldEventActive:
        input.universe.worldEvent.active,

      storylineActive:
        input.directorAI.storyline.active,

      explosive:
        input.directorAI.excitement.explosive,
    });

  const scheduler=
    createLiveSchedulerState({
      priority:
        priority.priority,

      cinematic,

      worldMoment,
    });

  const transition=
    createTransitionDirectorState({
      cameraMode:
        input.directorAI.camera.mode,

      intensity:
        runtime.intensity,

      worldMoment,
    });

  const overlays=
    createOverlayCoordinatorState({
      selectedChannel:
        priority.channel,

      worldEventActive:
        input.universe.worldEvent.active,

      presentationActive:
        input.directorAI
          .eventDirector
          .shouldPresent,

      storylineActive:
        input.directorAI
          .storyline
          .active,
    });

  const performance=
    createLivePerformanceState({
      excitementScore:
        input.directorAI.excitement.score,

      intensity:
        runtime.intensity,

      priority:
        priority.priority,

      motion:
        input.directorAI.camera.motion,
    });

  return {
    mode:
      runtime.mode,

    intensity:
      runtime.intensity,

    runtime,

    priority,

    scheduler,

    transition,

    overlays,

    performance,

    camera:
      input.directorAI.camera,

    adaptive:
      input.directorAI.adaptive,

    storyline:
      input.directorAI.storyline,

    eventDirector:
      input.directorAI.eventDirector,

    worldMoment,

    cinematic,

    runtimePriority:
      priority.priority,
  } as const;
}

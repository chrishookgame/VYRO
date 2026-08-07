"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  advancePresentationTransition,
  createPresentationTransitionState,
  type PresentationTransitionDurations,
  type PresentationTransitionState,
} from "@/components/live/presentationdirector/transitions/PresentationTransition";

import {
  DEFAULT_PRESENTATION_TRANSITION_DURATIONS,
  getPresentationAnimationStyle,
  getPresentationAnimationTransition,
} from "@/components/live/presentationdirector/animation/PresentationAnimation";

import type {
  ScheduledPresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export function usePresentationTransition(
  event:ScheduledPresentationEvent | null,
  durations:
    PresentationTransitionDurations =
      DEFAULT_PRESENTATION_TRANSITION_DURATIONS,
){
  const [
    state,
    setState,
  ]=
    useState<
      PresentationTransitionState
    >(
      () =>
        createPresentationTransitionState(
          event,
          Date.now(),
        ),
    );

  const eventKey=
    event?.id ??
    "none";

  useEffect(() => {
    setState(
      createPresentationTransitionState(
        event,
        Date.now(),
      ),
    );
  }, [
    event,
    eventKey,
  ]);

  useEffect(() => {
    if(
      !state.event ||
      state.phase === "IDLE"
    ){
      return;
    }

    let delay=0;

    if(state.phase === "ENTER"){
      delay=
        durations.enterMs;
    }else if(
      state.phase === "VISIBLE"
    ){
      delay=
        Math.max(
          0,
          state.event.durationMs -
          durations.enterMs -
          durations.exitMs,
        );
    }else if(
      state.phase === "EXIT"
    ){
      delay=
        durations.exitMs;
    }

    const timeout=
      window.setTimeout(
        () => {
          setState(
            current =>
              advancePresentationTransition(
                current,
                Date.now(),
                durations,
              ),
          );
        },
        delay,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    durations,
    state.event,
    state.phase,
  ]);

  const animationStyle=
    useMemo(
      () =>
        getPresentationAnimationStyle(
          state.phase,
        ),
      [
        state.phase,
      ],
    );

  return {
    ...state,

    animationStyle,

    transition:
      getPresentationAnimationTransition(),

    visible:
      state.phase !== "IDLE",
  };
}

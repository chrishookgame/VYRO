"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  LiveRecognitionMoment,
} from "./types";

export function useLiveRecognitionLifecycle(
  candidate:
    LiveRecognitionMoment | null,
): LiveRecognitionMoment | null {
  const [
    activeMoment,
    setActiveMoment,
  ] =
    useState<
      LiveRecognitionMoment | null
    >(null);

  const timeoutRef =
    useRef<number | null>(
      null,
    );

  const armedRef =
    useRef(true);

  useEffect(
    () => {
      if (candidate === null) {
        armedRef.current =
          true;

        return;
      }

      if (!armedRef.current) {
        return;
      }

      armedRef.current =
        false;

      setActiveMoment(
        candidate,
      );

      if (
        timeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          timeoutRef.current,
        );
      }

      timeoutRef.current =
        window.setTimeout(
          () => {
            setActiveMoment(
              null,
            );

            timeoutRef.current =
              null;
          },
          candidate.durationMs,
        );
    },
    [candidate],
  );

  useEffect(
    () => {
      return () => {
        if (
          timeoutRef.current !==
          null
        ) {
          window.clearTimeout(
            timeoutRef.current,
          );

          timeoutRef.current =
            null;
        }
      };
    },
    [],
  );

  return activeMoment;
}
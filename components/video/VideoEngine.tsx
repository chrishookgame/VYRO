"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoVisibility } from "@/hooks/useVideoVisibility";
import { ProgressBar, PulseAnimation } from "./";

type VideoEngineProps = {
  videoUrl: string;
};

export default function VideoEngine({
  videoUrl,
}: VideoEngineProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVisible = useVideoVisibility(videoRef);

  const [progress, setProgress] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  function handleTimeUpdate() {
    const video = videoRef.current;

    if (!video || video.duration === 0) return;

    setProgress((video.currentTime / video.duration) * 100);
  }

  function togglePlay() {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function handleDoubleClick() {
    setShowPulse(true);

    window.setTimeout(() => {
      setShowPulse(false);
    }, 700);
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
        onTimeUpdate={handleTimeUpdate}
      />

      <ProgressBar progress={progress} />

      <PulseAnimation show={showPulse} />

      {!isVisible && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/50 p-6 text-5xl backdrop-blur-md">
            ▶
          </div>
        </div>
      )}
    </div>
  );
}
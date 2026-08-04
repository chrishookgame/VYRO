"use client";

import { useEffect, useRef, useState } from "react";
import LikeAnimation from "./LikeAnimation";
import ProgressBar from "@/components/video/ProgressBar";

type VideoPlayerProps = {
  videoUrl: string;
};

export default function VideoPlayer({
  videoUrl,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [showLike, setShowLike] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const updateProgress = () => {
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, []);
function handleDoubleClick() {
  setShowLike(true);

  setTimeout(() => {
    setShowLike(false);
  }, 700);
}
  return (
    <div className="relative h-full w-full">

      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onDoubleClick={handleDoubleClick}
      />

      <ProgressBar progress={progress} />
      <LikeAnimation show={showLike} />

    </div>
  );
}
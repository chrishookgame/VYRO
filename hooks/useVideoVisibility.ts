"use client";

import { useEffect, useState } from "react";

export function useVideoVisibility(
  ref: React.RefObject<Element | null>
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.7,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}
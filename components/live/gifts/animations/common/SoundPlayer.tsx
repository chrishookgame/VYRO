"use client";

interface SoundPlayerProps {
  soundKey: string;
  enabled?: boolean;
}

export default function SoundPlayer({
  soundKey,
  enabled = true,
}: SoundPlayerProps) {
  if (!enabled) {
    return null;
  }

  return (
    <span
      className="sr-only"
      data-vyro-sound-key={soundKey}
    >
      Sonido VYRO preparado
    </span>
  );
}

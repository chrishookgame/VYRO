"use client";

import {
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
  type Room,
} from "livekit-client";
import {
  useEffect,
  useRef,
} from "react";

type BattleAudioReceiverProps = {
  room: Room | null;
  isLive: boolean;
};

export function BattleAudioReceiver({
  room,
  isLive,
}: BattleAudioReceiverProps) {
  const audioContainerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!room || !isLive) {
      return;
    }

    const attachBattleAudio = (
      track: RemoteTrack,
      _publication: RemoteTrackPublication,
      participant: RemoteParticipant,
    ) => {
      if (
        track.kind !== Track.Kind.Audio ||
        !participant.identity.startsWith(
          "battle:",
        )
      ) {
        return;
      }

      const container =
        audioContainerRef.current;

      if (!container) {
        return;
      }

      const selector =
        `[data-vyro-battle-audio="${participant.identity}"]`;

      if (
        container.querySelector(
          selector,
        )
      ) {
        return;
      }

      const element =
        track.attach();

      element.autoplay = true;
      element.dataset.vyroBattleAudio =
        participant.identity;

      console.info(
        "[VYRO BATTLE AUDIO][CREATOR] RIVAL AUDIO ATTACHED",
        {
          identity: participant.identity,
          kind: track.kind,
          muted: track.isMuted,
          elementPaused: element.paused,
          autoplay: element.autoplay,
        },
      );

      container.appendChild(element);
    };

    const detachBattleAudio = (
      track: RemoteTrack,
      _publication: RemoteTrackPublication,
      participant: RemoteParticipant,
    ) => {
      if (
        track.kind !== Track.Kind.Audio ||
        !participant.identity.startsWith(
          "battle:",
        )
      ) {
        return;
      }

      track.detach();

      audioContainerRef.current
        ?.querySelector(
          `[data-vyro-battle-audio="${participant.identity}"]`,
        )
        ?.remove();
    };

    room.on(
      RoomEvent.TrackSubscribed,
      attachBattleAudio,
    );

    room.on(
      RoomEvent.TrackUnsubscribed,
      detachBattleAudio,
    );

    room.remoteParticipants.forEach(
      (participant) => {
        if (
          !participant.identity.startsWith(
            "battle:",
          )
        ) {
          return;
        }

        participant.trackPublications.forEach(
          (publication) => {
            const track =
              publication.track;

            if (
              track &&
              track.kind === Track.Kind.Audio
            ) {
              attachBattleAudio(
                track,
                publication,
                participant,
              );
            }
          },
        );
      },
    );

    return () => {
      room.off(
        RoomEvent.TrackSubscribed,
        attachBattleAudio,
      );

      room.off(
        RoomEvent.TrackUnsubscribed,
        detachBattleAudio,
      );

      audioContainerRef.current
        ?.querySelectorAll(
          "[data-vyro-battle-audio]",
        )
        .forEach(
          (element) => {
            element.remove();
          },
        );
    };
  }, [
    isLive,
    room,
  ]);

  return (
    <div
      ref={audioContainerRef}
      className="hidden"
      aria-hidden="true"
    />
  );
}
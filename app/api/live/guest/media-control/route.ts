import {
  RoomServiceClient,
  TrackSource,
} from "livekit-server-sdk";
import { NextResponse } from "next/server";

import { getErrorMessage } from "@/lib/core";

import { createServerSupabaseClient } from "@/lib/supabase-server";

type MediaKind =
  | "camera"
  | "microphone";

type MediaControlRequestBody = {
  roomId?: unknown;
  guestIdentity?: unknown;
  trackSid?: unknown;
  media?: unknown;
  muted?: unknown;
};

export async function POST(
  request: Request,
) {
  try {
    const supabase =
      await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Debes iniciar sesión para controlar los medios del Guest.",
        },
        {
          status: 401,
        },
      );
    }

    const body =
      (await request.json()) as
        MediaControlRequestBody;

    const roomId =
      typeof body.roomId === "string"
        ? body.roomId.trim()
        : "";

    const guestIdentity =
      typeof body.guestIdentity === "string"
        ? body.guestIdentity.trim()
        : "";

    const trackSid =
      typeof body.trackSid === "string"
        ? body.trackSid.trim()
        : "";

    const media: MediaKind | null =
      body.media === "camera" ||
      body.media === "microphone"
        ? body.media
        : null;

    const muted =
      typeof body.muted === "boolean"
        ? body.muted
        : null;

    if (
      !roomId ||
      !guestIdentity ||
      !trackSid ||
      !media ||
      muted === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "La solicitud de control de medios no es válida.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !guestIdentity.startsWith(
        "guest:",
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "El participante indicado no es un Guest válido.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: roomData,
      error: roomError,
    } = await supabase
      .from("live_rooms")
      .select(
        "id,host_id,status",
      )
      .eq(
        "id",
        roomId,
      )
      .maybeSingle();

    if (roomError) {
      console.error(
        "VYRO Host Media Control room validation failed:",
        roomError.message,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "No fue posible validar este VYRO LIVE.",
        },
        {
          status: 500,
        },
      );
    }

    if (!roomData) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Este VYRO LIVE no existe.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      roomData.host_id !== user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No tienes permiso para controlar los medios de este LIVE.",
        },
        {
          status: 403,
        },
      );
    }

    const livekitUrl =
      process.env.LIVEKIT_URL?.trim();

    const livekitApiKey =
      process.env.LIVEKIT_API_KEY?.trim();

    const livekitApiSecret =
      process.env.LIVEKIT_API_SECRET?.trim();

    if (
      !livekitUrl ||
      !livekitApiKey ||
      !livekitApiSecret
    ) {
      console.error(
        "VYRO Host Media Control: LiveKit configuration missing.",
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "VYRO LIVE Media Core no está disponible temporalmente.",
        },
        {
          status: 503,
        },
      );
    }

    const roomService =
      new RoomServiceClient(
        livekitUrl,
        livekitApiKey,
        livekitApiSecret,
      );

    const participant =
      await roomService.getParticipant(
        roomId,
        guestIdentity,
      );

    const publishedTrack =
      participant.tracks.find(
        (track) =>
          track.sid === trackSid,
      );

    if (!publishedTrack) {
      return NextResponse.json(
        {
          success: false,
          error:
            "La publicación solicitada ya no está disponible.",
        },
        {
          status: 404,
        },
      );
    }

    const expectedSource =
      media === "camera"
        ? TrackSource.CAMERA
        : TrackSource.MICROPHONE;

    if (
      publishedTrack.source !==
      expectedSource
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "La publicación no corresponde al medio solicitado.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedTrack =
      await roomService.mutePublishedTrack(
        roomId,
        guestIdentity,
        trackSid,
        muted,
      );

    return NextResponse.json(
      {
        success: true,
        media,
        muted,
        trackSid:
          updatedTrack.sid,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "VYRO Host Media Control failed:",
      getErrorMessage(error),
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible actualizar los medios del Guest.",
      },
      {
        status: 500,
      },
    );
  }
}
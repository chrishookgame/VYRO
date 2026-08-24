import { AccessToken, TrackSource } from "livekit-server-sdk";
import { NextResponse } from "next/server";

import { getErrorMessage } from "@/lib/core";

import { createServerSupabaseClient } from "@/lib/supabase-server";

type LiveTokenRole =
  | "host"
  | "guest"
  | "viewer";

type LiveTokenRequestBody = {
  roomId?: unknown;
  role?: unknown;
};

type LiveRoomRow = {
  id: string;
  host_id: string;
  status: string;
  visibility: "public" | "private";
};

type LiveGuestPermissions = {
  canPublishCamera: boolean;
  canPublishMicrophone: boolean;
  canShareScreen: boolean;
};

type LiveGuestInvitationRow = {
  id: string;
  guest_id: string;
  status: string;
  stage_status: string;
  permissions: unknown;
};

const DEFAULT_GUEST_PERMISSIONS:
  LiveGuestPermissions = {
    canPublishCamera: true,
    canPublishMicrophone: true,
    canShareScreen: false,
  };

function parseGuestPermissions(
  value: unknown,
): LiveGuestPermissions {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return DEFAULT_GUEST_PERMISSIONS;
  }

  const permissions =
    value as Record<string, unknown>;

  return {
    canPublishCamera:
      permissions.canPublishCamera === true,
    canPublishMicrophone:
      permissions.canPublishMicrophone === true,
    canShareScreen:
      permissions.canShareScreen === true,
  };
}

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


    const body =
      (await request.json()) as
        LiveTokenRequestBody;

    const roomId =
      typeof body.roomId === "string"
        ? body.roomId.trim()
        : "";

    const role: LiveTokenRole | null =
      body.role === "host" ||
      body.role === "guest" ||
      body.role === "viewer"
        ? body.role
        : null;

    if (!roomId || !role) {
      return NextResponse.json(
        {
          success: false,
          token: "",
          url: "",
          error:
            "La solicitud de acceso LIVE no es válida.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      (
        role === "host" ||
        role === "guest"
      ) &&
      (
        authError ||
        !user
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          token: "",
          url: "",
          error:
            "Debes iniciar sesión para transmitir o participar como Guest.",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: roomData,
      error: roomError,
    } = await supabase
      .from("live_rooms")
      .select(
        "id,host_id,status,visibility",
      )
      .eq(
        "id",
        roomId,
      )
      .maybeSingle();

    if (roomError) {
      console.error(
        "VYRO LiveKit LIVE validation failed:",
        roomError.message,
      );

      return NextResponse.json(
        {
          success: false,
          token: "",
          url: "",
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
          token: "",
          url: "",
          error:
            "Este VYRO LIVE no existe.",
        },
        {
          status: 404,
        },
      );
    }

    const room =
      roomData as LiveRoomRow;

    if (
      role === "host" &&
      room.host_id !== user!.id
    ) {
      return NextResponse.json(
        {
          success: false,
          token: "",
          url: "",
          error:
            "No tienes permiso para transmitir este LIVE.",
        },
        {
          status: 403,
        },
      );
    }

    if (
      role === "viewer" &&
      room.visibility !== "public"
    ) {
      return NextResponse.json(
        {
          success: false,
          token: "",
          url: "",
          error:
            "Este VYRO LIVE es privado.",
        },
        {
          status: 403,
        },
      );
    }

    if (
      (
        role === "viewer" ||
        role === "guest"
      ) &&
      ![
        "live",
        "active",
        "scheduled",
      ].includes(room.status)
    ) {
      return NextResponse.json(
        {
          success: false,
          token: "",
          url: "",
          error:
            "Esta transmisión ya no está disponible.",
        },
        {
          status: 409,
        },
      );
    }

    let guestPermissions:
      LiveGuestPermissions | null =
      null;

    let guestInvitationId:
      string | null =
      null;

    let guestStageStatus:
      string | null =
      null;

    if (role === "guest") {
      const {
        data: invitationData,
        error: invitationError,
      } = await supabase
        .from(
          "live_guest_invitations",
        )
        .select(
          "id,guest_id,status,stage_status,permissions",
        )
        .eq(
          "room_id",
          roomId,
        )
        .eq(
          "guest_id",
          user!.id,
        )
        .eq(
          "status",
          "accepted",
        )
        .order(
          "accepted_at",
          {
            ascending: false,
          },
        )
        .limit(1);

      if (invitationError) {
        console.error(
          "VYRO Guest authorization failed:",
          invitationError.message,
        );

        return NextResponse.json(
          {
            success: false,
            token: "",
            url: "",
            error:
              "No fue posible validar tu acceso como invitado.",
          },
          {
            status: 500,
          },
        );
      }

      const guestInvitation =
        (
          invitationData?.[0] ??
          null
        ) as
          | LiveGuestInvitationRow
          | null;

      if (
        !guestInvitation ||
        guestInvitation.guest_id !==
          user!.id ||
        guestInvitation.status !==
          "accepted"
      ) {
        return NextResponse.json(
          {
            success: false,
            token: "",
            url: "",
            error:
              "No tienes una invitación Guest activa para este LIVE.",
          },
          {
            status: 403,
          },
        );
      }

      guestInvitationId =
        guestInvitation.id;

      guestStageStatus =
        guestInvitation.stage_status;

      guestPermissions =
        parseGuestPermissions(
          guestInvitation.permissions,
        );

      if (
        !guestPermissions
          .canPublishCamera &&
        !guestPermissions
          .canPublishMicrophone
      ) {
        return NextResponse.json(
          {
            success: false,
            token: "",
            url: "",
            error:
              "Tu acceso Guest no tiene fuentes multimedia habilitadas.",
          },
          {
            status: 403,
          },
        );
      }
    }

    const livekitUrl =
      process.env.LIVEKIT_URL;

    const apiKey =
      process.env.LIVEKIT_API_KEY;

    const apiSecret =
      process.env.LIVEKIT_API_SECRET;

    if (
      !livekitUrl ||
      !apiKey ||
      !apiSecret
    ) {
      console.error(
        "VYRO LiveKit configuration missing.",
      );

      return NextResponse.json(
        {
          success: false,
          token: "",
          url: "",
          error:
            "VYRO LIVE Media Core no está disponible temporalmente.",
        },
        {
          status: 503,
        },
      );
    }

    const viewerId =
      user?.id ??
      crypto.randomUUID();

    const identity =
      role === "host"
        ? `host:${user!.id}`
        : role === "guest"
          ? `guest:${user!.id}`
          : `viewer:${viewerId}`;

    const participantName =
      role === "host"
        ? "VYRO Host"
        : role === "guest"
          ? "VYRO Guest"
          : "VYRO Viewer";

    const canPublish =
      role === "host" ||
      (
        role === "guest" &&
        guestStageStatus === "on_stage"
      );

    const guestPublishSources =
      role === "guest" &&
      guestStageStatus === "on_stage" &&
      guestPermissions
        ? [
            ...(guestPermissions.canPublishCamera
              ? [TrackSource.CAMERA]
              : []),
            ...(guestPermissions.canPublishMicrophone
              ? [TrackSource.MICROPHONE]
              : []),
            ...(guestPermissions.canShareScreen
              ? [
                  TrackSource.SCREEN_SHARE,
                  TrackSource.SCREEN_SHARE_AUDIO,
                ]
              : []),
          ]
        : undefined;

    const token =
      new AccessToken(
        apiKey,
        apiSecret,
        {
          identity,
          name:
            participantName,
          ttl: "2h",
          metadata:
            JSON.stringify({
              vyroUserId:
                user?.id ?? null,
              role,
              roomId,
              guestInvitationId,
              guestPermissions,
            }),
        },
      );

    token.addGrant({
      roomJoin: true,
      room: roomId,
      canPublish,
      canPublishSources:
        guestPublishSources,
      canSubscribe: true,
      canPublishData:
        role === "host",
    });

    const jwt =
      await token.toJwt();

    return NextResponse.json({
      success: true,
      token: jwt,
      url: livekitUrl,
      roomId,
      role,
      guestPermissions,
    });
  }
  catch (error) {
    console.error(
      "VYRO LiveKit token error:",
      getErrorMessage(error),
    );

    return NextResponse.json(
      {
        success: false,
        token: "",
        url: "",
        error:
          "No fue posible preparar el acceso a VYRO LIVE.",
      },
      {
        status: 500,
      },
    );
  }
}

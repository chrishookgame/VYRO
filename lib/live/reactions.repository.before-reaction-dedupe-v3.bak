import { supabase } from "@/lib/supabase";

export type LiveReactionType =
  | "like"
  | "love"
  | "fire"
  | "wow"
  | "celebrate"
  | "support"
  | "vyro_energy";

export type SendLiveReactionInput = {
  roomId: string;
  reactionType: LiveReactionType;
  intensity?: number;
  metadata?: Record<string, unknown>;
};

export async function sendLiveReaction({
  roomId,
  reactionType,
  intensity = 1,
  metadata = {},
}: SendLiveReactionInput) {
  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "Debes iniciar sesión para reaccionar al LIVE.",
    );
  }

  const safeIntensity =
    Math.min(
      10,
      Math.max(
        1,
        Math.trunc(intensity),
      ),
    );

  const {
    error,
  } = await supabase
    .from("live_reactions")
    .insert({
      room_id: roomId,
      user_id: user.id,
      reaction_type: reactionType,
      intensity: safeIntensity,
      metadata,
    });

  if (error) {
    console.error(
      "VYRO live reaction insert error:",
      {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        roomId,
        userId: user.id,
        reactionType,
      },
    );

    const errorParts = [
      error.code
        ? `[${error.code}]`
        : "",
      error.message,
      error.details
        ? `Details: ${error.details}`
        : "",
      error.hint
        ? `Hint: ${error.hint}`
        : "",
    ].filter(Boolean);

    throw new Error(
      `No se pudo enviar la reacción. ${errorParts.join(
        " ",
      )}`,
    );
  }
}
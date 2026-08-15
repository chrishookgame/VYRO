"use client";

import {
  LoaderCircle,
  UserPlus,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLiveGuestRequests } from "@/hooks/useLiveGuestRequests";
import { supabase } from "@/lib/supabase";

type LiveGuestRequestButtonProps = {
  roomId: string;
  hostId: string;
  hasActiveInvitation: boolean;
  disabled?: boolean;
  onAuthRequired: () => void;
};

export function LiveGuestRequestButton({
  roomId,
  hostId,
  hasActiveInvitation,
  disabled = false,
  onAuthRequired,
}: LiveGuestRequestButtonProps) {
  const {
    requests,
    loading,
    error: requestError,
    requestAccess,
    cancelRequest,
  } = useLiveGuestRequests(roomId);

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState<string | null>(null);

  const [
    authResolved,
    setAuthResolved,
  ] = useState(false);

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    localError,
    setLocalError,
  ] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      setCurrentUserId(
        user?.id ?? null,
      );

      setAuthResolved(true);
    }

    void loadCurrentUser();

    return () => {
      active = false;
    };
  }, []);

  const activeOwnRequest =
    useMemo(
      () =>
        requests.find(
          (request) =>
            request.roomId === roomId &&
            request.requesterId ===
              currentUserId &&
            request.status === "pending",
        ) ?? null,
      [
        currentUserId,
        requests,
        roomId,
      ],
    );

  if (
    !authResolved ||
    hasActiveInvitation ||
    currentUserId === hostId
  ) {
    return null;
  }

  async function handleGuestRequest() {
    if (processing) {
      return;
    }

    if (!currentUserId) {
      onAuthRequired();
      return;
    }

    setProcessing(true);
    setLocalError("");

    try {
      if (activeOwnRequest) {
        await cancelRequest(
          activeOwnRequest.id,
        );
      } else {
        await requestAccess({
          roomId,
        });
      }
    } catch (guestRequestError) {
      setLocalError(
        guestRequestError instanceof Error
          ? guestRequestError.message
          : "No se pudo procesar la solicitud Guest.",
      );
    } finally {
      setProcessing(false);
    }
  }

  const pending =
    Boolean(activeOwnRequest);

  const busy =
    disabled ||
    loading ||
    processing;

  return (
    <button
      type="button"
      aria-label={
        pending
          ? "Cancelar solicitud Guest"
          : "Solicitar subir como Guest"
      }
      aria-pressed={pending}
      disabled={busy}
      title={
        localError ||
        requestError ||
        (
          pending
            ? "Tu solicitud esta esperando decision del Creator."
            : "Solicita participar en este LIVE como Guest."
        )
      }
      onClick={() => {
        void handleGuestRequest();
      }}
      className={[
        "flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-black transition duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        pending
          ? "border border-amber-300/25 bg-amber-300/10 text-amber-100 hover:bg-amber-300/15"
          : "border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15",
      ].join(" ")}
    >
      {processing || loading ? (
        <LoaderCircle
          size={15}
          className="animate-spin"
        />
      ) : (
        <UserPlus size={15} />
      )}

      <span className="hidden sm:inline">
        {processing
          ? "Procesando..."
          : pending
            ? "Solicitud enviada"
            : "Subir como Guest"}
      </span>
    </button>
  );
}
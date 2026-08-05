"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createLiveSession,
  endLiveSession,
  recoverLiveSession,
  startLiveSession,
  type CreateLiveSessionInput,
  type LiveSession,
} from "@/lib/live";

export interface UseLiveSessionResult {
  session: LiveSession | null;
  loading: boolean;
  actionLoading: boolean;
  error: string;
  createSession: (
    input: CreateLiveSessionInput,
  ) => Promise<LiveSession | null>;
  startSession: () => Promise<LiveSession | null>;
  endSession: () => Promise<LiveSession | null>;
  recoverSession: () => Promise<LiveSession | null>;
  clearError: () => void;
}

export function useLiveSession(): UseLiveSessionResult {
  const [session, setSession] =
    useState<LiveSession | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const recoverSession = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const recoveredSession =
        await recoverLiveSession();

      setSession(recoveredSession);

      return recoveredSession;
    } catch (sessionError) {
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "No se pudo recuperar la sesión LIVE.",
      );

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void recoverSession();
  }, [recoverSession]);

  const createSession = useCallback(
    async (
      input: CreateLiveSessionInput,
    ) => {
      setActionLoading(true);
      setError("");

      try {
        const createdSession =
          await createLiveSession(input);

        setSession(createdSession);

        return createdSession;
      } catch (sessionError) {
        setError(
          sessionError instanceof Error
            ? sessionError.message
            : "No se pudo crear la sesión LIVE.",
        );

        return null;
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  const startSession = useCallback(async () => {
    if (!session) {
      setError(
        "Primero debes crear una sesión LIVE.",
      );

      return null;
    }

    setActionLoading(true);
    setError("");

    try {
      const startedSession =
        await startLiveSession(session.id);

      setSession(startedSession);

      return startedSession;
    } catch (sessionError) {
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "No se pudo iniciar la sesión LIVE.",
      );

      return null;
    } finally {
      setActionLoading(false);
    }
  }, [session]);

  const endSession = useCallback(async () => {
    if (!session) {
      setError(
        "No existe una sesión LIVE para finalizar.",
      );

      return null;
    }

    setActionLoading(true);
    setError("");

    try {
      const endedSession =
        await endLiveSession(session.id);

      setSession(endedSession);

      return endedSession;
    } catch (sessionError) {
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "No se pudo finalizar la sesión LIVE.",
      );

      return null;
    } finally {
      setActionLoading(false);
    }
  }, [session]);

  return {
    session,
    loading,
    actionLoading,
    error,
    createSession,
    startSession,
    endSession,
    recoverSession,
    clearError,
  };
}

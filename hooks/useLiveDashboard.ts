"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getLiveDashboardData,
  type LiveDashboardData,
} from "@/lib/live";
import { supabase } from "@/lib/supabase";

const emptyDashboard: LiveDashboardData = {
  roomId: "",
  activeViewers: 0,
  peakViewers: 0,
  totalJoins: 0,
  reactions: 0,
  gifts: 0,
  energy: 0,
  messages: 0,
  grossRevenue: 0,
  updatedAt: null,
};

export interface UseLiveDashboardResult {
  dashboard: LiveDashboardData;
  loading: boolean;
  connected: boolean;
  error: string;
  refreshDashboard: () => Promise<void>;
}

export function useLiveDashboard(
  roomId: string | null | undefined,
): UseLiveDashboardResult {
  const mountedRef = useRef(true);

  const refreshVersionRef =
    useRef(0);

  const [dashboard, setDashboard] =
    useState<LiveDashboardData>(
      emptyDashboard,
    );

  const [loading, setLoading] =
    useState(false);

  const [connected, setConnected] =
    useState(false);

  const [error, setError] =
    useState("");

  const refreshDashboard =
    useCallback(async () => {
      const refreshVersion =
        ++refreshVersionRef.current;

      if (!roomId) {
        if (
          refreshVersion ===
          refreshVersionRef.current
        ) {
          setDashboard(emptyDashboard);
          setLoading(false);
        }

        return;
      }

      setLoading(true);

      try {
        const data =
          await getLiveDashboardData(
            roomId,
          );

        if (
          mountedRef.current &&
          refreshVersion ===
            refreshVersionRef.current
        ) {
          setDashboard(data);
          setError("");
        }
      } catch (dashboardError) {
        if (
          mountedRef.current &&
          refreshVersion ===
            refreshVersionRef.current
        ) {
          setError(
            dashboardError instanceof Error
              ? dashboardError.message
              : "No se pudo cargar el Dashboard LIVE.",
          );
        }
      } finally {
        if (
          mountedRef.current &&
          refreshVersion ===
            refreshVersionRef.current
        ) {
          setLoading(false);
        }
      }
    }, [roomId]);

  useEffect(() => {
    mountedRef.current = true;

    void refreshDashboard();

    return () => {
      mountedRef.current = false;
    };
  }, [refreshDashboard]);

  useEffect(() => {
    if (!roomId) {
      setConnected(false);
      return;
    }

    const channel = supabase
      .channel(
        `vyro-live-dashboard:${roomId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "live_room_counters",
          filter:
            `room_id=eq.${roomId}`,
        },
        () => {
          void refreshDashboard();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "live_energy_states",
          filter:
            `room_id=eq.${roomId}`,
        },
        () => {
          void refreshDashboard();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_messages",
          filter:
            `room_id=eq.${roomId}`,
        },
        () => {
          void refreshDashboard();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_gifts",
          filter:
            `room_id=eq.${roomId}`,
        },
        () => {
          void refreshDashboard();
        },
      )
      .subscribe((status) => {
        const isSubscribed =
          status === "SUBSCRIBED";

        setConnected(isSubscribed);

        if (isSubscribed) {
          void refreshDashboard();
        }
      });

    return () => {
      setConnected(false);
      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    refreshDashboard,
    roomId,
  ]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const refreshOnFocus = () => {
      void refreshDashboard();
    };

    const refreshOnVisibility = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        void refreshDashboard();
      }
    };

    const fallbackInterval =
      window.setInterval(() => {
        void refreshDashboard();
      }, 5000);

    window.addEventListener(
      "focus",
      refreshOnFocus,
    );

    document.addEventListener(
      "visibilitychange",
      refreshOnVisibility,
    );

    return () => {
      window.clearInterval(
        fallbackInterval,
      );

      window.removeEventListener(
        "focus",
        refreshOnFocus,
      );

      document.removeEventListener(
        "visibilitychange",
        refreshOnVisibility,
      );
    };
  }, [
    refreshDashboard,
    roomId,
  ]);

  return {
    dashboard,
    loading,
    connected,
    error,
    refreshDashboard,
  };
}

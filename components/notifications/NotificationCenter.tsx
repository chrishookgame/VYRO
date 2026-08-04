"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NotificationBell from "./NotificationBell";
import NotificationDropdown from "./NotificationDropdown";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "@/lib/notifications/repository";
import type { Notification } from "@/lib/notifications/types";
import { supabase } from "@/lib/supabase";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async (currentUserId: string) => {
    try {
      const data = await getNotifications(currentUserId);
      setNotifications(data);
    } catch (error) {
      console.error("Error al cargar las notificaciones:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      await loadNotifications(user.id);
    }

    void initialize();

    return () => {
      mounted = false;
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void loadNotifications(userId);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadNotifications, userId]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read_at,
  ).length;

  async function handleMarkAsRead(id: string) {
    const target = notifications.find(
      (notification) => notification.id === id,
    );

    if (!target || target.read_at) return;

    try {
      await markAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read_at: new Date().toISOString(),
              }
            : notification,
        ),
      );

      if (target.action_url) {
        window.location.href = target.action_url;
      }
    } catch (error) {
      console.error("Error al marcar la notificación:", error);
    }
  }

  async function handleMarkAllAsRead() {
    if (!userId || unreadCount === 0) return;

    try {
      await markAllAsRead(userId);

      const readAt = new Date().toISOString();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read_at: notification.read_at ?? readAt,
        })),
      );
    } catch (error) {
      console.error("Error al marcar todas las notificaciones:", error);
    }
  }

  if (!userId && !loading) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <NotificationBell
        unreadCount={unreadCount}
        onClick={() => setOpen((current) => !current)}
      />

      {open && (
        <div className="absolute right-0 top-12 z-50">
          <NotificationDropdown
            notifications={notifications.slice(0, 10)}
            loading={loading}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>
      )}
    </div>
  );
}

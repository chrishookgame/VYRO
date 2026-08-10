"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ChevronLeft } from "lucide-react";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "@/lib/notifications/repository";
import type { Notification } from "@/lib/notifications/types";
import { supabase } from "@/lib/supabase";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      .channel(`notifications-page:${userId}`)
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

  const unreadCount = notifications.filter(
    (notification) => !notification.read_at,
  ).length;

  async function handleMarkAsRead(notification: Notification) {
    if (!notification.read_at) {
      try {
        await markAsRead(notification.id);

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read_at: new Date().toISOString(),
                }
              : item,
          ),
        );
      } catch (error) {
        console.error("Error al marcar la notificación:", error);
        return;
      }
    }

    if (notification.action_url) {
      window.location.href = notification.action_url;
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-400"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al feed
          </Link>
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 shadow-2xl">
          <header className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  Notificaciones
                </h1>

                <p className="text-sm text-zinc-400">
                  {unreadCount > 0
                    ? `${unreadCount} sin leer`
                    : "Todo está al día"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck className="h-4 w-4" />
              Marcar todas como leídas
            </button>
          </header>

          {loading ? (
            <div className="px-6 py-16 text-center text-zinc-400">
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Bell className="mx-auto h-10 w-10 text-zinc-600" />

              <h2 className="mt-4 font-semibold">
                No tienes notificaciones
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Cuando haya actividad nueva aparecerá aquí.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => {
                const unread = !notification.read_at;

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => void handleMarkAsRead(notification)}
                    className={`flex w-full gap-4 border-b border-white/5 px-5 py-5 text-left transition last:border-b-0 hover:bg-white/5 ${
                      unread ? "bg-cyan-500/5" : ""
                    }`}
                  >
                    <div className="pt-2">
                      <span
                        className={`block h-2.5 w-2.5 rounded-full ${
                          unread ? "bg-cyan-400" : "bg-zinc-700"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-white">
                          {notification.title}
                        </h2>

                        {unread && (
                          <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-300">
                            Nueva
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-zinc-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
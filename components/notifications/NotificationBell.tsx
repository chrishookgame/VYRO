"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface NotificationBellProps {
  unreadCount: number;
  onClick?: () => void;
}

export default function NotificationBell({
  unreadCount,
  onClick,
}: NotificationBellProps) {
  const [visibleCount, setVisibleCount] = useState(unreadCount);

  useEffect(() => {
    setVisibleCount(unreadCount);
  }, [unreadCount]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir notificaciones"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
    >
      <Bell className="h-5 w-5" />

      {visibleCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {visibleCount > 99 ? "99+" : visibleCount}
        </span>
      )}
    </button>
  );
}

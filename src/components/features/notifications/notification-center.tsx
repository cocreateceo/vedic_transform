"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Bell, Check, CheckCheck, Info, Trophy, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "achievement":
      return Trophy;
    case "goal":
      return Target;
    case "insight":
      return Sparkles;
    case "reminder":
      return Bell;
    default:
      return Info;
  }
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiFetch("/data/notifications");
      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (data?.notifications) {
        setNotifications(data.notifications);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await apiFetch("/data/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
      });
    } catch {
      // silently fail
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await apiFetch("/data/notifications", {
        method: "PATCH",
        body: JSON.stringify({ markAll: true }),
      });
    } catch {
      // silently fail
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-[var(--color-card-bg)] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
          <div
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--color-bg-surface)] shadow-xl ring-1 ring-[var(--color-border)] overflow-hidden z-50 transition-all duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-orange-400" />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-card-bg)]",
                        !notification.isRead && "bg-orange-50/50 dark:bg-orange-950/20"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                          notification.isRead
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-orange-100 dark:bg-orange-900/50"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            notification.isRead
                              ? "text-gray-400"
                              : "text-orange-600 dark:text-orange-400"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "text-sm truncate",
                              notification.isRead
                                ? "text-[var(--color-text-secondary)] font-normal"
                                : "text-[var(--color-text-primary)] font-semibold"
                            )}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                          {getRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="flex-shrink-0 mt-1 p-1 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                          aria-label="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5 text-orange-500" />
                        </button>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
    </div>
  );
}

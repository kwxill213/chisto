// components/notifications/NotificationCenter.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';
import { Notification } from '@/lib/types';

export function NotificationCenter() {
  const { id, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchNotifications();
      
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, id]);

  const fetchNotifications = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/notifications', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Важно для передачи кук
      });
      
      if (res.status === 401) {
        // Пользователь не авторизован
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      if (!res.ok) {
        throw new Error(`Ошибка при загрузке уведомлений: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Некорректный формат уведомлений');
      }
      
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Не удалось пометить как прочитанное');
      }
      
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PUT',
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Не удалось пометить все как прочитанные');
      }
      
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="space-y-2 p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Уведомления</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={loading}
              >
                Прочитать все
              </Button>
            )}
          </div>
          
          {error ? (
            <div className="py-4 text-center text-sm text-red-500">
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={fetchNotifications}
                className="mt-2"
              >
                Повторить попытку
              </Button>
            </div>
          ) : loading ? (
            <div className="py-4 text-center">Загрузка...</div>
          ) : notifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              Нет новых уведомлений
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${
                    !notification.isRead ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <Link
                    href={getNotificationLink(notification)}
                    onClick={() => markAsRead(notification.id)}
                    className="block hover:no-underline"
                  >
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getNotificationLink(notification: Notification): string {
  if (!notification.typeId || !notification.relatedId) {
    return '/profile';
  }

  switch (notification.typeId) {
    case 1: // order
      return `/profile/orders/${notification.relatedId}`;
    case 2: // support
      return `/profile/support/${notification.relatedId}`;
    case 3: // system
      return `/profile`;
    default:
      return '/profile';
  }
}
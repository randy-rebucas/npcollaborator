import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { NotificationsProvider, useNotifications } from '@/providers/notifications-provider';

interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const notificationsElement = document.getElementById('notifications-container');
      const target = event.target as Node;

      if (notificationsElement && !notificationsElement.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div id="notifications-container" className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>
            {notifications.slice(0, 5).map((notification: Notification) => {
              return (
                <div
                  key={notification._id}
                  onClick={() => markAsRead(notification._id)}
                  className={`py-3 px-4 border-b border-gray-200 dark:border-gray-700 last:border-0 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1" dangerouslySetInnerHTML={{ __html: notification.message }} />
                  {notification.link && (
                    <Link
                      href={notification.link}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2 inline-block"
                    >
                      View details
                    </Link>
                  )}
                </div>
              )
            })}
            {notifications.length === 0 && (
              <p className="text-gray-500">No notifications</p>
            )}
            {notifications.length > 5 && (
              <div className="pt-3 text-center border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/np/notifications"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Show all notifications
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function NotificationsWithProvider() {
  return (
    <NotificationsProvider>
      <Notifications />
    </NotificationsProvider>
  );
} 